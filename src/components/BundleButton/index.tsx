import { useState } from 'react';
import {
  Flex,
  Button,
  IconButton,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Grid,
  GridItem,
  Text,
  useColorModeValue,
  Divider
} from '@chakra-ui/react';
import { FiUser, FiChevronDown, FiSettings, FiPlus } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { IBundle } from '@/types/IBundle';

export default function BundleButton({
  onClose,
  isHover,
  currentBundle,
  setCurrentBundle,
  bundlesData,
  setBundlesData,
  ...rest
}: {
  onClose: () => void;
  isHover: boolean;
  currentBundle: number;
  setCurrentBundle: (index: number) => void;
  bundlesData: IBundle[];
  setBundlesData: (data: IBundle[]) => void;
}) {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const hasBundle = bundlesData.length > 0;

  const handleProfileClick = () => {
    if (!hasBundle) {
      router.push(`/bundle`);
      onClose();
      return;
    }
    setShowModal(true);
  };

  const handleSelectProfileClick = (index: number) => {
    setCurrentBundle(index);
    setShowModal(false);
    window.localStorage.setItem('profileId', index.toString());
    router.push(`/`);
    onClose();
  };

  function getCurrentProfileName(): string {
    if (hasBundle && currentBundle < bundlesData.length) {
      return bundlesData[currentBundle].name;
    }
    return 'Create Bundle';
  }

  return (
    <Flex direction="column" {...rest}>
      {isHover ? (
        hasBundle ? (
          <Button
            variant={hasBundle ? 'outline' : 'solid'}
            colorScheme={hasBundle ? 'gray' : 'primary'}
            rounded="lg"
            leftIcon={
              hasBundle ? (
                <Icon fontSize="16" as={FiUser} />
              ) : (
                <Icon fontSize="16" as={FiPlus} />
              )
            }
            rightIcon={<Icon fontSize="16" as={FiChevronDown} ml="auto" />}
            w="full"
            onClick={handleProfileClick}
            display={{ base: 'none', xl: 'flex' }}
          >
            {getCurrentProfileName()}
          </Button>
        ) : (
          <Button
            variant={hasBundle ? 'outline' : 'solid'}
            colorScheme={hasBundle ? 'gray' : 'primary'}
            rounded="lg"
            leftIcon={
              hasBundle ? (
                <Icon fontSize="16" as={FiUser} />
              ) : (
                <Icon fontSize="16" as={FiPlus} />
              )
            }
            w="full"
            onClick={handleProfileClick}
            display={{ base: 'none', xl: 'flex' }}
          >
            {getCurrentProfileName()}
          </Button>
        )
      ) : (
        <IconButton
          variant={hasBundle ? 'outline' : 'solid'}
          colorScheme={hasBundle ? 'gray' : 'primary'}
          rounded="lg"
          aria-label="toggle dark mode"
          icon={
            hasBundle ? (
              <Icon fontSize="16" as={FiUser} />
            ) : (
              <Icon fontSize="16" as={FiPlus} />
            )
          }
          onClick={handleProfileClick}
          cursor="pointer"
          display={{ base: 'none', xl: 'flex' }}
        />
      )}
      {hasBundle ? (
        <Button
          variant={hasBundle ? 'outline' : 'solid'}
          colorScheme={hasBundle ? 'gray' : 'primary'}
          rounded="lg"
          leftIcon={
            hasBundle ? (
              <Icon fontSize="16" as={FiUser} />
            ) : (
              <Icon fontSize="16" as={FiPlus} />
            )
          }
          rightIcon={<Icon fontSize="16" as={FiChevronDown} ml="auto" />}
          w="full"
          onClick={handleProfileClick}
          display={{ base: 'flex', xl: 'none' }}
        >
          {getCurrentProfileName()}
        </Button>
      ) : (
        <Button
          variant={hasBundle ? 'outline' : 'solid'}
          colorScheme={hasBundle ? 'gray' : 'primary'}
          rounded="lg"
          leftIcon={
            hasBundle ? (
              <Icon fontSize="16" as={FiUser} />
            ) : (
              <Icon fontSize="16" as={FiPlus} />
            )
          }
          w="full"
          onClick={handleProfileClick}
          display={{ base: 'flex', xl: 'none' }}
        >
          {getCurrentProfileName()}
        </Button>
      )}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Profiles</ModalHeader>
          <ModalCloseButton />
          <Divider />
          <ModalBody>
            <Flex direction="column" gap={2}>
              <Flex direction="column" gap={2} py={2}>
                <Text
                  fontSize={{ base: 'xs', md: 'sm' }}
                  color={useColorModeValue('gray.500', 'gray.400')}
                >
                  Current profile
                </Text>
                {getCurrentProfileName()}
              </Flex>
              {/* <Divider /> */}
              <Flex direction="column" gap={2} py={2}>
                <Text
                  fontSize={{ base: 'xs', md: 'sm' }}
                  color={useColorModeValue('gray.500', 'gray.400')}
                >{`My Profiles (${
                  bundlesData.length > 0 ? bundlesData.length : 0
                })`}</Text>
                <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                  {bundlesData.length > 0 &&
                    bundlesData.map((profile, index) => (
                      <GridItem colSpan={{ base: 2, md: 1 }} key={profile.name}>
                        <Button
                          variant={'outline'}
                          size="sm"
                          w="full"
                          onClick={() => handleSelectProfileClick(index)}
                        >
                          {profile.name}
                        </Button>
                      </GridItem>
                    ))}
                </Grid>
              </Flex>
            </Flex>
          </ModalBody>
          <Divider />
          <ModalFooter>
            <Flex direction="column" gap={2} w="full">
              <Button
                variant={'link'}
                size="sm"
                leftIcon={<Icon fontSize="16" as={FiSettings} />}
                onClick={() => {
                  setShowModal(false);
                  router.push('/bundle');
                  onClose();
                }}
              >
                Manage Profiles
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
