import BridgedCard from '@/components/BridgedCard';
import ChainSelector from '@/components/ChainSelector';
import OverviewCard from '@/components/OverviewCard';
import TrendingCardSmall from '@/components/TrendingCardSmall';
import TxnsFrequency from '@/components/TxnsFrequency';
import TxnsOvertimeCard from '@/components/TxnsOvertimeCard';
import TxnsCard from '@/components/TxnsOvertimeCard';
import TxnsValueCard from '@/components/TxnsValueCard';
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
  TagLeftIcon
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  FiArrowRight,
  FiCopy,
  FiDroplet,
  FiGrid,
  FiPlus,
  FiPlusCircle,
  FiSettings,
  FiStopCircle,
  FiX
} from 'react-icons/fi';

const MOCK_GOALS_DATA = [
  {
    title: 'Bridged',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    value: '0.1'
  },
  {
    title: 'AVG TXNS / MONTH',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    value: '0.1'
  },
  {
    title: 'CONTRACT INTERACT.',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    value: '0.1'
  },
  {
    title: 'VALUE',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    value: '0.1'
  }
];

export default function Settings() {
  return (
    <Flex direction="column" gap={4} alignItems="center">
      <Card width={{ base: '100%', md: '70%' }}>
        <CardHeader>
          <Heading fontSize={{ base: 'md', lg: 'xl' }}>
            Goals & Milestones
          </Heading>
        </CardHeader>
        <CardBody>
          {MOCK_GOALS_DATA.map((goal, index) => (
            <Flex
              direction="row"
              gap={4}
              alignItems="center"
              justifyContent="space-between"
              key={index}
              py={2}
            >
              <Flex direction="column">
                <Heading fontSize={{ base: 'md' }}>{goal.title}</Heading>
                <Text fontSize="sm">{goal.description}</Text>
              </Flex>
              <Input size="sm" width="100px" placeholder={goal.value} />
            </Flex>
          ))}
        </CardBody>
        <CardFooter>
          <Button size="sm">Save</Button>
        </CardFooter>
      </Card>
      <Card width={{ base: '100%', md: '70%' }}>
        <CardBody>
          <Flex
            direction="row"
            gap={4}
            alignItems="center"
            justifyContent="space-between"
            py={2}
          >
            <Flex direction="column">
              <Heading fontSize={{ base: 'md' }}>Logout</Heading>
              <Text fontSize="sm">Logout of Biway</Text>
            </Flex>
            <Button size="sm" colorScheme="red">
              Logout
            </Button>
          </Flex>
        </CardBody>
      </Card>
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
