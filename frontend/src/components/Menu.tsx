import { Heading, Link, Stack, useDisclosure } from "@chakra-ui/react";
import PostProject from "./PostProject";

export default function Menu() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Stack
      h="full"
      paddingX="4"
      paddingY="2"
      shadow="lg"
      borderRadius="lg"
      w="20%"
    >
      <Heading as="h4" size="lg">
        Menu
      </Heading>
      <Stack spacing={4} marginTop="6">
        <Link>Dashboard</Link>
        <Link onClick={onOpen}>Post Project</Link>
        <PostProject isOpen={isOpen} onClose={onClose}></PostProject>
      </Stack>
    </Stack>
  );
}
