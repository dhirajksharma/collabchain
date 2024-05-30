import {
  Box,
  Container,
  Grid,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
} from "@chakra-ui/react";
import axios from "axios";
import { useQuery } from "react-query";
import Loader from "../components/Loader";
import { ProjectCard } from "../components/ProjectCard";
import ErrorPage from "./ErrorPage";
import { MenteeApplication, Project } from "../interfaces/Project";
import { useState } from "react";
import { SearchIcon } from "@chakra-ui/icons";

const MainFeed: React.FC = () => {
  const [filter, setFilter] = useState<string>("all-projects");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(event.target.value);
  };

  const { data: queryData } = useQuery("userData", async () => {
    return await axios.get("http://localhost:4000/api/user/profile");
  });

  const userId = queryData?.data?.data?._id;

  const { data, isLoading, isSuccess, isError } = useQuery(
    ["projects"],
    async () => {
      return await axios.get(`http://localhost:4000/api/projects`);
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
    const projects = data?.data?.data;
    const userData = queryData?.data?.data;
    console.log(projects);

    let filteredProjects = projects?.filter((project: any) => {
      if (filter === "all-projects") return true;
      else if (filter === "applied")
        return (
          project.menteesApplication.find(
            (application: MenteeApplication) => application?.user === userId
          )?.status === "pending"
        );
      else if (filter === "in-progress")
        return (
          project.menteesApplication.find(
            (application: MenteeApplication) => application?.user === userId
          )?.status === "approved"
        );
      else if (filter === "rejected")
        return (
          project.menteesApplication.find(
            (application: MenteeApplication) => application?.user === userId
          )?.status === "rejected"
        );
      return true;
    });

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    };

    filteredProjects = filteredProjects?.filter((project: Project) =>
      project?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <Container maxW="container.xl" mt={8}>
        <Heading as="h1" size="xl" mb={8}>
          All Projects
        </Heading>
        <HStack mb={10}>
          <Box maxW="lg">
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<SearchIcon color="gray.300" />}
              />
              <Input
                type="text"
                placeholder="Search projects by Name"
                value={searchTerm}
                onChange={handleSearchChange}
                _hover={{ borderColor: "gray.400" }}
                _focus={{
                  borderColor: "teal.400",
                  boxShadow: "0 0 0 1px teal",
                }}
              />
            </InputGroup>
          </Box>
          <Select onChange={handleFilterChange} w="fit-content">
            <option value="all-projects" selected>
              All Projects
            </option>
            <option value="applied">Applied</option>
            <option value="in-progress">In-Progress</option>
            <option value="rejected">Rejected</option>
          </Select>
        </HStack>
        <Grid templateColumns="repeat(2, 1fr)" justifyItems="center">
          {/* {projects */}
          {filteredProjects
            ?.filter((project: Project) => {
              return project.mentor !== userData._id;
            })
            .map((project: Project) => (
              <ProjectCard
                key={project._id}
                project={project}
                isOwner={false}
              />
            ))}
        </Grid>
      </Container>
    );
  }
};

export default MainFeed;
