import { Flex } from "@chakra-ui/react";
import Profile from "../components/Profile";
import SideMenu from "../components/SideMenu";
import PostProject from "../components/PostProject";
import { Route, Routes } from "react-router-dom";
import { UserFeed } from "../components/UserFeed";
import { ProjectDetails } from "../components/ProjectDetails";
import MainFeed from "./MainFeed";
import Tasks from "./Tasks";
import PageNotFound from "./404Page";

export default function Home() {
  return (
    <Flex>
      <SideMenu />
      <Flex flex="1">
        <Routes>
          <Route index element={<Profile />} />
          <Route element={<MainFeed />} path="feed" />
          <Route element={<Profile />} path="profile" />
          <Route element={<PostProject />} path="post-project" />
          <Route element={<UserFeed />} path="projects" />
          <Route element={<ProjectDetails />} path="project/:id" />
          <Route element={<Tasks />} path="project/:id/tasks" />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Flex>
    </Flex>
  );
}
