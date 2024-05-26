import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  VStack,
  Card,
  TableContainer,
  Table,
  Tbody,
  Tr,
  Td,
  Badge,
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  CardBody,
  StackDivider,
  Flex,
  Text,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  useToast,
} from "@chakra-ui/react";
import { Task } from "../interfaces/Project";
import { useRef } from "react";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";

const PendingTasks = ({ project, isOwner }) => {
  console.log(project.tasks);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation(
    async (data) => {
      return await axios.post(
        `http://localhost:4000/api/projects/${project._id}/tasks/${data.taskId}/${data.menteeId}`
      );
    },
    {
      onSuccess: () => {
        // console.log(data);
        toast({
          title: "Success",
          description: "Task assigned to mentee",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        queryClient.invalidateQueries(["project", project._id]);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: `${error?.response?.data?.message}. Could not assign task`,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      },
    }
  );

  const handleClick = (task, mentee) => {
    // console.log(task, mentee);
    const postData = {
      taskId: task.id,
      menteeId: mentee.user._id,
    };
    // console.log(postData);
    mutateAsync(postData);

    onClose();
  };

  return (
    <VStack h="400px" maxH="400px" overflowY="scroll">
      {project.tasks
        ?.filter((task: Task) => task.menteesAssigned?.length === 0)
        .map((task: Task) => {
          return (
            <Card key={task.id} w="100%" px={4} py={2}>
              <TableContainer>
                <Table
                  variant="unstyled"
                  style={{ tableLayout: "fixed", width: "100%" }}
                >
                  <Tbody
                    sx={{
                      "& > tr > td": {
                        py: 1, // Apply vertical padding to all <Td> elements
                      },
                    }}
                  >
                    <Tr>
                      <Td w="5%" fontWeight="semibold" px={1}>
                        1.
                      </Td>
                      <Td fontWeight="semibold" w="20%" pl={0}>
                        Title
                      </Td>
                      <Td whiteSpace="normal">{task.title}</Td>
                    </Tr>
                    <Tr>
                      <Td></Td>
                      <Td fontWeight="semibold" w="20%" pl={0}>
                        Description
                      </Td>
                      <Td whiteSpace="normal">{task.description}</Td>
                    </Tr>
                    <Tr>
                      <Td></Td>
                      <Td fontWeight="semibold" w="20%" pl={0}>
                        Due Date
                      </Td>
                      <Td whiteSpace="normal">
                        {new Date(task?.dueDate).toISOString().split("T")[0]}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td></Td>
                      <Td fontWeight="semibold" w="20%" pl={0}>
                        Tokens
                      </Td>
                      <Td whiteSpace="normal">{task.token}</Td>
                    </Tr>
                    <Tr>
                      <Td></Td>
                      <Td fontWeight="semibold" w="20%" pl={0}>
                        Priority
                      </Td>
                      <Td whiteSpace="normal">
                        <Badge
                          variant="subtle"
                          colorScheme={
                            (task.priority === "low" && "green") ||
                            (task.priority === "medium" && "orange") ||
                            ((task.priority === "high" && "red") as string)
                          }
                        >
                          {task.priority}
                        </Badge>
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
              {isOwner && (
                <Popover placement="right">
                  <PopoverTrigger>
                    <Button
                      mr="auto"
                      colorScheme="green"
                      size="sm"
                      rightIcon={<ChevronRightIcon />}
                    >
                      Assign To
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent maxH="250px" overflowY="scroll">
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader fontWeight="semibold">
                      Mentees List
                    </PopoverHeader>
                    <PopoverBody>
                      <CardBody py={0} px={1}>
                        <VStack
                          divider={<StackDivider />}
                          spacing="1"
                          alignItems="flex-start"
                        >
                          {project.menteesApproved?.map((mentee) => {
                            return (
                              <>
                                <Flex
                                  flexDirection="column"
                                  alignItems="start"
                                  cursor="pointer"
                                  _hover={{ bg: "gray.100" }}
                                  w="100%"
                                  py={1}
                                  px={1}
                                  borderRadius={3}
                                  id={mentee.user._id}
                                  onClick={onOpen}
                                >
                                  <Text fontWeight="medium">
                                    {mentee.user.name}
                                  </Text>
                                  <Text fontWeight="medium">
                                    {mentee.user.email}
                                  </Text>
                                </Flex>
                                <AlertDialog
                                  isOpen={isOpen}
                                  leastDestructiveRef={cancelRef}
                                  onClose={onClose}
                                >
                                  <AlertDialogOverlay>
                                    <AlertDialogContent>
                                      <AlertDialogHeader
                                        fontSize="lg"
                                        fontWeight="bold"
                                      >
                                        Assign Task
                                      </AlertDialogHeader>
                                      <AlertDialogBody>
                                        Are you sure you want to assign this
                                        task to{" "}
                                        <strong>{mentee.user.name}</strong>?
                                      </AlertDialogBody>

                                      <AlertDialogFooter>
                                        <Button
                                          colorScheme="green"
                                          onClick={() =>
                                            handleClick(task, mentee)
                                          }
                                        >
                                          Confirm
                                        </Button>
                                        <Button
                                          ref={cancelRef}
                                          onClick={onClose}
                                          ml={3}
                                        >
                                          Cancel
                                        </Button>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialogOverlay>
                                </AlertDialog>
                              </>
                            );
                          })}
                        </VStack>
                      </CardBody>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              )}
            </Card>
          );
        })}
    </VStack>
  );
};
export default PendingTasks;
