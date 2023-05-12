import BridgedCard from '@/components/BridgedCard';
import ChainSelector from '@/components/ChainSelector';
import TrendingCardSmall from '@/components/TrendingCardSmall';
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
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
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
  FiChevronDown,
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
import TimeFilter from '@/components/TimeFilter';
import { trpc } from '@/connectors/Trpc';
import { useEffect, useState } from 'react';
import { generateColorFromString } from '@/utils/format';
import { Avatar } from '@/components/Avatar';
import {
  Legend,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer
} from 'recharts';

import { get } from '@vercel/edge-config';
import { Chain } from '@/types/Chains';

const MOCK_CHAINS = [
  {
    name: 'Ethereum',
    icon: '/eth.png',
    isTestnet: false
  },
  {
    name: 'Goerli',
    icon: '/eth.png',
    isTestnet: true
  },
  {
    name: 'Polygon',
    icon: '/polygon.jpeg',
    isTestnet: false
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

type txsByContract = {
  contract: string;
  txCount: number;
  txValue: number;
  feesPaidSum: string;
};

const steps = [
  { title: 'Top 50%', description: `10 txs` },
  { title: 'Top 25%', description: '50 txs' },
  { title: 'Top 10%', description: '100 txs' }
];

const curatedProtocols: { [key: string]: { name: string; img?: string } } = {
  '0xef1c6e67703c7bd7107eed8303fbe6ec2554bf6b': {
    name: 'Uniswap: Universal Router',
    img: '/protocols/uniswap.png'
  },
  '0x5427fefa711eff984124bfbb1ab6fbf5e3da1820': {
    name: 'Celer Network: cBridge V2'
  }
};

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
  const [currentChain, setCurrentChain] = useState<string>('ethereum');
  const [currentTime, setCurrentTime] = useState<string>('7d');
  const router = useRouter();
  const { chain, time } = router.query;
  const subHeadingColor = useColorModeValue('gray.600', 'gray.400');

  // all time stats
  const txsSummaryQueriesAllTime = trpc.txs.getSummary.useQuery({
    chainName: chains[currentChain],
    walletAddr: address,
    timeSpan: 0
  });
  // last week stats
  const txsSummaryQueriesLastWeek = trpc.txs.getSummary.useQuery({
    chainName: chains[currentChain],
    walletAddr: address,
    timeSpan: 7
  });
  // progress
  const { activeStep } = useSteps({
    index: 1,
    count: steps.length
  });

  const txsSummaryByDayQueries = trpc.txs.getSummaryByDay.useQuery({
    chainName: chains[currentChain],
    walletAddr: address,
    timeSpan: times[currentTime]
  });

  const txsSummaryByContract = trpc.txs.getSummaryByContract.useQuery({
    chainName: chains[currentChain],
    walletAddr: address,
    timeSpan: times[currentTime]
  });

  const txsSummaryByContractAllTime = trpc.txs.getSummaryByContract.useQuery({
    chainName: chains[currentChain],
    walletAddr: address,
    timeSpan: 0
  });

  const txsSummaryByContractLastWeek = trpc.txs.getSummaryByContract.useQuery({
    chainName: chains[currentChain],
    walletAddr: address,
    timeSpan: 7
  });

  const protocolUsage: {
    contract: string;
    txCountAllTime: number;
    txCountLastWeek: number;
    txValueSumAllTime: number;
    txValueSumLastWeek: number;
    txCountChangePercentage: number;
    txValueSumChangePercentage: number;
  }[] = [];

  txsSummaryByContractAllTime.data?.txsByContract.forEach(contract => {
    const contractLastWeek =
      txsSummaryByContractLastWeek.data?.txsByContract.find(
        c => c.contract === contract.contract
      );
    const contractUsage = {
      contract: contract.contract,
      txCountAllTime: contract.txCount,
      txCountLastWeek: contractLastWeek?.txCount || 0,
      txValueSumAllTime: contract.txValueSum,
      txValueSumLastWeek: contractLastWeek?.txValueSum || 0,
      txCountChangePercentage: contractLastWeek
        ? ((contract.txCount - contractLastWeek.txCount) /
            contractLastWeek.txCount) *
          100
        : 0,
      txValueSumChangePercentage: contractLastWeek
        ? ((contract.txValueSum - contractLastWeek.txValueSum) /
            contractLastWeek.txValueSum) *
          100
        : 0
    };
    protocolUsage.push(contractUsage);
  });
  protocolUsage.sort(
    (a, b) => b.txCountChangePercentage - a.txCountChangePercentage
  );

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
      setCurrentChain(chain as string);
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
            <Card size="lg">
              <CardHeader>
                <Flex
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <ChainSelector chainConfigs={chainConfigs} />
                  <Flex direction="row" alignItems="center" gap={1}>
                    <Text
                      color={useColorModeValue(
                        'blackAlpha.500',
                        'whiteAlpha.500'
                      )}
                      fontSize="xs"
                    >
                      Resynced 2 days ago
                    </Text>
                    <IconButton
                      size="sm"
                      variant="ghost"
                      aria-label="refresh"
                      icon={<FiRefreshCw />}
                    />
                  </Flex>
                </Flex>
              </CardHeader>
              <CardBody>
                <Flex direction="column" alignItems="center" gap={3}>
                  <Avatar address={address} size={100} ensImage={avatarUrl} />
                  <Flex direction="column" alignItems="center" gap={2}>
                    <Heading
                      size={ensName.length > 19 ? 'md' : 'lg'}
                      textAlign="center"
                      marginTop={2}
                    >
                      {ensName}
                    </Heading>
                    <Button
                      color={subHeadingColor}
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(address);
                        toast({
                          title: 'Copied to clipboard',
                          status: 'info',
                          duration: 1500,
                          isClosable: true,
                          position: 'top-right'
                        });
                      }}
                    >
                      {getFormattedAddress(address)}
                    </Button>
                  </Flex>
                  <Flex
                    direction="row"
                    width="100%"
                    justifyContent="space-between"
                  >
                    <Stat textAlign="center">
                      <StatNumber>{formatPrettyNumber(totalTxs)}</StatNumber>
                      <StatLabel color={subHeadingColor}>
                        Transactions
                      </StatLabel>
                      <Tooltip label="Percent change from 7 days ago" hasArrow>
                        <StatHelpText>
                          <StatArrow type="increase" />
                          {txsChange.toFixed(2)}%
                        </StatHelpText>
                      </Tooltip>
                    </Stat>
                    <Stat textAlign="center">
                      <StatNumber>
                        <Text
                          as="a"
                          href={`https://etherscan.io/address/${topContract}`}
                          target="_blank"
                        >
                          ${formatDecimals(totalValue)}
                        </Text>
                      </StatNumber>
                      <StatLabel>Total Tx Value</StatLabel>
                      <Tooltip label="Percent change from 7 days ago" hasArrow>
                        <StatHelpText>
                          <StatArrow type="increase" />
                          {valueChange.toFixed(2)}%
                        </StatHelpText>
                      </Tooltip>
                    </Stat>
                    <Stat textAlign="center">
                      <StatNumber>{getEthFromWei(totalFees)}</StatNumber>
                      <StatLabel color={subHeadingColor}>Fees Paid</StatLabel>
                      <Tooltip label="Percent change from 7 days ago" hasArrow>
                        <StatHelpText>
                          <StatArrow type="increase" />
                          {feesChange.toFixed(2)}%
                        </StatHelpText>
                      </Tooltip>
                    </Stat>
                  </Flex>
                </Flex>
              </CardBody>
              <CardFooter>
                <Text
                  color={useColorModeValue('blackAlpha.500', 'whiteAlpha.500')}
                  fontSize="xs"
                >
                  Powered by Biway Analytics
                </Text>
              </CardFooter>
            </Card>
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
                        {curatedProtocols[topContract] && (
                          <StatHelpText>
                            {curatedProtocols[topContract].name}
                          </StatHelpText>
                        )}
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
                    {protocolUsage.map((protocol, index) => (
                      <>
                        {curatedProtocols[protocol.contract] && (
                          <Card key={index} size="md" minWidth="240px">
                            <CardBody>
                              <Flex direction="column">
                                <Flex direction="row" alignItems="center">
                                  {curatedProtocols[protocol.contract]?.img && (
                                    <Image
                                      src={
                                        curatedProtocols[protocol.contract]?.img
                                      }
                                      boxSize="24px"
                                      mr={1}
                                      alt={
                                        curatedProtocols[protocol.contract]
                                          ?.name
                                      }
                                    />
                                  )}
                                  <Text
                                    fontSize="xs"
                                    fontWeight="bold"
                                    color={subHeadingColor}
                                  >
                                    {curatedProtocols[protocol.contract]
                                      ?.name ||
                                      getFormattedAddress(protocol.contract)}
                                  </Text>
                                </Flex>
                                <Flex direction="row" alignItems="center">
                                  <Heading fontSize="xl" fontWeight="bold">
                                    {protocol.txCountAllTime} txs
                                  </Heading>
                                  <Badge
                                    ml={2}
                                    colorScheme={
                                      protocol.txCountChangePercentage > 0
                                        ? 'green'
                                        : 'gray'
                                    }
                                    rounded="md"
                                  >
                                    {protocol.txCountChangePercentage}%
                                  </Badge>
                                </Flex>
                                <Flex direction="row" alignItems="center">
                                  <Text
                                    fontSize="xs"
                                    fontWeight="bold"
                                    color={subHeadingColor}
                                  >
                                    $
                                    {formatDecimals(protocol.txValueSumAllTime)}{' '}
                                    (volume)
                                  </Text>
                                </Flex>
                              </Flex>
                            </CardBody>
                          </Card>
                        )}
                      </>
                    ))}
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
  const chainConfigs = await get('chains');
  console.log('chainConfigs', chainConfigs);

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
