import { PhoneIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  Link,
  Icon,
  Avatar,
} from "@chakra-ui/react";
import {
  FaHome,
  FaProjectDiagram,
  FaUser,
  FaPlusCircle,
  FaCogs,
  FaSignOutAlt,
} from "react-icons/fa";
import { ReactText } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "react-query";

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

interface NavItemProps extends FlexProps {
  children: ReactText;
}

const NavItem = ({ children, ...rest }: NavItemProps) => {
  return (
    <Box
      as="a"
      href="#"
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        color="white"
        _hover={{
          bg: "blackAlpha.700",
        }}
        {...rest}
      >
        {children}
      </Flex>
    </Box>
  );
};

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const { data: queryData } = useQuery("userData", async () => {
    return await axios.get("http://localhost:4000/api/user/profile");
  });

  const userId = queryData?.data?.data?._id;

  const navigate = useNavigate();
  const logoutMutation = useMutation(() =>
    axios.get("http://localhost:4000/api/user/logout")
  );

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      console.log("Logout successful");
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Box
      bg="teal.500"
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      zIndex="sticky"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <NavLink to="/">
          <Text
            fontSize="2xl"
            fontFamily="monospace"
            fontWeight="bold"
            cursor="pointer"
            color={useColorModeValue("white", "gray.700")}
          >
            CollabChain
          </Text>
        </NavLink>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      <NavLink to="profile">
        <NavItem>
          {/* <Icon as={FaUser} mr={2} />  */}
          <Avatar
            size="md"
            name={queryData?.data?.data.name}
            src={`http://localhost:4000/api/user/uploads/avatar/${userId}`}
            mr={2}
          />
          {queryData?.data?.data.name}
        </NavItem>
      </NavLink>
      <NavLink to="feed">
        <NavItem>
          <Icon as={FaHome} mr={2} />
          Home
        </NavItem>
      </NavLink>
      <NavLink to="projects">
        <NavItem>
          <Icon as={FaProjectDiagram} mr={2} />
          My Projects
        </NavItem>
      </NavLink>
      <NavLink to="post-project">
        <NavItem>
          <Icon as={FaPlusCircle} mr={2} />
          New Project
        </NavItem>
      </NavLink>
      <NavItem
        color={"black"}
        _hover={{
          bg: "white",
          color: "red.500",
        }}
        onClick={handleLogout}
      >
        <Icon as={FaSignOutAlt} mr={2} />
        Logout
      </NavItem>
    </Box>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<PhoneIcon />}
      />

      <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
        Logo
      </Text>
    </Flex>
  );
};

export default function SimpleSidebar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box>
      <SidebarContent
        onClose={() => onClose}
        // display={{ base: "none", md: "block" }}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }}>{/* Content */}</Box>
    </Box>
  );
}
