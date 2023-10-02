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
  HStack,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { createUser } from "../features/users/userSlice";
import { useNavigate, Link as ReactRouterLink } from "react-router-dom";
import { motion } from "framer-motion";

export default function Signup() {
  const [userType, setUserType] = useState("");
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [designation, setDesignation] = useState("");

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
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl id="user-type" isRequired>
                <FormLabel>User Type</FormLabel>
                <Select
                  placeholder="Select User Type"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                >
                  <option value="Reasearcher">Researcher</option>
                  <option value="Collaborator">Collaborator</option>
                </Select>
              </FormControl>
              <FormControl id="name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>
              <HStack>
                <FormControl id="organization" isRequired>
                  <FormLabel>Organization</FormLabel>
                  <Input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                  />
                </FormControl>
                <FormControl id="designation" isRequired>
                  <FormLabel>Designation</FormLabel>
                  <Input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                  />
                </FormControl>
              </HStack>
              <FormControl id="updated_cv" isRequired isDisabled>
                <FormLabel>Updated CV</FormLabel>
                <Input type="file" />
              </FormControl>
              <FormControl id="email" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl id="phone" isRequired>
                <FormLabel>Phone No.</FormLabel>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </FormControl>
              <HStack>
                <FormControl id="password" isRequired>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormControl>
                <FormControl id="confirm_password" isRequired>
                  <FormLabel>Confirm Password</FormLabel>
                  <Input type="password" />
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
