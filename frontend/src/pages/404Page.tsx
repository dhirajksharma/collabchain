import React from "react";
import { Flex, Heading, Text } from "@chakra-ui/react";

const NotFoundPage: React.FC = () => {
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
        404
      </Heading>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Oops! Page not found.
      </Text>
      <Text fontSize="lg">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </Text>
    </Flex>
  );
};

export default NotFoundPage;
