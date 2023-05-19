import { isAddress } from 'viem';
import { normalize } from 'viem/ens';
import { publicClient } from '@/utils/client';

import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import { useRouter } from 'next/router';

import { trpc } from '@/connectors/Trpc';
import { useEffect, useState } from 'react';

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Legend,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

import { get } from '@vercel/edge-config';
import { Chain } from '@/types/Chains';
import ProfileCard from '@/components/ProfileCard';
import { IAccount } from '@/types/Account';
import AchievementsCard from '@/components/AchievementsCard';
import TopProtocolsUsageCard from '@/components/TopProtocolsUsageCard';
import AddToBundleBtn from '@/components/AddToBundleButton';
import { IProfile } from '@/types/IProfile';
import {
  TxSummary,
  TxSummaryByContract,
  TxSummaryByMonth
} from '@/types/TxSummary';
import Head from 'next/head';
import ActivityIndexCard from '@/components/ActivityIndexCard';
import { formatPrettyNumber } from '@/utils/format';

export default function Account({
  account,
  chainConfigs,
  setProfilesData,
  profilesData,
  currentProfile
}: {
  account: IAccount;
  chainConfigs: Chain[];
  setProfilesData: (newProfilesData: IProfile[]) => void;
  profilesData: IProfile[];
  currentProfile: number;
}) {
  const toast = useToast();
  const [currentChain, setCurrentChain] = useState<Chain>(chainConfigs[0]);
  const [currentTime, setCurrentTime] = useState<string>('7d');
  const router = useRouter();
  const { chain, time } = router.query;
  const subHeadingColor = useColorModeValue(
    'RGBA(0, 0, 0, 0.36)',
    'RGBA(255, 255, 255, 0.36)'
  );

  // resync wallet
  const { mutate } = trpc.txs.syncWalletTxs.useMutation();
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const data = mutate({
      chainName: currentChain.name,
      walletAddr: account.address
    });
  };

  const txSummary: TxSummary | undefined = trpc.txs.getSummary.useQuery({
    chainName: currentChain.name,
    walletAddr: account.address
  }).data;

  const txsSummaryByContract: TxSummaryByContract | undefined =
    trpc.txs.getSummaryByContract.useQuery({
      chainName: currentChain.name,
      walletAddr: account.address
    }).data;

  const txsSummaryByMonth: TxSummaryByMonth | undefined =
    trpc.txs.getSummaryByMonth.useQuery({
      chainName: currentChain.name,
      walletAddr: account.address
    }).data;

  const getLastThreeMonths = () => {
    const lastThreeMonths = [];
    for (let i = 0; i < 6; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);

      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      const formattedMonth = month < 10 ? String(month) : month;
      const formattedDate = `${formattedMonth}/${year}`;
      lastThreeMonths.push({ date: formattedDate });
    }
    return lastThreeMonths;
  };

  const byMonthData = getLastThreeMonths()
    .map(month => {
      const monthData = txsSummaryByMonth?.txsByMonth?.find(
        m => m.date === month.date
      );
      return {
        date: month.date,
        txCount: monthData?.txCount ?? 0,
        contractCount: monthData?.contractCount ?? 0,
        valueQuoteSum: monthData?.valueQuoteSum ?? 0,
        gasQuoteSum: monthData?.gasQuoteSum ?? 0
      };
    })
    .reverse();

  const maxTxCount = Math.max(...byMonthData.map(d => d.txCount));
  const maxvalueQuoteSum = Math.max(...byMonthData.map(d => d.valueQuoteSum));

  const colors = {
    green: ['#9AE6B4', '#68D391', '#48BB78'],
    red: ['#FEB2B2', '#FC8181', '#F56565']
  };

  const getGraphColor = (start: number, end: number, index: number) => {
    const color = start < end ? colors.green : colors.red;
    return color[index];
  };

  useEffect(() => {
    if (chain) {
      const currentChain = chainConfigs.find(c => c.name === chain);
      setCurrentChain(currentChain ?? chainConfigs[0]);
    }
    if (time) {
      setCurrentTime(time as string);
    }
  }, [chain, time]);

  return (
    <Flex direction="column">
      <Head>
        <title>
          {account.ensName == 'Unidentified'
            ? account.address
            : account.ensName}
        </title>
      </Head>
      <Grid templateColumns="repeat(12, 1fr)" gap={4}>
        <GridItem colSpan={{ base: 12, lg: 6, xl: 4 }}>
          <Flex
            direction="column"
            gap={4}
            // justifyContent={{ base: 'normal', xl: 'space-between' }}
            // h="100%"
          >
            <ProfileCard
              account={account}
              chainConfigs={chainConfigs}
              txSummary={txSummary}
              handleSubmit={handleSubmit}
            />
            <AddToBundleBtn
              account={account}
              currentProfile={currentProfile}
              profilesData={profilesData}
              setProfilesData={setProfilesData}
            />
            <Box>
              <AchievementsCard />
            </Box>
          </Flex>
        </GridItem>
        <GridItem colSpan={{ base: 12, lg: 6, xl: 8 }}>
          <Grid templateColumns="repeat(12, 1fr)" gap={4}>
            <GridItem colSpan={{ base: 12, md: 6, lg: 12, xl: 6 }}>
              <Flex direction="column" gap={4}>
                <ActivityIndexCard txSummary={txSummary} />
              </Flex>
            </GridItem>
            <GridItem colSpan={{ base: 12, lg: 6 }}>
              <TopProtocolsUsageCard
                txsSummaryByContract={txsSummaryByContract}
                currentChain={currentChain}
                account={account}
              />
            </GridItem>
            <GridItem colSpan={{ base: 12 }}>
              <Flex direction="column" gap={4}>
                <Card>
                  <CardHeader>
                    <Flex
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Heading size="md">Transactions</Heading>
                      <Flex direction="row" alignItems="center" gap={2}>
                        <Text fontSize="sm" color={subHeadingColor}>
                          Last 6 months
                        </Text>
                      </Flex>
                    </Flex>
                  </CardHeader>
                  <CardBody>
                    {/* <ResponsiveContainer width="100%" height={160}>
                      <BarChart data={byMonthData}>
                        <XAxis dataKey="date" stroke={subHeadingColor} />
                        <YAxis domain={[0, maxTxCount]} hide />
                        <Tooltip
                          formatter={value => {
                            return [
                              formatPrettyNumber(value as number, 0),
                              'Transactions'
                            ];
                          }}
                        />
                        <Legend
                          formatter={() => {
                            return 'Transactions';
                          }}
                          iconType="circle"
                        />
                        <Bar
                          maxBarSize={20}
                          dataKey="txCount"
                          fill={colors.txCount[2]}
                          shape={<Rectangle radius={[10, 10, 0, 0]} />}
                        >
                          {byMonthData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={colors.txCount[index % 3]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer> */}
                    <ResponsiveContainer width="100%" height={160}>
                      <AreaChart data={byMonthData}>
                        <defs>
                          <linearGradient
                            id="colorUv"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor={getGraphColor(
                                byMonthData[0].txCount,
                                byMonthData[5].txCount,
                                0
                              )}
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor={getGraphColor(
                                byMonthData[0].txCount,
                                byMonthData[5].txCount,
                                1
                              )}
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" hide />
                        <YAxis
                          domain={[0, maxTxCount]}
                          tickFormatter={value => {
                            return formatPrettyNumber(value as number, 0);
                          }}
                        />

                        <Tooltip
                          formatter={value => {
                            return [
                              formatPrettyNumber(value as number, 0),
                              'Transactions'
                            ];
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="txCount"
                          stroke={getGraphColor(
                            byMonthData[0].txCount,
                            byMonthData[5].txCount,
                            2
                          )}
                          fillOpacity={1}
                          fill="url(#colorUv)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader>
                    <Flex
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Heading size="md">Transaction Value</Heading>
                      <Flex direction="row" alignItems="center" gap={2}>
                        <Text fontSize="sm" color={subHeadingColor}>
                          Last 6 months
                        </Text>
                      </Flex>
                    </Flex>
                  </CardHeader>
                  <CardBody>
                    {/* <ResponsiveContainer width="100%" height={160}>
                      <BarChart width={730} height={250} data={byMonthData}>
                        <XAxis dataKey="date" stroke={subHeadingColor} />
                        <YAxis domain={[0, maxvalueQuoteSum]} hide />
                        <Tooltip
                          formatter={value => {
                            return [
                              formatPrettyNumber(value as number, 0),
                              'Tx Value'
                            ];
                          }}
                        />

                        <Legend
                          formatter={() => {
                            return 'Transactions Value';
                          }}
                          iconType="circle"
                        />
                        <Bar
                          maxBarSize={20}
                          dataKey="valueQuoteSum"
                          fill={getGraphColor(
                            byMonthData[0].valueQuoteSum,
                            byMonthData[5].valueQuoteSum,
                            2
                          )}
                          shape={<Rectangle radius={[10, 10, 0, 0]} />}
                        >
                          {byMonthData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={getGraphColor(
                                byMonthData[0].valueQuoteSum,
                                byMonthData[5].valueQuoteSum,
                                2
                              )}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer> */}
                    <ResponsiveContainer width="100%" height={160}>
                      <AreaChart data={byMonthData}>
                        <defs>
                          <linearGradient
                            id="colorUv"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor={getGraphColor(
                                byMonthData[0].valueQuoteSum,
                                byMonthData[5].valueQuoteSum,
                                0
                              )}
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor={getGraphColor(
                                byMonthData[0].valueQuoteSum,
                                byMonthData[5].valueQuoteSum,
                                1
                              )}
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" hide />
                        <YAxis
                          domain={[0, maxvalueQuoteSum]}
                          tickFormatter={value => {
                            return formatPrettyNumber(value as number, 0);
                          }}
                        />

                        <Tooltip
                          formatter={value => {
                            return [
                              formatPrettyNumber(value as number, 0),
                              'Transaction Value'
                            ];
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="valueQuoteSum"
                          stroke={getGraphColor(
                            byMonthData[0].valueQuoteSum,
                            byMonthData[5].valueQuoteSum,
                            2
                          )}
                          fillOpacity={1}
                          fill="url(#colorUv)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardBody>
                </Card>
              </Flex>
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>
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
    ensName: ensName ?? 'Unidentified',
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
  const chainConfigs = await get('chains');
  // const chainConfigs = testChainConfigs;

  if (!addressType) {
    return {
      notFound: true
    };
  }

  try {
    if (addressType === 'address') {
      const account = await fetchAddressProps(p.address);
      return { props: { chainConfigs, account } };
    } else if (addressType === 'ens') {
      const account = await fetchEnsProps(p.address);
      return { props: { chainConfigs, account } };
    }
  } catch (error) {
    console.error(error);
    return {
      notFound: true
    };
  }
};

const testChainConfigs = [
  {
    name: 'eth-mainnet',
    chain_id: '1',
    is_testnet: false,
    label: 'Ethereum Mainnet',
    category_label: 'Ethereum',
    logo_url: '/eth.png',
    black_logo_url: '/eth.png',
    white_logo_url: '/eth.png',
    is_appchain: false,
    appchain_of: null,
    protocols: [
      {
        address: '0xef1c6e67703c7bd7107eed8303fbe6ec2554bf6b',
        label: 'Uniswap',
        logo_url: '/protocols/uniswap.png'
      },
      {
        address: '0x6982508145454ce325ddbe47a25d4ec3d2311933',
        label: 'Pepe',
        logo_url: '/protocols/uniswap.png'
      },
      {
        address: '0x000000000000Ad05Ccc4F10045630fb830B95127',
        label: 'Blur',
        logo_url: '/protocols/uniswap.png'
      }
    ]
  },
  {
    name: 'eth-goerli',
    chain_id: '5',
    is_testnet: true,
    label: 'Ethereum Goerli Testnet',
    category_label: 'Ethereum',
    logo_url: '/eth.png',
    black_logo_url: '/eth.png',
    white_logo_url: '/eth.png',
    is_appchain: false,
    appchain_of: null,
    protocols: []
  }
];
