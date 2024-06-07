import React from "react";
import { Box, Text } from "@chakra-ui/react";

const NoContent: React.FC = ({ children }) => {
  return (
    <Box p={8} borderRadius="lg" bg="white" textAlign="center">
      <Text fontSize="xl" fontWeight="bold" color="gray.600">
        No Content Found
      </Text>
      <Text fontSize="md" mt={2} color="gray.400">
        {children}
      </Text>
    </Box>
  );
};

export default NoContent;
