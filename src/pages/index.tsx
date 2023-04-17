import BridgedCard from '@/components/BridgedCard';
import ChainSelector from '@/components/ChainSelector';
import OverviewCard from '@/components/OverviewCard';
import TrendingCardSmall from '@/components/TrendingCardSmall';
import TxnsFrequency from '@/components/TxnsFrequency';
import TxnsOvertimeCard from '@/components/TxnsOvertimeCard';
import TxnsCard from '@/components/TxnsOvertimeCard';
import TxnsValueCard from '@/components/TxnsValueCard';
import { IProfile } from '@/types/IProfile';
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Image,
  Link,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FiArrowRight, FiCopy, FiGrid } from 'react-icons/fi';

const MOCK_OVERVIEW_DATA = [
  {
    address: '0x293j...293k',
    bridged: { value: 20, goal: 25 },
    txns: {
      smartContract: { value: 5, goal: 10 },
      general: { value: 28, goal: 35 },
      average: { value: 5.5, goal: 10 },
      value: { value: 28.5283, goal: 40 }
    }
  },
  {
    address: '0x293j...293s',
    bridged: { value: 20, goal: 25 },
    txns: {
      smartContract: { value: 5, goal: 10 },
      general: { value: 28, goal: 35 },
      average: { value: 5.5, goal: 10 },
      value: { value: 28.5283, goal: 40 }
    }
  }
];

const MOCK_TXNS_FREQUENCY_DATA = [
  {
    address: '0x293j...293k',
    txns: {
      smartContract: 5,
      general: 28
    }
  },
  {
    address: '0x293j...293k',
    txns: {
      smartContract: 5,
      general: 28
    }
  }
];

const MOCK_TXNS_VALUE_DATA = [
  {
    address: '0x293j...293k',
    txns: {
      symbol: 'ETH',
      amount: 28.5283
    }
  },
  {
    address: '0x293j...293k',
    txns: {
      symbol: 'ETH',
      amount: 8.5283
    }
  }
];

const MOCK_TXNS_OVERTIME_DATA = [
  {
    address: '0x293j...293k',
    txns: {
      total: 33,
      average: 5.5
    },
    duration: 6
  },
  {
    address: '0x293j...293k',
    txns: {
      total: 33,
      average: 5.5
    },
    duration: 6
  }
];

const MOCK_CHAINS = [
  {
    name: 'Ethereum',
    icon: '/eth.png'
  },
  {
    name: 'Polygon',
    icon: '/polygon.jpeg'
  }
];

export default function Home({
  currentProfile,
  profilesData
}: {
  currentProfile: number;
  profilesData: IProfile[];
}) {
  return (
    <Flex direction="column" paddingTop={4} gap={4}>
      <Flex direction="row" gap={4}>
        <Image
          src="/pfp.png"
          alt="0x0asdaoisjdklas"
          rounded={{ base: 'lg', md: 'xl' }}
          boxSize={'80px'}
        />
        {profilesData[currentProfile] && (
          <Flex direction="column">
            <Heading>{profilesData[currentProfile].name}</Heading>
            <Text>{profilesData[currentProfile].wallets.length} Wallets</Text>
          </Flex>
        )}
      </Flex>
      <Flex>
        <Tabs w="100%" isLazy colorScheme="primary">
          <TabList>
            <Tab>Portfolio</Tab>
            {/* <Tab>History</Tab> */}
          </TabList>

          <TabPanels>
            <TabPanel>
              <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                <GridItem colSpan={{ base: 12, lg: 12 }}>
                  <ChainSelector chainData={MOCK_CHAINS} />
                </GridItem>
                <GridItem colSpan={{ base: 12, md: 9 }}>
                  <Flex direction="column" gap={4}>
                    <OverviewCard txData={MOCK_OVERVIEW_DATA} />
                  </Flex>
                </GridItem>
                <GridItem colSpan={{ base: 12, lg: 3 }}>
                  <TrendingCardSmall chainData={MOCK_CHAINS} />
                </GridItem>
              </Grid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
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
