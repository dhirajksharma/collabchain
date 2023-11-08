import { Avatar, Flex, Stack, Text } from "@chakra-ui/react";
import { useAppSelector } from "../app/hooks";

export default function Profile() {
  const user = useAppSelector((store) => store.user);

  return (
    <Flex justifyContent="space-between" w="full" alignItems="center">
      <Stack direction="column" alignItems="start" spacing="0">
        <Text>
          <strong>Name: </strong> {user.name}
        </Text>
        <Text>
          <strong>Organization: </strong> {user.organization}
        </Text>
        <Text>
          <strong>Profession: </strong> {user.type}
        </Text>
        <Text>
          <strong>E-mail ID: </strong> {user.email}
        </Text>
        <Text>
          <strong>Contact: </strong> {user.phone}
        </Text>
      </Stack>
      <Avatar size="xl" name={user.name} />
    </Flex>
  );
}
