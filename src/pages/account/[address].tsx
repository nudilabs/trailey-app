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
  ResponsiveContainer
} from 'recharts';

import { get } from '@vercel/edge-config';
import { Chain } from '@/types/Chains';
import ProfileCard from '@/components/ProfileCard';

const times: { [key: string]: number } = {
  '24h': 1,
  '7d': 7,
  '30d': 30,
  all: 0
};

const data = [
  {
    subject: 'Bridged Value',
    A: 120,
    B: 110,
    fullMark: 150
  },
  {
    subject: 'Protocols Used',
    A: 85,
    B: 90,
    fullMark: 150
  },
  {
    subject: 'Interactions',
    A: 86,
    B: 70,
    fullMark: 150
  },
  {
    subject: 'Fees Paid',
    A: 99,
    B: 100,
    fullMark: 150
  },

  {
    subject: 'Txs',
    A: 98,
    B: 130,
    fullMark: 150
  }
];

const steps = [
  { title: 'Top 50%', description: `10 txs` },
  { title: 'Top 25%', description: '50 txs' },
  { title: 'Top 10%', description: '100 txs' }
];

export default function Account({
  address,
  ensName,
  avatarUrl,
  chainConfigs
}: {
  address: string;
  ensName: string;
  avatarUrl: string | null;
  chainConfigs: Chain[];
}) {
  const toast = useToast();
  const [currentChain, setCurrentChain] = useState<Chain>(chainConfigs[0]);
  const [currentTime, setCurrentTime] = useState<string>('7d');
  const router = useRouter();
  const { chain, time } = router.query;
  const subHeadingColor = useColorModeValue('gray.600', 'gray.400');

  // resync wallet
  const { mutate } = trpc.txs.syncWalletTxs.useMutation();
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const data = mutate({
      chainName: currentChain.name,
      walletAddr: address
    });
    // Handle form submission logic here
    // console.log('Input 1:', chainName);
    console.log('data', data);
    // console.log('Input 2:', walletAddr);
  };

  // all time stats
  const txsSummaryQueriesAllTime = trpc.txs.getSummary.useQuery({
    chainName: currentChain.name,
    walletAddr: address,
    timeSpan: 0
  });
  // last week stats
  const txsSummaryQueriesLastWeek = trpc.txs.getSummary.useQuery({
    chainName: currentChain.name,
    walletAddr: address,
    timeSpan: 7
  });
  // progress
  const { activeStep } = useSteps({
    index: 1,
    count: steps.length
  });

  const txsSummaryByContractAllTime = trpc.txs.getSummaryByContract.useQuery({
    chainName: currentChain.name,
    walletAddr: address,
    timeSpan: 0
  });

  const txsSummaryByContractLastWeek = trpc.txs.getSummaryByContract.useQuery({
    chainName: currentChain.name,
    walletAddr: address,
    timeSpan: 7
  });

  const topContract =
    txsSummaryByContractAllTime.data?.txsByContract &&
    txsSummaryByContractAllTime.data?.txsByContract.length > 0
      ? txsSummaryByContractAllTime.data?.txsByContract[0].contract ?? ''
      : '';

  // all time stats
  const totalTxs = txsSummaryQueriesAllTime.data?.txCount ?? 0;
  const totalFees = txsSummaryQueriesAllTime.data?.feesPaidSum ?? 0;
  const totalValue = Number(txsSummaryQueriesAllTime.data?.txValueSum) ?? 0;
  // last week stats
  const totalTxsLastWeek = txsSummaryQueriesLastWeek.data?.txCount ?? 0;
  const totalFeesLastWeek = txsSummaryQueriesLastWeek.data?.feesPaidSum ?? 0;
  const totalValueLastWeek = txsSummaryQueriesLastWeek.data?.txValueSum ?? 0;
  // percentage change in txs
  const txsChange =
    totalTxsLastWeek > 0 && totalTxs > 0
      ? ((totalTxs - totalTxsLastWeek) / totalTxsLastWeek) * 100
      : 0;
  // percentage change in fees
  const feesChange =
    totalFeesLastWeek > 0 && totalFees > 0
      ? ((totalFees - totalFeesLastWeek) / totalFeesLastWeek) * 100
      : 0;

  // percentage change in value
  const valueChange =
    totalValueLastWeek > 0 && totalValue > 0
      ? ((totalValue - totalValueLastWeek) / totalValueLastWeek) * 100
      : 0;

  // stepper
  const stepperOrientation: 'horizontal' | 'vertical' | undefined =
    useBreakpointValue(
      {
        base: 'vertical',
        md: 'horizontal',
        lg: 'vertical',
        xl: 'horizontal'
      },
      {
        fallback: 'md'
      }
    );

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
      <Grid templateColumns="repeat(12, 1fr)" gap={4}>
        <GridItem colSpan={{ base: 12, lg: 6, xl: 4 }}>
          <Flex direction="column" gap={4}>
            <ProfileCard
              account={{
                address: address,
                ensName: ensName,
                avatarUrl: avatarUrl
              }}
              chainConfigs={chainConfigs}
              totalTxs={totalTxs}
              txsChange={txsChange}
              totalValue={totalValue}
              valueChange={valueChange}
              totalFees={totalFees}
              feesChange={feesChange}
              handleSubmit={handleSubmit}
            />
            <Button
              variant="solid"
              colorScheme="primary"
              leftIcon={<FiPlusCircle />}
              rounded="3xl"
            >
              Add to Bundle
            </Button>
            <Card size="lg">
              <CardHeader>
                <Flex direction="row" justifyContent="space-between">
                  <Heading size="md">Achievements</Heading>
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
                <Flex direction="row">
                  <Box
                    bgColor="primary.500"
                    rounded="full"
                    width={12}
                    height={12}
                  />
                  <Box
                    bgColor="primary.400"
                    rounded="full"
                    width={12}
                    height={12}
                    ml={-2}
                  />
                  <Box
                    bgColor="primary.300"
                    rounded="full"
                    width={12}
                    height={12}
                    ml={-2}
                  />
                </Flex>
              </CardBody>
            </Card>
          </Flex>
        </GridItem>
        <GridItem colSpan={{ base: 12, lg: 6, xl: 8 }}>
          <Grid templateColumns="repeat(12, 1fr)" gap={4}>
            <GridItem colSpan={{ base: 12 }}>
              <Card size="lg">
                <CardBody>
                  <Flex direction="row" gap={4} alignItems="center">
                    <Stepper
                      index={activeStep}
                      colorScheme="primary"
                      orientation={stepperOrientation}
                      width="100%"
                    >
                      {steps.map((step, index) => (
                        <Step key={index}>
                          <StepIndicator>
                            <StepStatus
                              complete={<StepIcon />}
                              incomplete={<StepNumber />}
                              active={<StepNumber />}
                            />
                          </StepIndicator>

                          <Box flexShrink="0">
                            <StepTitle>{step.title}</StepTitle>
                            <StepDescription>
                              {step.description}
                            </StepDescription>
                          </Box>

                          <StepSeparator />
                        </Step>
                      ))}
                    </Stepper>
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
                          <Text
                            as="a"
                            href={`https://etherscan.io/address/${topContract}`}
                            target="_blank"
                          >
                            ${formatDecimals(totalValue)}
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
                          <Text
                            as="a"
                            href={`https://etherscan.io/address/${topContract}`}
                            target="_blank"
                          >
                            123456
                          </Text>
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
                          name={getFormattedAddress(address)}
                          dataKey="A"
                          stroke="#E53E3E"
                          fill="#E53E3E"
                          fillOpacity={0.25}
                        />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </Flex>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem colSpan={{ base: 12 }}>
              <Card size="lg">
                <CardHeader>
                  <Flex direction="row" justifyContent="space-between">
                    <Heading size="md">Top Protocols Usage</Heading>
                    <Tooltip
                      label="The % change is the increase in usage since last week"
                      hasArrow
                    >
                      <IconButton
                        aria-label="Previous"
                        icon={<FiInfo />}
                        variant="link"
                      />
                    </Tooltip>
                  </Flex>
                </CardHeader>
                <CardBody>
                  <Flex direction="row" gap={4} overflow="scroll">
                    {currentChain.protocols &&
                      currentChain.protocols.map((protocol, index) => {
                        const protocolUsageAllTime =
                          txsSummaryByContractAllTime.data?.txsByContract.find(
                            tx => tx.contract === protocol.contract
                          );
                        const protocolUsageLastWeek =
                          txsSummaryByContractLastWeek.data?.txsByContract.find(
                            tx => tx.contract === protocol.contract
                          );
                        return (
                          <Card key={index} size="md" minWidth="240px">
                            <CardBody>
                              <Flex direction="column">
                                <Flex direction="row" alignItems="center">
                                  {protocol.logo_url && (
                                    <Image
                                      src={protocol.logo_url}
                                      boxSize="24px"
                                      mr={1}
                                      alt={protocol.label}
                                    />
                                  )}
                                  <Text
                                    fontSize="xs"
                                    fontWeight="bold"
                                    color={subHeadingColor}
                                  >
                                    {protocol.label}
                                  </Text>
                                </Flex>
                                <Flex direction="row" alignItems="center">
                                  <Heading fontSize="xl" fontWeight="bold">
                                    {protocolUsageAllTime?.txCount ?? 0} txs
                                  </Heading>
                                  <Badge
                                    ml={2}
                                    colorScheme={
                                      getPercentageChangeSinceLastWeek(
                                        protocolUsageAllTime?.txCount,
                                        protocolUsageLastWeek?.txCount
                                      ) > 0
                                        ? 'green'
                                        : 'gray'
                                    }
                                    rounded="md"
                                  >
                                    {getPercentageChangeSinceLastWeek(
                                      protocolUsageAllTime?.txCount,
                                      protocolUsageLastWeek?.txCount
                                    )}
                                    %
                                  </Badge>
                                </Flex>
                                <Flex direction="row" alignItems="center">
                                  <Text
                                    fontSize="xs"
                                    fontWeight="bold"
                                    color={subHeadingColor}
                                  >
                                    $
                                    {formatDecimals(
                                      protocolUsageAllTime?.txValueSum
                                    )}{' '}
                                    (value)
                                  </Text>
                                </Flex>
                              </Flex>
                            </CardBody>
                          </Card>
                        );
                      })}
                  </Flex>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>
    </Flex>
  );
}

const getPercentageChangeSinceLastWeek = (
  allTime?: number,
  lastWeek?: number
) => {
  if (allTime === undefined || lastWeek === undefined) {
    return 0;
  }
  const percentageChange = ((allTime - lastWeek) / lastWeek) * 100;
  return Number(percentageChange.toFixed(2));
};

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
      const props = await fetchAddressProps(p.address);
      return { props: { chainConfigs, ...props } };
    } else if (addressType === 'ens') {
      const props = await fetchEnsProps(p.address);
      return { props: { chainConfigs, ...props } };
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
        contract: '0xef1c6e67703c7bd7107eed8303fbe6ec2554bf6b',
        label: 'Uniswap',
        logo_url: '/protocols/uniswap.png'
      },
      {
        contract: '0x6982508145454ce325ddbe47a25d4ec3d2311933',
        label: 'Pepe',
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
    appchain_of: null
  }
];
