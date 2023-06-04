import React, { ReactNode, useState } from 'react';
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  Image,
  useColorMode,
  Spacer,
  Button,
  Divider,
  Stack,
  Tooltip
} from '@chakra-ui/react';
import {
  FiHome,
  FiTrendingUp,
  FiSettings,
  FiMenu,
  FiSun,
  FiMoon,
  FiTwitter
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import { ReactText } from 'react';
import { useRouter } from 'next/router';
import SearchBar from '../SearchBar';
import BundleButton from '../BundleButton';
import { IBundle } from '@/types/IBundle';

import CustomConnectButton from '../ConnectButton';

interface LinkItemProps {
  name: string;
  icon: IconType;
  href?: string;
}
const LinkItems: Array<LinkItemProps> = [
  { name: 'Home', icon: FiHome, href: '/' }
];

export default function SidebarWithHeader({
  currentBundle,
  setCurrentBundle,
  bundlesData,
  setBundlesData,
  children
}: {
  currentBundle: number;
  setCurrentBundle: (index: number) => void;
  bundlesData: IBundle[];
  setBundlesData: (data: IBundle[]) => void;
  children: ReactNode;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', xl: 'block' }}
        zIndex={999}
        currentBundle={currentBundle}
        setCurrentBundle={setCurrentBundle}
        bundlesData={bundlesData}
        setBundlesData={setBundlesData}
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
            currentBundle={currentBundle}
            setCurrentBundle={setCurrentBundle}
            bundlesData={bundlesData}
            setBundlesData={setBundlesData}
          />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} bundlesData={bundlesData} />
      <Box ml={{ base: 0, xl: '68px' }} px={{ base: 4, xl: 8 }} pt={'85px'}>
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
  currentBundle: number;
  setCurrentBundle: (index: number) => void;
  bundlesData: IBundle[];
  setBundlesData: (data: IBundle[]) => void;
}

const SidebarContent = ({
  onClose,
  currentBundle,
  setCurrentBundle,
  bundlesData,
  setBundlesData,
  ...rest
}: SidebarProps) => {
  const { toggleColorMode } = useColorMode();
  const toggleIcon = useColorModeValue(<FiSun />, <FiMoon />);
  const toggleBorderColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');
  const darkModeButtonVariant = useColorModeValue('solid', 'ghost');
  const lightModeButtonVariant = useColorModeValue('ghost', 'solid');
  const logo = useColorModeValue('/logos/logo.svg', '/logos/logo-dark.svg');
  const [isHover, setIsHover] = useState(false);

  const handleHover = (hover: boolean) => {
    setIsHover(hover);
  };

  return (
    <Flex
      direction="column"
      bg={useColorModeValue('gray.50', 'gray.900')}
      boxShadow={useColorModeValue('xl', 'dark-xl')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', xl: 'auto' }}
      minW={0}
      pos="fixed"
      h="100vh"
      {...rest}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
    >
      <Flex direction="column" h="100%" p={4} gap={8}>
        {/* Sidebar header */}
        <Flex alignItems="center" justifyContent={'space-between'}>
          <Image
            src={
              isHover ? logo : logo.replace('/logos/logo', '/logos/logo-small')
            }
            alt="Abtrail Logo"
            height={'40px'}
            display={{ base: 'none', xl: 'block' }}
          />
          <Image
            src={logo}
            alt="Abtrail Logo"
            height={'40px'}
            display={{ base: 'block', xl: 'none' }}
          />
          <CloseButton
            display={{ base: 'flex', xl: 'none' }}
            onClick={onClose}
          />
        </Flex>
        {/* Profile button */}
        <BundleButton
          onClose={onClose}
          isHover={isHover}
          currentBundle={currentBundle}
          setCurrentBundle={setCurrentBundle}
          bundlesData={bundlesData}
          setBundlesData={setBundlesData}
        />
        <Divider />
        {/* Navigation items */}
        <Stack spacing={2}>
          <Box display={{ base: 'flex', xl: 'none' }}>
            <SearchBar onClose={onClose} />
          </Box>
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
        <Spacer display={{ base: 'none', md: 'block' }} />
        <Divider display={{ base: 'block', md: 'none' }} />
        <Stack spacing={2}>
          <NavItem
            onClose={onClose}
            isHover={isHover}
            key={'twitter'}
            icon={FiTwitter}
            href={'https://twitter.com/AbtrailAnalytics'}
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
              display={{ base: 'flex', xl: isHover ? 'flex' : 'none' }}
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
              display={{ base: 'flex', xl: isHover ? 'flex' : 'none' }}
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
              display={{ base: 'none', xl: isHover ? 'none' : 'flex' }}
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
          display={{ base: 'none', xl: 'flex' }}
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
          display={{ base: 'none', xl: 'flex' }}
        />
      )}
      <Button
        variant={isActive ? 'solid' : 'ghost'}
        colorScheme="secondary"
        leftIcon={<Icon as={icon} />}
        justifyContent="left"
        onClick={handleClick}
        cursor="pointer"
        display={{ base: 'flex', xl: 'none' }}
      >
        {children}
      </Button>
    </Flex>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
  bundlesData: IBundle[];
}
const MobileNav = ({ onOpen, bundlesData, ...rest }: MobileProps) => {
  const logo = useColorModeValue('/logos/logo.svg', '/logos/logo-dark.svg');
  const router = useRouter();
  const path = router.pathname;
  return (
    <Flex
      pl={{ base: 0, xl: '68px' }}
      py={{ base: 2, xl: 2 }}
      px={{ base: 2, xl: 4 }}
      gap={{ base: 2, xl: 4 }}
      alignItems="center"
      minH="60px"
      bg={{
        base: useColorModeValue('gray.50', 'gray.900'),
        xl: useColorModeValue('gray.50', 'gray.900')
      }}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', xl: 'flex-end' }}
      position={'fixed'}
      direction="row"
      w="100%"
      zIndex={1}
      {...rest}
    >
      <Flex alignItems="center" gap={2}>
        <Box
          display={{
            base: 'none',
            xl:
              (bundlesData && bundlesData.length > 0) || path !== '/'
                ? 'flex'
                : 'none'
          }}
          width="440px"
        >
          <SearchBar kbd />
        </Box>

        <IconButton
          display={{ base: 'flex', xl: 'none' }}
          onClick={onOpen}
          variant="outline"
          aria-label="open menu"
          icon={<FiMenu />}
        />
        <Box display={{ base: 'flex', xl: 'none' }}>
          <Image src={logo} alt="Abtrail Logo" width="128px" />
        </Box>
      </Flex>
      {/* <CustomConnectButton /> */}
    </Flex>
  );
};
