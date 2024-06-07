import {
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  ModalFooter,
  Button,
  Box,
  Flex,
  Heading,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { useNavigate, useParams } from "react-router";

interface PasswordFormData {
  password: string;
  confirmPassword: string;
}

const ResetPassword = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PasswordFormData>();

  const password = watch("confirmPassword");

  const { id } = useParams();
  const toast = useToast();
  const { mutateAsync } = useMutation(
    async (data: PasswordFormData) => {
      return await axios.put(
        `http://localhost:4000/api/user/resetpassword/${id}`,
        data
      );
    },
    {
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
        navigate("/login");
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: `${error?.response?.data?.message}. Could not update password`,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      },
    }
  );

  const onSubmit: SubmitHandler<PasswordFormData> = async (data) => {
    // console.log(data);
    await mutateAsync(data);
  };

  return (
    <VStack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6} marginBottom={8}>
      <Flex align={"center"}>
        <Heading fontSize={"4xl"}>Reset your password</Heading>
      </Flex>
      <Box
        rounded={"lg"}
        // eslint-disable-next-line react-hooks/rules-of-hooks
        bg={useColorModeValue("white", "gray.700")}
        boxShadow={"lg"}
        p={8}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>New Password</FormLabel>
              <Input
                type="password"
                {...register("password", {
                  required: "New Password is required",
                })}
              />
            </FormControl>
            <FormControl isInvalid={!!errors.confirmPassword} isRequired>
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
          <Button colorScheme="blue" mr={3} mt={4} type="submit" w="full">
            Confirm
          </Button>
        </form>
      </Box>
    </VStack>
  );
};
export default ResetPassword;
