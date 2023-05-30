import { IProfile } from '@/types/IProfile';
import { getFormattedAddress, getEmojiForWalletType } from '@/utils/format';
import {
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
  FormHelperText,
  RadioGroup,
  Stack,
  Radio
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
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
  currentProfile: number;
  profilesData: IProfile[];
  setProfilesData: React.Dispatch<React.SetStateAction<IProfile[]>>;
}

export default function Profiles({
  setCurrentProfile,
  currentProfile,
  profilesData,
  setProfilesData
}: ProfilesProps) {
  const [profileInput, setProfileInput] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toBeDeletedProfileIndex, setToBeDeletedProfileIndex] = useState(0);
  const handleProfileInputChange = (e: any) => setProfileInput(e.target.value);

  const [addressInput, setAddressInput] = useState('');
  const handleAddressInputChange = (e: any) => setAddressInput(e.target.value);

  const [type, setType] = useState('hot');

  const isError = !isAddress(addressInput);
  const [showModal, setShowModal] = useState(false);

  const maxProfiles = 2;

  // const [profilesData, setProfilesData] = useState<
  //   { name: string; wallets: { address: string; type: string }[] }[]
  // >([]);
  const router = useRouter();
  const toast = useToast();

  const handleSelectProfileClick = (index: number) => {
    setCurrentProfile(index);
    window.localStorage.setItem('profileId', index.toString());
    router.push(`/`);
  };

  const handleAddProfileSubmit = (formData: {
    name: string;
    wallets: { address: string; type: string }[];
  }) => {
    // Add the new profile data to the existing profiles array
    const updatedProfiles = [...profilesData, formData];
    setProfilesData(updatedProfiles);
    window.localStorage.setItem(
      'biway.profiles',
      JSON.stringify(updatedProfiles)
    );

    // Navigate back to the main page
    router.push(`/profile/${updatedProfiles.length - 1}`);
  };

  const handleDeleteProfile = (index: number) => {
    const updatedProfiles = profilesData.filter((_, i) => i !== index);
    setProfilesData(updatedProfiles);
    window.localStorage.setItem(
      'biway.profiles',
      JSON.stringify(updatedProfiles)
    );
    setCurrentProfile(0);
    window.localStorage.setItem('profileId', '0');
  };

  return (
    <Flex direction="column" gap={4} alignItems="center">
      <Flex width={{ base: '100%', md: '70%' }} justifyContent="space-between">
        <Heading fontSize={{ base: 'lg', lg: '2xl' }}>Profiles</Heading>
        {profilesData.length < maxProfiles ? (
          <Button
            size="sm"
            leftIcon={<FiPlusCircle />}
            onClick={() => {
              setShowModal(true);
            }}
          >
            Add Profile
          </Button>
        ) : (
          <Tooltip
            label={`You can only have a maximum of ${maxProfiles} profiles.`}
            hasArrow
            placement="top"
          >
            <Button size="sm" leftIcon={<FiPlusCircle />} isDisabled>
              Add Profile
            </Button>
          </Tooltip>
        )}
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
                      setToBeDeletedProfileIndex(index);
                      setShowDeleteModal(true);
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
                        {`${getEmojiForWalletType(
                          wallet.type
                        )} ${getFormattedAddress(wallet.address, 8)}`}
                      </TagLabel>
                    </Tooltip>
                  </Tag>
                </GridItem>
              ))}
            </Grid>
          </CardBody>
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
                  autoFocus
                />
              </FormControl>
              <Flex direction="column" gap={4}>
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
                <RadioGroup onChange={setType} value={type}>
                  <FormLabel>Wallet Type</FormLabel>
                  <Stack direction="row">
                    <Radio value="hot">🔥 Hot</Radio>
                    <Radio value="cold">🥶 Cold</Radio>
                    <Radio value="vault">🔒 Vault</Radio>
                  </Stack>
                </RadioGroup>
              </Flex>
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
                      wallets: [{ address: addressInput, type: type }]
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
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to delete the profile?</ModalBody>
          <ModalFooter>
            <Flex gap={2}>
              <Button
                size="sm"
                onClick={() => {
                  setShowDeleteModal(false);
                }}
                variant="ghost"
              >
                No
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  handleDeleteProfile(toBeDeletedProfileIndex);
                  setShowDeleteModal(false);
                }}
                colorScheme="red"
              >
                Yes
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
