import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  HStack,
  VStack,
  Badge,
  TabList,
  Tabs,
  Tab,
  TabPanels,
  TabPanel,
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
} from "@chakra-ui/react";
import { useLocation, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import Loader from "./Loader";
import UpdateProjectModal from "./UpdateProjectModal";
import { MenteeApplication, Project } from "../interfaces/Project";
import { User } from "../interfaces/User";
import ApplicantDetails from "./ApplicantDetails";

export const ProjectDetails = () => {
  const [dataFetched, setDataFetched] = useState(false);
  const [isProjectUpdated, setIsProjectUpdated] = useState(false);
  const toast = useToast();
  const queryClient = useQueryClient();

  const { id } = useParams<{ id: string }>();

  const fetchData = async () => {
    const [data1, data2] = await Promise.all([
      axios.get(`http://localhost:4000/api/projects/${id}`),
      axios.get("http://localhost:4000/api/user/profile"),
    ]);
    setDataFetched(true); // Set dataFetched to true when data is set
    // setProject(data1.data);
    return { project: data1.data, userData: data2.data };
  };

  const {
    data: queryData,
    isLoading,
    isError,
    isSuccess,
    refetch,
  } = useQuery("project,userData", fetchData);

  useEffect(() => {
    if (isProjectUpdated) refetch();
  }, [isProjectUpdated, refetch]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // const { mutate, isLoading, isError, isSuccess } = useMutation(() =>
  //   axios.post(`http://localhost:4000/api/projects/{{projectID}}/apply`)
  // );

  const {
    mutate: mutateApply,
    // isLoading: isLoadingApply,
    // isError: isErrorApply,
    // isSuccess: isSuccessApply,
  } = useMutation(
    async () => {
      const response = await axios.post(
        `http://localhost:4000/api/projects/${id}/apply`
      );
      return response.data;
    },
    {
      // onSuccess callback
      onSuccess: (data) => {
        console.log("Mutation successful", data);
        toast({
          title: "Success",
          description: "Your Application has been sent",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        queryClient.invalidateQueries("project,userData");
      },
      // onError callback
      onError: (error) => {
        console.error("Mutation failed", error);
        // Handle error logic here
        toast({
          title: "Error",
          description: "Some error occured. Could not apply",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      },
    }
  );
  const handleApplyClick = async (): Promise<void> => {
    await mutateApply();
  };

  const { mutate: mutateWithdraw } = useMutation(
    async () => {
      await axios.delete(`http://localhost:4000/api/projects/${id}/apply`);
    },
    {
      onSuccess: () => {
        // Handle success logic here
        console.log("Delete request successful");
        toast({
          title: "Success",
          description: "Your Application has been withdrawn",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        queryClient.invalidateQueries("project,userData");
      },
      onError: (error) => {
        // Handle error logic here
        console.error("Delete request failed", error);
        toast({
          title: "Error",
          description: "Some error occured. Could not withdraw application",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      },
    }
  );

  const handleWithdraw = async (): void => {
    // console.log("Withdraw");
    await mutateWithdraw();
  };

  if (isLoading || !dataFetched) {
    return <Loader />;
  }

  if (isError) {
    return <div>Error fetching data</div>;
  }

  if (isSuccess) {
    const project = queryData.project.data;
    const userData = queryData.userData.data;
    const isOwner = project.mentor._id === userData._id;
    const isApplied = project.menteesApplication?.some(
      (mentee: MenteeApplication) => mentee?.user?._id === userData._id
    );

    return (
      <>
        <VStack
          w="full"
          h="full"
          paddingX="4"
          marginX="4"
          alignItems="start"
          spacing={4}
          marginY="0.5"
        >
          <HStack display="flex" alignItems="center" spacing={4} w="full">
            <Heading
              as="h1"
              size="xl"
              mt={4}
              mb={4}
              fontWeight="bold"
              textTransform="uppercase"
            >
              {project.title}
            </Heading>
            <Box>
              <Badge
                variant="solid"
                colorScheme={project.menteesRequired > 0 ? "green" : "orange"}
                fontSize="xl"
              >
                {project.menteesRequired > 0 ? "Recruiting" : "In-Progress"}
              </Badge>
            </Box>
          </HStack>
          {!isOwner && !isApplied && (
            <Alert status="warning" w="50%" variant="top-accent">
              <AlertIcon />
              <VStack spacing={0} alignItems="start">
                <AlertTitle>Application Status</AlertTitle>
                <AlertDescription>
                  You have not applied to this project
                </AlertDescription>
              </VStack>
            </Alert>
          )}
          {!isOwner && isApplied && (
            <Alert status="info" w="50%" variant="top-accent">
              <AlertIcon />
              <VStack spacing={0} alignItems="start">
                <AlertTitle>Application Status</AlertTitle>
                <AlertDescription>
                  You have successfully applied to this project. Awaiting
                  response
                </AlertDescription>
                <Button size="sm" colorScheme="yellow" onClick={handleWithdraw}>
                  Withdraw
                </Button>
              </VStack>
            </Alert>
          )}
          <VStack
            spacing={4}
            borderWidth="1px"
            rounded={10}
            p={5}
            w="50%"
            alignItems="start"
          >
            <Tabs w="full" colorScheme="teal">
              <TabList>
                <Tab>Project Details</Tab>
                {isOwner && <Tab>Applicant Details</Tab>}
              </TabList>
              <TabPanels>
                <TabPanel py={0}>
                  <TableContainer>
                    <Table
                      variant="unstyled"
                      style={{ tableLayout: "fixed", width: "100%" }}
                    >
                      <Tbody>
                        <Tr>
                          <Td fontWeight="semibold" w="20%" pl={0}>
                            Title
                          </Td>
                          <Td whiteSpace="normal">{project.title}</Td>
                        </Tr>
                        <Tr>
                          <Td fontWeight="semibold" w="20%" pl={0}>
                            Domain
                          </Td>
                          <Td whiteSpace="normal">{project.domain}</Td>
                        </Tr>
                        <Tr>
                          <Td fontWeight="semibold" w="20%" pl={0}>
                            Description
                          </Td>
                          <Td whiteSpace="normal">{project.description}</Td>
                        </Tr>
                        <Tr>
                          <Td fontWeight="semibold" w="20%" pl={0}>
                            Start Date
                          </Td>
                          {/* <Td whiteSpace="normal">{project.startDate}</Td> */}
                          <Td whiteSpace="normal">
                            {
                              new Date(project?.startDate)
                                .toISOString()
                                .split("T")[0]
                            }
                          </Td>
                        </Tr>
                        <Tr>
                          <Td fontWeight="semibold" w="20%" pl={0}>
                            End Date
                          </Td>
                          {/* <Td whiteSpace="normal">{project.endDate}</Td> */}
                          <Td whiteSpace="normal">
                            {
                              new Date(project?.endDate)
                                .toISOString()
                                .split("T")[0]
                            }
                          </Td>
                        </Tr>
                      </Tbody>
                    </Table>
                    {isOwner && (
                      <Button colorScheme="blue" onClick={openModal}>
                        Update Project
                      </Button>
                    )}
                    {!isOwner && !isApplied && (
                      <Button colorScheme="blue" onClick={handleApplyClick}>
                        Apply
                      </Button>
                    )}
                  </TableContainer>
                </TabPanel>

                {isOwner && (
                  <TabPanel>
                    <ApplicantDetails />
                  </TabPanel>
                )}
              </TabPanels>
            </Tabs>
          </VStack>
        </VStack>
        <UpdateProjectModal
          isOpen={isModalOpen}
          onClose={closeModal}
          projectData={project}
          isProjectUpdated={isProjectUpdated}
          setIsProjectUpdated={setIsProjectUpdated}
        />
      </>
    );
  }
};
