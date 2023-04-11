import { getFormattedAddress } from '@/utils/format';
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  AccordionIcon,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Image,
  Input,
  Link,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  useToast,
  useColorModeValue,
  Tag,
  TagLabel,
  TagCloseButton,
  TagLeftIcon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalFooter,
  Divider,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalHeader,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  FiArrowRight,
  FiCopy,
  FiDroplet,
  FiEye,
  FiGrid,
  FiMoreVertical,
  FiPenTool,
  FiPlus,
  FiPlusCircle,
  FiTrash,
  FiX
} from 'react-icons/fi';
import { isAddress } from 'viem';

interface ProfilesProps {
  setCurrentProfile: React.Dispatch<React.SetStateAction<number>>;
}

export default function Profiles({ setCurrentProfile }: ProfilesProps) {
  const [profileInput, setProfileInput] = useState('');
  const [addressInput, setAddressInput] = useState('');
  const handleProfileInputChange = (e: any) => setProfileInput(e.target.value);
  const handleAddressInputChange = (e: any) => setAddressInput(e.target.value);
  const isError = !isAddress(addressInput);
  const [showModal, setShowModal] = useState(false);

  const [profilesData, setProfilesData] = useState<
    { name: string; wallets: { address: string }[] }[]
  >([]);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    // Get item from local storage
    const profiles = window.localStorage.getItem('profiles');
    if (profiles) setProfilesData(JSON.parse(profiles));
  }, []);

  const handleSelectProfileClick = (index: number) => {
    setCurrentProfile(index);
    window.localStorage.setItem('profileId', index.toString());
    router.push(`/`);
  };

  const handleAddProfileSubmit = (formData: {
    name: string;
    wallets: { address: string }[];
  }) => {
    // Add the new profile data to the existing profiles array
    const updatedProfiles = [...profilesData, formData];
    setProfilesData(updatedProfiles);
    window.localStorage.setItem('profiles', JSON.stringify(updatedProfiles));

    // Navigate back to the main page
    router.push(`/profile/${updatedProfiles.length - 1}`);
  };

  const handleDeleteProfile = (index: number) => {
    const updatedProfiles = profilesData.filter((_, i) => i !== index);
    setProfilesData(updatedProfiles);
    window.localStorage.setItem('profiles', JSON.stringify(updatedProfiles));
    setCurrentProfile(0);
    window.localStorage.setItem('profileId', '0');
  };

  return (
    <Flex direction="column" gap={4} alignItems="center">
      <Flex width={{ base: '100%', md: '70%' }} justifyContent="space-between">
        <Heading fontSize={{ base: 'lg', lg: '2xl' }}>Profiles</Heading>
        <Button
          size="sm"
          leftIcon={<FiPlusCircle />}
          onClick={() => {
            setShowModal(true);
          }}
        >
          Add Profile
        </Button>
      </Flex>
      {profilesData.length === 0 && (
        <Flex
          direction="column"
          alignItems="center"
          justifyContent="center"
          width={{ base: '100%', md: '70%' }}
          height="300px"
          border="1px dashed"
          borderColor="gray.300"
          borderRadius="md"
        >
          <Heading fontSize="xl" textAlign="center">
            {`You don't have any profiles yet.`}
          </Heading>
        </Flex>
      )}
      {profilesData.map((profile, index) => (
        <Card width={{ base: '100%', md: '70%' }} key={index}>
          <CardHeader display="flex" justifyContent="space-between">
            <Heading fontSize={{ base: 'md', lg: 'xl' }}>
              {profile.name}
            </Heading>
            <Box gap={2} display="flex">
              <Button
                size="sm"
                onClick={() => {
                  router.push(`/profile/${index}`);
                }}
              >
                Edit
              </Button>
              <Menu>
                <MenuButton
                  as={IconButton}
                  size="sm"
                  variant="ghost"
                  icon={<FiMoreVertical />}
                  aria-label="More"
                />
                <MenuList>
                  <MenuItem
                    gap={2}
                    onClick={() => {
                      handleSelectProfileClick(index);
                    }}
                  >
                    <FiEye />
                    View
                  </MenuItem>
                  <MenuItem
                    color="red.500"
                    gap={2}
                    onClick={() => {
                      handleDeleteProfile(index);
                    }}
                  >
                    <FiTrash />
                    Delete
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
          </CardHeader>
          <CardBody>
            <Grid templateColumns="repeat(12, 1fr)" gap={2}>
              {profile.wallets.map((wallet, index) => (
                <GridItem colSpan={{ base: 6, md: 4, lg: 3 }} key={index}>
                  <Tag w={'100%'} size="lg" justifyContent="space-between">
                    <Tooltip label="Copy to clipboard" placement="top" hasArrow>
                      <TagLabel
                        cursor="pointer"
                        onClick={() => {
                          navigator.clipboard.writeText(wallet.address);
                          toast({
                            title: 'Copied to clipboard',
                            status: 'info',
                            duration: 2000,
                            isClosable: true,
                            position: 'top-right'
                          });
                        }}
                      >
                        {getFormattedAddress(wallet.address, 8)}
                      </TagLabel>
                    </Tooltip>
                  </Tag>
                </GridItem>
              ))}
            </Grid>
          </CardBody>
          <CardFooter></CardFooter>
        </Card>
      ))}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add address</ModalHeader>
          <ModalCloseButton />
          <Divider />
          <ModalBody>
            <Flex direction="column" gap={4}>
              <FormControl>
                <FormLabel>Profile Name</FormLabel>
                <Input
                  type="text"
                  value={profileInput}
                  onChange={handleProfileInputChange}
                />
              </FormControl>
              <FormControl isInvalid={isError}>
                <FormLabel>Address</FormLabel>
                <Input
                  type="text"
                  value={addressInput}
                  onChange={handleAddressInputChange}
                />
                {isError && (
                  <FormErrorMessage>
                    Please enter a valid address
                  </FormErrorMessage>
                )}
              </FormControl>
            </Flex>
          </ModalBody>
          <Divider />
          <ModalFooter>
            <Flex gap={2}>
              <Button
                size="sm"
                onClick={() => {
                  if (!isError) {
                    handleAddProfileSubmit({
                      name: profileInput,
                      wallets: [{ address: addressInput }]
                    });
                    setShowModal(false);
                  }
                }}
              >
                Add
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export const getServerSideProps = async (context: {
  query: { chain: string };
}) => {
  return {
    props: {}
  };
};
