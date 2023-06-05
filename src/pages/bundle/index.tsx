import { IBundle } from '@/types/IBundle';
import ENV from '@/utils/Env';
import { customPublicClient } from '@/utils/client';
import {
  getFormattedAddress,
  getEmojiForWalletType,
  formatPrettyNumber
} from '@/utils/format';
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
import { getAddress, isAddress } from 'viem';

interface BundlesProps {
  setCurrentBundle: React.Dispatch<React.SetStateAction<number>>;
  currentBundle: number;
  bundlesData: IBundle[];
  setBundlesData: React.Dispatch<React.SetStateAction<IBundle[]>>;
  localChain: string;
}

export default function Bundles({
  setCurrentBundle,
  currentBundle,
  bundlesData,
  setBundlesData,
  localChain
}: BundlesProps) {
  const [profileInput, setBundleInput] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toBeDeletedBundleIndex, setToBeDeletedBundleIndex] = useState(0);
  const handleBundleInputChange = (e: any) => setBundleInput(e.target.value);

  const [addressInput, setAddressInput] = useState('');
  const handleAddressInputChange = (e: any) => setAddressInput(e.target.value);

  const [type, setType] = useState('hot');

  const isError = !isAddress(addressInput);
  const [showModal, setShowModal] = useState(false);

  const maxBundles = 2;

  // const [bundlesData, setBundlesData] = useState<
  //   { name: string; wallets: { address: string; type: string }[] }[]
  // >([]);
  const router = useRouter();
  const toast = useToast();

  const handleSelectBundleClick = (index: number) => {
    setCurrentBundle(index);
    window.localStorage.setItem('profileId', index.toString());
    router.push(`/`);
  };

  const handleAddBundleSubmit = async (formData: {
    name: string;
    wallets: { address: string; type: string }[];
  }) => {
    const nonce = await customPublicClient(localChain).getTransactionCount({
      address: getAddress(formData.wallets[0].address)
    });
    if (nonce > Number(ENV.NEXT_PUBLIC_TX_LIMIT)) {
      toast({
        title: 'Error',
        description: `We do not support addresses with more than ${formatPrettyNumber(
          ENV.NEXT_PUBLIC_TX_LIMIT,
          0
        )} transactions during beta`,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });
      return;
    }
    // Add the new profile data to the existing profiles array
    const updatedBundles = [...bundlesData, formData];
    setBundlesData(updatedBundles);
    window.localStorage.setItem(
      'trailey.bundles',
      JSON.stringify(updatedBundles)
    );

    // Navigate back to the main page
    router.push(`/bundle/${updatedBundles.length - 1}`);
  };

  const handleDeleteBundle = (index: number) => {
    const updatedBundles = bundlesData.filter((_, i) => i !== index);
    setBundlesData(updatedBundles);
    window.localStorage.setItem(
      'trailey.bundles',
      JSON.stringify(updatedBundles)
    );
    setCurrentBundle(0);
    window.localStorage.setItem('profileId', '0');
  };

  return (
    <Flex direction="column" gap={4} alignItems="center">
      <Flex width={{ base: '100%', md: '70%' }} justifyContent="space-between">
        <Heading fontSize={{ base: 'lg', lg: '2xl' }}>Bundles</Heading>
        {bundlesData.length < maxBundles ? (
          <Button
            size="sm"
            leftIcon={<FiPlusCircle />}
            onClick={() => {
              setShowModal(true);
            }}
          >
            Add Bundle
          </Button>
        ) : (
          <Tooltip
            label={`You can only have a maximum of ${maxBundles} profiles.`}
            hasArrow
            placement="top"
          >
            <Button size="sm" leftIcon={<FiPlusCircle />} isDisabled>
              Add Bundle
            </Button>
          </Tooltip>
        )}
      </Flex>
      {bundlesData.length === 0 && (
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
            {`You don't have any bundles yet.`}
          </Heading>
        </Flex>
      )}
      {bundlesData.map((profile, index) => (
        <Card width={{ base: '100%', md: '70%' }} key={index}>
          <CardHeader display="flex" justifyContent="space-between">
            <Heading fontSize={{ base: 'md', lg: 'xl' }}>
              {profile.name}
            </Heading>
            <Box gap={2} display="flex">
              <Button
                size="sm"
                onClick={() => {
                  router.push(`/bundle/${index}`);
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
                      handleSelectBundleClick(index);
                    }}
                  >
                    <FiEye />
                    View
                  </MenuItem>
                  <MenuItem
                    color="red.500"
                    gap={2}
                    onClick={() => {
                      setToBeDeletedBundleIndex(index);
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
                <FormLabel>Bundle Name</FormLabel>
                <Input
                  type="text"
                  value={profileInput}
                  onChange={handleBundleInputChange}
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
                    handleAddBundleSubmit({
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
                  handleDeleteBundle(toBeDeletedBundleIndex);
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
