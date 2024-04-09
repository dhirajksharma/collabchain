// import {
//   Heading,
//   Link,
//   MenuItem,
//   MenuList,
//   Stack,
//   useDisclosure,
//   Menu,
//   Box,
// } from "@chakra-ui/react";
// import PostProject from "./PostProject";

// export default function SideMenu() {
//   const { isOpen, onOpen, onClose } = useDisclosure();

//   return (
//     // <Stack
//     //   h="full"
//     //   paddingX="4"
//     //   paddingY="2"
//     //   shadow="lg"
//     //   borderRadius="lg"
//     //   w="20%"
//     // >
//     //   <Heading as="h4" size="lg">
//     //     Menu
//     //   </Heading>
//     //   <Stack spacing={4} marginTop="6">
//     //     <Link>Dashboard</Link>
//     //     <Link onClick={onOpen}>Post Project</Link>
//     //     <PostProject isOpen={isOpen} onClose={onClose}></PostProject>
//     //   </Stack>
//     // </Stack>
//     <Box>
//       <Menu
//         isOpen={true}
//         h="full"
//         paddingX="4"
//         paddingY="2"
//         shadow="lg"
//         borderRadius="lg"
//         w="20%"
//       >
//         <MenuList>
//           <MenuItem>LOGO</MenuItem>
//           <MenuItem>User Feed</MenuItem>
//           <MenuItem>Profile</MenuItem>
//           <MenuItem>Post Project</MenuItem>
//           <MenuItem>Account Settings</MenuItem>
//           <MenuItem>Log Out</MenuItem>
//         </MenuList>
//       </Menu>
//     </Box>
//   );
// }

////////////////////////////////////

import React, { ReactNode, useState } from "react";
import { PhoneIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
} from "@chakra-ui/react";
// import {
//   FiHome,
//   FiTrendingUp,
//   FiCompass,
//   FiStar,
//   FiSettings,
//   FiMenu,
// } from "react-icons/fi";
// import { IconType } from "react-icons";
import { ReactText } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "react-query";

const logoutUser = () => {
  return axios
    .get("http://localhost:4000/api/user/logout")
    .then((response) => response.data)
    .catch((error) => {
      throw new Error("Error fetching data");
    });
};

// interface LinkItemProps {
//   name: string;
// }
// const LinkItems: Array<string> = [
//   "User Feed",
//   "Profile",
//   "Post Project",
//   "Account Settings",
//   "Logout",
// ];

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

interface NavItemProps extends FlexProps {
  // icon: IconType;
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
        _hover={{
          // bg: "cyan.400",
          bg: "gray.50",
          // color: "white",
        }}
        {...rest}
      >
        {/* {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )} */}
        {children}
      </Flex>
    </Box>
  );
};

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
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
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      zIndex="sticky"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Logo
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {/* {LinkItems.map((link) => (
        <NavItem key={link}>{link}</NavItem>
      ))} */}
      <NavItem>User Feed</NavItem>
      <NavItem>Profile</NavItem>
      <NavItem>Post Project</NavItem>
      <NavItem>Account Settings</NavItem>
      <NavItem
        color={"red.500"}
        _hover={{
          // bg: "cyan.400",
          bg: "red.50",
          // color: "white",
        }}
        // onClick={handleLogoutClick}
        onClick={handleLogout}
      >
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
        // icon={<FiMenu />}
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
    <Box minH="full">
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
