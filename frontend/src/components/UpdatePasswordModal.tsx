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
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";

interface PasswordFormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const UpdatePasswordModal = ({ isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PasswordFormData>();

  const password = watch("newPassword");

  const updateUserProfile = async (data) => {
    console.log(data);
    try {
      const response = await axios.post(
        "http://localhost:4000/api/user/editPassword",
        data
      );
      return response.data.data;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to update Password");
    }
  };

  const toast = useToast();
  const { mutateAsync, isLoading, isSuccess } = useMutation(updateUserProfile, {
    onSuccess: () => {
      // console.log(data);
      toast({
        title: "Success",
        description: "Password updated",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not update password",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    },
  });

  const onSubmit: SubmitHandler<PasswordFormData> = async (data) => {
    try {
      await mutateAsync(data);
      onClose(); // Close the modal after updating profile
    } catch (error) {
      console.error("Failed to update password:", error);
    }
    onClose(); // Close modal after updating profile
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent w="50%">
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Update Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Old Password</FormLabel>
                <Input
                  type="password"
                  {...register("oldPassword", {
                    required: "Old password is required",
                  })}
                />
              </FormControl>
              <FormControl>
                <FormLabel>New Password</FormLabel>
                <Input
                  type="password"
                  {...register("newPassword", {
                    required: "New Password is required",
                  })}
                />
              </FormControl>
              <FormControl isInvalid={!!errors.confirmPassword}>
                <FormLabel>Confirm New Password</FormLabel>
                <Input
                  type="password"
                  {...register("confirmPassword", {
                    required: true,
                    validate: (value) =>
                      value === password || "The passwords do not match",
                  })}
                />
                <FormErrorMessage>
                  {errors.confirmPassword?.message}
                </FormErrorMessage>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              type="submit"
              // isLoading={isLoading}
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
export default UpdatePasswordModal;
