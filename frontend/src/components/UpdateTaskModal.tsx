import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import MyToast from "./MyToast";

interface TaskFormData {
  description: string;
  priority: "low" | "medium" | "high";
  dueDate: Date;
  token: number;
}

const UpdateTaskModal = ({ isOpen, onClose, taskData, projectId }) => {
  const queryClient = useQueryClient();

  console.log(taskData);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<TaskFormData>({
    defaultValues: {
      description: taskData?.description,
      priority: taskData?.priority,
      dueDate: taskData?.dueDate,
      token: taskData?.token,
    },
  });

  const toast = useToast();
  const { mutateAsync, isLoading } = useMutation(
    async (data) => {
      return await axios.put(
        `http://localhost:4000/api/projects/${projectId}/tasks`,
        data
      );
    },
    {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Task details updated",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        queryClient.invalidateQueries(["project", projectId]);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: `${error?.response?.data?.message}. Could not update task`,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      },
    }
  );

  const onSubmit: SubmitHandler<TaskFormData> = async (data) => {
    console.log(data);
    data["taskId"] = taskData?.id;
    await mutateAsync(data);
    reset();
    onClose(); // Close the modal after updating profile
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Update Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={!!errors.description}>
              <FormLabel>Description</FormLabel>
              <Input
                type="text"
                {...register("description", {
                  required: "Field is required",
                })}
              />
              <FormErrorMessage>
                {errors.description && errors.description.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl mt={4} isInvalid={!!errors.priority}>
              <FormLabel as="legend">Priority</FormLabel>
              <Controller
                name="priority"
                control={control}
                defaultValue="medium"
                render={({ field }) => (
                  <RadioGroup {...field}>
                    <Stack direction="row">
                      <Radio value="low" colorScheme="green">
                        Low
                      </Radio>
                      <Radio value="medium" colorScheme="yellow">
                        Medium
                      </Radio>
                      <Radio value="high" colorScheme="red">
                        High
                      </Radio>
                    </Stack>
                  </RadioGroup>
                )}
              />
            </FormControl>
            <FormControl mt={4} isInvalid={!!errors.dueDate}>
              <FormLabel>Due Date</FormLabel>
              <Input
                type="date"
                {...register("dueDate", {
                  required: "Field is required",
                })}
              />
              <FormErrorMessage>{errors.dueDate?.message}</FormErrorMessage>
            </FormControl>
            <FormControl mt={4} isInvalid={!!errors.token}>
              <FormLabel>Token</FormLabel>
              <Input
                type="number"
                {...register("token", {
                  required: "Field is required",
                })}
              />
              <FormErrorMessage>{errors.token?.message}</FormErrorMessage>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              type="submit"
              isLoading={isLoading}
            >
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
export default UpdateTaskModal;
