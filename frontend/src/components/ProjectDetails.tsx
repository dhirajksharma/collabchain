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
import { useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import Loader from "./Loader";
import UpdateProjectModal from "./UpdateProjectModal";
import { MenteeApplication } from "../interfaces/Project";
import ApplicantDetails from "./ApplicantDetails";
import TaskDetails from "./TaskDetails";

export const ProjectDetails = () => {
  const [dataFetched, setDataFetched] = useState(false);
  const [isProjectUpdated, setIsProjectUpdated] = useState(false);
  const toast = useToast();
  const queryClient = useQueryClient();

  const { id } = useParams<{ id: string }>();

  const { data: userData } = useQuery("userData", async () => {
    return await axios.get("http://localhost:4000/api/user/profile");
  });

  const userId = userData?.data?.data?._id;

  const {
    data: queryData,
    isLoading,
    isError,
    isSuccess,
    refetch,
  } = useQuery(
    ["project", id],
    async () => {
      return await axios.get(`http://localhost:4000/api/projects/${id}`);
    },
    {
      enabled: !!userId,
      onSuccess: () => {
        setDataFetched(true);
      },
    }
  );

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
        queryClient.invalidateQueries("userProjects");
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
    const project = queryData?.data.data;
    const isOwner = project.mentor._id === userId;
    const isApplied = project.menteesApplication?.some(
      (mentee: MenteeApplication) => mentee?.user?._id === userId
    );

    const applicationStatus = project.menteesApplication.find(
      (application: MenteeApplication) => application?.user?._id === userId
    )?.status;

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
          <HStack
            display="flex"
            alignItems="center"
            justifyContent={"flex-start"}
            spacing={"16"}
            w="full"
          >
            <Heading as="h1" size="xl" mt={4} mb={4} fontWeight="bold">
              Project Details
            </Heading>
            <Box>
              <Badge
                variant="solid"
                colorScheme={project.menteesRequired > 0 ? "green" : "orange"}
                fontSize="xl"
                mt={1}
                textTransform={"none"}
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
          {!isOwner && isApplied && applicationStatus === "pending" && (
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
          {!isOwner && isApplied && applicationStatus === "approved" && (
            <Alert status="success" w="50%" variant="top-accent">
              <AlertIcon />
              <VStack spacing={0} alignItems="start">
                <AlertTitle>Application Status</AlertTitle>
                <AlertDescription>
                  Congratulations! Your application has been accepted
                </AlertDescription>
              </VStack>
            </Alert>
          )}
          {!isOwner && isApplied && applicationStatus === "rejected" && (
            <Alert status="error" w="50%" variant="top-accent">
              <AlertIcon />
              <VStack spacing={0} alignItems="start">
                <AlertTitle>Application Status</AlertTitle>
                <AlertDescription>
                  Your application has been rejected 🥹
                </AlertDescription>
              </VStack>
            </Alert>
          )}
          <VStack
            spacing={4}
            borderWidth="1px"
            rounded={10}
            p={5}
            alignItems="start"
            bg="white"
          >
            <Tabs w="70vw" colorScheme="teal">
              <TabList justifyContent={"space-evenly"}>
                <Tab pt={0}>Project Details</Tab>
                {isOwner && <Tab pt={0}>Applicant Details</Tab>}
                {(!isOwner && isApplied && applicationStatus === "approved") ||
                  (isOwner && <Tab pt={0}>Task Details</Tab>)}
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
                            Total Tokens
                          </Td>
                          <Td whiteSpace="normal">{project.token}</Td>
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
                        Update Project Details
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
                    <ApplicantDetails project={project} />
                  </TabPanel>
                )}
                <TabPanel>
                  <TaskDetails project={project} isOwner={isOwner} />
                </TabPanel>
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
