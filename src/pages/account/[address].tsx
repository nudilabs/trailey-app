import BridgedCard from '@/components/BridgedCard';
import ChainSelector from '@/components/ChainSelector';
import TrendingCardSmall from '@/components/TrendingCardSmall';
import TxnsFrequency from '@/components/TxnsFrequency';
import TxnsOvertimeCard from '@/components/TxnsOvertimeCard';
import TxnsValueCard from '@/components/TxnsValueCard';
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Circle,
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
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

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
    address: '0x293j...293k',
    token: {
      symbol: 'ETH',
      amount: 0.1
    },
    value: 183
  }
];

const MOCK_OVERVIEW_DATA = [
  {
    address: '0x293j...293k',
    bridged: 20,
    txns: {
      smartContract: 5,
      general: 28,
      average: 5.5,
      value: 28.5283
    }
  },
  {
    address: '0x293j...293k',
    bridged: 20,
    txns: {
      smartContract: 5,
      general: 28,
      average: 5.5,
      value: 28.5283
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

const data02 = [
  {
    name: 'zkSync',
    value: 24
  },
  {
    name: 'Scroll',
    value: 45
  },
  {
    name: 'Linea',
    value: 13
  },
  {
    name: 'Sui',
    value: 98
  },
  {
    name: 'Sei',
    value: 39
  },
  {
    name: 'Base',
    value: 48
  }
];

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#AF19FF',
  '#FF0000'
];

export default function Account() {
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
        <Tabs w="100%" isLazy colorScheme="pink">
          <TabList>
            <Tab>Portfolio</Tab>
            <Tab>History</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                <GridItem colSpan={{ base: 12, lg: 12 }}>
                  <ChainSelector chainData={MOCK_CHAINS} />
                </GridItem>
                <GridItem colSpan={{ base: 12, lg: 8 }}>
                  <Flex direction="column" gap={4}>
                    <Card size={{ base: 'sm', md: 'md', lg: 'lg' }}>
                      <CardHeader>
                        <Flex direction="row" justifyContent="space-between">
                          <Heading fontSize={{ base: 'md', lg: 'xl' }}>
                            Most Active Chains
                          </Heading>
                        </Flex>
                      </CardHeader>
                      <CardBody>
                        <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                          <GridItem
                            colSpan={6}
                            alignContent="center"
                            justifyContent="center"
                          >
                            <ResponsiveContainer width="100%" height={200}>
                              <PieChart>
                                <Pie
                                  data={data02}
                                  dataKey="value"
                                  nameKey="name"
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={80}
                                  fill="#82ca9d"
                                >
                                  {data02.map((entry, index) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={COLORS[index % COLORS.length]}
                                    />
                                  ))}
                                </Pie>
                              </PieChart>
                            </ResponsiveContainer>
                          </GridItem>
                          <GridItem colSpan={6}>
                            <Flex
                              direction="column"
                              height="100%"
                              justifyContent="center"
                              p={4}
                            >
                              {data02.map((item, index) => (
                                <Flex
                                  direction="row"
                                  alignItems="center"
                                  key={index}
                                  gap={2}
                                >
                                  <Circle
                                    size={4}
                                    style={{
                                      backgroundColor:
                                        COLORS[index % COLORS.length]
                                    }}
                                  />
                                  <Text>{item.name}</Text>
                                </Flex>
                              ))}
                            </Flex>
                          </GridItem>
                        </Grid>
                      </CardBody>
                    </Card>
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
  return {
    props: {}
  };
};
