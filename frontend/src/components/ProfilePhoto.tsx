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
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useMutation } from "react-query";

export const ProfilePhoto = ({ userName, userId }) => {
  console.log(userId);
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

  const handleClick = () => {
    console.log("Profile clicked");
  };

  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = () => {
    console.log("Profile clicked");
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleUploadPicture = () => {
    // Implement picture upload logic here
    console.log("Picture uploaded");
    // Close the modal after picture is uploaded
    handleCloseModal();
  };

  const uploadMutation = useMutation((file: File) => {
    const formData = new FormData();
    formData.append("type", "avatar");
    formData.append("file", file); // Add any additional fields here
    return axios.post(
      `http://localhost:4000/api/user/uploads/${userId}`,
      formData
    );
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log(file);
      uploadMutation.mutate(file);
    }
  };

  return (
    <>
      <Box position="relative" display="inline-block" onClick={handleOpenModal}>
        <Avatar
          size="xl"
          name={userName}
          // src={image}
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
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
            id="avatar-upload"
          />
          <label htmlFor="avatar-upload">
            <Box
              as="span"
              fontSize="xl"
              color="white"
              cursor="pointer"
              _hover={{ textDecoration: "underline" }}
            >
              <EditIcon />
            </Box>
          </label>
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
