import React, { ReactNode } from 'react';
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  HStack,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  useColorMode,
  Text,
  Spacer
} from '@chakra-ui/react';
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
  FiBell,
  FiSearch,
  FiSun,
  FiMoon
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import { ReactText } from 'react';
import { useRouter } from 'next/router';

interface LinkItemProps {
  name: string;
  icon: IconType;
  href: string;
}
const LinkItems: Array<LinkItemProps> = [
  { name: 'Home', icon: FiHome, href: '/' },
  { name: 'Trending', icon: FiTrendingUp, href: '/trending' },
  { name: 'Explore', icon: FiCompass, href: '/explore' },
  { name: 'Favourites', icon: FiStar, href: '/favourites' },
  { name: 'Settings', icon: FiSettings, href: '/settings' }
];

export default function SidebarWithHeader({
  children
}: {
  children: ReactNode;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        autoFocus={false}
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
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p={4}>
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const { toggleColorMode } = useColorMode();
  const toggleIcon = useColorModeValue(<FiMoon />, <FiSun />);
  const logo = useColorModeValue('/logo.svg', '/logo-dark.svg');
  return (
    <Flex
      direction="column"
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex alignItems="center" py="8" px="8" justifyContent="space-between">
        <Image src={logo} alt="Dropbook Logo" width="128px" />
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      <Flex direction="column" gap="6">
        {LinkItems.map(link => (
          <NavItem key={link.name} icon={link.icon} href={link.href}>
            {link.name}
          </NavItem>
        ))}
      </Flex>
      <Spacer />
      <Flex
        alignItems="center"
        py={8}
        px={4}
        display={{ base: 'flex', md: 'none' }}
      >
        <IconButton
          variant="ghost"
          aria-label="toggle dark mode"
          onClick={toggleColorMode}
          icon={toggleIcon}
        />
      </Flex>
    </Flex>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  href: string;
  children: ReactText;
  isActive?: boolean;
}

const NavItem = ({ icon, href, children, ...rest }: NavItemProps) => {
  const router = useRouter();
  const isActive = router.pathname === href;
  const color = useColorModeValue('blackAlpha.600', 'whiteAlpha.600');
  const activeColor = useColorModeValue('blackAlpha.800', 'whiteAlpha.800');
  const borderColor = useColorModeValue('blue.600', 'blue.300');

  return (
    <Link
      href={href}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
      <Flex
        align="center"
        px="8"
        color={isActive ? activeColor : color}
        role="group"
        cursor="pointer"
        _hover={{
          color: activeColor
        }}
        borderRight={isActive ? '4px' : '0px'}
        borderColor={isActive ? borderColor : 'none'}
        {...rest}
      >
        {icon && <Icon mr="4" fontSize="16" as={icon} />}
        <Text>{children}</Text>
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const { toggleColorMode } = useColorMode();
  const toggleIcon = useColorModeValue(<FiMoon />, <FiSun />);
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      p={{ base: 2, md: 2 }}
      gap={{ base: 2, md: 4 }}
      alignItems="center"
      bg={useColorModeValue('whiteAlpha.600', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}
    >
      <InputGroup display={{ base: 'none', md: 'flex' }} width="240px">
        <InputLeftElement color={useColorModeValue('gray.300', 'gray.600')}>
          <FiSearch />
        </InputLeftElement>
        <Input placeholder="Search address or ens..." />
      </InputGroup>
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />
      <Box display={{ base: 'flex', md: 'none' }}>
        <Image src="/logo.svg" alt="Dropbook Logo" width="128px" />
      </Box>

      <HStack>
        <IconButton variant="ghost" aria-label="open menu" icon={<FiBell />} />
        <IconButton
          variant="ghost"
          aria-label="toggle dark mode"
          onClick={toggleColorMode}
          icon={toggleIcon}
          display={{ base: 'none', md: 'flex' }}
        />
      </HStack>
    </Flex>
  );
};
