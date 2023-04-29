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
  Button,
  Select,
  Divider,
  Stack,
  Text,
  Tooltip
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
  FiMoon,
  FiUser,
  FiChevronDown,
  FiTwitter
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import { ReactText } from 'react';
import { useRouter } from 'next/router';
import SearchBar from './SearchBar';
import ProfileButton from './ProfileButton';
import { IProfile } from '@/types/IProfile';

import { motion } from 'framer-motion';
import { CustomConnectButton } from './ConnectButton';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface LinkItemProps {
  name: string;
  icon: IconType;
  href?: string;
}
const LinkItems: Array<LinkItemProps> = [
  { name: 'Home', icon: FiHome, href: '/' },
  { name: 'Trending', icon: FiTrendingUp }
];

export default function SidebarWithHeader({
  currentProfile,
  setCurrentProfile,
  profilesData,
  setProfilesData,
  children
}: {
  currentProfile: number;
  setCurrentProfile: (index: number) => void;
  profilesData: IProfile[];
  setProfilesData: (data: IProfile[]) => void;
  children: ReactNode;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.800')}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
        zIndex={999}
        currentProfile={currentProfile}
        setCurrentProfile={setCurrentProfile}
        profilesData={profilesData}
        setProfilesData={setProfilesData}
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
          <SidebarContent
            onClose={onClose}
            currentProfile={currentProfile}
            setCurrentProfile={setCurrentProfile}
            profilesData={profilesData}
            setProfilesData={setProfilesData}
          />
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
  currentProfile: number;
  setCurrentProfile: (index: number) => void;
  profilesData: IProfile[];
  setProfilesData: (data: IProfile[]) => void;
}

const SidebarContent = ({
  onClose,
  currentProfile,
  setCurrentProfile,
  profilesData,
  setProfilesData,
  ...rest
}: SidebarProps) => {
  const { toggleColorMode } = useColorMode();
  const toggleIcon = useColorModeValue(<FiSun />, <FiMoon />);
  const toggleBorderColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');
  const darkModeButtonVariant = useColorModeValue('solid', 'ghost');
  const lightModeButtonVariant = useColorModeValue('ghost', 'solid');
  const logo = useColorModeValue('/logo.svg', '/logo-dark.svg');
  const [isHover, setIsHover] = useState(false);

  const handleHover = (hover: boolean) => {
    setIsHover(hover);
  };

  var viewportHeight = window.innerHeight;

  return (
    <Flex
      direction="column"
      bg={useColorModeValue('gray.50', 'gray.900')}
      boxShadow={useColorModeValue('xl', 'dark-xl')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 'auto' }}
      minW={0}
      pos="fixed"
      h={viewportHeight}
      {...rest}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
    >
      <Flex direction="column" h="100%" p={4} gap={8}>
        {/* Sidebar header */}
        <Flex alignItems="center" justifyContent={'space-between'}>
          <Image
            src={isHover ? logo : logo.replace('logo', 'logo-small')}
            alt="Biway Logo"
            height={'40px'}
            display={{ base: 'none', md: 'block' }}
          />
          <Image
            src={logo}
            alt="Biway Logo"
            height={'40px'}
            display={{ base: 'block', md: 'none' }}
          />
          <CloseButton
            display={{ base: 'flex', md: 'none' }}
            onClick={onClose}
          />
        </Flex>
        {/* Profile button */}
        <ProfileButton
          onClose={onClose}
          isHover={isHover}
          currentProfile={currentProfile}
          setCurrentProfile={setCurrentProfile}
          profilesData={profilesData}
          setProfilesData={setProfilesData}
        />
        <Divider />
        {/* Navigation items */}
        <Stack spacing={2}>
          {LinkItems.map(link => (
            <NavItem
              onClose={onClose}
              isHover={isHover}
              key={link.name}
              icon={link.icon}
              href={link.href}
            >
              {link.name}
            </NavItem>
          ))}
        </Stack>

        <Spacer />
        <Stack spacing={2}>
          <NavItem
            onClose={onClose}
            isHover={isHover}
            key={'settings'}
            icon={FiSettings}
            href={'/settings'}
          >
            Settings
          </NavItem>
          <NavItem
            onClose={onClose}
            isHover={isHover}
            key={'twitter'}
            icon={FiTwitter}
            href={'https://twitter.com/BiwayAnalytics'}
          >
            Twitter
          </NavItem>
          {/* Dark mode toggle */}
          {/* <Box> */}
          <Flex
            direction={'row'}
            borderRadius="xl"
            borderColor={toggleBorderColor}
            borderWidth="1px"
            p={1}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
          >
            <Button
              variant={darkModeButtonVariant}
              rounded="lg"
              size="sm"
              leftIcon={<FiSun fontSize="16" />}
              justifyContent="center"
              onClick={toggleColorMode}
              display={{ base: 'flex', md: isHover ? 'flex' : 'none' }}
              w="100%"
            >
              Light
            </Button>
            <Button
              variant={lightModeButtonVariant}
              rounded="lg"
              size="sm"
              leftIcon={<FiMoon fontSize="16" />}
              justifyContent="center"
              onClick={toggleColorMode}
              display={{ base: 'flex', md: isHover ? 'flex' : 'none' }}
              w="100%"
            >
              Dark
            </Button>
            <IconButton
              size="sm"
              rounded="lg"
              aria-label="toggle dark mode"
              icon={toggleIcon}
              onClick={toggleColorMode}
              cursor="pointer"
              display={{ base: 'none', md: isHover ? 'none' : 'flex' }}
            />
          </Flex>
          {/* </Box> */}
        </Stack>
      </Flex>
    </Flex>
  );
};

interface NavItemProps extends FlexProps {
  onClose: () => void;
  isHover: boolean;
  icon: IconType;
  href?: string;
  children: ReactText;
  isActive?: boolean;
}

const NavItem = ({
  onClose,
  isHover,
  icon,
  href,
  children,
  ...rest
}: NavItemProps) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  const handleClick = (e: React.MouseEvent) => {
    onClose();
    e.preventDefault();
    if (href) router.push(href);
  };

  return (
    <Flex direction="column" {...rest}>
      {isHover ? (
        <Button
          variant={isActive ? 'solid' : 'ghost'}
          colorScheme={isActive ? 'secondary' : 'gray'}
          isDisabled={!href}
          rounded="lg"
          leftIcon={<Icon fontSize="16" as={icon} />}
          justifyContent="left"
          onClick={handleClick}
          cursor="pointer"
          display={{ base: 'none', md: 'flex' }}
        >
          {href ? (
            children
          ) : (
            <Tooltip label={'Coming soon'} placement="right">
              {children}
            </Tooltip>
          )}
        </Button>
      ) : (
        <IconButton
          variant={isActive ? 'solid' : 'ghost'}
          colorScheme={isActive ? 'secondary' : 'gray'}
          isDisabled={!href}
          rounded="lg"
          aria-label="toggle dark mode"
          icon={<Icon fontSize="16" as={icon} />}
          onClick={handleClick}
          cursor="pointer"
          display={{ base: 'none', md: 'flex' }}
        />
      )}
      <Button
        variant={isActive ? 'solid' : 'ghost'}
        size="sm"
        leftIcon={<Icon fontSize="16" as={icon} />}
        justifyContent="left"
        onClick={handleClick}
        cursor="pointer"
        display={{ base: 'flex', md: 'none' }}
      >
        {children}
      </Button>
    </Flex>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const logo = useColorModeValue('/logo.svg', '/logo-dark.svg');
  return (
    <Flex
      ml={{ base: 0, md: '68px' }}
      p={{ base: 2, md: 2 }}
      gap={{ base: 2, md: 4 }}
      alignItems="center"
      bg={{
        base: useColorModeValue('gray.50', 'gray.900'),
        md: useColorModeValue('gray.50', 'gray.900')
      }}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}
    >
      <Flex alignItems="center" gap={2}>
        <SearchBar />
        <Box
          h="32px"
          borderRight="1px solid"
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          pr={2}
          display={{ base: 'none', md: 'flex' }}
        />
        <IconButton
          display={{ base: 'flex', md: 'none' }}
          onClick={onOpen}
          variant="outline"
          aria-label="open menu"
          icon={<FiMenu />}
        />
        <Box display={{ base: 'flex', md: 'none' }}>
          <Image src={logo} alt="Biway Logo" width="128px" />
        </Box>
      </Flex>
      {/* <ConnectButton
        showBalance={false}
        chainStatus={{
          smallScreen: 'none',
          largeScreen: 'icon'
        }}
        accountStatus={{
          smallScreen: 'avatar',
          largeScreen: 'full'
        }}
      /> */}
      <CustomConnectButton />
    </Flex>
  );
};
