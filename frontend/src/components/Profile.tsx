import {
  Avatar,
  Box,
  Button,
  Flex,
  FormErrorMessage,
  HStack,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useAppSelector } from "../app/hooks";
import { useUser } from "../context/UserContext";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import useUpdateProfile from "../hooks/useUpdateProfile";

interface UserData {
  name: string;
  email: string;
  organization_id: string;
  designation: string;
  phone: string;
}

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
}

export default function Profile() {
  // const user = useAppSelector((store) => store.user);
  // const { userData: user } = useUser();
  // console.log(user);

  const [userData, setUserData] = useState<UserData | null>(null);
  const [updatedName, setUpdatedName] = useState<string>("");
  const [updatedEmail, setUpdatedEmail] = useState<string>("");
  const [updatedContact, setUpdatedContact] = useState<string>("");
  const [profileUpdated, setIsProfileUpdated] = useState<boolean>(false);
  const { updateProfile, isLoading } = useUpdateProfile(); // Use the custom hook

  // const [updatedUserData, setUpdatedUserData] = useState(userData);

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUserData = localStorage.getItem("userData");
    // console.log(storedUserData);
    if (storedUserData) {
      // Parse the JSON string and set user data state
      setUserData(JSON.parse(storedUserData));
      // setIsProfileUpdated(false);
    }
  }, []); // Empty dependency array ensures this effect runs only once on mount

  const handleChange = (newValue, fieldName) => {
    setUpdatedUserData((prevData) => ({
      ...prevData,
      [fieldName]: newValue,
    }));
  };

  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);

  const handleUpdateProfile = () => {
    // Add logic to update profile
    onClose(); // Close modal after updating profile
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>();

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    console.log(data);

    try {
      await updateProfile(data);
      setIsProfileUpdated(true);
      onClose(); // Close the modal after updating profile
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
    onClose(); // Close modal after updating profile
  };

  return (
    <>
      <HStack
        w="full"
        h="full"
        flexDirection="column"
        paddingX="4"
        marginX="4"
        alignItems="start"
        spacing={4}
        marginY="0.5"
      >
        <Heading
          as="h1"
          size="xl"
          mt={4}
          mb={4}
          fontWeight="bold"
          textTransform="uppercase"
        >
          Profile Page
        </Heading>
        <Avatar size="2xl" name={userData?.name} />
        <TableContainer
          w="80%"
          border="1px"
          borderColor="gray.100"
          borderRadius={10}
        >
          <Table variant="simple">
            <Tbody>
              <Tr>
                <Td>Name</Td>
                <Td fontWeight="semibold" fontSize="lg">
                  {userData?.name}
                </Td>
              </Tr>
              <Tr>
                <Td>Email ID</Td>
                <Td fontWeight="semibold" fontSize="lg">
                  {userData?.email}
                </Td>
              </Tr>
              <Tr>
                <Td>Contact</Td>
                <Td fontWeight="semibold" fontSize="lg">
                  {userData?.phone}
                </Td>
              </Tr>
              <Tr>
                <Td>Organization</Td>
                <Td fontWeight="semibold" fontSize="lg">
                  {userData?.organization_id}
                </Td>
              </Tr>
              <Tr>
                <Td>Designation</Td>
                <Td fontWeight="semibold" fontSize="lg">
                  {userData?.designation}
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
        <Button colorScheme="blue" onClick={onOpen}>
          Update Profile
        </Button>
      </HStack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>Update Profile</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl isInvalid={!!errors.name}>
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter your name"
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
                />
                <FormErrorMessage>
                  {errors.name && errors.name.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl mt={4} isInvalid={!!errors.email}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="Enter your email"
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
              <FormControl mt={4}>
                <FormLabel>Contact</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter your contact"
                  {...register("phone")}
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
    </>
  );
}
