import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Flex,
  StackDivider,
  VStack,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios, { AxiosError } from "axios";
import { useMutation, useQueryClient } from "react-query";

const TaskActionModal = ({ isOpen, onClose, task, project }) => {
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
    // console.log(task, mentee);
    const postData = {
      taskId: task.id,
      menteeId: mentee.user._id,
    };
    // console.log(postData);
    mutateAsync(postData);

    onClose();
  };

  const getModalBody = () => {
    console.log(task.taskStatus);

    if (task.taskStatus === "complete") {
      return (
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>ceihyg hg59yuh</ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      );
    }

    if (task.taskStatus === "pending") {
      return (
        <ModalContent>
          <ModalHeader>Assign Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Choose a mentee to assign this task to ihgrihg 5riuyg5
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

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      {getModalBody()}
    </Modal>
  );
};
export default TaskActionModal;
