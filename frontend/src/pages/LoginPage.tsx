import React from "react";
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  Text,
  VStack,
  Link,
  useColorModeValue,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);
const MotionButton = motion(Button);

const animationVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 1 } },
  exit: { opacity: 0, x: 50, transition: { duration: 1 } },
};

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);

  const bgColor = useColorModeValue("white", "gray.700");
  const boxShadowColor = useColorModeValue("lg", "dark-lg");

  return (
    <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} minH="100vh">
      {/* Left Side */}
      <GridItem
        bg="teal.500"
        color="white"
        p={8}
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <MotionBox
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={animationVariants}
          mb={8}
          textAlign="center"
        >
          <MotionHeading as="h1" size="2xl">
            Your Logo
          </MotionHeading>
        </MotionBox>
        <VStack spacing={4} textAlign="center">
          <MotionHeading as="h2" size="md" variants={animationVariants}>
            Welcome to Our Platform
          </MotionHeading>
          <MotionText fontSize="lg" variants={animationVariants}>
            Discover the best projects and collaborate with others. Join us to
            make the most out of your professional network.
          </MotionText>
        </VStack>
      </GridItem>

      {/* Right Side */}
      <GridItem
        bg="teal.50"
        p={8}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <MotionBox
          maxW="400px"
          w="full"
          p={6}
          bg={bgColor}
          boxShadow={boxShadowColor}
          borderRadius="lg"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={animationVariants}
        >
          <VStack spacing={4} align="stretch">
            <MotionHeading
              as="h1"
              size="lg"
              textAlign="center"
              color="teal.700"
              variants={animationVariants}
            >
              Log in to your account
            </MotionHeading>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl id="email" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  placeholder="Enter your email"
                  focusBorderColor="teal.500"
                />
                {errors.email && (
                  <Text color="red.500">{errors.email.message}</Text>
                )}
              </FormControl>

              <FormControl id="password" isRequired mt={4}>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  placeholder="Enter your password"
                  focusBorderColor="teal.500"
                />
                {errors.password && (
                  <Text color="red.500">{errors.password.message}</Text>
                )}
              </FormControl>

              <MotionButton
                type="submit"
                colorScheme="teal"
                w="full"
                mt={6}
                _hover={{ bg: "teal.600" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign in
              </MotionButton>
            </form>

            <MotionText textAlign="center" mt={4} variants={animationVariants}>
              Not a registered user?{" "}
              <Link color="teal.500" href="/register">
                Register Here
              </Link>
            </MotionText>
          </VStack>
        </MotionBox>
      </GridItem>
    </Grid>
  );
};

export default LoginPage;
