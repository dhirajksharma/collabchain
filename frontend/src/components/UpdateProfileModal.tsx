import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  organization_name: string;
  organization_email: string;
  organization_address: string;
  designation: string;
}

const UpdateProfileModal = ({
  isOpen,
  onClose,
  userData,
  isProfileUpdated,
  setIsProfileUpdated,
}) => {
  setIsProfileUpdated(false);
  const queryClient = useQueryClient();
  // console.log(userData);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: userData?.name,
      email: userData?.email,
      phone: userData?.phone,
      organization_name: userData?.organization_details?.name,
      organization_email: userData?.organization_details?.email,
      organization_address: userData?.organization_details?.address,
      designation: userData?.designation,
    },
  });

  const updateUserProfile = async (data) => {
    console.log(data);
    try {
      const response = await axios.post(
        "http://localhost:4000/api/user/editprofile",
        data
      );
      return response.data.data;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to update User Profile");
    }
  };

  const toast = useToast();
  const { mutateAsync, isLoading, isSuccess } = useMutation(updateUserProfile, {
    onSuccess: (data) => {
      // console.log(data);
      toast({
        title: "Success",
        description: "Profile details updated",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      queryClient.invalidateQueries("userData");
    },
    onError: (error) => {
      // console.log(error);
    },
  });

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    try {
      const organization = {
        designation: data.designation,
        name: data.organization_name,
        email: data.organization_email,
        address: data.organization_address,
      };

      const {
        organization_name,
        organization_email,
        organization_address,
        designation,
        ...localUserData
      } = data;

      const formData = { ...localUserData, organization };

      await mutateAsync(formData);
      setIsProfileUpdated(true);
      onClose(); // Close the modal after updating profile
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
    onClose(); // Close modal after updating profile
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent w="50%">
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Update Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <HStack spacing={4}>
              <FormControl isInvalid={!!errors.name}>
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Name should be at least 2 characters long",
                    },
                    maxLength: {
                      value: 50,
                      message: "Name should not exceed 50 characters",
                    },
                  })}
                  defaultValue={getValues("name")}
                />
                <FormErrorMessage>
                  {errors.name && errors.name.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.email}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.email && errors.email.message}
                </FormErrorMessage>
              </FormControl>
            </HStack>
            <FormControl mt={4}>
              <FormLabel>Contact</FormLabel>
              <Input
                type="text"
                {...register("phone", {
                  required: "Phone number is required",
                })}
              />
              <FormErrorMessage>
                {errors.phone && errors.phone.message}
              </FormErrorMessage>
            </FormControl>
            <HStack spacing={4}>
              <FormControl mt={4}>
                <FormLabel>Organization Name</FormLabel>
                <Input
                  type="text"
                  {...register("organization_name", {
                    required: "Organization Name is required",
                  })}
                />
                <FormErrorMessage>
                  {errors.organization_name && errors.organization_name.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Organization Email</FormLabel>
                <Input
                  type="text"
                  {...register("organization_email", {
                    required: "Organization email is required",
                  })}
                />
                <FormErrorMessage>
                  {errors.organization_email &&
                    errors.organization_email.message}
                </FormErrorMessage>
              </FormControl>
            </HStack>
            <HStack spacing={4}>
              <FormControl mt={4}>
                <FormLabel>Organization Address</FormLabel>
                <Input
                  type="text"
                  {...register("organization_address", {
                    required: "Organization address is required",
                  })}
                />
                <FormErrorMessage>
                  {errors.organization_address?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Organization Email</FormLabel>
                <Input
                  type="text"
                  {...register("designation", {
                    required: "Designation is required",
                  })}
                />
                <FormErrorMessage>
                  {errors.designation?.message}
                </FormErrorMessage>
              </FormControl>
            </HStack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="green"
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
export default UpdateProfileModal;
