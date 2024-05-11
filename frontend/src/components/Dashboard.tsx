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
