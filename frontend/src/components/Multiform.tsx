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

const Form1 = () => {
  const [show, setShow] = useState(false);
  const [tagValue, setTagValue] = useState<string>("");
  const [projectTags, setProjectTags] = useState<string[]>([]);

  const handleAddTag = () => {
    // console.log(tagValue);
    setTagValue("");
    if (/\S/.test(tagValue)) setProjectTags([...projectTags, tagValue]);
  };

  const handleRemoveTag = (tag: string) => {
    const updatedTags = projectTags.filter((projectTag) => projectTag !== tag);
    setProjectTags(updatedTags);
  };

  return (
    <VStack spacing={4}>
      <FormControl>
        <FormLabel htmlFor="title" fontWeight={"normal"}>
          Title
        </FormLabel>
        <Input id="Title" />
      </FormControl>
      <HStack justifyContent="space-between" spacing={10} w="full">
        <FormControl>
          <FormLabel htmlFor="start-date" fontWeight={"normal"}>
            Application Start Date
          </FormLabel>
          <Input id="start-date" type="date" />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="end-date" fontWeight={"normal"}>
            Application End Date
          </FormLabel>
          <Input id="end-date" type="date" />
        </FormControl>
      </HStack>
      <FormControl>
        <FormLabel htmlFor="candidates" fontWeight={"normal"}>
          Initial No. of Candidates
        </FormLabel>
        <Input id="candidates" type="number" />
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
    </VStack>
  );
};

const Form2 = () => {
  return (
    <>
      <Heading w="100%" textAlign={"center"} fontWeight="normal" mb="2%">
        User Details
      </Heading>
      <FormControl as={GridItem} colSpan={[6, 3]}>
        <FormLabel
          htmlFor="country"
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{
            color: "gray.50",
          }}
        >
          Country / Region
        </FormLabel>
        <Select
          id="country"
          name="country"
          autoComplete="country"
          placeholder="Select option"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
        >
          <option>United States</option>
          <option>Canada</option>
          <option>Mexico</option>
        </Select>
      </FormControl>

      <FormControl as={GridItem} colSpan={6}>
        <FormLabel
          htmlFor="street_address"
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{
            color: "gray.50",
          }}
          mt="2%"
        >
          Street address
        </FormLabel>
        <Input
          type="text"
          name="street_address"
          id="street_address"
          autoComplete="street-address"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
        />
      </FormControl>

      <FormControl as={GridItem} colSpan={[6, 6, null, 2]}>
        <FormLabel
          htmlFor="city"
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{
            color: "gray.50",
          }}
          mt="2%"
        >
          City
        </FormLabel>
        <Input
          type="text"
          name="city"
          id="city"
          autoComplete="city"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
        />
      </FormControl>

      <FormControl as={GridItem} colSpan={[6, 3, null, 2]}>
        <FormLabel
          htmlFor="state"
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{
            color: "gray.50",
          }}
          mt="2%"
        >
          State / Province
        </FormLabel>
        <Input
          type="text"
          name="state"
          id="state"
          autoComplete="state"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
        />
      </FormControl>

      <FormControl as={GridItem} colSpan={[6, 3, null, 2]}>
        <FormLabel
          htmlFor="postal_code"
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{
            color: "gray.50",
          }}
          mt="2%"
        >
          ZIP / Postal
        </FormLabel>
        <Input
          type="text"
          name="postal_code"
          id="postal_code"
          autoComplete="postal-code"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
        />
      </FormControl>
    </>
  );
};

const Form3 = () => {
  return (
    <>
      <Heading w="100%" textAlign={"center"} fontWeight="normal">
        Social Handles
      </Heading>
      <SimpleGrid columns={1} spacing={6}>
        <FormControl as={GridItem} colSpan={[3, 2]}>
          <FormLabel
            fontSize="sm"
            fontWeight="md"
            color="gray.700"
            _dark={{
              color: "gray.50",
            }}
          >
            Website
          </FormLabel>
          <InputGroup size="sm">
            <InputLeftAddon
              bg="gray.50"
              _dark={{
                bg: "gray.800",
              }}
              color="gray.500"
              rounded="md"
            >
              http://
            </InputLeftAddon>
            <Input
              type="tel"
              placeholder="www.example.com"
              focusBorderColor="brand.400"
              rounded="md"
            />
          </InputGroup>
        </FormControl>

        <FormControl id="email" mt={1}>
          <FormLabel
            fontSize="sm"
            fontWeight="md"
            color="gray.700"
            _dark={{
              color: "gray.50",
            }}
          >
            About
          </FormLabel>
          <Textarea
            placeholder="you@example.com"
            rows={3}
            shadow="sm"
            focusBorderColor="brand.400"
            fontSize={{
              sm: "sm",
            }}
          />
          <FormHelperText>
            Brief description for your profile. URLs are hyperlinked.
          </FormHelperText>
        </FormControl>
      </SimpleGrid>
    </>
  );
};

export default function Multistep() {
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(33.33);

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
      <Box
        borderWidth="1px"
        rounded="lg"
        // shadow="1px 1px 3px rgba(0,0,0,0.3)"
        minWidth={500}
        maxWidth={500}
        p={6}
        // m="10px"
        as="form"
        alignItems="start"
        justifyContent="start"
      >
        <Progress
          colorScheme="blue"
          hasStripe
          value={progress}
          mb="5%"
          mx="5%"
          isAnimated
        ></Progress>
        {/* {step === 1 ? <Form1 /> : step === 2 ? <Form2 /> : <Form3 />} */}
        <Form1 />
        <ButtonGroup mt="5%" w="100%">
          <Flex w="100%" justifyContent="space-between">
            <Flex>
              <Button
                onClick={() => {
                  setStep(step - 1);
                  setProgress(progress - 33.33);
                }}
                isDisabled={step === 1}
                colorScheme="teal"
                variant="solid"
                w="7rem"
                mr="5%"
              >
                Back
              </Button>
              <Button
                w="7rem"
                isDisabled={step === 3}
                onClick={() => {
                  setStep(step + 1);
                  if (step === 3) {
                    setProgress(100);
                  } else {
                    setProgress(progress + 33.33);
                  }
                }}
                colorScheme="teal"
                variant="outline"
              >
                Next
              </Button>
            </Flex>
            {step === 3 ? (
              <Button
                w="7rem"
                colorScheme="red"
                variant="solid"
                onClick={() => {
                  toast({
                    title: "Account created.",
                    description: "We've created your account for you.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                  });
                }}
              >
                Submit
              </Button>
            ) : null}
          </Flex>
        </ButtonGroup>
      </Box>
    </HStack>
  );
}
