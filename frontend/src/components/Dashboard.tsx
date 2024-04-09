import {
  StackDivider,
  HStack,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";

export default function Dashboard() {
  return (
    // <HStack
    //   borderTop="1px"
    //   borderColor="gray.400"
    //   marginTop="4px"
    //   paddingTop="8px"
    //   divider={<StackDivider borderColor="gray.400" />}
    //   w="full"
    //   h="full"
    //   justifyContent="space-evenly"
    //   align="center"
    //   sx={{
    //     h5: { fontSize: "lg", fontWeight: "bold", fontFamily: "sans-serif" },
    //   }}
    // >
    //   <Text as="h5">Completed</Text>
    //   <Text as="h5">In Progress</Text>
    //   <Text as="h5">Saved</Text>
    // </HStack>
    <Tabs variant="soft-rounded" w="full">
      <TabList>
        <Tab w="full">Completed</Tab>
        <Tab w="full">In-Progress</Tab>
        <Tab w="full">Saved</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <p>one!</p>
        </TabPanel>
        <TabPanel>
          <p>two!</p>
        </TabPanel>
        <TabPanel>
          <p>three!</p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
