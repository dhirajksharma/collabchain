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
  Link as ChakraLink,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
// import { useDispatch } from "react-redux";
import { useNavigate, Link as ReactRouterLink } from "react-router-dom";
// import { createUser } from "../features/users/userSlice";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
// import { useUser } from "../context/UserContext";

export default function Login() {
  // const [userType, setUserType] = useState("");
  // const [name, setName] = useState("Nahshal Manir");
  // const [organization, setOrganization] = useState("TMSL");
  const [email, setEmail] = useState("");
  // const [phone, setPhone] = useState("+91 1234567890");
  const [password, setPassword] = useState("");
  // const [designation, setDesignation] = useState("Professor");

  // const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();

  async function postUserData() {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/user/login",
        {
          email,
          password,
        }
      );
      console.log(response);
      if (response.status === 200) {
        return response.data.data;
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      toast({
        title: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      throw new Error("Error logging in");
    }
  }

  const setCookie = (name: string, value: string, days: number): void => {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = `; expires=${date.toUTCString()}`;
    }
    // document.cookie = `${name}=${value || ""}${expires}; path=/`;
    document.cookie = `token=${value}; path=/; max-age=604800; SameSite=None; Secure`;
    console.log(document.cookie);
  };
  const { mutate, isLoading, isSuccess } = useMutation(postUserData, {
    onSuccess: (data) => {
      console.log(data);
      const { name, email, organization, phone } = data.user;
      const { token } = data;
      localStorage.setItem("authToken", token);
      setCookie("token", token, 7); // Set the cookie with a lifespan of 7 days

      const { organization_id, designation } = organization;
      localStorage.setItem(
        "userData",
        JSON.stringify({ name, email, phone, organization_id, designation })
      );
      const x = localStorage.getItem("userData");
      console.log(x);
      queryClient.invalidateQueries("userData");
      navigate("/app/profile");
    },
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      mutate();
    } catch (error) {
      console.error("mutate error");
    }
  }

  if (isLoading) {
    return (
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    );
  }

  // console.log(isSuccess);
  if (isSuccess) {
    navigate("/app");
  }

  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"}>
      <Stack
        spacing={8}
        mx={"auto"}
        maxW={"lg"}
        py={12}
        px={6}
        marginBottom={8}
      >
        <Flex align={"center"}>
          <Heading fontSize={"4xl"}>Log in to your account</Heading>
        </Flex>
        <Box
          rounded={"lg"}
          // eslint-disable-next-line react-hooks/rules-of-hooks
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl id="email" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              <Stack marginTop="8" spacing={4}>
                <Stack>
                  <Button
                    type="submit"
                    // bg={"blue.400"}
                    // color={"white"}
                    // _hover={{
                    //   bg: "blue.500",
                    // }}
                    colorScheme="blue"
                  >
                    Sign in
                  </Button>
                </Stack>
                <Flex justifyContent="center">
                  <Text marginX="2">Not a registered User?</Text>
                  <ChakraLink
                    as={ReactRouterLink}
                    to="/signup"
                    color={"blue.400"}
                    // colorScheme="blue"
                    textDecoration={"underline"}
                  >
                    Register Here
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
