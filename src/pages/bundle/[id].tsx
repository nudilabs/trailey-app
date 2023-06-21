import { IBundle } from '@/types/IBundle';
import { customPublicClient } from '@/utils/client';
import {
  getFormattedAddress,
  getEmojiForWalletType,
  formatPrettyNumber
} from '@/utils/format';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Input,
  Tooltip,
  useToast,
  Tag,
  TagLabel,
  TagCloseButton,
  TagLeftIcon,
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
  RadioGroup,
  Radio,
  Stack
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FiChevronLeft, FiEdit, FiPlus, FiPlusCircle } from 'react-icons/fi';
import { getAddress, isAddress } from 'viem';
import { env } from '@/env.mjs';

interface ProfileProps {
  id: string;
  bundlesData: IBundle[];
  setBundlesData: React.Dispatch<React.SetStateAction<IBundle[]>>;
  localChain: string;
}

export default function Profile({
  id,
  bundlesData,
  setBundlesData,
  localChain
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

  const maxWallets = 10;

  const [profile, setProfile] = useState<{
    name: string;
    wallets: { address: string; type: string }[];
  }>();

  const handleRemoveAddress = (index: number) => {
    if (profile) {
      const newWallets = profile.wallets.filter((_, i) => i !== index);
      const newProfile = { ...profile, wallets: newWallets };
      setProfile(newProfile);
      const newProfilesData = bundlesData.map((p, i) =>
        i === parseInt(id) ? newProfile : p
      );
      setBundlesData(newProfilesData);
      window.localStorage.setItem(
        'dropbook.bundles',
        JSON.stringify(newProfilesData)
      );
    }
  };

  const handleAddAddress = async (address: string, type: string) => {
    const nonce = await customPublicClient(localChain).getTransactionCount({
      address: getAddress(address)
    });
    if (nonce > Number(env.NEXT_PUBLIC_TX_LIMIT)) {
      toast({
        title: 'Error',
        description: `We do not support addresses with more than ${formatPrettyNumber(
          env.NEXT_PUBLIC_TX_LIMIT,
          0
        )} transactions during beta`,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });
      return;
    }
    if (profile) {
      const newWallets = [...profile.wallets, { address, type }];
      const newProfile = { ...profile, wallets: newWallets };
      setProfile(newProfile);
      const newProfilesData = bundlesData.map((p, i) =>
        i === parseInt(id) ? newProfile : p
      );
      setBundlesData(newProfilesData);
      window.localStorage.setItem(
        'dropbook.bundles',
        JSON.stringify(newProfilesData)
      );
    }
    toast({
      title: 'Address added',
      status: 'success',
      duration: 2000,
      isClosable: true,
      position: 'top-right'
    });
  };

  const handleRenameProfile = (name: string) => {
    if (profile) {
      const newProfile = { ...profile, name };
      setProfile(newProfile);
      const newProfilesData = bundlesData.map((p, i) =>
        i === parseInt(id) ? newProfile : p
      );
      setBundlesData(newProfilesData);
      window.localStorage.setItem(
        'dropbook.bundles',
        JSON.stringify(newProfilesData)
      );
    }
  };

  useEffect(() => {
    // Get item from local storage
    const profiles = window.localStorage.getItem('dropbook.bundles');
    if (profiles) {
      const parsedProfiles = JSON.parse(profiles);
      setBundlesData(parsedProfiles);
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
          <Flex justifyContent="space-between" alignItems="center">
            <Heading
              fontSize={{ base: 'md', lg: 'xl' }}
            >{`Wallets (${profile?.wallets.length} of ${maxWallets})`}</Heading>
            {profile && profile?.wallets.length < maxWallets ? (
              <IconButton
                onClick={() => setShowModal(true)}
                aria-label="Add"
                size="sm"
              >
                <FiPlus />
              </IconButton>
            ) : (
              <Tooltip
                label={`Max of ${maxWallets} wallets reached`}
                placement="top"
                hasArrow
              >
                <IconButton aria-label="Add" isDisabled>
                  <FiPlusCircle />
                </IconButton>
              </Tooltip>
            )}
          </Flex>
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
                  <TagCloseButton
                    onClick={() => {
                      handleRemoveAddress(index);
                      toast({
                        title: 'Wallet removed',
                        status: 'error',
                        duration: 2000,
                        isClosable: true,
                        position: 'top-right'
                      });
                    }}
                  />
                </Tag>
              </GridItem>
            ))}
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
                  toast({
                    title: 'Profile renamed',
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                    position: 'top-right'
                  });
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
