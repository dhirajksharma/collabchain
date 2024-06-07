import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  useDisclosure,
  useToast,
  VStack,
  Card,
  TableContainer,
  Table,
  Tbody,
  Tr,
  Td,
  Badge,
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  CardBody,
  StackDivider,
  Flex,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import axios from "axios";
import { useRef } from "react";
import { useQueryClient, useMutation } from "react-query";
import { Task } from "../interfaces/Project";

const CompletedTasks = ({ project }) => {
  console.log(project.tasks);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const toast = useToast();
  const queryClient = useQueryClient();

  return (
    <VStack h="400px" maxH="400px" overflowY="scroll">
      {project.tasks
        ?.filter((task: Task) => task.taskStatus === "complete")
        .map((task: Task) => {
          return (
            <Card key={task.id} w="100%" px={4} py={2}>
              <TableContainer>
                <Table
                  variant="unstyled"
                  style={{ tableLayout: "fixed", width: "100%" }}
                >
                  <Tbody
                    sx={{
                      "& > tr > td": {
                        py: 1, // Apply vertical padding to all <Td> elements
                      },
                    }}
                  >
                    <Tr>
                      <Td w="5%" fontWeight="semibold" px={1}>
                        1.
                      </Td>
                      <Td fontWeight="semibold" w="20%" pl={0}>
                        Title
                      </Td>
                      <Td whiteSpace="normal">{task.title}</Td>
                    </Tr>
                    <Tr>
                      <Td></Td>
                      <Td fontWeight="semibold" w="20%" pl={0}>
                        Description
                      </Td>
                      <Td whiteSpace="normal">{task.description}</Td>
                    </Tr>
                    <Tr>
                      <Td></Td>
                      <Td fontWeight="semibold" w="20%" pl={0}>
                        Due Date
                      </Td>
                      <Td whiteSpace="normal">
                        {new Date(task?.dueDate).toISOString().split("T")[0]}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td></Td>
                      <Td fontWeight="semibold" w="20%" pl={0}>
                        Tokens
                      </Td>
                      <Td whiteSpace="normal">{task.token}</Td>
                    </Tr>
                    <Tr>
                      <Td></Td>
                      <Td fontWeight="semibold" w="20%" pl={0}>
                        Priority
                      </Td>
                      <Td whiteSpace="normal">
                        <Badge
                          variant="subtle"
                          colorScheme={
                            (task.priority === "low" && "green") ||
                            (task.priority === "medium" && "orange") ||
                            ((task.priority === "high" && "red") as string)
                          }
                        >
                          {task.priority}
                        </Badge>
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
            </Card>
          );
        })}
    </VStack>
  );
};
export default CompletedTasks;
