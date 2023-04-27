import { useState, useRef } from 'react';
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
  ListItem,
  UnorderedList,
  Grid,
  GridItem,
  Text,
  useColorModeValue,
  Divider
} from '@chakra-ui/react';
import { FiUser, FiChevronDown, FiSettings } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { IProfile } from '@/types/IProfile';

export default function ProfileButton({
  onClose,
  isHover,
  currentProfile,
  setCurrentProfile,
  profilesData,
  setProfilesData,
  ...rest
}: {
  onClose: () => void;
  isHover: boolean;
  currentProfile: number;
  setCurrentProfile: (index: number) => void;
  profilesData: IProfile[];
  setProfilesData: (data: IProfile[]) => void;
}) {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleProfileClick = () => {
    setShowModal(true);
  };

  const handleSelectProfileClick = (index: number) => {
    setCurrentProfile(index);
    setShowModal(false);
    window.localStorage.setItem('profileId', index.toString());
    router.push(`/`);
    onClose();
  };

  function getCurrentProfileName(): string {
    if (profilesData.length > 0 && currentProfile < profilesData.length) {
      return profilesData[currentProfile].name;
    }
    return 'No Profile';
  }

  return (
    <Flex direction="column" {...rest}>
      {isHover ? (
        <Button
          variant={'outline'}
          // size="sm"
          rounded="lg"
          leftIcon={<Icon fontSize="16" as={FiUser} />}
          rightIcon={<Icon fontSize="16" as={FiChevronDown} ml="auto" />}
          w="full"
          onClick={handleProfileClick}
          display={{ base: 'none', md: 'flex' }}
        >
          {getCurrentProfileName()}
        </Button>
      ) : (
        <IconButton
          variant={'outline'}
          // size="sm"
          rounded="lg"
          aria-label="toggle dark mode"
          icon={<Icon fontSize="16" as={FiUser} />}
          onClick={handleProfileClick}
          cursor="pointer"
          display={{ base: 'none', md: 'flex' }}
        />
      )}
      <Button
        variant={'outline'}
        size="sm"
        leftIcon={<Icon fontSize="16" as={FiUser} />}
        rightIcon={<Icon fontSize="16" as={FiChevronDown} />}
        onClick={handleProfileClick}
        cursor="pointer"
        display={{ base: 'flex', md: 'none' }}
      >
        {getCurrentProfileName()}
      </Button>
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
                >{`My Profiles (${profilesData.length})`}</Text>
                <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                  {profilesData.map((profile, index) => (
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
                  router.push('/profile');
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
