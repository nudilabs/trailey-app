import { Address, getAddress, isAddress } from 'viem';
import { normalize } from 'viem/ens';
import { customPublicClient, publicClient } from '@/utils/client';

import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Skeleton,
  Stat,
  StatHelpText,
  StatNumber,
  Text,
  useColorModeValue,
  chakra,
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
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

import { get } from '@vercel/edge-config';
import { Chain } from '@/types/Chains';
import ProfileCard from '@/components/ProfileCard';
import { IAccount } from '@/types/IAccount';
import AchievementsCard from '@/components/AchievementsCard';
import TopProtocolsUsageCard from '@/components/TopProtocolsUsageCard';
import AddToBundleBtn from '@/components/AddToBundleButton';
import { IBundle } from '@/types/IBundle';
import {
  TxSummary,
  TxSummaryByContract,
  TxSummaryByMonth
} from '@/types/TxSummary';
import Head from 'next/head';
import ActivityIndexCard from '@/components/ActivityIndexCard';
import { formatPrettyNumber } from '@/utils/format';
import { fetchBalance } from '@wagmi/core';
import { CHAINS } from '@/configs/chains';
import { LastResync } from '@/types/LastResync';
import { env } from '@/env.mjs';

export default function Account({
  account_,
  chainConfigs,
  setBundlesData,
  bundlesData,
  currentBundle,
  localChain,
  setLocalChain
}: {
  account_: IAccount;
  chainConfigs: Chain[];
  setBundlesData: (newProfilesData: IBundle[]) => void;
  bundlesData: IBundle[];
  currentBundle: number;
  localChain: string;
  setLocalChain: (chain: string) => void;
}) {
  const [currentChain, setCurrentChain] = useState<Chain>(chainConfigs[0]);
  const [lastResynced, setLastResynced] = useState<LastResync>();
  const [validateData, setValidateData] = useState<boolean>(false);
  const [account, setAccount] = useState<IAccount>(account_);
  const toast = useToast();

  const [balance, setBalance] = useState<{
    formatted: string;
    symbol: string;
  }>();
  const router = useRouter();
  const { chain } = router.query;

  const subHeadingColor = useColorModeValue(
    'RGBA(0, 0, 0, 0.5)',
    'RGBA(255, 255, 255, 0.5)'
  );

  // resync wallet
  const { mutate } = trpc.txs.syncWalletTxs.useMutation();
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const nonce = await customPublicClient(localChain).getTransactionCount({
      address: account.address
    });
    if (nonce > Number(env.NEXT_PUBLIC_TX_LIMIT)) {
      toast({
        title: 'Error',
        description: `We do not support addresses with more than ${formatPrettyNumber(
          env.NEXT_PUBLIC_TX_LIMIT,
          0
        )} transactions during beta`,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });

      return;
    }
    setValidateData(true);
    mutate({
      chainName: localChain,
      walletAddr: account.address
    });
    // set 1 minute timer to stop validating data
    setTimeout(() => {
      setValidateData(false);
    }, 60000);
  };

  const txSummary = trpc.txs.getSummary.useQuery(
    {
      chainName: currentChain.name,
      walletAddr: account.address
    },
    {
      refetchInterval: validateData ? env.NEXT_PUBLIC_REVALIDATE_TIME : 0
    }
  );

  const txsSummaryByContract: TxSummaryByContract | undefined =
    trpc.txs.getSummaryByContract.useQuery(
      {
        chainName: currentChain.name,
        walletAddr: account.address
      },
      {
        refetchInterval: validateData ? env.NEXT_PUBLIC_REVALIDATE_TIME : 0
      }
    ).data;

  const txsSummaryByMonth: TxSummaryByMonth | undefined =
    trpc.txs.getSummaryByMonth.useQuery(
      {
        chainName: currentChain.name,
        walletAddr: account.address
      },
      {
        refetchInterval: validateData ? env.NEXT_PUBLIC_REVALIDATE_TIME : 0
      }
    ).data;

  const getLastSixMonths = () => {
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

  const byMonthData = getLastSixMonths()
    .map(month => {
      const monthData = txsSummaryByMonth?.txsByMonth?.find(
        m => m.date === month.date
      );
      return {
        date: month.date,
        txCount: monthData?.txCount ?? 0,
        contractCount: monthData?.contractCount ?? 0,
        valueQuoteSum:
          Number(monthData?.valueQuoteSum ?? 0) +
          Number(monthData?.erc20ValueQuoteSum ?? 0),
        gasQuoteSum: monthData?.gasQuoteSum ?? 0
      };
    })
    .reverse();

  const maxTxCount = Math.max(...byMonthData.map(d => d.txCount));
  const maxvalueQuoteSum = Math.max(...byMonthData.map(d => d.valueQuoteSum));

  let totalTxCountByMonthData = 0;
  let totalVolumeByMonthData = 0;

  byMonthData.forEach(d => {
    totalTxCountByMonthData += Number(d.txCount);
  });

  byMonthData.forEach(d => {
    totalVolumeByMonthData += d.valueQuoteSum;
  });

  const colors = {
    green: ['#9AE6B4', '#68D391', '#48BB78'],
    red: ['#FEB2B2', '#FC8181', '#F56565']
  };

  const getGraphColor = (start: number, end: number, index: number) => {
    const color = start < end ? colors.green : colors.red;
    return color[index];
  };

  useEffect(() => {
    // check if type is string
    if (typeof chain === 'string') {
      setLocalChain(chain);
      localStorage.setItem('dropbook.chain', chain);
    }
  }, [chain]);

  useEffect(() => {
    const selectedChain = chainConfigs.find(c => c.name === localChain);
    if (selectedChain) setCurrentChain(selectedChain);
    // for each key in txSummary object, check if it is achieved
  }, [localChain]);

  useEffect(() => {
    const getBalance = async () => {
      const balance = await fetchBalance({
        address: `0x${account.address.slice(2)}`,
        chainId: Number(currentChain.chain_id)
      });
      setBalance({
        formatted: balance.formatted,
        symbol: balance.symbol
      });
    };
    getBalance();
  }, [currentChain, account]);

  useEffect(() => {
    if (
      txSummary.data &&
      typeof txSummary.data.txCount.allTime === 'string' &&
      parseInt(txSummary.data.txCount.allTime) === 0
    ) {
      handleSubmit({ preventDefault: () => {} });
      const currentDate = new Date();
      const obj = {
        chain: localChain,
        address: account.address,
        timestamp: currentDate
      };
      const localStorage = window.localStorage;
      const lrsFromLocal = localStorage.getItem('dropbook.lrs');
      // find the old lrs in storage
      if (lrsFromLocal) {
        let lrsFromLocalObj = JSON.parse(lrsFromLocal);
        let currentLsrObj = lrsFromLocalObj.find(
          (item: { chain: string; address: string }) =>
            item.chain === localChain && item.address === account.address
        );
        if (currentLsrObj) {
          // if found, update the timestamp
          currentLsrObj.timestamp = currentDate;
        } else {
          lrsFromLocalObj.push(obj);
        }
        localStorage.setItem('dropbook.lrs', JSON.stringify(lrsFromLocalObj));
        setLastResynced(currentLsrObj);
      } else {
        // if not found, create a new one
        localStorage.setItem('dropbook.lrs', JSON.stringify([obj]));
        setLastResynced(obj);
      }
    }
  }, [txSummary.data]);

  // handle auto resync
  useEffect(() => {
    const localStorage = window.localStorage;
    const currentDate = new Date();
    const lrsFromLocal = localStorage.getItem('dropbook.lrs');
    let lrsFromLocalObj = lrsFromLocal ? JSON.parse(lrsFromLocal) : [];

    let currentLsrObj = lrsFromLocalObj.find(
      (item: { chain: string; address: string }) =>
        item.chain === localChain && item.address === account.address
    );

    if (
      !currentLsrObj?.timestamp ||
      shouldResync(currentLsrObj.timestamp, currentDate)
    ) {
      handleSubmit({ preventDefault: () => {} });

      if (currentLsrObj) {
        // Update the timestamp if found
        currentLsrObj.timestamp = currentDate;
      } else {
        // Create a new object if not found
        currentLsrObj = {
          chain: localChain,
          address: account.address,
          timestamp: currentDate
        };
        lrsFromLocalObj.push(currentLsrObj);
      }

      localStorage.setItem('dropbook.lrs', JSON.stringify(lrsFromLocalObj));
      setLastResynced(currentLsrObj);
    }
  }, [localChain, account.address]);

  function shouldResync(lastResyncedTimestamp: Date, currentDate: Date) {
    const diff =
      currentDate.getTime() - new Date(lastResyncedTimestamp).getTime();
    const diffInDays = diff / (1000 * 3600 * 24);
    return diffInDays > 1;
  }

  useEffect(() => {
    const localStorage = window.localStorage;
    const lrsFromLocal = localStorage.getItem('dropbook.lrs');
    if (lrsFromLocal) {
      let lrsFromLocalObj = JSON.parse(lrsFromLocal);
      let currentLsrObj = lrsFromLocalObj.find(
        (item: { chain: string; address: string }) =>
          item.chain === localChain && item.address === account.address
      );
      if (currentLsrObj) {
        setLastResynced(currentLsrObj);
      }
    }
  }, [account, localChain]);

  useEffect(() => {
    const getAccount = async () => {
      let account: IAccount = {
        address: account_.address,
        ensName: 'Unidentified',
        avatarUrl: null
      };
      const ensName = await publicClient.getEnsName({
        address: account_.address
      });
      account.ensName = ensName as string;

      if (ensName) {
        const avatarURL = await publicClient.getEnsAvatar({
          name: normalize(ensName)
        });
        if (avatarURL) account.avatarUrl = avatarURL as string;
      }
      setAccount(account);
    };
    getAccount();
  }, [account_]);

  return (
    <Flex direction="column">
      <Head>
        <title>
          {account.ensName == 'Unidentified'
            ? account.address
            : account.ensName}
        </title>
      </Head>
      <Container maxW="container.xl" paddingX={0}>
        <Grid
          templateColumns="repeat(12, 1fr)"
          gap={4}
          h={{ base: 'fit-content', lg: 'calc(100vh - 85px)' }}
        >
          <GridItem
            colSpan={{ base: 12, lg: 6, xl: 4 }}
            overflowY={{ base: 'auto', lg: 'scroll' }}
            paddingBottom={{ base: 0 }}
          >
            <Flex direction="column" gap={4}>
              <ProfileCard
                account={account}
                chainConfigs={chainConfigs}
                txSummary={txSummary.data}
                handleSubmit={handleSubmit}
                balance={balance}
                localChain={localChain}
                setLocalChain={setLocalChain}
                txsSummaryByMonth={txsSummaryByMonth}
                lastResynced={lastResynced}
                setLastResynced={setLastResynced}
                isRefetching={txSummary.isRefetching || txSummary.isFetching}
              />
              <AddToBundleBtn
                account={account}
                currentBundle={currentBundle}
                bundlesData={bundlesData}
                setBundlesData={setBundlesData}
                localChain={localChain}
              />
              <Box>
                <AchievementsCard
                  achievements={currentChain.achievements}
                  txSummary={txSummary.data}
                />
              </Box>
            </Flex>
          </GridItem>
          <GridItem
            colSpan={{ base: 12, lg: 6, xl: 8 }}
            overflowY={{ base: 'auto', lg: 'scroll' }}
            paddingBottom={{ base: 0, lg: 8 }}
          >
            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
              <GridItem colSpan={{ base: 12, md: 6, lg: 12, xl: 6 }}>
                <Flex
                  direction="column"
                  gap={4}
                  h="100%"
                  justify="space-between"
                >
                  <Card height="100%">
                    <CardHeader>
                      <Flex
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Heading size="md">Transactions</Heading>
                      </Flex>
                    </CardHeader>
                    <CardBody>
                      <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                        <GridItem colSpan={{ base: 6 }} alignSelf="center">
                          <Stat>
                            <StatNumber>
                              <Heading>
                                {txSummary.data ? (
                                  totalTxCountByMonthData
                                ) : (
                                  <Skeleton height="42px" />
                                )}
                              </Heading>
                            </StatNumber>
                            <StatHelpText>
                              <Text fontSize="sm" color={subHeadingColor}>
                                Last 6 months
                              </Text>
                            </StatHelpText>
                          </Stat>
                        </GridItem>
                        <GridItem colSpan={{ base: 6 }}>
                          <ResponsiveContainer width="100%" height="100%">
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
                                hide
                              />

                              <Tooltip
                                formatter={value => {
                                  return [
                                    formatPrettyNumber(value as number, 0),
                                    'Transactions'
                                  ];
                                }}
                                labelStyle={{ color: 'black' }}
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
                        </GridItem>
                      </Grid>
                    </CardBody>
                  </Card>
                  <Card height="100%">
                    <CardHeader>
                      <Flex
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Heading size="md">Volume</Heading>
                      </Flex>
                    </CardHeader>
                    <CardBody>
                      <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                        <GridItem colSpan={{ base: 6 }} alignSelf="center">
                          <Stat>
                            <StatNumber>
                              <Heading>
                                {txSummary.data ? (
                                  `$${formatPrettyNumber(
                                    totalVolumeByMonthData
                                  )}`
                                ) : (
                                  <Skeleton height="42px" />
                                )}
                              </Heading>
                            </StatNumber>
                            <StatHelpText>
                              <Text fontSize="sm" color={subHeadingColor}>
                                Last 6 months
                              </Text>
                            </StatHelpText>
                          </Stat>
                        </GridItem>
                        <GridItem colSpan={{ base: 6 }}>
                          <ResponsiveContainer width="100%" height="100%">
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
                                domain={[0, maxvalueQuoteSum]}
                                tickFormatter={value => {
                                  return formatPrettyNumber(value as number, 0);
                                }}
                                hide
                              />

                              <Tooltip
                                formatter={value => {
                                  return [
                                    formatPrettyNumber(value as number, 0),
                                    'Tx Value'
                                  ];
                                }}
                                labelStyle={{ color: 'black' }}
                              />
                              <Area
                                type="monotone"
                                dataKey="valueQuoteSum"
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
                        </GridItem>
                      </Grid>
                    </CardBody>
                    <Flex
                      position="absolute"
                      direction="column"
                      top={0}
                      left={0}
                      right={0}
                      bottom={0}
                      zIndex={1}
                      alignItems="center"
                      justifyContent="center"
                      rounded="3xl"
                      bgGradient={useColorModeValue(
                        'linear(to-b, whiteAlpha.700, white)',
                        'linear(to-b, blackAlpha.700, gray.900)'
                      )}
                      display={currentChain.is_testnet ? 'flex' : 'none'}
                    >
                      {/* <Heading>Coming Soon</Heading> */}
                      <Text>Testnet coins have no real value</Text>
                    </Flex>
                  </Card>
                  <Card height="100%">
                    <CardHeader>
                      <Flex
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Heading size="md">Active months</Heading>
                      </Flex>
                    </CardHeader>
                    <CardBody>
                      <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                        <GridItem colSpan={{ base: 6 }} alignSelf="center">
                          <Stat>
                            <StatNumber>
                              <Heading>
                                {txSummary.data ? (
                                  txsSummaryByMonth?.txsByMonth.length ?? 0
                                ) : (
                                  <Skeleton height="42px" />
                                )}
                              </Heading>
                            </StatNumber>
                            <StatHelpText>
                              <Text fontSize="sm" color={subHeadingColor}>
                                All time
                              </Text>
                            </StatHelpText>
                          </Stat>
                        </GridItem>
                        <GridItem colSpan={{ base: 6 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              width={730}
                              height={250}
                              data={txsSummaryByMonth?.txsByMonth}
                            >
                              <XAxis dataKey="date" hide />
                              <YAxis
                                domain={[0, maxTxCount]}
                                tickFormatter={value => {
                                  return formatPrettyNumber(value as number, 0);
                                }}
                                hide
                              />
                              <Tooltip
                                formatter={value => {
                                  return [
                                    formatPrettyNumber(value as number, 0),
                                    'Txs'
                                  ];
                                }}
                                labelStyle={{ color: 'black' }}
                              />
                              <Bar dataKey="txCount" fill={'#F857A6'} />
                            </BarChart>
                          </ResponsiveContainer>
                        </GridItem>
                      </Grid>
                    </CardBody>
                  </Card>
                </Flex>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6, lg: 12, xl: 6 }}>
                <Flex direction="column" gap={4}>
                  <ActivityIndexCard
                    txSummary={txSummary.data}
                    chainConfigs={chainConfigs}
                    localChain={localChain}
                  />
                </Flex>
              </GridItem>
              <GridItem colSpan={{ base: 12 }}>
                <TopProtocolsUsageCard
                  txsSummaryByContract={txsSummaryByContract}
                  currentChain={currentChain}
                />
              </GridItem>
            </Grid>
          </GridItem>
        </Grid>
      </Container>
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
  const chainConfigs = process.env.VERCEL_URL ? await get('chains') : CHAINS;
  if (!addressType || addressType === 'ens') {
    return {
      notFound: true
    };
  }
  if (addressType === 'address') {
    return {
      props: {
        chainConfigs,
        account_: {
          address: p.address,
          ensName: null,
          avatarUrl: null
        }
      }
    };
  }
};
