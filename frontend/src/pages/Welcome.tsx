import React from 'react';
import { Box, Button, Heading, Text, Image } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import welcomeImg from '../assets/welcome.svg';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      minHeight="100vh" 
      bg="gray.50" 
      p={4}
    >
      <Image src={welcomeImg} alt="Welcome" mb={6} blockSize={'96'} objectFit="cover" />
      <Heading as="h1" size="2xl" mb={4}>
        Welcome to Collab Chain
      </Heading>
      <Text fontSize="lg" mb={6}>
        Your journey into the world of research collaboration begins here.
      </Text>
      <Button colorScheme="teal" size="lg" onClick={handleLoginRedirect}>
        Proceed to Login
      </Button>
    </Box>
  );
};

export default Welcome;
