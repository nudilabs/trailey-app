import BridgedCard from '@/components/BridgedCard';
import ChainSelector from '@/components/ChainSelector';
import TrendingCardSmall from '@/components/TrendingCardSmall';
import { isAddress } from 'viem';
import { normalize } from 'viem/ens';
import { publicClient } from '@/utils/client';

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
  Text,
  useToast
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FiArrowRight, FiCopy, FiGrid } from 'react-icons/fi';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { getFormattedAddress } from '@/utils/format';

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
