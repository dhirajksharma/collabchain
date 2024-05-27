"use client";

import {
  Button,
  Heading,
  FormControl,
  FormLabel,
  Input,
  HStack,
  VStack,
  Textarea,
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react";

import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import Loader from "./Loader";

interface ProjectFormData {
  // tagValue: string;
  // projectTags: string[];
  domain: string;
  title: string;
  token: number;
  candidates: number;
  startDate: string;
  endDate: string;
  description: string;
}

const PostProject = () => {
  // const [tagValue, setTagValue] = useState<string>("");
  // const [projectTags, setProjectTags] = useState<string[]>([]);

  const toast = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<ProjectFormData>();

  const startDate = watch("startDate");

  const validateEndDate = (endDate: string) => {
    if (endDate <= startDate) {
      console.log(startDate, endDate);
      return "End Date must be greater than Start Date";
    }
    return true;
  };

  const { data: userData } = useQuery("userData", async () => {
    return await axios.get("http://localhost:4000/api/user/profile");
  });

  // const handleAddTag = () => {
  //   setTagValue("");
  //   if (/\S/.test(tagValue)) setProjectTags([...projectTags, tagValue]);
  // };

  // const handleRemoveTag = (tag: string) => {
  //   const updatedTags = projectTags.filter((projectTag) => projectTag !== tag);
  //   setProjectTags(updatedTags);
  // };

  const { mutate, isLoading } = useMutation(
    (formData: any) =>
      axios.post("http://localhost:4000/api/projects", formData),
    {
      onSuccess: (data) => {
        console.log(data);
        toast({
          title: "Success",
          description: "Project has been posted successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        queryClient.invalidateQueries("projects,userData");
        navigate("/app/projects");
      },
      // TODO: Add backend error message
      onError: (error) => {
        toast({
          title: "Error",
          description: `An error occurred. Could not Post Project`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      },
    }
  );

  if (isLoading) {
    return <Loader />;
  }

  function onSubmit(data: any) {
    const orgId = userData?.data?.data?.organization?.organization_details._id;
    const { candidates, ...projectData } = data;

    const submitData = {
      ...projectData,
      menteesRequired: candidates,
      organization: {
        id: orgId,
      },
    };

    mutate(submitData);
    reset();
  }

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
      >
        Post Project
      </Heading>
      <VStack
        spacing={4}
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        borderWidth="1px"
        rounded={10}
        p={5}
        w="full"
        bg="white"
      >
        <HStack spacing={4} w="100%">
          <FormControl id="name" isRequired>
            <FormLabel htmlFor="title" fontWeight={"normal"}>
              Title
            </FormLabel>
            <Input id="title" {...register("title")} />
          </FormControl>
          <FormControl id="domain" isRequired>
            <FormLabel htmlFor="domain" fontWeight={"normal"}>
              Domain
            </FormLabel>
            <Input id="domain" type="text" {...register("domain")} />
          </FormControl>
        </HStack>
        <FormControl id="description" isRequired>
          <FormLabel htmlFor="description" fontWeight={"normal"}>
            Description
          </FormLabel>
          <Textarea id="description" {...register("description")} />
        </FormControl>
        <HStack spacing={4} w="100%">
          <FormControl id="candidates" isRequired>
            <FormLabel htmlFor="candidates" fontWeight={"normal"}>
              Initial No. of Candidates
            </FormLabel>
            <Input id="candidates" type="number" {...register("candidates")} />
          </FormControl>
          <FormControl id="token" isRequired>
            <FormLabel htmlFor="token" fontWeight={"normal"}>
              No. of Tokens Allocated
            </FormLabel>
            <Input id="token" type="text" {...register("token")} />
          </FormControl>
        </HStack>
        <HStack justifyContent="space-between" spacing={4} w="full">
          <FormControl id="startDate" isRequired>
            <FormLabel htmlFor="startDate" fontWeight={"normal"}>
              Application Start Date
            </FormLabel>
            <Input id="startDate" type="date" {...register("startDate")} />
          </FormControl>
          <FormControl id="endDate" isRequired>
            <FormLabel htmlFor="endDate" fontWeight={"normal"}>
              Application End Date
            </FormLabel>
            <Input id="endDate" type="date" {...register("endDate")} />
          </FormControl>
        </HStack>
        <Button type="submit" colorScheme="blue">
          Submit
        </Button>
      </VStack>
    </HStack>
  );
};

export default PostProject;
