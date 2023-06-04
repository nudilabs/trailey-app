import { Achievement } from '@/types/Chains';
import {
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
  Text,
  Skeleton
} from '@chakra-ui/react';
import { FiInfo } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { TxSummary } from '@/types/TxSummary';

type AchievementsCardProps = {
  achievements?: Achievement[];
  txSummary?: TxSummary;
};

export default function AchievementsCard({
  achievements,
  txSummary
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
  // Get the transaction summary value based on the condition type
  const getTxSummaryValue = (conditionType: string, txSummary?: TxSummary) => {
    if (!txSummary) return 0;
    switch (conditionType) {
      case 'txCount':
        return txSummary.txCount.allTime;
      case 'contractCount':
        return txSummary.contractCount.allTime;
      case 'valueQuoteSum':
        return txSummary.valueQuoteSum.allTime;
      case 'gasQuoteSum':
        return txSummary.gasQuoteSum.allTime;
      default:
        return 0;
    }
  };

  // Filter the achievements based on transaction summary values
  const filteredAchievements = achievements?.filter(achievement =>
    achievement.conditions.every(condition => {
      const txSummaryValue = getTxSummaryValue(condition.type, txSummary);
      return txSummaryValue >= condition.value;
    })
  );

  return (
    <Card size="lg">
      <CardHeader paddingBottom={0}>
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
      <CardBody paddingTop={4} paddingBottom={6}>
        {txSummary ? (
          <Flex direction="row" overflowX="scroll" paddingTop={2} pl={2}>
            {filteredAchievements && filteredAchievements.length > 0 ? (
              filteredAchievements.map((achievement, index) => (
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
              ))
            ) : (
              <Text>No achievements found</Text>
            )}
          </Flex>
        ) : (
          <Skeleton height="64px" />
        )}
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
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
}
