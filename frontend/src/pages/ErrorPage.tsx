import React from "react";
import { Box, Button, Container, Flex, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

const ErrorPage: React.FC = () => {
  const navigate = useNavigate(); // Use useNavigate hook for navigation

  const goBack = () => {
    navigate(-1); // Navigate back one step
  };

  return (
    <Flex
      minH="100vh"
      justify="center"
      align="center"
      direction="column"
      textAlign="center"
      bg="gray.100"
    >
      <Heading fontSize="6xl" color="red.500" mb={4}>
        Oops, an error occurred
      </Heading>
      <Button colorScheme="teal" onClick={goBack}>
        Please go back
      </Button>
    </Flex>
  );
};

export default ErrorPage;
