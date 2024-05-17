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
} from "@chakra-ui/react";
import { Project } from "../interfaces/Project";
import ApplicantCard from "./ApplicantCard";

interface ApplicantDetailsProps {
  project: Project; // Specify the type of the 'project' prop
}

const ApplicantDetails = ({ project }: ApplicantDetailsProps) => {
  console.log(project.menteesApplication);

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
                Applicants remaining to be selected
              </Td>
              <Td whiteSpace="normal">
                {project?.menteesRequired - project?.menteesApproved?.length}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
      <Tabs variant="enclosed-colored">
        <TabList>
          <Tab>Pending</Tab>
          <Tab>Accepted</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Container overflowY="scroll" maxH="300px">
              {project.menteesApplication
                ?.filter((application) => application.status === "pending")
                .map((application, index) => {
                  return (
                    <ApplicantCard
                      key={application?._id}
                      application={application}
                      index={index + 1}
                      projectId={project._id}
                    />
                  );
                })}
            </Container>
          </TabPanel>
          <TabPanel>
            <Container overflowY="scroll" maxH="300px">
              {project.menteesApplication
                ?.filter((application) => application.status === "approved")
                .map((application, index) => {
                  return (
                    <ApplicantCard
                      key={application?._id}
                      application={application}
                      index={index + 1}
                      projectId={project._id}
                    />
                  );
                })}
            </Container>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};
export default ApplicantDetails;
