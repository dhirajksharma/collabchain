import { Flex, HStack, VStack } from "@chakra-ui/react";
import Dashboard from "../components/Dashboard";
import Menu from "../components/SideMenu";
import Profile from "../components/Profile";
import { motion } from "framer-motion";
import SideMenu from "../components/SideMenu";
import PostProject from "../components/PostProject";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export default function Home() {
  return (
    <Flex>
      <SideMenu />
      <Routes>
        <Route index element={<Profile />} />
        <Route element={<Profile />} path="profile" />
        <Route element={<PostProject />} path="post-project" />
      </Routes>
    </Flex>
  );
}
