import {
  Box,
  Button,
  Card,
  Flex,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tr,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Avatar,
  useToast,
} from "@chakra-ui/react";
import axios, { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link, NavLink } from "react-router-dom";
import { MenteeApplication } from "../interfaces/Project";

interface ApplicantCardProps {
  application: MenteeApplication;
  index: number;
  projectId: string;
  status: string;
}

const ApplicantCard = ({
  application,
  index,
  projectId,
  status,
}: ApplicantCardProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();
  const toast = useToast();
  // console.log(isOpen);

  // console.log(application);
  const { data: queryData } = useQuery(
    ["menteeData", application.user._id],
    async () => {
      return await axios.get(
        `http://localhost:4000/api/user/${application.user._id}`
      );
    },
    {
      enabled: isOpen,
    }
  );

  const mentee = queryData?.data?.data;

  const { mutate } = useMutation(
    async (type: string) => {
      let response;
      if (type === "accept") {
        response = await axios.post(
          `http://localhost:4000/api/projects/${projectId}/updatementeestatus/${mentee._id}`
        );
      } else {
        response = await axios.delete(
          `http://localhost:4000/api/projects/${projectId}/updatementeestatus/${mentee._id}`
        );
      }
      return response.data;
    },
    {
      // onSuccess callback
      onSuccess: (data) => {
        console.log("Mutation successful", data);
        toast({
          title: "Success",
          description: "Application accepted",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        queryClient.invalidateQueries("projects");
      },
      // onError callback
      onError: (error: AxiosError) => {
        console.error("Mutation failed", error);
        // Handle error logic here
        toast({
          title: "Error",
          description: `${
            (error.response?.data as { message?: string }).message
          }. Could not apply`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      },
    }
  );

  const handleAccept = () => {
    mutate("accept");
    onClose();
  };

  const handleReject = () => {
    mutate("reject");
    onClose();
  };

  return (
    <>
      <Card
        p={4}
        mb={2}
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="md"
        bg="white"
      >
        <Flex justifyContent="space-between" alignItems="center">
          <VStack spacing={2} alignItems="start">
            <HStack spacing={2} alignItems="center">
              <Text fontSize="xl" fontWeight="bold">
                {index}.
              </Text>
              <Text fontSize="lg">{application.user.name}</Text>
              <Text fontSize="md" color="gray.500">
                {application.user.email}
              </Text>
            </HStack>
          </VStack>
          <Button colorScheme="teal" size="sm" onClick={onOpen}>
            View Profile
          </Button>

          {/* {status === "approved" && (
            <NavLink to={`tasks`}>
              <Text>Tasks</Text>
            </NavLink>
          )} */}
        </Flex>
      </Card>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Applicant details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Avatar
              size="xl"
              name={mentee?.name}
              src={`http://localhost:4000/api/user/uploads/avatar/${application.user._id}`}
            />
            <TableContainer mb={5}>
              <Table
                variant="unstyled"
                style={{ tableLayout: "fixed", width: "100%" }}
              >
                <Tbody>
                  <Tr>
                    <Td fontWeight="semibold" w="40%" pl={0}>
                      Name
                    </Td>
                    <Td whiteSpace="normal">{mentee?.name}</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="semibold" pl={0}>
                      Email
                    </Td>
                    <Td whiteSpace="normal">{mentee?.email}</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="semibold" pl={0}>
                      Contact
                    </Td>
                    <Td whiteSpace="normal">{mentee?.phone}</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="semibold" pl={0}>
                      Organization name
                    </Td>
                    <Td whiteSpace="normal">
                      {mentee?.organization?.organization_details?.name}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="semibold" pl={0}>
                      Organization email
                    </Td>
                    <Td whiteSpace="normal">
                      {mentee?.organization?.organization_details?.email}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="semibold" pl={0}>
                      Organization address
                    </Td>
                    <Td whiteSpace="normal">
                      {mentee?.organization?.organization_details?.address}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="semibold" pl={0}>
                      Designation
                    </Td>
                    <Td whiteSpace="normal">
                      {mentee?.organization?.designation}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="semibold" pl={0}>
                      Resume
                    </Td>
                    <Td whiteSpace="normal">
                      <Link
                        to={`http://localhost:4000/api/user/uploads/resume/${application.user._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Link
                      </Link>
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </ModalBody>

          <ModalFooter>
            {status === "pending" && (
              <>
                <Button colorScheme="green" mr={3} onClick={handleAccept}>
                  Accept
                </Button>
                <Button colorScheme="red" onClick={handleReject}>
                  Reject
                </Button>
              </>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default ApplicantCard;
