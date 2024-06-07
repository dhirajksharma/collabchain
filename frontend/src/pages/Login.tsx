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
  Link as ChakraLink,
  Spinner,
  useToast,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate, Link as ReactRouterLink } from "react-router-dom";
import axios from "axios";
import { useMutation } from "react-query";
import { useCookies } from "react-cookie";
import VerifyEmail from "./VerifyEmail";

axios.defaults.withCredentials = true;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // const dispatch = useDispatch();
  const navigate = useNavigate();
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
        title: "Error logging in",
        description: error.response.data.message,
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
      const { token } = data;
      setCookie("token", token, { path: "/" });
      toast({
        title: "Successful",
        description: "Logged in successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });

      navigate("/app/profile", { state: { isAuthenticated: true } });
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

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [verifyMail, setVerifyMail] = useState("");

  const { mutateAsync: mutateVerifyEmail } = useMutation(
    async () => {
      const email = verifyMail;
      console.log(email);
      return await axios.post("http://localhost:4000/api/user/forgotpassword", {
        email,
      });
    },
    {
      onSuccess: (data) => {
        toast({
          title: "Success",
          description: `${data.data.message}`,
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: `${error?.response?.data?.message}. Could not send email`,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      },
    }
  );

  const handleVerifyEmailClick = () => {
    mutateVerifyEmail();
    setVerifyMail("");
    onClose();
  };

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
                <Text
                  mt={3}
                  color="blue.500"
                  cursor="pointer"
                  textDecoration="underline"
                  onClick={onOpen}
                >
                  Forgot Password?
                </Text>
              </FormControl>
              <Stack marginTop="8" spacing={4}>
                <Stack>
                  <Button type="submit" colorScheme="blue">
                    Sign in
                  </Button>
                </Stack>
                <Flex justifyContent="center">
                  <Text marginX="2">Not a registered User?</Text>
                  <ChakraLink
                    as={ReactRouterLink}
                    to="/signup"
                    color={"blue.400"}
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
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Verify Email</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <FormControl id="email" isRequired>
                  <FormLabel>Enter your registered Email id</FormLabel>
                  <Input
                    type="email"
                    value={verifyMail}
                    onChange={(e) => setVerifyMail(e.target.value)}
                  />
                </FormControl>
              </Stack>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleVerifyEmailClick}>
              Send Reset Link
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
