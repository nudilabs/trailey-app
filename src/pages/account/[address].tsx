import ChainSelector from '@/components/ChainSelector';
import { isAddress } from 'viem';
import { normalize } from 'viem/ens';
import { publicClient } from '@/utils/client';

import {
  Badge,
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
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Text,
  Tooltip,
  useBreakpointValue,
  useColorModeValue,
  useSteps,
  useToast
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import {
  FiArrowDownCircle,
  FiBox,
  FiInfo,
  FiPlusCircle,
  FiRefreshCw
} from 'react-icons/fi';
import {
  formatDecimals,
  formatPrettyNumber,
  getEthFromWei,
  getFormattedAddress
} from '@/utils/format';

import { trpc } from '@/connectors/Trpc';
import { useEffect, useState } from 'react';

import { Avatar } from '@/components/Avatar';
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip as TooltipRecharts
} from 'recharts';

import { get } from '@vercel/edge-config';
import { Chain } from '@/types/Chains';
import ProfileCard from '@/components/ProfileCard';
import { IAccount } from '@/types/Account';
import AchievementsCard from '@/components/AchievementsCard';
import ProgressTrackerCard from '@/components/ProgressTrackerCard';
import TopProtocolsUsageCard from '@/components/TopProtocolsUsageCard';
import AddToBundleBtn from '@/components/AddToBundleButton';
import { IProfile } from '@/types/IProfile';
import { TxSummary, TxSummaryByContract } from '@/types/TxSummary';
import Head from 'next/head';

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

  const average = {
    bridged: 200,
    protocols: 250,
    interactions: 1800,
    fees: 60000,
    txs: 2500
  };

  const data = [
    {
      subject: 'Bridged Value',
      A: 120 / average.bridged,
      fullMark: 100
    },
    {
      subject: 'Protocols Used',
      A: (txsSummaryByContract?.contracts.length ?? 0) / average.protocols,
      fullMark: 100
    },
    {
      subject: 'Interactions',
      A: (txSummary?.contractCount.allTime ?? 0) / average.interactions,
      fullMark: 100
    },
    {
      subject: 'Fees Paid',
      A: (txSummary?.gasQuoteSum.allTime ?? 0) / average.fees,
      fullMark: 100
    },

    {
      subject: 'Txs',
      A: (txSummary?.txCount.allTime ?? 0) / average.txs,
      fullMark: 100
    }
  ];

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
          <Flex direction="column" gap={4}>
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
            <AchievementsCard />
          </Flex>
        </GridItem>
        <GridItem colSpan={{ base: 12, lg: 6, xl: 8 }}>
          <Grid templateColumns="repeat(12, 1fr)" gap={4}>
            <GridItem colSpan={{ base: 12 }}>
              <ProgressTrackerCard />
            </GridItem>

            <GridItem colSpan={{ base: 12, md: 6, lg: 12, xl: 6 }}>
              <Flex direction="column" gap={4}>
                <Card size="lg">
                  <CardBody>
                    <Flex direction="row" alignItems="center" gap={4}>
                      <Box
                        color="primary.500"
                        bg={useColorModeValue('blackAlpha.50', 'whiteAlpha.50')}
                        p={4}
                        rounded="full"
                      >
                        <FiBox fontSize="18px" />
                      </Box>
                      <Stat>
                        <StatLabel>Total Tx Value</StatLabel>
                        <StatNumber>
                          <Text>
                            ${formatDecimals(txSummary?.valueQuoteSum.allTime)}
                          </Text>
                        </StatNumber>
                      </Stat>
                      <Tooltip label="More Info" hasArrow>
                        <IconButton
                          aria-label="Previous"
                          icon={<FiInfo />}
                          variant="link"
                        />
                      </Tooltip>
                    </Flex>
                  </CardBody>
                </Card>
                <Card size="lg">
                  <CardBody>
                    <Flex direction="row" alignItems="center" gap={4}>
                      <Box
                        color="primary.500"
                        bg={useColorModeValue('blackAlpha.50', 'whiteAlpha.50')}
                        p={4}
                        rounded="full"
                      >
                        <FiArrowDownCircle fontSize="18px" />
                      </Box>
                      <Stat>
                        <StatLabel>Bridged Value</StatLabel>
                        <StatNumber>
                          <Text>123456</Text>
                        </StatNumber>
                        <StatHelpText>Top 10%</StatHelpText>
                      </Stat>
                      <Tooltip label="More Info" hasArrow>
                        <IconButton
                          aria-label="Previous"
                          icon={<FiInfo />}
                          variant="link"
                        />
                      </Tooltip>
                    </Flex>
                  </CardBody>
                </Card>
              </Flex>
            </GridItem>
            <GridItem colSpan={{ base: 12, md: 6, lg: 12, xl: 6 }}>
              <Card size="lg">
                <CardHeader>
                  <Flex direction="row" justifyContent="space-between">
                    <Heading size="md">Stats</Heading>
                    <Tooltip label="More Info" hasArrow>
                      <IconButton
                        aria-label="Previous"
                        icon={<FiInfo />}
                        variant="link"
                      />
                    </Tooltip>
                  </Flex>
                </CardHeader>
                <CardBody>
                  <Flex
                    direction="row"
                    alignItems="center"
                    gap={4}
                    height="160px"
                  >
                    <ResponsiveContainer>
                      <RadarChart data={data}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        {/* <PolarRadiusAxis angle={30} domain={[0, 150]} /> */}
                        <Radar
                          name="Average"
                          dataKey="B"
                          stroke="#38A169"
                          fill="#38A169"
                          fillOpacity={0.1}
                        />
                        <Radar
                          name={getFormattedAddress(account.address)}
                          dataKey="A"
                          stroke="#E53E3E"
                          fill="#E53E3E"
                          fillOpacity={0.25}
                        />
                        <Legend />
                        <TooltipRecharts />
                      </RadarChart>
                    </ResponsiveContainer>
                  </Flex>
                </CardBody>
              </Card>
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
  // const chainConfigs = await get('chains');
  const chainConfigs = testChainConfigs;

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
