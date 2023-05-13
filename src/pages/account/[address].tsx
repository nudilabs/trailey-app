import BridgedCard from '@/components/BridgedCard';
import ChainSelector from '@/components/ChainSelector';
import TrendingCardSmall from '@/components/TrendingCardSmall';
import { isAddress } from 'viem';
import { normalize } from 'viem/ens';
import { publicClient } from '@/utils/client';

import {
  Box,
  Button,
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
  Text,
  useToast
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FiArrowRight, FiCopy, FiGrid } from 'react-icons/fi';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { getFormattedAddress } from '@/utils/format';
import TimeFilter from '@/components/TimeFilter';
import { trpc } from '@/connectors/Trpc';
import { useEffect, useState } from 'react';

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

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#AF19FF',
  '#FF0000'
];

const chains: { [key: string]: string } = {
  ethereum: 'eth-mainnet'
};

const times: { [key: string]: number } = {
  '24h': 1,
  '7d': 7,
  '30d': 30,
  all: 0
};

type Data = {
  date: string;
  txCount: number | undefined;
  contractCount: number | undefined;
};

export default function Account({
  address,
  ensName,
  avatarUrl
}: {
  address: string;
  ensName: string;
  avatarUrl: string | null;
}) {
  const toast = useToast();
  const [currentChain, setCurrentChain] = useState<string>('ethereum');
  const [currentTime, setCurrentTime] = useState<string>('7d');
  const router = useRouter();
  const { chain, time } = router.query;

  const txsSummaryQueries = trpc.txs.getSummaryByDay.useQuery({
    chainName: chains[currentChain],
    walletAddr: address,
    timeSpan: times[currentTime]
  });

  const txsSummaryByContract = trpc.txs.getSummaryByContract.useQuery({
    chainName: chains[currentChain],
    walletAddr: address,
    timeSpan: times[currentTime]
  });

  // console.log(txsSummaryQueries);

  useEffect(() => {
    if (chain) {
      setCurrentChain(chain as string);
    }
    if (time) {
      setCurrentTime(time as string);
    }
  }, [chain, time]);

  return (
    <Flex direction="column" paddingTop={4} gap={4}>
      <Flex direction="row" gap={4}>
        <Image
          src={avatarUrl ? avatarUrl : '/pfp.png'}
          alt={ensName}
          rounded={{ base: 'lg', md: 'xl' }}
          boxSize={'80px'}
        />
        <Flex direction="column">
          <Heading>{ensName}</Heading>
          <Flex direction="row" gap={2} alignItems="center" fontSize={12}>
            <Link href={`https://etherscan.io/address/${address}`}>
              <Text>{getFormattedAddress(address)}</Text>
            </Link>
            <IconButton
              aria-label="Copy"
              icon={<FiCopy />}
              size="xs"
              onClick={() => {
                navigator.clipboard.writeText(address);
                toast({
                  title: 'Copied address to clipboard',
                  status: 'info',
                  position: 'top-right',
                  duration: 2500,
                  isClosable: true
                });
              }}
            />
          </Flex>
        </Flex>
      </Flex>
      <Flex>
        <Tabs w="100%" isLazy colorScheme="primary">
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
                            Total Transactions
                          </Heading>
                          <TimeFilter />
                        </Flex>
                      </CardHeader>
                      <CardBody>
                        <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                          <GridItem
                            colSpan={12}
                            alignContent="center"
                            justifyContent="center"
                          >
                            <ResponsiveContainer width="100%" height={200}>
                              <ComposedChart
                                width={730}
                                height={250}
                                data={txsSummaryQueries.data?.txsByDay}
                              >
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <CartesianGrid stroke="#f5f5f5" />
                                <Area
                                  type="monotone"
                                  dataKey="txCount"
                                  fill="#8884d8"
                                  stroke="#8884d8"
                                />
                                {/* <Bar
                                  dataKey="contractCount"
                                  barSize={20}
                                  fill="#413ea0"
                                /> */}
                                <Line
                                  type="monotone"
                                  dataKey="contractCount"
                                  stroke="#ff7300"
                                />
                              </ComposedChart>
                            </ResponsiveContainer>
                          </GridItem>
                        </Grid>
                      </CardBody>
                    </Card>
                  </Flex>
                </GridItem>
                <GridItem colSpan={{ base: 12, lg: 4 }}>
                  <Flex direction="column" gap={4}>
                    <Card size={{ base: 'sm', md: 'md', lg: 'lg' }}>
                      <CardHeader>
                        <Flex direction="row" justifyContent="space-between">
                          <Heading fontSize={{ base: 'md', lg: 'xl' }}>
                            Protocols Used
                          </Heading>
                          <TimeFilter />
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
                                  data={
                                    txsSummaryByContract.data?.txsByContract
                                  }
                                  dataKey="txCount"
                                  nameKey="contract"
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={60}
                                  fill=""
                                  label
                                >
                                  {txsSummaryByContract.data?.txsByContract.map(
                                    (entry, index) =>
                                      // Check if index is less than or equal to 8
                                      index <= 8 && (
                                        <Cell
                                          key={`cell-${index}`}
                                          fill={
                                            index < 8
                                              ? COLORS[index % COLORS.length]
                                              : '#BBBBBB'
                                          }
                                        />
                                      )
                                  )}
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
                              {txsSummaryByContract.data?.txsByContract.map(
                                (item, index) =>
                                  index < 8 && (
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
                                      <Button
                                        as="a"
                                        variant="link"
                                        href={`https://etherscan.io/address/${item.contract}`}
                                        target="_blank"
                                      >
                                        <Text>
                                          {getFormattedAddress(item.contract)}
                                        </Text>
                                      </Button>
                                    </Flex>
                                  )
                              )}
                            </Flex>
                          </GridItem>
                        </Grid>
                      </CardBody>
                    </Card>
                  </Flex>
                </GridItem>
                <GridItem colSpan={{ base: 12, lg: 8 }}>
                  <Flex direction="column" gap={4}>
                    <Card size={{ base: 'sm', md: 'md', lg: 'lg' }}>
                      <CardHeader>
                        <Flex direction="row" justifyContent="space-between">
                          <Heading fontSize={{ base: 'md', lg: 'xl' }}>
                            Total Transaction Value
                          </Heading>
                          <TimeFilter />
                        </Flex>
                      </CardHeader>
                      <CardBody>
                        <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                          <GridItem
                            colSpan={12}
                            alignContent="center"
                            justifyContent="center"
                          >
                            <ResponsiveContainer width="100%" minHeight={200}>
                              <BarChart
                                width={730}
                                height={250}
                                data={txsSummaryQueries.data?.txsByDay}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="txValueSum" fill="#8884d8" />
                              </BarChart>
                            </ResponsiveContainer>
                          </GridItem>
                        </Grid>
                      </CardBody>
                    </Card>
                  </Flex>
                </GridItem>
                <GridItem colSpan={{ base: 12, lg: 4 }}>
                  <Flex direction="column" gap={4}>
                    <Card size={{ base: 'sm', md: 'md', lg: 'lg' }}>
                      <CardHeader>
                        <Flex direction="row" justifyContent="space-between">
                          <Heading fontSize={{ base: 'md', lg: 'xl' }}>
                            Bridges used
                          </Heading>
                          <TimeFilter />
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
                                  data={
                                    txsSummaryByContract.data?.txsByContract
                                  }
                                  dataKey="txCount"
                                  nameKey="contract"
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={60}
                                  fill=""
                                  label
                                >
                                  {txsSummaryByContract.data?.txsByContract.map(
                                    (entry: any, index: number) => (
                                      // Check if index is less than or equal to 8
                                      <Cell
                                        key={`cell-${index}`}
                                        fill={
                                          index < 8
                                            ? COLORS[index % COLORS.length]
                                            : '#BBBBBB'
                                        }
                                      />
                                    )
                                  )}
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
                              {txsSummaryByContract.data?.txsByContract.map(
                                (item, index) =>
                                  // Check if index is less than 8
                                  index < 8 && (
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
                                      <Button
                                        as="a"
                                        variant="link"
                                        href={`https://etherscan.io/address/${item.contract}`}
                                        target="_blank"
                                      >
                                        <Text>
                                          {getFormattedAddress(item.contract)}
                                        </Text>
                                      </Button>
                                    </Flex>
                                  )
                              )}
                            </Flex>
                          </GridItem>
                        </Grid>
                      </CardBody>
                    </Card>
                  </Flex>
                </GridItem>
                <GridItem colSpan={{ base: 12, lg: 8 }}>
                  <Flex direction="column" gap={4}>
                    <Card size={{ base: 'sm', md: 'md', lg: 'lg' }}>
                      <CardHeader>
                        <Flex direction="row" justifyContent="space-between">
                          <Heading fontSize={{ base: 'md', lg: 'xl' }}>
                            Total Fees Paid
                          </Heading>
                          <TimeFilter />
                        </Flex>
                      </CardHeader>
                      <CardBody>
                        <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                          <GridItem
                            colSpan={12}
                            alignContent="center"
                            justifyContent="center"
                          >
                            <ResponsiveContainer width="100%" minHeight={200}>
                              <BarChart
                                width={730}
                                height={250}
                                data={txsSummaryQueries.data?.txsByDay}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="feesPaidSum" fill="#8884d8" />
                              </BarChart>
                            </ResponsiveContainer>
                          </GridItem>
                        </Grid>
                      </CardBody>
                    </Card>
                  </Flex>
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

const getAddressType = (address: string): string | null => {
  if (isAddress(address)) {
    return 'address';
  } else if (address.endsWith('.eth')) {
    return 'ens';
  } else {
    return null;
  }
};

const fetchAddressProps = async (address: string) => {
  const ensName = await publicClient.getEnsName({
    address: `0x${address.slice(2)}`
  });

  const avatarUrlPromise = async () => {
    if (ensName) {
      return publicClient.getEnsAvatar({
        name: normalize(ensName)
      });
    }
    return null;
  };

  const [avatarUrl] = await Promise.all([avatarUrlPromise()]);

  return {
    ensName: ensName ? ensName : 'Unidentified',
    address,
    avatarUrl
  };
};

const fetchEnsProps = async (ensName: string) => {
  const addressPromise = publicClient.getEnsAddress({
    name: normalize(ensName)
  });

  const avatarUrlPromise = publicClient.getEnsAvatar({
    name: normalize(ensName)
  });

  const [address, avatarUrl] = await Promise.all([
    addressPromise,
    avatarUrlPromise
  ]);

  if (!address) {
    throw new Error('No address found for ENS name');
  }

  return {
    ensName,
    address,
    avatarUrl
  };
};

export const getServerSideProps = async (context: {
  query: { chain: string };
  params: { address: string };
  res: { setHeader: (arg0: string, arg1: string) => void };
}) => {
  const { res } = context;
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  );
  const p = context.params;
  const addressType = getAddressType(p.address);

  if (!addressType) {
    return {
      notFound: true
    };
  }

  try {
    if (addressType === 'address') {
      const props = await fetchAddressProps(p.address);
      return { props };
    } else if (addressType === 'ens') {
      const props = await fetchEnsProps(p.address);
      return { props };
    }
  } catch (error) {
    console.error(error);
    return {
      notFound: true
    };
  }
};
