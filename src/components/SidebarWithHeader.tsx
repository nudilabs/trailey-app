import React, { ReactNode, useState } from 'react';
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  HStack,
  Icon,
  useColorModeValue,
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
  Spacer,
  Button
} from '@chakra-ui/react';
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
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
import SearchBar from './SearchBar';

interface LinkItemProps {
  name: string;
  icon: IconType;
  href: string;
}
const LinkItems: Array<LinkItemProps> = [
  { name: 'Home', icon: FiHome, href: '/' },
  { name: 'Trending', icon: FiTrendingUp, href: '/trending' },
  { name: 'Explore', icon: FiCompass, href: '/explore' },
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
        zIndex={999}
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
      <Box ml={{ base: 0, md: '68px' }} p={4}>
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
  const [isHover, setIsHover] = useState(false);

  const handleHover = (hover: boolean) => {
    setIsHover(hover);
  };
  return (
    <Flex
      direction="column"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: isHover ? 60 : '68px' }}
      pos="fixed"
      h="full"
      {...rest}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
    >
      <Flex alignItems="center" py={4} px={4} justifyContent="space-between">
        <Image
          src={isHover ? logo : logo.replace('logo', 'logo-small')}
          alt="Dropbook Logo"
          height={'32px'}
        />
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      <Flex direction="column">
        {LinkItems.map(link => (
          <NavItem
            isHover={isHover}
            key={link.name}
            icon={link.icon}
            href={link.href}
          >
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
  isHover: boolean;
  icon: IconType;
  href: string;
  children: ReactText;
  isActive?: boolean;
}

const NavItem = ({ isHover, icon, href, children, ...rest }: NavItemProps) => {
  const router = useRouter();
  const isActive = router.pathname === href;
  const color = useColorModeValue('blackAlpha.600', 'whiteAlpha.600');
  const activeColor = useColorModeValue('blackAlpha.800', 'whiteAlpha.800');
  const borderColor = useColorModeValue('blue.600', 'blue.300');

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <Flex direction="column" {...rest} px={4} py={1}>
      {isHover ? (
        <Button
          variant={isActive ? 'solid' : 'ghost'}
          size="sm"
          leftIcon={<Icon fontSize="16" as={icon} />}
          justifyContent="left"
          onClick={handleClick}
          cursor="pointer"
        >
          {children}
        </Button>
      ) : (
        <IconButton
          variant={isActive ? 'solid' : 'ghost'}
          size="sm"
          aria-label="toggle dark mode"
          icon={<Icon fontSize="16" as={icon} />}
          onClick={handleClick}
          cursor="pointer"
        />
      )}
    </Flex>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const { toggleColorMode } = useColorMode();
  const toggleIcon = useColorModeValue(<FiMoon />, <FiSun />);
  const logo = useColorModeValue('/logo.svg', '/logo-dark.svg');
  return (
    <Flex
      ml={{ base: 0, md: '68px' }}
      p={{ base: 2, md: 2 }}
      gap={{ base: 2, md: 4 }}
      alignItems="center"
      bg={{
        base: useColorModeValue('white', 'gray.900'),
        md: useColorModeValue('whiteAlpha.600', 'gray.900')
      }}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}
    >
      <Flex alignItems="center" gap={2}>
        <InputGroup display={{ base: 'none', md: 'flex' }} width="240px">
          <InputLeftElement color={useColorModeValue('gray.300', 'gray.600')}>
            <FiSearch />
          </InputLeftElement>
          <SearchBar />
        </InputGroup>
        <IconButton
          display={{ base: 'flex', md: 'none' }}
          onClick={onOpen}
          variant="outline"
          aria-label="open menu"
          icon={<FiMenu />}
        />
        <Box display={{ base: 'flex', md: 'none' }}>
          <Image src={logo} alt="Dropbook Logo" width="128px" />
        </Box>
      </Flex>

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
