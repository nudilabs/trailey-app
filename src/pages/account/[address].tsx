import BridgedCard from '@/components/BridgedCard';
import ChainSelector from '@/components/ChainSelector';
import TrendingCardSmall from '@/components/TrendingCardSmall';
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

// const MOCK_DATA = [
//   {
//     token: {
//       denom: 'ETH',
//       contract: '0x283j...293k',
//       icon: '/eth.png',
//       chain: {
//         name: 'Polygon',
//         icon: '/polygon.jpeg'
//       }
//     },
//     wallets: 2,
//     txns: 4,
//     price: 12000,
//     balance: 4.2,
//     value: 50400
//   }
// ];

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
          <Heading>alice.eth</Heading>
          <Flex direction="row" gap={2} alignItems="center" fontSize={12}>
            <Link href="https://etherscan.io/address/0x283j...293k">
              <Text>0x283j...293k</Text>
            </Link>
            <IconButton aria-label="Copy" icon={<FiCopy />} size="xs" />
          </Flex>
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
                  <BridgedCard txData={MOCK_BRIDGED_DATA} />
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
