import { StarIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Heading,
  Text,
  Badge,
  useColorModeValue,
  IconButton,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router";

export const ProjectCard = ({ project, isOwner = true }) => {
  // Calculate the duration of the project
  const startDate = new Date(project.startDate);
  const endDate = new Date(project.endDate);
  const durationInDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
  );
  const navigate = useNavigate();

  // Define gradient colors for the card background
  const bgGradient = useColorModeValue(
    "linear(to-b, teal.300, teal.200)",
    "linear(to-b, teal.700, teal.600)"
  );

  const handleClick = (): void => {
    navigate(`/app/project/${project._id}`, { state: { isOwner } });
  };

  return (
    <Box
      maxW="md"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="sm"
      bg="white"
      p="4"
      color="gray.700"
      cursor="pointer"
      onClick={handleClick}
    >
      <Flex justifyContent="space-between" alignItems="center" mb="2">
        <Badge colorScheme="teal">{project.domain}</Badge>
        <Text fontSize="sm">
          {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()} (
          {durationInDays} days)
        </Text>
      </Flex>
      <Text fontWeight="bold" fontSize="lg" mb="2">
        {project.title}
      </Text>
      <Text fontSize="sm" mb="4">
        {project.description}
      </Text>
      <Flex alignItems="center">
        <Text fontWeight="medium">Rating -</Text>
        <Text ml="1" fontWeight="medium">
          {project.ratings}&nbsp;
        </Text>
        <StarIcon color="yellow.400" />
        {/* <IconButton
          aria-label="Apply"
          icon={<StarIcon />}
          variant="solid"
          colorScheme="teal"
          size="sm"
          mr="2"
        /> */}
      </Flex>
    </Box>
  );
};
