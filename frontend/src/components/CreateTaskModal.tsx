import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormErrorMessage,
  FormLabel,
  Input,
  FormControl,
  Textarea,
  Radio,
  RadioGroup,
  Stack,
  HStack,
  useToast,
} from "@chakra-ui/react";
import axios, { AxiosError } from "axios";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";

interface TaskFormData {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  token: number;
  dueDate: Date;
}

const CreateTaskModal = ({ isOpen, onClose, projectId }) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<TaskFormData>();

  const { mutateAsync, isLoading, isSuccess } = useMutation(
    async (formData) => {
      return await axios.post(
        `http://localhost:4000/api/projects/${projectId}/tasks`,
        formData
      );
    },
    {
      onSuccess: () => {
        // console.log(data);
        toast({
          title: "Success",
          description: "New task created",
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
          description: `${error?.response?.data?.message}. Could not create task`,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      },
    }
  );

  const onSubmit: SubmitHandler<TaskFormData> = async (data) => {
    // console.log(data);
    await mutateAsync(data);
    onClose();
    reset();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create a new task</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <FormControl isRequired isInvalid={!!errors.title}>
              <FormLabel>Title</FormLabel>
              <Input
                type="text"
                {...register("title", {
                  required: "Title is required",
                })}
              />
              <FormErrorMessage>{errors?.title?.message}</FormErrorMessage>
            </FormControl>
            <FormControl id="description" isRequired isInvalid={!!errors.title}>
              <FormLabel htmlFor="description">Description</FormLabel>
              <Textarea id="description" {...register("description")} />
              <FormErrorMessage>
                {errors?.description?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl as="fieldset" isRequired>
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
            <HStack spacing={4}>
              <FormControl isRequired isInvalid={!!errors.token}>
                <FormLabel>Tokens</FormLabel>
                <Input
                  type="number"
                  {...register("token", {
                    required: "Tokens is required",
                  })}
                />
                <FormErrorMessage>{errors?.token?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={!!errors.dueDate}>
                <FormLabel>Due Date</FormLabel>
                <Input
                  type="date"
                  {...register("dueDate", {
                    required: "Due Date is required",
                  })}
                />
                <FormErrorMessage>{errors?.dueDate?.message}</FormErrorMessage>
              </FormControl>
            </HStack>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} colorScheme="teal" type="submit">
              Create
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
export default CreateTaskModal;
