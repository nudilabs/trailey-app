import ChainSelector from '@/components/ChainSelector';
import OverviewCard from '@/components/OverviewCard';
import { IProfile } from '@/types/IProfile';
import {
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Highlight,
  Image,
  Spinner,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tfoot,
  Icon,
  StatArrow,
  StatHelpText,
  IconButton,
  CardHeader
} from '@chakra-ui/react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { GetServerSideProps } from 'next';
import { getToken } from 'next-auth/jwt';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Spline from '@splinetool/react-spline';
import { trpc } from '@/connectors/Trpc';
import { Avatar } from '@/components/Avatar';
import AvatarGroup from '@/components/AvatarGroup';
import { FiEdit, FiPlusCircle, FiUmbrella } from 'react-icons/fi';

type OverviewData = {
  message: string;
  txCount?: string | undefined;
  txValueSum?: string | undefined;
  contractCount?: string | undefined;
  feesPaidSum?: string | undefined;
  address: string;
};

const MOCK_OVERVIEW_DATA = [
  {
    address: '0x293j...293k',
    bridged: { value: 20, goal: 25 },
    txns: {
      smartContract: { value: 5, goal: 10 },
      general: { value: 28, goal: 35 },
      average: { value: 5.5, goal: 10 },
      value: { value: 28.5283, goal: 40 }
    }
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

interface Session {
  user: {
    name: string;
    image: string;
  };
  address: string;
  expires: string;
}

const chains: { [key: string]: string } = {
  ethereum: 'eth-mainnet'
};

const times: { [key: string]: number } = {
  '24h': 1,
  '7d': 7,
  '30d': 30,
  all: 0
};

export default function Home({
  currentProfile,
  profilesData
}: {
  currentProfile: number;
  profilesData: IProfile[];
}) {
  const [address, setAddress] = useState<string | null>(null);
  // const [txData, setTxData] = useState<OverviewData[]>([]);
  const [currentChain, setCurrentChain] = useState<string>('ethereum');
  const [currentTime, setCurrentTime] = useState<string>('7d');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data: session, status: sessionStatus } = useSession();
  const { openConnectModal } = useConnectModal();
  const subHeadingColor = useColorModeValue('gray.600', 'gray.400');
  const maxAvatarsShown = 1;

  const router = useRouter();
  const { chain, time } = router.query;

  const contractTxsSummaryQueries = trpc.useQueries(
    t =>
      profilesData[currentProfile]?.wallets?.map(addr =>
        t.txs.getSummary({
          chainName: chains[currentChain],
          walletAddr: addr.address,
          timeSpan: times[currentTime]
        })
      ) || []
  );

  useEffect(() => {
    setAddress((session as Session)?.address ?? null);

    if (chain) {
      setCurrentChain(chain as string);
    }
    if (time) {
      setCurrentTime(time as string);
    }
  }, [sessionStatus, chain, time]);

  const txData: OverviewData[] = contractTxsSummaryQueries.map((q, i) => ({
    message: q.data?.message ?? '',
    txCount: q.data?.txCount,
    txValueSum: q.data?.txValueSum,
    contractCount: q.data?.contractCount,
    feesPaidSum: q.data?.feesPaidSum,
    address: profilesData[currentProfile]?.wallets?.[i].address ?? ''
  }));

  if (!session || !address) {
    return (
      <Flex minH="calc(100vh - 88px)" alignItems="center">
        <Container maxW="container.lg" py={{ base: 12, md: 0 }}>
          <Grid templateColumns="repeat(12, 1fr)" gap={8}>
            <GridItem colSpan={{ base: 12, lg: 5 }}>
              <Flex
                direction="column"
                gap={8}
                justifyContent={{ base: 'normal', md: 'center' }}
                height="100%"
              >
                <Stack>
                  <Heading lineHeight="tall">
                    <Highlight
                      query="onchain"
                      styles={{
                        px: '2',
                        rounded: 'xl',
                        bg: 'primary.100'
                      }}
                    >
                      Keep track of your onchain journey
                    </Highlight>
                  </Heading>
                  <Text fontSize="lg" color={subHeadingColor}>
                    Simplify your crypto experience with an easy-to-use
                    dashboard
                  </Text>
                </Stack>
                <Box>
                  <Button
                    onClick={openConnectModal}
                    colorScheme="primary"
                    isLoading={sessionStatus === 'loading'}
                  >
                    Login to start
                  </Button>
                </Box>
              </Flex>
            </GridItem>
            <GridItem
              colSpan={{ base: 12, lg: 7 }}
              alignContent={'center'}
              justifyContent={'center'}
              minHeight="512px"
            >
              <Spline scene="https://prod.spline.design/QMJDTScZ1nj6yrQl/scene.splinecode" />
            </GridItem>
          </Grid>
        </Container>
      </Flex>
    );
  }

  if (profilesData.length === 0) {
    router.push(`/account/${address}`);
    return null;
  }

  return (
    <Flex direction="column" paddingTop={4} gap={4}>
      <Grid templateColumns="repeat(12, 1fr)" gap={4}>
        {/* START TOP STATS */}
        <GridItem
          display={{ base: 'none', md: 'block' }}
          colSpan={{ base: 6, md: 3 }}
        >
          <Card size="lg">
            <CardBody>
              <Flex direction="row" gap={4} alignItems="center">
                <IconButton
                  aria-label="Profile"
                  icon={<FiUmbrella />}
                  display={{ base: 'none', md: 'flex' }}
                />
                <Stat>
                  <StatLabel>Wallets</StatLabel>
                  <StatNumber>
                    {profilesData[currentProfile].wallets.length}
                  </StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    100
                  </StatHelpText>
                </Stat>
              </Flex>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem
          display={{ base: 'none', md: 'block' }}
          colSpan={{ base: 6, md: 3 }}
        >
          <Card size="lg">
            <CardBody>
              <Flex direction="row" gap={4} alignItems="center">
                <IconButton
                  aria-label="Profile"
                  icon={<FiUmbrella />}
                  display={{ base: 'none', md: 'flex' }}
                />
                <Stat>
                  <StatLabel>Wallets</StatLabel>
                  <StatNumber>
                    {profilesData[currentProfile].wallets.length}
                  </StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    100
                  </StatHelpText>
                </Stat>
              </Flex>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem
          display={{ base: 'none', md: 'block' }}
          colSpan={{ base: 6, md: 3 }}
        >
          <Card size="lg">
            <CardBody>
              <Flex direction="row" gap={4} alignItems="center">
                <IconButton
                  aria-label="Profile"
                  icon={<FiUmbrella />}
                  display={{ base: 'none', md: 'flex' }}
                />
                <Stat>
                  <StatLabel>Wallets</StatLabel>
                  <StatNumber>
                    {profilesData[currentProfile].wallets.length}
                  </StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    100
                  </StatHelpText>
                </Stat>
              </Flex>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem
          display={{ base: 'none', md: 'block' }}
          colSpan={{ base: 6, md: 3 }}
        >
          <Card size="lg">
            <CardBody>
              <Flex direction="row" gap={4} alignItems="center">
                <IconButton
                  aria-label="Profile"
                  icon={<FiUmbrella />}
                  display={{ base: 'none', md: 'flex' }}
                />
                <Stat>
                  <StatLabel>Wallets</StatLabel>
                  <StatNumber>
                    {profilesData[currentProfile].wallets.length}
                  </StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    100
                  </StatHelpText>
                </Stat>
              </Flex>
            </CardBody>
          </Card>
        </GridItem>
        {/* END TOP STATS */}
        <GridItem colSpan={{ base: 12, lg: 4 }}>
          <Card size="lg">
            <CardHeader>
              <Flex
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Heading size="md">Profile</Heading>
                <IconButton aria-label="Profile" icon={<FiEdit />} />
              </Flex>
            </CardHeader>
            <CardBody>
              <Flex direction="column" gap={4}>
                <AvatarGroup
                  wallets={profilesData[currentProfile].wallets}
                  max={5}
                />
                {profilesData[currentProfile] && (
                  <Flex direction="column">
                    <Heading>{profilesData[currentProfile].name}</Heading>
                    <Text color={subHeadingColor}>
                      {profilesData[currentProfile].wallets.length} Wallets
                    </Text>
                  </Flex>
                )}
              </Flex>
            </CardBody>
          </Card>
        </GridItem>
        {/* START BOTTOM STATS */}
        <GridItem
          display={{ base: 'block', md: 'none' }}
          colSpan={{ base: 6, md: 3 }}
        >
          <Card size="lg">
            <CardBody>
              <Stat>
                <StatLabel>Wallets</StatLabel>
                <StatNumber>
                  {profilesData[currentProfile].wallets.length}
                </StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  100
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem
          display={{ base: 'block', md: 'none' }}
          colSpan={{ base: 6, md: 3 }}
        >
          <Card size="lg">
            <CardBody>
              <Stat>
                <StatLabel>Wallets</StatLabel>
                <StatNumber>
                  {profilesData[currentProfile].wallets.length}
                </StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  100
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem
          display={{ base: 'block', md: 'none' }}
          colSpan={{ base: 6, md: 3 }}
        >
          <Card size="lg">
            <CardBody>
              <Stat>
                <StatLabel>Wallets</StatLabel>
                <StatNumber>
                  {profilesData[currentProfile].wallets.length}
                </StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  100
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem
          display={{ base: 'block', md: 'none' }}
          colSpan={{ base: 6, md: 3 }}
        >
          <Card size="lg">
            <CardBody>
              <Stat>
                <StatLabel>Wallets</StatLabel>
                <StatNumber>
                  {profilesData[currentProfile].wallets.length}
                </StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  100
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>
        {/* END BOTTOM STATS */}
        <GridItem colSpan={{ base: 12, lg: 8 }}>
          <OverviewCard isLoading={isLoading} txData={txData} />
        </GridItem>
      </Grid>
    </Flex>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  return {
    props: {}
  };
};
