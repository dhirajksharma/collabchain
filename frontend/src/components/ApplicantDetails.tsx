import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Tr,
  Text,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Container,
  Box,
} from "@chakra-ui/react";
import { Project } from "../interfaces/Project";
import ApplicantCard from "./ApplicantCard";

interface ApplicantDetailsProps {
  project: Project; // Specify the type of the 'project' prop
}

const ApplicantDetails = ({ project }: ApplicantDetailsProps) => {
  const isProjectComplete = new Date(project.endDate) < new Date();

  return (
    <>
      <TableContainer mb={5}>
        <Table
          variant="unstyled"
          style={{ tableLayout: "fixed", width: "100%" }}
        >
          <Tbody>
            <Tr>
              <Td fontWeight="semibold" w="50%" pl={0}>
                Total No. of applicants
              </Td>
              <Td whiteSpace="normal">{project?.menteesApplication?.length}</Td>
            </Tr>
            <Tr>
              <Td fontWeight="semibold" pl={0}>
                Total mentees required
              </Td>
              <Td whiteSpace="normal">{project?.menteesRequired}</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
      <Tabs variant="enclosed-colored">
        <TabList>
          {!isProjectComplete && <Tab>Pending</Tab>}
          <Tab>Accepted</Tab>
        </TabList>

        <TabPanels>
          {!isProjectComplete && (
            <TabPanel>
              <Box overflowY="scroll" maxH="300px">
                {project.menteesApplication
                  ?.filter((application) => application.status === "pending")
                  .map((application, index) => {
                    return (
                      <ApplicantCard
                        key={application?._id}
                        application={application}
                        index={index + 1}
                        projectId={project._id}
                        status={application.status}
                      />
                    );
                  })}
              </Box>
            </TabPanel>
          )}
          <TabPanel px={0}>
            <Box overflowY="scroll" maxH="300px">
              {project.menteesApplication
                ?.filter((application) => application.status === "approved")
                .map((application, index) => {
                  return (
                    <ApplicantCard
                      key={application?._id}
                      application={application}
                      index={index + 1}
                      projectId={project._id}
                      status={application.status}
                    />
                  );
                })}
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};
export default ApplicantDetails;
