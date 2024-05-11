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
  useColorModeValue,
  // Select,
  HStack,
  Link as ChakraLink,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useState } from "react";
import { useDispatch } from "react-redux";
// import { createUser } from "../features/users/userSlice";
import { useNavigate, Link as ReactRouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import ErrorPage from "./ErrorPage";
import Loader from "../components/Loader";
import StepOneForm from "../components/StepOneForm";
import { useForm } from "react-hook-form";

interface SignupFormData {
  name: string;
  email: string;
  phone: string;
  aadhar: string;
  ethAddress: string;
}

export default function Signup() {
  const [formData, setFormData] = useState({
    ethAddress: "",
    name: "",
    organization: "",
    email: "",
    phone: "",
    aadhar: "",
    password: "",
    designation: "",
  });
  const [step, setStep] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<SignupFormData>();

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  function postUserData(variables: void): Promise<unknown> {
    throw new Error("Function not implemented.");
  }

  const { mutate, isLoading, isError, isSuccess, error } = useMutation(
    postUserData,
    {
      onSuccess: () => {
        // Invalidate relevant queries after successful mutation
        queryClient.invalidateQueries("userData");
      },
    }
  );

  function onSubmit(data) {
    // e.preventDefault();
    // const formData = new FormData(e.target);
    // const userData = Object.fromEntries(formData.entries());
    // mutate();
    console.log(data);
  }

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    // console.log(error);
    return <ErrorPage />;
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
      <Stack spacing={8} mx={"auto"} maxW={"xxl"} px={6} marginBottom={8}>
        <Flex align={"center"} justifyContent={"center"}>
          <Heading fontSize={"4xl"}>Sign up for a new account</Heading>
        </Flex>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          {/* <StepOneForm register={register} errors={errors} /> */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <FormControl id="name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  {...register("name", { required: true })}
                  type="text"
                  placeholder="Enter your name"
                />
                <FormErrorMessage>
                  {errors.name && errors.name.message}
                </FormErrorMessage>
              </FormControl>
              {/* <FormControl id="updated_cv" isRequired isDisabled>
                <FormLabel>Updated CV</FormLabel>
                <Input
                  type="file"
                  {...register("updated_cv", { required: true })}
                />
                {errors.updated_cv && <span>Updated CV is required</span>}
              </FormControl> */}
              <FormControl id="email" isRequired>
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
                <FormErrorMessage>
                  {errors.email && errors.email.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl id="phone" isRequired>
                <FormLabel>Phone No.</FormLabel>
                <Input
                  {...register("phone", { required: true })}
                  type="tel"
                  placeholder="Enter your phone number"
                />
                {errors.phone && errors.phone.message}
              </FormControl>
              <FormControl id="aadhar" isRequired>
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
                <FormErrorMessage>
                  {errors.aadhar && errors.aadhar.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl id="ethAddress" isRequired>
                <FormLabel>Ethereum Address</FormLabel>
                <Input
                  {...register("ethAddress", { required: true })}
                  type="text"
                  placeholder="Enter your Ethereum address"
                />
                {errors.ethAddress && errors.ethAddress.message}
              </FormControl>
              {/* <HStack>
                <FormControl id="organization" isRequired>
                  <FormLabel>Organization</FormLabel>
                  <Input
                    type="text"
                    value={formData.organization}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl id="designation" isRequired>
                  <FormLabel>Designation</FormLabel>
                  <Input
                    type="text"
                    value={formData.designation}
                    onChange={handleChange}
                  />
                </FormControl>
              </HStack>
              <HStack>
                <FormControl id="password" isRequired>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl id="confirm_password" isRequired>
                  <FormLabel>Confirm Password</FormLabel>
                  <Input type="password" />
                </FormControl>
              </HStack> */}
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
