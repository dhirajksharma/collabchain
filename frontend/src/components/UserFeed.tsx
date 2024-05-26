import {
  HStack,
  Heading,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Grid,
  GridItem,
  SimpleGrid,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { ProjectCard } from "./ProjectCard";
import NoContent from "./NoContent";
import Loader from "./Loader";
import ErrorPage from "../pages/ErrorPage";
import { Project } from "../interfaces/Project";

export const UserFeed = () => {
  const { data: userData } = useQuery("userData", async () => {
    return await axios.get("http://localhost:4000/api/user/profile");
  });

  const userId = userData?.data.data._id;

  const { data, isLoading, isSuccess, isError } = useQuery(
    "projects",
    async () => {
      return await axios.get("http://localhost:4000/api/projects");
    },
    {
      enabled: !!userId,
    }
  );

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <ErrorPage />;
  }

  if (isSuccess) {
    console.log(data?.data.data);
    const projects = data?.data.data.filter(
      (project: Project) => project.mentor === userId
    );

    return (
      <HStack
        w="full"
        h="full"
        flexDirection="column"
        paddingX="4"
        marginX="4"
        alignItems="start"
        spacing={4}
        marginY="0.5"
      >
        <Heading
          as="h1"
          size="xl"
          mt={4}
          mb={4}
          fontWeight="bold"
          textTransform="uppercase"
        >
          My Projects
        </Heading>
        <VStack
          spacing={4}
          borderWidth="1px"
          rounded={10}
          p={5}
          w="full"
          h="full"
          marginBottom={4}
        >
          <Tabs w="full" variant="soft-rounded" colorScheme="teal">
            <TabList
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderBottom="2px"
              borderColor="gray.100"
              paddingBottom={5}
              sx={{ "& > button": { width: "full" } }}
            >
              <Tab>In-Progress</Tab>
              <Tab>Completed</Tab>
              {/* <Tab>Saved</Tab> */}
            </TabList>

            <TabPanels>
              <TabPanel h="full">
                {projects.length === 0 ? (
                  <NoContent />
                ) : (
                  <SimpleGrid columns={3} spacing={4}>
                    {projects.map((project: any) => (
                      <ProjectCard key={project._id} project={project} />
                    ))}
                  </SimpleGrid>
                )}
              </TabPanel>
              <TabPanel>
                <NoContent />
              </TabPanel>
              {/* <TabPanel>
              <p>three!</p>
            </TabPanel> */}
            </TabPanels>
          </Tabs>
        </VStack>
      </HStack>
    );
  }
};
