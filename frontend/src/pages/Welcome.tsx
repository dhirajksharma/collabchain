import React, { useState } from 'react';
import { Box, Button, Heading, Text, Image, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Checkbox, useDisclosure } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import welcomeImg from '../assets/welcome.svg';

const Welcome: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [isLoginEnabled, setIsLoginEnabled] = useState(false);
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    if (isLoginEnabled) {
      navigate('/login');
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCheckboxChecked(e.target.checked);
    setIsLoginEnabled(e.target.checked);
  };

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      minHeight="100vh" 
      bg="gray.50" 
      p={4}
    >
      <Image src={welcomeImg} alt="Welcome" mb={6} blockSize={'96'} objectFit="cover" />
      <Heading as="h1" size="2xl" mb={4}>
        Welcome to Collab Chain
      </Heading>
      <Text fontSize="lg" mb={6}>
        Your journey into the world of research collaboration begins here.
      </Text>
      <Box display="flex" gap={4}>
        <Button colorScheme="blue" size="lg" onClick={onOpen}>
          Read Instructions
        </Button>
        <Button colorScheme="teal" size="lg" onClick={handleLoginRedirect} isDisabled={!isLoginEnabled}>
          Proceed to Login
        </Button>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}  size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Research Collaboration Agreement</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>
              <b>1. Introduction</b>
              <br></br>
              This Research Collaboration Agreement ("Agreement") establishes the terms and conditions governing participation in the research collaboration platform ("Platform"). By agreeing to these terms, you ("Contributor") agree to comply with the rules and guidelines outlined herein.
            </Text>
            <Text mb={4}>
              <b>2. Purpose</b>
              <br></br>
              The purpose of this Agreement is to provide a framework for collaboration among contributors on the Platform, ensuring adherence to ethical standards, intellectual property rights (IPR), and facilitating the resolution of disputes, including those related to plagiarism.
            </Text>
            <Text mb={4}>
              <b>3. Intellectual Property Rights (IPR)</b>
              <br></br>
              Each contributor retains ownership of their intellectual property rights generated during the collaboration. The platform's blockchain token incentivization system is designed to identify and recognize the unique contributions of each contributor to a particular project.
            </Text>
            <Text mb={4}>
              <b>4. Research Compliance Approvals (IRB)</b>
              <br></br>
              Contributors agree to obtain and maintain all necessary Institutional Review Board (IRB) approvals and comply with relevant research ethics regulations for their contributions.
              <br></br>
              <br></br>
              Contributors agree to provide documentation verifying IRB approval for their contributions upon request by the Platform.
            </Text>
            <Text mb={4}>
              <b>5. Research Collaboration Assurance (RCA)</b>
              <br></br>
              Contributors affirm that their contributions are original and do not infringe upon any third-party rights, including copyright, trademark, or patent.
              <br></br>
              <br></br>
              The Platform will provide contributors with access to the history of contributions they have submitted to a particular project. Contributors agree to utilize this resource exclusively for activities such as fighting against IPR violations or related issues.
            </Text>
            <Text mb={4}>
              <b>6. Dispute Resolution</b>
              <br></br>
              Mediation: In the event of a dispute arising from this Agreement, contributors agree to attempt to resolve the matter through mediation conducted by the Platform.
            </Text>
            <Text mb={4}>
              <b>7. Governing Law</b>
              <br></br>
              This Agreement shall be governed by and construed in accordance with the laws of [Jurisdiction], without regard to its conflict of law principles.
            </Text>
            <Checkbox isChecked={isCheckboxChecked} onChange={handleCheckboxChange}>
              I have read the instructions and agree with it.
            </Checkbox>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Welcome;
