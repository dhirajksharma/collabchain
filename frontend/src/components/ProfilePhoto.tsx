import { EditIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

const fileTypes = ["image/jpeg", "image/jpg", "image/png"];

export const ProfilePhoto = ({ userName, userId }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const toast = useToast();
  const queryClient = useQueryClient();

  const handleHover = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setImage(null);
    setIsOpen(false);
  };

  const uploadMutation = useMutation(
    async (file: File) => {
      console.log(file);
      const formData = new FormData();
      // formData.append("type", "avatar");
      formData.append("file", file); // Add any additional fields here
      return await axios.post(
        `http://localhost:4000/api/user/uploads/avatar/${userId}`,
        formData
      );
    },
    {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Profile picture updated",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        queryClient.invalidateQueries("avatar");
      },
    }
  );

  const handleUploadPicture = () => {
    // console.log(image);
    if (image) {
      uploadMutation.mutate(image);
    }
    handleCloseModal();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!fileTypes.includes(file.type)) {
        toast({
          title: "Error",
          description: "Please upload jpeg or png files for display picture",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        handleCloseModal();
      } else {
        setImage(file);
      }
    }
  };

  return (
    <>
      <Box position="relative" display="inline-block" onClick={handleOpenModal}>
        <Avatar
          size="xl"
          name={userName}
          src={`http://localhost:4000/api/user/uploads/avatar/${userId}`}
          onMouseEnter={handleHover}
          onMouseLeave={handleMouseLeave}
          onClick={() => {}}
          cursor="pointer"
        />
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="rgba(0, 0, 0, 0.5)"
          borderRadius="50%"
          pointerEvents="none"
          opacity={isHovered ? 1 : 0}
          transition="opacity 0.3s"
        >
          {/* <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
            id="avatar-upload"
          /> */}
          {/* <label htmlFor="avatar-upload"> */}
          <Box
            as="span"
            fontSize="xl"
            color="white"
            cursor="pointer"
            _hover={{ textDecoration: "underline" }}
          >
            <EditIcon />
          </Box>
          {/* </label> */}
        </Box>
      </Box>
      <Modal isOpen={isOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Profile Picture</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleUploadPicture}>
              Upload
            </Button>
            <Button variant="ghost" onClick={handleCloseModal}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
