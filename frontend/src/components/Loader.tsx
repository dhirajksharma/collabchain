import React from "react";
import { Spinner, Box } from "@chakra-ui/react";

const Loader: React.FC = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      w="100%"
    >
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="teal.400"
        size="xl"
      />
    </Box>
  );
};

export default Loader;
