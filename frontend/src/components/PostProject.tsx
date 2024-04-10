"use client";

import { useState } from "react";
import {
  Progress,
  Box,
  ButtonGroup,
  Button,
  Heading,
  Flex,
  FormControl,
  GridItem,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  InputLeftAddon,
  InputGroup,
  Textarea,
  FormHelperText,
  InputRightElement,
  HStack,
  Card,
  InputLeftElement,
  Tag,
  TagCloseButton,
  VStack,
  Wrap,
  WrapItem,
  TagLabel,
} from "@chakra-ui/react";

import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useMutation } from "react-query";

const PostProject = () => {
  const [show, setShow] = useState(false);
  const [tagValue, setTagValue] = useState<string>("");
  const [projectTags, setProjectTags] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [candidates, setCandidates] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");

  const handleAddTag = () => {
    // console.log(tagValue);
    setTagValue("");
    if (/\S/.test(tagValue)) setProjectTags([...projectTags, tagValue]);
  };

  const handleRemoveTag = (tag: string) => {
    const updatedTags = projectTags.filter((projectTag) => projectTag !== tag);
    setProjectTags(updatedTags);
  };

  async function postProjectData() {
    const organization_id = JSON.parse(
      localStorage.getItem("userData")
    ).organization_id;

    await axios.post("http://localhost:4000/api/projects", {
      title,
      domain: "Demo Project",
      description,
      startDate,
      endDate,
      organization: {
        id: organization_id,
      },
    });
  }

  const { mutate, isLoading, isError, isSuccess, error } = useMutation(
    postProjectData,
    {
      onSuccess: () => {
        // Invalidate relevant queries after successful mutation
        console.log("Success");
      },
      onError: (data) => {
        console.log(`Error: ${data}`);
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate();
    // const formData = new FormData(e.target);
    // const userData = Object.fromEntries(formData.entries());
    // console.log(userData);
  };

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
        Post Project
      </Heading>
      <VStack
        spacing={4}
        as="form"
        onSubmit={handleSubmit}
        borderWidth="1px"
        rounded={10}
        p={5}
      >
        <FormControl isRequired>
          <FormLabel htmlFor="title" fontWeight={"normal"}>
            Title
          </FormLabel>
          <Input
            id="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel htmlFor="description" fontWeight={"normal"}>
            Description
          </FormLabel>
          <Input
            id="Domain"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormControl>
        <HStack justifyContent="space-between" spacing={10} w="full">
          <FormControl isRequired>
            <FormLabel htmlFor="start-date" fontWeight={"normal"}>
              Application Start Date
            </FormLabel>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor="end-date" fontWeight={"normal"}>
              Application End Date
            </FormLabel>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </FormControl>
        </HStack>
        <FormControl isRequired>
          <FormLabel htmlFor="candidates" fontWeight={"normal"}>
            Initial No. of Candidates
          </FormLabel>
          <Input
            id="candidates"
            type="number"
            value={candidates}
            onChange={(e) => setCandidates(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="domain-tags" fontWeight={"normal"}>
            Add Domain Tags
          </FormLabel>
          <InputGroup size="md">
            <Input
              id="domain-tags"
              pr="4.5rem"
              value={tagValue}
              onChange={(e) => setTagValue(e.target.value)}
            />
            <InputRightElement w="4.5rem">
              <Button
                size="sm"
                h="1.75rem"
                colorScheme="blue"
                onClick={handleAddTag}
              >
                Add +
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Wrap borderWidth="1px" borderRadius={2} w="full" p={2} rounded={6}>
          {projectTags.map((tag) => {
            return (
              <WrapItem id={tag}>
                <Tag>
                  <TagLabel>{tag}</TagLabel>
                  <TagCloseButton onClick={() => handleRemoveTag(tag)} />
                </Tag>
              </WrapItem>
            );
          })}
        </Wrap>
        <Button type="submit" colorScheme="teal">
          Submit
        </Button>
      </VStack>
    </HStack>
  );
};

export default PostProject;
