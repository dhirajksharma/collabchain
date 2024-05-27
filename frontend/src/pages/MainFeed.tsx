import { Center, Container, Grid, Heading } from "@chakra-ui/react";
import axios from "axios";
import { useQuery } from "react-query";
import Loader from "../components/Loader";
import { ProjectCard } from "../components/ProjectCard";
import ErrorPage from "./ErrorPage";
import { Project } from "../interfaces/Project";

const fetchData = async () => {
  const [data1, data2] = await Promise.all([
    axios.get("http://localhost:4000/api/projects"),
    axios.get("http://localhost:4000/api/user/profile"),
  ]);
  return { projects: data1.data, userData: data2.data };
};

const MainFeed: React.FC = () => {
  const { data, isLoading, isSuccess, isError } = useQuery(
    "projects,userData",
    fetchData
  );

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <ErrorPage />;
  }

  if (isSuccess) {
    const projects = data?.projects?.data;
    console.log(projects);
    const userData = data?.userData?.data;

    return (
      <Container maxW="container.xl" mt={8}>
        <Heading as="h1" size="xl" mb={8}>
          All Projects
        </Heading>
        <Grid templateColumns="repeat(2, 1fr)" justifyItems={"center"}>
          {projects
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
