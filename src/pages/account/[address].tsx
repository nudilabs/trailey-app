import { isAddress } from 'viem';
import { normalize } from 'viem/ens';
import { publicClient } from '@/utils/client';

import {
  Box,
  Card,
  CardBody,
  Flex,
  Grid,
  GridItem,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import { useRouter } from 'next/router';

import { trpc } from '@/connectors/Trpc';
import { useEffect, useState } from 'react';

import {
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

const times: { [key: string]: number } = {
  '24h': 1,
  '7d': 7,
  '30d': 30,
  all: 0
};

const steps = [
  { title: 'Top 50%', description: `10 txs` },
  { title: 'Top 25%', description: '50 txs' },
  { title: 'Top 10%', description: '100 txs' }
];

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
    // Handle form submission logic here
    // console.log('Input 1:', chainName);
    console.log('data', data);
    // console.log('Input 2:', walletAddr);
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
    for (let i = 0; i < 3; i++) {
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
    txCount: ['#D6BCFA', '#B794F4', '#9F7AEA'],
    valueQuoteSum: ['#FBB6CE', '#F687B3', '#ED64A6']
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
            justifyContent={{ base: 'normal', xl: 'space-between' }}
            h="100%"
          >
            <Box display={{ base: 'block', md: 'none' }}>
              <ProfileCard
                account={account}
                chainConfigs={chainConfigs}
                txSummary={txSummary}
                handleSubmit={handleSubmit}
              />
            </Box>
            <Box display={{ base: 'block', md: 'none' }}>
              <AddToBundleBtn
                account={account}
                currentProfile={currentProfile}
                profilesData={profilesData}
                setProfilesData={setProfilesData}
              />
            </Box>
            <Box>
              <AchievementsCard />
            </Box>
            <Box display={{ base: 'none', md: 'block' }}>
              <ActivityIndexCard txSummary={txSummary} />
            </Box>
          </Flex>
        </GridItem>
        <GridItem colSpan={{ base: 12, lg: 6, xl: 8 }}>
          <Grid templateColumns="repeat(12, 1fr)" gap={4}>
            <GridItem colSpan={{ base: 12, md: 6, lg: 12, xl: 6 }}>
              <Flex
                direction="column"
                gap={4}
                display={{ base: 'block', md: 'none' }}
              >
                <ActivityIndexCard txSummary={txSummary} />
              </Flex>
              <Box display={{ base: 'none', md: 'block' }}>
                <ProfileCard
                  account={account}
                  chainConfigs={chainConfigs}
                  txSummary={txSummary}
                  handleSubmit={handleSubmit}
                />
              </Box>
            </GridItem>
            <GridItem colSpan={{ base: 12, md: 6, lg: 12, xl: 6 }}>
              <Flex
                direction="column"
                justifyContent={'space-between'}
                h="100%"
                gap={4}
              >
                <Box display={{ base: 'none', md: 'block' }}>
                  <AddToBundleBtn
                    account={account}
                    currentProfile={currentProfile}
                    profilesData={profilesData}
                    setProfilesData={setProfilesData}
                  />
                </Box>
                <Card>
                  <CardBody>
                    <ResponsiveContainer width="100%" height={160}>
                      <BarChart data={byMonthData}>
                        {/* <CartesianGrid strokeDasharray="3 3" /> */}
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
                              fill={colors.txCount[index]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody>
                    <ResponsiveContainer width="100%" height={160}>
                      <BarChart width={730} height={250} data={byMonthData}>
                        {/* <CartesianGrid strokeDasharray="3 3" /> */}
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
                          fill={colors.valueQuoteSum[2]}
                          shape={<Rectangle radius={[10, 10, 0, 0]} />}
                        >
                          {byMonthData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={colors.valueQuoteSum[index]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardBody>
                </Card>
              </Flex>
            </GridItem>
            <GridItem colSpan={{ base: 12 }}>
              <TopProtocolsUsageCard
                txsSummaryByContract={txsSummaryByContract}
                currentChain={currentChain}
                account={account}
              />
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
