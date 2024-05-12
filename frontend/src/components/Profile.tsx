import { Button, HStack, Heading } from "@chakra-ui/react";
import { Table, Tbody, Tr, Td, TableContainer } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ProfilePhoto } from "./ProfilePhoto";
import axios from "axios";
import { useQuery } from "react-query";
import Loader from "./Loader";
import UpdateProfileModal from "./UpdateProfileModal";
import UpdatePasswordModal from "./UpdatePasswordModal";

axios.defaults.withCredentials = true;

interface UserData {
  name: string;
  email: string;
  organization_id: string;
  designation: string;
  phone: string;
}

export default function Profile() {
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
  } = useQuery("userData", fetchUserDetails);

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
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const openPasswordModal = () => {
    setIsPasswordModalOpen(true);
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isSuccess) {
    const { name, email, organization, phone } = queryData.data;
    const { designation, organization_details } = organization;
    const updateUserData = {
      name,
      email,
      phone,
      designation,
      organization_details,
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
          <ProfilePhoto userName={name} userId={queryData.data._id} />
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
                    {name}
                  </Td>
                </Tr>
                <Tr>
                  <Td>Email ID</Td>
                  <Td fontWeight="semibold" fontSize="lg">
                    {email}
                  </Td>
                </Tr>
                <Tr>
                  <Td>Contact</Td>
                  <Td fontWeight="semibold" fontSize="lg">
                    {phone}
                  </Td>
                </Tr>
                <Tr>
                  <Td>Organization</Td>
                  <Td fontWeight="semibold" fontSize="lg">
                    {organization_details.name}
                  </Td>
                </Tr>
                <Tr>
                  <Td>Organization Email</Td>
                  <Td fontWeight="semibold" fontSize="lg">
                    {organization_details.email}
                  </Td>
                </Tr>
                <Tr>
                  <Td>Organization Address</Td>
                  <Td fontWeight="semibold" fontSize="lg">
                    {organization_details.address}
                  </Td>
                </Tr>
                <Tr>
                  <Td>Designation</Td>
                  <Td fontWeight="semibold" fontSize="lg">
                    {designation}
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
          <HStack spacing={4}>
            <Button colorScheme="blue" onClick={openModal}>
              Update Profile
            </Button>
            <Button colorScheme="yellow" onClick={openPasswordModal}>
              Change Password
            </Button>
          </HStack>
        </HStack>
        <UpdateProfileModal
          isOpen={isModalOpen}
          onClose={closeModal}
          userData={updateUserData}
          isProfileUpdated={isProfileUpdated}
          setIsProfileUpdated={setIsProfileUpdated}
        />
        <UpdatePasswordModal
          isOpen={isPasswordModalOpen}
          onClose={closePasswordModal}
        />
      </>
    );
  }
}
