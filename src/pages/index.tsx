import BridgedCard from '@/components/BridgedCard';
import ChainSelector from '@/components/ChainSelector';
import TrendingCardSmall from '@/components/TrendingCardSmall';
import TxnsFrequency from '@/components/TxnsFrequency';
import TxnsOvertimeCard from '@/components/TxnsOvertimeCard';
import TxnsCard from '@/components/TxnsOvertimeCard';
import TxnsValueCard from '@/components/TxnsValueCard';
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

const MOCK_BRIDGED_DATA = [
  {
    address: '0x293j...293k',
    token: {
      symbol: 'ETH',
      amount: 0.1
    },
    value: 183
  },
  {
    address: '0x2ks0...192j',
    token: {
      symbol: 'ETH',
      amount: 0.1
    },
    value: 183
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

export default function Home({ query }: { query: { chain: string } }) {
  return (
    <Flex direction="column" paddingTop={4} gap={4}>
      <Flex direction="row" gap={4}>
        <Image
          src="/pfp.png"
          alt="0x0asdaoisjdklas"
          rounded={{ base: 'lg', md: 'xl' }}
          boxSize={'80px'}
        />
        <Flex direction="column">
          <Heading>Profile 1</Heading>
          <Text>{MOCK_BRIDGED_DATA.length} Wallets</Text>
        </Flex>
      </Flex>
      <Flex>
        <Tabs w="100%" isLazy>
          <TabList>
            <Tab>Portfolio</Tab>
            <Tab>History</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                <GridItem colSpan={{ base: 12, lg: 12 }}>
                  <ChainSelector
                    chainData={MOCK_CHAINS}
                    activeChain={query.chain}
                  />
                </GridItem>
                <GridItem colSpan={{ base: 12, lg: 8 }}>
                  <Flex direction="column" gap={4}>
                    <BridgedCard txData={MOCK_BRIDGED_DATA} />
                    <TxnsOvertimeCard txData={MOCK_TXNS_OVERTIME_DATA} />
                    <TxnsFrequency txData={MOCK_TXNS_FREQUENCY_DATA} />
                    <TxnsValueCard txData={MOCK_TXNS_VALUE_DATA} />
                  </Flex>
                </GridItem>
                <GridItem colSpan={{ base: 12, lg: 4 }}>
                  <TrendingCardSmall chainData={MOCK_CHAINS} />
                </GridItem>
              </Grid>
            </TabPanel>
            <TabPanel>
              <p>two!</p>
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
  const { query } = context;
  return {
    props: {
      query
    }
  };
};
