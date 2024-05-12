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
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import MyToast from "./MyToast";

interface ProjectFormData {
  description: string;
  menteesRequired: number;
  endDate: string;
}

const UpdateProjectModal = ({
  isOpen,
  onClose,
  //   userData,
  isProjectUpdated,
  setIsProjectUpdated,
  projectData,
}) => {
  setIsProjectUpdated(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ProjectFormData>({
    defaultValues: {
      description: projectData?.description,
      menteesRequired: projectData?.menteesRequired,
      // endDate: projectData?.endDate,
      endDate: new Date(projectData?.endDate).toISOString().split("T")[0],
    },
  });

  const updateUserProject = async (data) => {
    try {
      const response = await axios.post(
        `http://localhost:4000/api/projects/${projectData._id}`,
        data
      );
      // console.log(response);
      return response.data.data;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to update User Profile");
    }
  };

  const toast = useToast();
  const { mutateAsync, isLoading, isSuccess } = useMutation(updateUserProject, {
    onSuccess: (data) => {
      // console.log(data);
      toast({
        title: "Success",
        description: "Project details updated",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    },
    onError: (error) => {
      // console.log(error);
    },
  });

  const onSubmit: SubmitHandler<ProjectFormData> = async (data) => {
    try {
      console.log(data);
      await mutateAsync(data);
      setIsProjectUpdated(true);
      onClose(); // Close the modal after updating profile
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
    onClose(); // Close modal after updating profile
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Update Profile</ModalHeader>
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
            <FormControl mt={4} isInvalid={!!errors.menteesRequired}>
              <FormLabel>Mentees Required</FormLabel>
              <Input
                type="number"
                {...register("menteesRequired", {
                  required: "Field is required",
                  min: {
                    value:
                      projectData.menteesRequired -
                      projectData.menteesApproved.length,
                    message: `Value must be greater than or equal to " + ${
                      projectData.menteesRequired -
                      projectData.menteesApproved.length
                    }`,
                  },
                })}
              />
              <FormErrorMessage>
                {errors.menteesRequired && errors.menteesRequired.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl mt={4} isInvalid={!!errors.menteesRequired}>
              <FormLabel>End Date</FormLabel>
              <Input
                type="date"
                {...register("endDate", {
                  required: "Field is required",
                })}
              />
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
export default UpdateProjectModal;
