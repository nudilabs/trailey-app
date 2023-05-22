import { Achievement } from '@/types/Chains';
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Tooltip,
  Card,
  CardHeader,
  CardBody,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  useColorModeValue
} from '@chakra-ui/react';
import { FiInfo } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useState } from 'react';

type AchievementsCardProps = {
  achievements?: Achievement[];
};

export default function AchievementsCard({
  achievements
}: AchievementsCardProps) {
  const [selectedAchievement, setSelectedAchievement] =
    useState<Achievement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAchievementClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const theRestColor = useColorModeValue('gray.300', 'gray.700');
  const maxShown = 7;

  return (
    <Card size="lg">
      <CardHeader>
        <Flex direction="row" justifyContent="space-between">
          <Heading size="md">Achievements</Heading>
          <Tooltip label="More Info" hasArrow>
            <IconButton
              aria-label="Previous"
              icon={<FiInfo />}
              variant="link"
            />
          </Tooltip>
        </Flex>
      </CardHeader>
      <CardBody>
        <Flex direction="row">
          {achievements &&
            achievements.slice(0, maxShown).map((achievement, index) => (
              <motion.div
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.9 }}
                key={index}
              >
                <Tooltip label={achievement.name} hasArrow placement="top">
                  <Flex
                    boxSize="64px"
                    mr={-6}
                    onClick={() => handleAchievementClick(achievement)}
                    cursor="pointer"
                  >
                    <Image
                      src={achievement.image_url}
                      alt={achievement.name}
                      objectFit="cover"
                    />
                  </Flex>
                </Tooltip>
              </motion.div>
            ))}

          {achievements && achievements.length > maxShown && (
            <Flex
              boxSize="64px"
              mr={-6}
              justifyContent="center"
              alignItems="center"
              borderRadius="full"
              bgColor={theRestColor}
              cursor="pointer"
              onClick={() => handleAchievementClick(achievements[5])}
            >
              <Text>+{achievements.length - maxShown}</Text>
            </Flex>
          )}
        </Flex>
      </CardBody>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedAchievement?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="row" gap={4}>
              <Image
                src={selectedAchievement?.image_url}
                alt={selectedAchievement?.name}
                objectFit="cover"
                maxHeight="64px"
              />
              <Text>{selectedAchievement?.description}</Text>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Text
              fontSize="xs"
              color={useColorModeValue('blackAlpha.500', 'whiteAlpha.500')}
            >
              1% of users have this achievement
            </Text>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
}
