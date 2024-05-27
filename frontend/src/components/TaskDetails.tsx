// Task.tsx
import {
  Box,
  Flex,
  VStack,
  Text,
  Link,
  Icon,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import axios from "axios";
import {
  FaHome,
  FaProjectDiagram,
  FaUser,
  FaPlusCircle,
  FaCogs,
  FaSignOutAlt,
} from "react-icons/fa";
import { useQuery } from "react-query";
import { Project, Task } from "../interfaces/Project";
import { useState } from "react";
import CreateTaskModal from "./CreateTaskModal";
import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import PendingTasks from "./PendingTasks";
import ActiveTasks from "./ActiveTasks";

interface TaskProps {
  project: Project;
  isOwner: boolean;
}

const TaskDetails: React.FC<TaskProps> = ({ project, isOwner }: TaskProps) => {
  console.log(isOwner);

  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);

  const openCreateTaskModal = () => {
    setIsCreateTaskModalOpen(true);
  };

  const closeCreateTaskModal = () => {
    setIsCreateTaskModalOpen(false);
  };

  return (
    <>
      <VStack alignItems="start">
        {isOwner && (
          <Button colorScheme="blue" onClick={openCreateTaskModal}>
            <Icon as={FaPlusCircle} mr={2} mt={1}/>
            Create Task
          </Button>
        )}
        <Tabs variant="enclosed-colored" w="100%">
          <TabList w="100%" mb={2}>
            {isOwner && <Tab>Pending</Tab>}
            <Tab>Active</Tab>
            <Tab>Completed</Tab>
          </TabList>

          <TabPanels>
            {isOwner && (
              <TabPanel p={0}>
                <PendingTasks project={project} isOwner={isOwner} />
              </TabPanel>
            )}
            <TabPanel>
              <ActiveTasks project={project} isOwner={isOwner} />
            </TabPanel>
            <TabPanel>Three!</TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={closeCreateTaskModal}
        projectId={project._id}
      />
    </>
  );
};

export default TaskDetails;
