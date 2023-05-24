import { IProfile } from '@/types/IProfile';
import { getFormattedAddress, getEmojiForWalletType } from '@/utils/format';
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
  FormHelperText,
  RadioGroup,
  Radio,
  Stack
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  FiArrowLeft,
  FiChevronLeft,
  FiEdit,
  FiPlusCircle
} from 'react-icons/fi';
import { isAddress } from 'viem';

interface ProfileProps {
  id: string;
  profilesData: IProfile[];
  setProfilesData: React.Dispatch<React.SetStateAction<IProfile[]>>;
}

export default function Profile({
  id,
  profilesData,
  setProfilesData
}: ProfileProps) {
  const router = useRouter();
  const [input, setInput] = useState('');
  const handleInputChange = (e: any) => setInput(e.target.value);

  const [editInput, setEditInput] = useState('');
  const handleEditInputChange = (e: any) => setEditInput(e.target.value);

  const [type, setType] = useState('hot');

  const isError = !isAddress(input);
  const [showModal, setShowModal] = useState(false);
  const [showEditNameModal, setShowEditNameModal] = useState(false);
  const toast = useToast();

  const [profile, setProfile] = useState<{
    name: string;
    wallets: { address: string; type: string }[];
  }>();

  const handleRemoveAddress = (index: number) => {
    if (profile) {
      const newWallets = profile.wallets.filter((_, i) => i !== index);
      const newProfile = { ...profile, wallets: newWallets };
      setProfile(newProfile);
      const newProfilesData = profilesData.map((p, i) =>
        i === parseInt(id) ? newProfile : p
      );
      setProfilesData(newProfilesData);
      window.localStorage.setItem(
        'biway.profiles',
        JSON.stringify(newProfilesData)
      );
    }
  };

  const handleAddAddress = (address: string, type: string) => {
    if (profile) {
      const newWallets = [...profile.wallets, { address, type }];
      const newProfile = { ...profile, wallets: newWallets };
      setProfile(newProfile);
      const newProfilesData = profilesData.map((p, i) =>
        i === parseInt(id) ? newProfile : p
      );
      setProfilesData(newProfilesData);
      window.localStorage.setItem(
        'biway.profiles',
        JSON.stringify(newProfilesData)
      );
    }
  };

  const handleRenameProfile = (name: string) => {
    if (profile) {
      const newProfile = { ...profile, name };
      setProfile(newProfile);
      const newProfilesData = profilesData.map((p, i) =>
        i === parseInt(id) ? newProfile : p
      );
      setProfilesData(newProfilesData);
      window.localStorage.setItem(
        'biway.profiles',
        JSON.stringify(newProfilesData)
      );
    }
  };

  useEffect(() => {
    // Get item from local storage
    const profiles = window.localStorage.getItem('biway.profiles');
    if (profiles) {
      const parsedProfiles = JSON.parse(profiles);
      setProfilesData(parsedProfiles);
      const selectedProfile = parsedProfiles[parseInt(id)];
      if (selectedProfile) setProfile(selectedProfile);
    }
  }, [id]);

  return (
    <Flex direction="column" gap={4} alignItems="center">
      <Flex width={{ base: '100%', md: '70%' }}>
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<FiChevronLeft />}
          onClick={() => router.back()}
        >
          Back
        </Button>
      </Flex>
      <Flex width={{ base: '100%', md: '70%' }} alignItems="center" gap={2}>
        <Heading fontSize={{ base: 'lg', lg: '2xl' }}>
          {profile ? profile.name : ''}
        </Heading>
        <IconButton
          variant="ghost"
          size="sm"
          icon={<FiEdit />}
          onClick={() => setShowEditNameModal(true)}
          aria-label="Edit"
        />
      </Flex>
      <Card width={{ base: '100%', md: '70%' }}>
        <CardHeader>
          <Heading
            fontSize={{ base: 'md', lg: 'xl' }}
          >{`Wallets (${profile?.wallets.length})`}</Heading>
        </CardHeader>
        <CardBody>
          <Grid templateColumns="repeat(4, 1fr)" gap={2}>
            {profile?.wallets.map((wallet, index) => (
              <GridItem key={index} colSpan={{ base: 4, md: 2, lg: 1 }}>
                <Tag
                  w={'100%'}
                  size={{ base: 'lg', md: 'md' }}
                  justifyContent="space-between"
                >
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
                      )} ${getFormattedAddress(wallet.address)}`}
                    </TagLabel>
                  </Tooltip>
                  <TagCloseButton onClick={() => handleRemoveAddress(index)} />
                </Tag>
              </GridItem>
            ))}
            <GridItem colSpan={{ base: 4, md: 2, lg: 1 }}>
              <Tag
                colorScheme="green"
                size={{ base: 'lg', md: 'md' }}
                w={'100%'}
                onClick={() => setShowModal(true)}
                cursor="pointer"
              >
                <TagLeftIcon as={FiPlusCircle} />
                <TagLabel>Add wallet</TagLabel>
              </Tag>
            </GridItem>
          </Grid>
        </CardBody>
      </Card>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add wallet</ModalHeader>
          <ModalCloseButton />
          <Divider />
          <ModalBody>
            <Flex direction="column" gap={4}>
              <FormControl isInvalid={isError}>
                <FormLabel>Address</FormLabel>
                <Input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  autoFocus
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
          </ModalBody>
          <Divider />
          <ModalFooter>
            <Flex gap={2}>
              <Button
                size="sm"
                onClick={() => {
                  if (!isError) {
                    handleAddAddress(input, type);
                    setShowModal(false);
                    setInput('');
                  }
                }}
              >
                Add
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={showEditNameModal}
        onClose={() => setShowEditNameModal(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Rename profile</ModalHeader>
          <ModalCloseButton />
          <Divider />
          <ModalBody>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                value={editInput}
                onChange={handleEditInputChange}
                autoFocus
              />
            </FormControl>
          </ModalBody>
          <Divider />
          <ModalFooter>
            <Flex gap={2}>
              <Button
                size="sm"
                onClick={() => {
                  handleRenameProfile(editInput);
                  setShowEditNameModal(false);
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
  params: { id: string };
}) => {
  const { id } = context.params;
  return {
    props: {
      id
    }
  };
};
