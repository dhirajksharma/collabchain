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
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useCookies } from "react-cookie";
import { useUser } from "../context/UserContext";
import MyToast from "../components/MyToast";

axios.defaults.withCredentials = true;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [cookies, setCookie] = useCookies(["token"]);

  async function postUserData() {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/user/login",
        {
          email,
          password,
        }
      );
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

  const { mutate, isLoading, isSuccess } = useMutation(postUserData, {
    onSuccess: (data) => {
      const { name, email, organization, phone } = data.user;
      const { token } = data;
      // localStorage.setItem("authToken", token);
      setCookie("token", token, { path: "/" });

      const { organization_id, designation } = organization;
      localStorage.setItem(
        "userData",
        JSON.stringify({ name, email, phone, organization_id, designation })
      );

      navigate("/app/profile", { state: { isAuthenticated: true } });
    },
  });

  const { login, userData } = useUser();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      mutate();
      // login(email, password);
      // console.log(userData);
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
