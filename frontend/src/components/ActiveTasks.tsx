import {
  VStack,
  Card,
  TableContainer,
  Table,
  Tbody,
  Tr,
  Td,
  Badge,
  Button,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  useToast,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Box,
} from "@chakra-ui/react";
import { Task } from "../interfaces/Project";
import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { useForm } from "react-hook-form";

interface FormValues {
  key: string;
  files: FileList;
}

const ActiveTasks = ({ project, isOwner }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: taskData } = useQuery(
    ["task", project._id],
    async () => {
      return await axios.get(
        `http://localhost:4000/api/projects/${project._id}/mytasks`
      );
    },
    { enabled: !isOwner }
  );

  const myTasks = taskData?.data.data;

  const { mutateAsync } = useMutation(
    async (data) => {
      return await axios.delete(
        `http://localhost:4000/api/projects/${project._id}/tasks/${data.taskId}/${data.menteeId}`
      );
    },
    {
      onSuccess: () => {
        // console.log(data);
        toast({
          title: "Success",
          description: "Mentee removed from task",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        queryClient.invalidateQueries(["project", project._id]);
        queryClient.invalidateQueries(["task", project._id]);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: `${error?.response?.data?.message}. Could not remove mentee from task`,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      },
    }
  );

  const handleClick = (task, menteeId) => {
    const postData = {
      taskId: task.id,
      menteeId,
    };
    mutateAsync(postData);
    onClose();
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  const { mutateAsync: mutateSubmit } = useMutation(
    async (data) => {
      console.log(data);
      const formData = new FormData();
      formData.append("key", data.key);

      Array.from(data.files).forEach((file, index) => {
        formData.append(`files`, file); // append each file
      });
      console.log(formData);

      return await axios.put(
        `http://localhost:4000/api/projects/${project._id}/tasks/${data.taskId}`,
        formData
      );
    },
    {
      onSuccess: (data) => {
        console.log(data);
        toast({
          title: "Success",
          description: "Task documents uploaded",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        queryClient.invalidateQueries(["project", project._id]);
        // queryClient.invalidateQueries(["task", data.]);
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
    const taskId = e.target.getAttribute("taskId");
    console.log("Key:", data.key);
    console.log("Files:", data.files);

    const formData = {
      key: data.key,
      files: data.files,
      taskId,
    };
    // const files = Array.from(data.files);
    // files.forEach((file) => {
    //   console.log(file.name);
    // });
    console.log(formData);

    await mutateSubmit(formData);

    reset();
    onClose();
  };

  const {
    isOpen: isOpenDoc,
    onOpen: onOpenDoc,
    onClose: onCloseDoc,
  } = useDisclosure();

  const [docKey, setDocKey] = useState("");

  const { mutate: mutateDoc } = useMutation(
    async (taskId) => {
      return await axios.post(
        `http://localhost:4000/api/projects/${project._id}/tasks/${taskId}/markcomplete`,
        {
          verificationKey: docKey,
        }
      );
    },
    {
      onSuccess: (data) => {
        console.log(data);

        const url = window.URL.createObjectURL(new Blob([data.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "file.zip"); // Specify the file name and extension
        document.body.appendChild(link);
        link.click();
        link.remove();

        toast({
          title: "Success",
          description: "Task marked complete",
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

  const handleSubmitDoc = (e) => {
    e.preventDefault();
    const taskId = e.target.getAttribute("taskId");
    mutateDoc(taskId);

    setDocKey("");
    onCloseDoc();
  };

  const tasksArray = isOwner ? project.tasks : myTasks;
  return (
    <VStack h="400px" maxH="400px" overflowY="scroll">
      {tasksArray
        ?.filter((task: Task) => task.taskStatus === "active")
        .map((task: Task) => {
          return (
            <Card key={task.id} w="100%" px={4} py={2}>
              {isOwner && task.verificationKey != null && (
                <>
                  <Badge
                    mr="auto"
                    colorScheme="green"
                    variant="solid"
                    fontSize="medium"
                    cursor="pointer"
                    onClick={onOpenDoc}
                  >
                    Documents Uploaded
                  </Badge>
                  <Modal isOpen={isOpenDoc} onClose={onCloseDoc}>
                    <ModalOverlay />
                    <form onSubmit={handleSubmitDoc} taskId={task.id}>
                      <ModalContent>
                        <ModalHeader>Get documents</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                          <FormControl>
                            <FormLabel>
                              Enter the key to get mentee documents
                            </FormLabel>
                            <Input
                              type="text"
                              value={docKey}
                              onChange={(e) => setDocKey(e.target.value)}
                            />
                          </FormControl>
                        </ModalBody>

                        <ModalFooter>
                          <Button colorScheme="blue" mr={3} type="submit">
                            Secondary Action
                          </Button>
                          <Button variant="ghost" onClick={onCloseDoc}>
                            Close
                          </Button>
                        </ModalFooter>
                      </ModalContent>
                    </form>
                  </Modal>
                </>
              )}
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
                      <Td fontWeight="semibold" w="25%" pl={0}>
                        Title
                      </Td>
                      <Td whiteSpace="normal">{task.title}</Td>
                    </Tr>
                    <Tr>
                      <Td></Td>
                      <Td fontWeight="semibold" w="25%" pl={0}>
                        Description
                      </Td>
                      <Td whiteSpace="normal">{task.description}</Td>
                    </Tr>
                    <Tr>
                      <Td></Td>
                      <Td fontWeight="semibold" w="25%" pl={0}>
                        Due Date
                      </Td>
                      <Td whiteSpace="normal">
                        {new Date(task?.dueDate).toISOString().split("T")[0]}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td></Td>
                      <Td fontWeight="semibold" w="25%" pl={0}>
                        Tokens
                      </Td>
                      <Td whiteSpace="normal">{task.token}</Td>
                    </Tr>
                    <Tr>
                      <Td></Td>
                      <Td fontWeight="semibold" w="25%" pl={0}>
                        Mentee assigned
                      </Td>
                      <Td whiteSpace="normal">
                        {task?.menteesAssigned[0]?.name}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td></Td>
                      <Td fontWeight="semibold" w="25%" pl={0}>
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
                <Button
                  mr="auto"
                  colorScheme="red"
                  size="sm"
                  onClick={onOpen}
                  // rightIcon={<ChevronRightIcon />}
                >
                  Remove contributor
                </Button>
              )}
              {!isOwner && (
                <Button
                  mr="auto"
                  colorScheme="green"
                  size="sm"
                  onClick={onOpen}
                  // rightIcon={<ChevronRightIcon />}
                >
                  Complete task
                </Button>
              )}
              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <form
                  as="form"
                  onSubmit={handleSubmit(onSubmit)}
                  taskId={task.id}
                >
                  <ModalContent>
                    <ModalHeader>Modal Title</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <VStack spacing={4} align="stretch">
                        <FormControl isInvalid={!!errors.key}>
                          <FormLabel htmlFor="key">Key</FormLabel>
                          <Input
                            id="key"
                            placeholder="Enter key"
                            {...register("key", {
                              required: "Key is required",
                            })}
                          />
                          <FormErrorMessage>
                            {errors.key && errors.key.message}
                          </FormErrorMessage>
                        </FormControl>

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
                      <Button variant="ghost" onClick={onClose}>
                        Close
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </form>
              </Modal>
              {isOwner && (
                <AlertDialog
                  isOpen={isOpen}
                  leastDestructiveRef={cancelRef}
                  onClose={onClose}
                >
                  <AlertDialogOverlay>
                    <AlertDialogContent>
                      <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        Remove Contributor
                      </AlertDialogHeader>
                      <AlertDialogBody>
                        Are you sure you want to remove{" "}
                        <strong>{task?.menteesAssigned[0].name}</strong>? from
                        this task?
                      </AlertDialogBody>

                      <AlertDialogFooter>
                        <Button
                          colorScheme="green"
                          onClick={() =>
                            handleClick(task, task?.menteesAssigned[0]?._id)
                          }
                        >
                          Confirm
                        </Button>
                        <Button ref={cancelRef} onClick={onClose} ml={3}>
                          Cancel
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialogOverlay>
                </AlertDialog>
              )}
            </Card>
          );
        })}
    </VStack>
  );
};
export default ActiveTasks;
