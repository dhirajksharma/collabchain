import React, { useEffect } from "react";
import { Box, Center, Text, VStack, Spinner, useToast } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "react-query";
import axios from "axios";

const MotionBox = motion(Box);

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { id } = useParams();

  const { mutate } = useMutation(
    async () => {
      await axios.post(`http://localhost:4000/api/user/verifymail/${id}`);
    },
    {
      onSuccess: () => {
        setTimeout(() => {
          toast({
            title: "Success",
            description: "Your email has been verified",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top",
          });
          navigate("/app/profile", { state: { isAuthenticated: true } });
        }, 2000);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: `${error?.response?.data?.message}. Could not verify Email`,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      },
    }
  );

  useEffect(() => {
    mutate();
  }, [mutate]);

  return (
    <Center h="100vh" bg="white">
      <VStack
        spacing={8}
        p={8}
        // boxShadow="lg"
        bg="white"
        borderRadius="lg"
        as={MotionBox}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Spinner size="xl" color="teal.500" />
        <Text fontSize="2xl" fontWeight="bold" color="teal.600">
          Verifying your email...
        </Text>
      </VStack>
    </Center>
  );
};

export default VerifyEmail;
