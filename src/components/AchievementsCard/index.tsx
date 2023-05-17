import {
  Box,
  Flex,
  Heading,
  IconButton,
  Tooltip,
  Card,
  CardHeader,
  CardBody
} from '@chakra-ui/react';
import { FiInfo } from 'react-icons/fi';

export default function AchievementsCard() {
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
          <Box bgColor="primary.500" rounded="full" width={12} height={12} />
          <Box
            bgColor="primary.400"
            rounded="full"
            width={12}
            height={12}
            ml={-2}
          />
          <Box
            bgColor="primary.300"
            rounded="full"
            width={12}
            height={12}
            ml={-2}
          />
        </Flex>
      </CardBody>
    </Card>
  );
}
