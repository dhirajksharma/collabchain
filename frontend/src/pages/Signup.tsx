import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  HStack,
  Link as ChakraLink,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, Link as ReactRouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useMutation } from "react-query";
import axios from "axios";
import Loader from "../components/Loader";
import { useForm } from "react-hook-form";
import { useCookies } from "react-cookie";

interface SignupFormData {
  name: string;
  email: string;
  phone: string;
  aadhar: string;
  ethAddress: string;
  organization_name: string;
  organization_email: string;
  organization_address: string;
  designation: string;
  password: string;
  confirm_password?: string;
}

export default function Signup() {
  const toast = useToast();
  const [cookies, setCookie] = useCookies(["token"]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignupFormData>();
  const password = watch("password");

  const navigate = useNavigate();

  const { mutate, isLoading, isSuccess } = useMutation(
    (formData: SignupFormData) =>
      axios.post("http://localhost:4000/api/user/register", formData),
    {
      onSuccess: (data) => {
        // console.log(data.data?.data.token);
        const { token } = data.data?.data;
        setCookie("token", token, { path: "/" });

        navigate("/app/profile", { state: { isAuthenticated: true } });

        toast({
          title: "Success",
          description: "Signup successful! Welcome to the platform",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        // You can redirect to another page or show a success message, etc.
      },
      onError: (error: any) => {
        // Handle signup error
        console.error("Signup error:", error.response?.data?.message);
        toast({
          title: "Error",
          description: `${error.response?.data?.message}. Could not signup`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        // You can display an error message to the user, reset the form, etc.
      },
    }
  );

  function onSubmit(data: any) {
    const organization = {
      name: data.organization_name,
      email: data.organization_email,
      address: data.organization_address,
      designation: data.designation,
    };
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      confirm_password,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      organization_name,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      organization_email,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      organization_address,
      ...formData
    } = data;

    const signupData = { ...formData, organization };
    mutate(signupData);
  }

  if (isLoading) {
    return <Loader />;
  }

  if (isSuccess) {
    navigate("/app");
  }

  return (
    <Flex
      align={"center"}
      justify={"center"}
      as={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Stack spacing={5} mx={"auto"} w="50%" px={6} marginBottom={8}>
        <Flex align={"center"} justifyContent={"center"}>
          <Heading fontSize={"4xl"}>Sign up for a new account</Heading>
        </Flex>
        <Box rounded={"lg"} boxShadow={"lg"} p={8}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <HStack spacing={4}>
                <FormControl id="name" isRequired isInvalid={!!errors.name}>
                  <FormLabel>Name</FormLabel>
                  <Input
                    {...register("name", { required: true })}
                    type="text"
                    placeholder="Enter your name"
                  />
                  <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                </FormControl>
                {/* <FormControl id="updated_cv" isRequired isDisabled>
                <FormLabel>Updated CV</FormLabel>
                <Input
                type="file"
                  {...register("updated_cv", { required: true })}
                  />
                {errors.updated_cv && <span>Updated CV is required</span>}
              </FormControl> */}
                <FormControl id="email" isRequired isInvalid={!!errors.email}>
                  <FormLabel>Email address</FormLabel>
                  <Input
                    {...register("email", {
                      required: true,
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email address",
                      },
                    })}
                    type="email"
                    placeholder="Enter your email"
                  />
                  <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                </FormControl>
              </HStack>
              <HStack spacing={4}>
                <FormControl id="phone" isRequired isInvalid={!!errors.phone}>
                  <FormLabel>Phone No.</FormLabel>
                  <Input
                    {...register("phone", { required: true })}
                    type="tel"
                    placeholder="Enter your phone number"
                  />
                  {errors.phone?.message}
                </FormControl>
                <FormControl id="aadhar" isRequired isInvalid={!!errors.aadhar}>
                  <FormLabel>Aadhar No.</FormLabel>
                  <Input
                    {...register("aadhar", {
                      required: true,
                      minLength: {
                        value: 12,
                        message: "Aadhar No. should be 12 characters",
                      },
                      maxLength: {
                        value: 12,
                        message: "Aadhar No. should be 12 characters",
                      },
                    })}
                    type="number"
                    placeholder="Enter your Aadhar number"
                  />
                  <FormErrorMessage>{errors.aadhar?.message}</FormErrorMessage>
                </FormControl>
              </HStack>
              <FormControl
                id="ethAddress"
                isRequired
                isInvalid={!!errors.ethAddress}
              >
                <FormLabel>Ethereum Address</FormLabel>
                <Input
                  {...register("ethAddress", { required: true })}
                  type="text"
                  placeholder="Enter a valid Ethereum address"
                />
                {errors.ethAddress?.message}
              </FormControl>
              <HStack>
                <FormControl
                  id="organization_name"
                  isRequired
                  isInvalid={!!errors.organization_name}
                >
                  <FormLabel>Organization Name</FormLabel>
                  <Input
                    {...register("organization_name", {
                      required: true,
                    })}
                    type="text"
                    placeholder=" Enter your organization's name"
                  />
                  <FormErrorMessage>
                    {errors.organization_name?.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  id="organization_email"
                  isRequired
                  isInvalid={!!errors.organization_email}
                >
                  <FormLabel>Organization Email</FormLabel>
                  <Input
                    {...register("organization_email", {
                      required: true,
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email address",
                      },
                    })}
                    type="text"
                    placeholder=" Enter your organization's email"
                  />
                  <FormErrorMessage>
                    {errors.organization_email?.message}
                  </FormErrorMessage>
                </FormControl>
              </HStack>
              <HStack>
                <FormControl
                  id="organization_address"
                  isRequired
                  isInvalid={!!errors.organization_address}
                >
                  <FormLabel>Organization Address</FormLabel>
                  <Input
                    {...register("organization_address", {
                      required: true,
                    })}
                    type="text"
                    placeholder=" Enter your organization's address"
                  />
                  <FormErrorMessage>
                    {errors.organization_address?.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  id="designation"
                  isRequired
                  isInvalid={!!errors.designation}
                >
                  <FormLabel>Designation</FormLabel>
                  <Input
                    {...register("designation", {
                      required: true,
                    })}
                    type="text"
                    placeholder=" Enter your designation"
                  />
                  <FormErrorMessage>
                    {errors.designation?.message}
                  </FormErrorMessage>
                </FormControl>
              </HStack>
              <HStack>
                <FormControl id="password" isRequired>
                  <FormLabel>Password</FormLabel>
                  <Input
                    {...register("password", {
                      required: true,
                    })}
                    type="password"
                  />
                </FormControl>
                <FormControl
                  id="confirm_password"
                  isRequired
                  isInvalid={!!errors.confirm_password}
                >
                  <FormLabel>Confirm Password</FormLabel>
                  <Input
                    {...register("confirm_password", {
                      required: true,
                      validate: (value) =>
                        value === password || "The passwords do not match",
                    })}
                    type="password"
                  />
                  <FormErrorMessage>
                    {errors.confirm_password?.message}
                  </FormErrorMessage>
                </FormControl>
              </HStack>
              <Stack marginTop="8" spacing={4}>
                <Stack>
                  <Button
                    bg={"blue.400"}
                    color={"white"}
                    _hover={{
                      bg: "blue.500",
                    }}
                    type="submit"
                  >
                    Sign in
                  </Button>
                </Stack>
                <Flex justifyContent="center">
                  <Text marginX="2">Already registered?</Text>
                  <ChakraLink
                    as={ReactRouterLink}
                    to="/login"
                    color={"blue.400"}
                    textDecoration={"underline"}
                  >
                    Sign in
                  </ChakraLink>
                </Flex>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
}
