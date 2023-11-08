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
  Select,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link as ReactRouterLink } from "react-router-dom";
import { createUser } from "../features/users/userSlice";

export default function Login() {
  const [userType, setUserType] = useState("");
  const [name, setName] = useState("Nahshal Manir");
  const [organization, setOrganization] = useState("TMSL");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+91 1234567890");
  const [password, setPassword] = useState("");
  const [designation, setDesignation] = useState("Professor");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    dispatch(
      createUser(name, email, userType, designation, organization, phone)
    );
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
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl id="user-type" isRequired>
                <FormLabel>User Type</FormLabel>
                <Select
                  placeholder="Select User Type"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                >
                  <option value="reasearcher">Researcher</option>
                  <option value="collaborator">Collaborator</option>
                </Select>
              </FormControl>
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
                    bg={"blue.400"}
                    color={"white"}
                    _hover={{
                      bg: "blue.500",
                    }}
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
