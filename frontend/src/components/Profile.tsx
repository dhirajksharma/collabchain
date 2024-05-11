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
import { EditIcon } from "@chakra-ui/icons";
import { ProfilePhoto } from "./ProfilePhoto";
import axios from "axios";
import { useQuery } from "react-query";
import Loader from "./Loader";
import UpdateProfileModal from "./UpdateProfileModal";

axios.defaults.withCredentials = true;

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
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isProfileUpdated, setIsProfileUpdated] = useState<boolean>(false);

  const fetchUserDetails = async () => {
    const response = await axios.get("http://localhost:4000/api/user/profile");
    return response.data;
  };

  const {
    data: queryData,
    isLoading,
    isSuccess,
    refetch,
  } = useQuery("userData", fetchUserDetails, {
    onSuccess: (data) => {
      const { name, email, organization, phone } = data.data;
      const { organization_id, designation } = organization;
      setUserData({ name, email, organization_id, designation, phone });
    },
  });

  useEffect(() => {
    if (isProfileUpdated) refetch();
  }, [isProfileUpdated, refetch]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [isHovered, setIsHovered] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const handleHover = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageDataUrl = reader.result as string;
        setImage(imageDataUrl);
        // Here you can send the imageDataUrl to your backend for updating the profile photo
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isSuccess) {
    const { name, email, organization, phone } = queryData.data;
    const { organization_id, designation } = organization;
    const updateUserData = { name, email, organization_id, phone, designation };

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
          <ProfilePhoto userName={userData?.name} />
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
          <Button colorScheme="blue" onClick={openModal}>
            Update
          </Button>
        </HStack>
        <UpdateProfileModal
          isOpen={isModalOpen}
          onClose={closeModal}
          userData={updateUserData}
          isProfileUpdated={isProfileUpdated}
          setIsProfileUpdated={setIsProfileUpdated}
        />
      </>
    );
  }
}
