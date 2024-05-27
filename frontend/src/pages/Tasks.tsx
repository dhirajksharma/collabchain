import {
  VStack,
  HStack,
  Heading,
  Badge,
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Icon,
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import { FaPlusCircle } from "react-icons/fa";
import { useQuery } from "react-query";
import { useParams } from "react-router";

const Tasks = () => {
  const { id } = useParams<{ id: string }>();
  // const { userId } = useParams<{ userId: string }>();

  // const { data: menteeData } = useQuery(["menteeData", userId], async () => {
  //   return axios.get(`http://localhost:4000/api/user/${userId}`);
  // });
  //   console.log(menteeData?.data.data);

  const {
    data: queryData,
    isLoading,
    isError,
    isSuccess,
  } = useQuery(["userProjects", id], async () => {
    return await axios.get(`http://localhost:4000/api/projects/${id}`);
  });

  const { data: tasksData } = useQuery(["tasks", id], async () => {
    return await axios.get(`http://localhost:4000/api/projects/${id}/mytasks`);
  });

  console.log(tasksData?.data.data);

  //   return <div>Tasks</div>;

  if (isSuccess) {
    const project = queryData?.data.data;
    console.log(project);

    return (
      <VStack
        w="full"
        h="full"
        paddingX="4"
        marginX="4"
        alignItems="start"
        spacing={4}
        marginY="0.5"
      >
        <HStack display="flex" alignItems="center" spacing={4} w="full">
          <Heading
            as="h1"
            size="xl"
            mt={4}
            mb={4}
            fontWeight="bold"
          >
            {project.title}
          </Heading>
          <Box>
            <Badge
              variant="solid"
              colorScheme={project.menteesRequired > 0 ? "green" : "orange"}
              fontSize="xl"
            >
              {project.menteesRequired > 0 ? "Recruiting" : "In-Progress"}
            </Badge>
          </Box>
        </HStack>
        <VStack
          spacing={4}
          borderWidth="1px"
          rounded={10}
          p={5}
          w="50%"
          alignItems="start"
          bg="white"
        >
          <Button colorScheme="blue">
            <Icon as={FaPlusCircle} mr={2} />
            Create Task
          </Button>
          <Tabs w="100%">
            <TabList>
              <Tab>Pending</Tab>
              <Tab>Completed</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <p>one!</p>
              </TabPanel>
              <TabPanel>
                <p>two!</p>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </VStack>
    );
  }
};
export default Tasks;
