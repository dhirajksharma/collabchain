// Task.tsx
import {
  VStack,
  Icon,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  Badge,
  Avatar,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
  StackDivider,
  Flex,
  Box,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  HStack,
  IconButton,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { FaCog, FaPlusCircle } from "react-icons/fa";
import { Project, Task } from "../interfaces/Project";
import { useEffect, useState } from "react";
import CreateTaskModal from "./CreateTaskModal";
import PendingTasks from "./PendingTasks";
import ActiveTasks from "./ActiveTasks";
import TaskActionModal from "./TaskActionModal";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import UpdateTaskModal from "./UpdateTaskModal";
import { SubmitHandler, useForm } from "react-hook-form";

interface TaskProps {
  project: Project;
  isOwner: boolean;
}

const TaskDetails: React.FC<TaskProps> = ({ project, isOwner }: TaskProps) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  // console.log(project.tasks[0].menteesAssigned);

  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);

  const openCreateTaskModal = () => {
    setIsCreateTaskModalOpen(true);
  };

  const closeCreateTaskModal = () => {
    setIsCreateTaskModalOpen(false);
  };

  //////

  const [sortedTasks, setSortedTasks] = useState<Task[]>(project.tasks);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSortByDueDate = () => {
    const sorted = [...sortedTasks].sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    });
    setSortedTasks(sorted);
    queryClient.setQueryData<Project>(["project", project._id], (oldData) => ({
      ...oldData!,
      tasks: sortedTasks,
    }));
    console.log(sorted);
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  useEffect(() => {}, [sortedTasks]);

  //////

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleOpenModal = (task: Task) => {
    setSelectedTask(task);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
  };

  // Assign task to mentee
  const { mutateAsync: mutateAssignTask } = useMutation(
    async (data) => {
      return await axios.post(
        `http://localhost:4000/api/projects/${project._id}/tasks/${data.taskId}/${data.menteeId}`
      );
    },
    {
      onSuccess: () => {
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

  const handleAssignClick = (mentee) => {
    const postData = {
      taskId: selectedTask?.id,
      menteeId: mentee.user._id,
    };
    mutateAssignTask(postData);
    handleCloseModal();
  };

  // Review task done by mentee
  const { mutateAsync: mutateReviewTask } = useMutation(
    async () =>
      await axios.post(
        `http://localhost:4000/api/projects/${project._id}/tasks/${selectedTask?.id}/reviewtask`
      ),
    {
      onSuccess: (data) => {
        toast({
          title: "Success",
          description: "Task under review",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });

        const url = window.URL.createObjectURL(new Blob([data.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "file.zip"); // Specify the file name and extension
        document.body.appendChild(link);
        link.click();
        link.remove();

        queryClient.invalidateQueries(["project", project._id]);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: `${error?.response?.data?.message}. Could not update task to review`,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      },
    }
  );

  const handleGetMenteeDocsClick = () => {
    mutateReviewTask();
    handleCloseModal();
  };

  // Accept or Reject mentee task work
  const { mutateAsync: mutateCompleteTask } = useMutation(
    async (data) => {
      return await axios.post(
        `http://localhost:4000/api/projects/${project._id}/tasks/${selectedTask?.id}/markTaskComplete`,
        data
      );
    },
    {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Task status updated",
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
          description: `${error?.response?.data?.message}. Could not update task status`,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      },
    }
  );

  const handleAcceptClick = () => {
    const data = { status: "complete" };
    mutateCompleteTask(data);
    handleCloseModal();
  };

  const handleRejectClick = () => {
    const data = { status: "reject" };
    mutateCompleteTask(data);
    handleCloseModal();
  };

  interface FormValues {
    files: FileList;
  }
  // Mentee submit documents
  const {
    register,
    handleSubmit: handleMenteeSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  // Mentee uploads tasks
  const { mutateAsync: mutateMenteeSubmit } = useMutation(
    async (data) => {
      const formData = new FormData();
      // formData.append("key", data.key);

      Array.from(data.files).forEach((file, index) => {
        formData.append(`files`, file); // append each file
      });
      // console.log(formData);

      return await axios.put(
        `http://localhost:4000/api/projects/${project._id}/tasks/${data.taskId}`,
        formData
      );
    },
    {
      onSuccess: (data) => {
        // console.log(data);
        toast({
          title: "Success",
          description: "Task documents uploaded",
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
          description: `${error?.response?.data?.message}. Could not upload task documents`,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      },
    }
  );

  const onSubmit: SubmitHandler<FormValues> = async (data, e) => {
    // const taskId = e.target.getAttribute("taskId");
    const formData = {
      files: data.files,
      taskId: selectedTask.id,
    };
    await mutateMenteeSubmit(formData);
    reset();
    handleCloseModal();
  };

  const renderModal = () => {
    if (!selectedTask) return null;

    let modalContent;
    switch (selectedTask.taskStatus) {
      case "pending":
        modalContent = (
          <>
            <ModalHeader>Assign Task</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              Choose a mentee to assign this task to
              <VStack
                divider={<StackDivider borderWidth="1px" />}
                spacing="1"
                alignItems="flex-start"
                mt={4}
                borderWidth="1px"
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
                        px={4}
                        borderRadius={3}
                        id={mentee.user._id}
                        onClick={() => handleAssignClick(mentee)}
                      >
                        <Text fontWeight="medium">{mentee.user.name}</Text>
                        <Text fontWeight="medium">{mentee.user.email}</Text>
                      </Flex>
                    </>
                  );
                })}
              </VStack>
            </ModalBody>
          </>
        );
        break;
      case "active":
        if (isOwner) {
          modalContent = (
            <>
              <ModalHeader>Task is active</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                The Task is still not completed by the mentee. Please check back
                later
              </ModalBody>
            </>
          );
        } else {
          modalContent = (
            <>
              <form
                as="form"
                onSubmit={handleMenteeSubmit(onSubmit)}
                taskId={task.id}
              >
                <ModalHeader>Modal Title</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <VStack spacing={4} align="stretch">
                    <FormControl isInvalid={!!errors.files}>
                      <FormLabel htmlFor="files">Upload Files</FormLabel>
                      <Input
                        id="files"
                        type="file"
                        multiple
                        {...register("files", {
                          required: "At least one file is required",
                        })}
                      />
                      <FormErrorMessage>
                        {errors.files && errors.files.message}
                      </FormErrorMessage>
                    </FormControl>
                  </VStack>
                </ModalBody>

                <ModalFooter>
                  <Button colorScheme="blue" mr={3} type="submit">
                    Submit
                  </Button>
                  <Button variant="ghost" onClick={handleCloseModal}>
                    Close
                  </Button>
                </ModalFooter>
              </form>
            </>
          );
        }
        break;
      case "submit":
        modalContent = (
          <>
            <ModalHeader>Task completed by mentee</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <Button
                colorScheme="green"
                mb={5}
                onClick={handleGetMenteeDocsClick}
              >
                {" "}
                Get documents
              </Button>
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                Clicking above button will change the task status to "Under
                Review"
              </Alert>
            </ModalBody>
          </>
        );
        break;
      case "review":
        modalContent = (
          <>
            <ModalHeader>Mark Task Complete</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              Please Accept or reject if review is complete
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                Accept will update task status to "Complete"
                <br /> Reject will update task status back to "Active"
              </Alert>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="green" mr={3} onClick={handleAcceptClick}>
                Accept
              </Button>
              <Button colorScheme="red" onClick={handleRejectClick}>
                Reject
              </Button>
            </ModalFooter>
          </>
        );
        break;
      case "complete":
        modalContent = (
          <>
            <ModalHeader>Task Complete</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              This task has been completed by{" "}
              {selectedTask?.menteesAssigned[0]?.name}
              <br />
              Tokens alloted: {selectedTask.token}
            </ModalBody>
          </>
        );
        break;
      default:
        modalContent = <div>Task Details for {selectedTask.title}</div>;
        break;
    }

    return (
      <Modal isOpen={!!selectedTask} onClose={handleCloseModal}>
        <ModalOverlay bg="rgba(0, 0, 0, 0.25)" />
        <ModalContent>{modalContent}</ModalContent>
      </Modal>
    );
  };

  const [isOpenUpdateTask, setIsOpenUpdateTask] = useState(false);

  const openUpdateTaskModal = (task) => {
    setSelectedTask(task);
    setIsOpenUpdateTask(true);
  };

  const closeUpdateTaskModal = () => {
    setSelectedTask(null);
    setIsOpenUpdateTask(false);
    setSortedTasks(project.tasks);
  };

  // console.log(project.tasks);
  return (
    <>
      <VStack alignItems="start">
        {isOwner && (
          <>
            <Alert status="info" variant="left-accent">
              <AlertIcon />
              <VStack spacing={0} alignItems="start">
                <AlertTitle>Important Information</AlertTitle>
                <AlertDescription>
                  The first task you create for a new contributor should be
                  signing of legal documents
                </AlertDescription>
              </VStack>
            </Alert>
            <Button colorScheme="blue" onClick={openCreateTaskModal}>
              <Icon as={FaPlusCircle} mr={2} mt={1} />
              Create Task
            </Button>
          </>
        )}
        <TableContainer w="100%" borderWidth="1px">
          <Table variant="striped" size="lg">
            <Thead
              sx={{
                "& > tr > th": {
                  px: 2, // Apply vertical padding to all <Td> elements
                  textAlign: "center",
                },
              }}
            >
              <Tr>
                <Th w="5%" px={2}>
                  S.No.
                </Th>
                <Th w="10%">Title</Th>
                <Th
                  w="50%"
                  whiteSpace="normal"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  Description
                </Th>
                <Th cursor="pointer" onClick={handleSortByDueDate}>
                  Due Date {sortDirection === "asc" ? "↑" : "↓"}
                </Th>
                <Th>Tokens</Th>
                <Th>Status</Th>
                <Th>Priority</Th>
                {isOwner && <Th>Assigned To</Th>}
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody
              sx={{
                "& > tr > td": {
                  px: 5, // Apply vertical padding to all <Td> elements
                },
              }}
            >
              {project.tasks?.map((task: Task, index: number) => {
                return (
                  <>
                    <Tr key={task.id}>
                      <Td w="5%">{index + 1}</Td>
                      <Td w="10%">{task.title}</Td>
                      <Td w="50%" whiteSpace="normal">
                        {task.description}
                      </Td>
                      <Td>
                        {new Date(task.dueDate).toISOString().split("T")[0]}
                      </Td>
                      <Td>{task.token}</Td>
                      <Td cursor="pointer">
                        <Badge
                          w="full"
                          variant="solid"
                          colorScheme={
                            (task.taskStatus === "pending" && "blue") || "teal"
                          }
                          textAlign="center"
                        >
                          {(task.taskStatus === "submit" && "Submitted") ||
                            (task.taskStatus === "pending" && "Unassigned") ||
                            (task.taskStatus === "review" && "Under Review") ||
                            task.taskStatus}
                        </Badge>
                      </Td>
                      <Td>
                        <Badge
                          variant="outline"
                          w="full"
                          textAlign="center"
                          colorScheme={
                            (task.priority === "low" && "green") ||
                            (task.priority === "medium" && "orange") ||
                            ((task.priority === "high" && "red") as string)
                          }
                        >
                          {task.priority}
                        </Badge>
                      </Td>
                      {isOwner && (
                        <Td>
                          <Popover trigger="hover" placement="bottom-start">
                            <PopoverTrigger>
                              <Avatar
                                size="md"
                                name={task?.menteesAssigned[0]?.name}
                                cursor="pointer"
                              />
                            </PopoverTrigger>
                            <PopoverContent>
                              <PopoverArrow />
                              <PopoverCloseButton />
                              <PopoverBody>
                                <VStack align="start">
                                  <HStack>
                                    <Text fontWeight="bold">Name:</Text>
                                    <Text>
                                      {task?.menteesAssigned[0]?.name}
                                    </Text>
                                  </HStack>
                                  <HStack>
                                    <Text fontWeight="bold">Email:</Text>
                                    <Text>
                                      {task?.menteesAssigned[0]?.email}
                                    </Text>
                                  </HStack>
                                  <HStack>
                                    <Text
                                      fontWeight="bold"
                                      color="blue.500"
                                      textDecoration="underline"
                                    >
                                      View Profile
                                    </Text>
                                  </HStack>
                                </VStack>
                              </PopoverBody>
                            </PopoverContent>
                          </Popover>
                        </Td>
                      )}
                      <Td>
                        <Popover trigger="hover" placement="bottom-start">
                          <PopoverTrigger>
                            <IconButton
                              icon={<FaCog />}
                              aria-label="Settings"
                              variant="link"
                              colorScheme="gray"
                            />
                          </PopoverTrigger>
                          <PopoverContent>
                            <PopoverArrow />
                            <PopoverCloseButton />
                            <PopoverHeader fontWeight="semibold">
                              Options
                            </PopoverHeader>
                            <PopoverBody>
                              <VStack
                                align="start"
                                divider={<StackDivider borderWidth="1px" />}
                                spacing="0"
                                alignItems="flex-start"
                                mt={0}
                                borderWidth="1px"
                                sx={{
                                  "& > button": {
                                    cursor: "pointer",
                                    w: "full",
                                    fontSize: "sm",
                                    borderRadius: 0,
                                    textAlign: "start",
                                  },
                                }}
                              >
                                {isOwner && (
                                  <>
                                    <Button
                                      isDisabled={
                                        task.taskStatus === "complete" ||
                                        task.taskStatus === "submit"
                                      }
                                      colorScheme="blue"
                                      onClick={() => openUpdateTaskModal(task)}
                                    >
                                      Update Task
                                    </Button>
                                    <Button
                                      onClick={() => handleOpenModal(task)}
                                      isDisabled={task.taskStatus !== "pending"}
                                    >
                                      Assign Mentee
                                    </Button>
                                    <Button
                                      onClick={() => handleOpenModal(task)}
                                      colorScheme="blue"
                                      isDisabled={task.taskStatus !== "submit"}
                                    >
                                      Get documents
                                    </Button>
                                    <Button
                                      onClick={() => handleOpenModal(task)}
                                      colorScheme="green"
                                      isDisabled={task.taskStatus !== "review"}
                                    >
                                      Finalize task
                                    </Button>
                                    <Button
                                      colorScheme="red"
                                      onClick={() => handleOpenModal(task)}
                                      isDisabled={
                                        task.taskStatus === "complete"
                                      }
                                    >
                                      Remove contributor
                                    </Button>
                                  </>
                                )}
                                {!isOwner && (
                                  <Button
                                    colorScheme="blue"
                                    onClick={() => handleOpenModal(task)}
                                    isDisabled={task.taskStatus !== "active"}
                                  >
                                    Submit Documents
                                  </Button>
                                )}
                              </VStack>
                            </PopoverBody>
                          </PopoverContent>
                        </Popover>
                      </Td>
                    </Tr>
                  </>
                );
              })}
              {renderModal()}
              <UpdateTaskModal
                isOpen={isOpenUpdateTask}
                onClose={closeUpdateTaskModal}
                taskData={selectedTask}
                projectId={project._id}
              />
            </Tbody>
          </Table>
        </TableContainer>
        {/* <Tabs variant="enclosed-colored" w="100%">
          <TabList w="100%" mb={2}>
            {isOwner && <Tab>Pending</Tab>}
            <Tab>Active</Tab>
            <Tab>Completed</Tab>
          </TabList>

          <TabPanels>
            {isOwner && (
              <TabPanel p={0}>
                <PendingTasks project={project} isOwner={isOwner} />
              </TabPanel>
            )}
            <TabPanel>
              <ActiveTasks project={project} isOwner={isOwner} />
            </TabPanel>
            <TabPanel>Three!</TabPanel>
          </TabPanels>
        </Tabs> */}
      </VStack>
      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={closeCreateTaskModal}
        projectId={project._id}
      />
    </>
  );
};

export default TaskDetails;
