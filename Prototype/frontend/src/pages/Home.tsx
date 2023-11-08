import { HStack, VStack } from "@chakra-ui/react";
import Dashboard from "../components/Dashboard";
import Menu from "../components/Menu";
import Profile from "../components/Profile";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <HStack
      h="full"
      alignItems="start"
      as={motion.div}
      initial={{ opacity: 0, scale: 0.75 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ ease: "ease-in-out", duration: 0.5 } as object}
    >
      <Menu />
      <VStack
        alignItems="start"
        marginX="4"
        h="full"
        paddingX="4"
        paddingY="2"
        shadow="lg"
        borderRadius="lg"
        w="full"
      >
        <Profile />
        <Dashboard />
      </VStack>
    </HStack>
  );
}
