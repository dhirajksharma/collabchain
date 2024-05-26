import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  HStack,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { Table, Tbody, Tr, Td, TableContainer } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ProfilePhoto } from "./ProfilePhoto";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Loader from "./Loader";
import UpdateProfileModal from "./UpdateProfileModal";
import UpdatePasswordModal from "./UpdatePasswordModal";
import { Link } from "react-router-dom";

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
  const [resume, setResume] = useState<File | null>(null);
  const toast = useToast();
  const queryClient = useQueryClient();

  const {
    data: queryData,
    isLoading,
    isSuccess,
    refetch,
  } = useQuery("userData", async () => {
    return await axios.get("http://localhost:4000/api/user/profile");
  });

  const userId = queryData?.data?._id;

  const { data: resumeData, isError: isErrorResume } = useQuery(
    ["resume", userId],
    async () => {
      return await axios.get(
        `http://localhost:4000/api/user/uploads/resume/${userId}`
      );
    },
    {
      retry: false, // Disable automatic retries
      enabled: !!userId,
    }
  );

  const { mutateAsync: mutateResume } = useMutation(
    async (file: File) => {
      const formData = new FormData();
      formData.append("file", file); // Add any additional fields here
      return await axios.post(
        `http://localhost:4000/api/user/uploads/resume/${userId}`,
        formData
      );
    },
    {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Resume updated",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        queryClient.invalidateQueries("resume");
      },
    }
  );

  const [isOpenResume, setIsOpenResume] = useState(false);

  const handleOpenResumeModal = () => {
    setIsOpenResume(true);
  };

  const handleCloseResumeModal = () => {
    setIsOpenResume(false);
  };

  function handleUploadResume(): void {
    if (resume) {
      mutateResume(resume);
    }
    handleCloseResumeModal();
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log(file.type);
      if (file.type !== "application/pdf") {
        toast({
          title: "Error",
          description: "Please upload pdf type for Resume",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        handleCloseResumeModal();
      } else {
        setResume(file);
      }
    }
  };

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
    const { name, email, organization, phone } = queryData.data.data;
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
          {isErrorResume && (
            <Alert status="warning" w="50%" variant="top-accent">
              <AlertIcon />
              <VStack spacing={0} alignItems="start">
                <AlertTitle>Upload Resume</AlertTitle>
                <AlertDescription>
                  You have not uploaded your resume
                </AlertDescription>
                <Button
                  size="sm"
                  colorScheme="green"
                  onClick={handleOpenResumeModal}
                >
                  Upload
                </Button>
              </VStack>
            </Alert>
          )}
          <ProfilePhoto userName={name} userId={queryData.data.data._id} />
          <TableContainer
            w="80%"
            border="1px"
            borderColor="gray.100"
            borderRadius={10}
            bg="white"
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
                {resumeData?.data && (
                  <Tr>
                    <Td>Resume</Td>
                    <Td fontWeight="semibold" fontSize="lg">
                      <Link
                        to={`http://localhost:4000/api/user/uploads/resume/${userId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Link
                      </Link>
                    </Td>
                  </Tr>
                )}
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
        <Modal isOpen={isOpenResume} onClose={handleCloseResumeModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Upload Resume</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
              />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="teal" mr={3} onClick={handleUploadResume}>
                Upload
              </Button>
              <Button variant="ghost" onClick={handleCloseResumeModal}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }
}
