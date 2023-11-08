import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  HStack,
} from "@chakra-ui/react";

type PostProjectProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function PostProject({ isOpen, onClose }: PostProjectProps) {
  function handleSubmit() {}

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">Post Project</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl id="name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input type="text" />
              </FormControl>
              <HStack>
                <FormControl id="domain" isRequired>
                  <FormLabel>Domain</FormLabel>
                  <Input type="text" />
                </FormControl>
                <FormControl id="category" isRequired>
                  <FormLabel>Category</FormLabel>
                  <Input type="text" />
                </FormControl>
              </HStack>
              <FormControl id="no_of_candidates" isRequired>
                <FormLabel>No. of candidates</FormLabel>
                <Input type="number" />
              </FormControl>
              <HStack>
                <FormControl id="appl_start_date" isRequired>
                  <FormLabel>Application start date</FormLabel>
                  <Input type="date" />
                </FormControl>
                <FormControl id="appl_end_date" isRequired>
                  <FormLabel>Application end date</FormLabel>
                  <Input type="date" />
                </FormControl>
              </HStack>
              <HStack>
                <FormControl id="project_start_date" isRequired>
                  <FormLabel>Project start date</FormLabel>
                  <Input type="date" />
                </FormControl>
                <FormControl id="project_end_date" isRequired>
                  <FormLabel>Project end date</FormLabel>
                  <Input type="date" />
                </FormControl>
              </HStack>
            </Stack>
          </form>
        </ModalBody>

        <ModalFooter justifyContent="center">
          <Button
            // variant="solid"
            bg="blue.400"
            color="white"
            _hover={{
              bg: "blue.500",
            }}
          >
            Create Project
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
