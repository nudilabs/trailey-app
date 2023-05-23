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
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useColorModeValue,
  StatArrow,
  StatHelpText,
  IconButton,
  CardHeader
} from '@chakra-ui/react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Spline from '@splinetool/react-spline';
import { trpc } from '@/connectors/Trpc';
import AvatarGroup from '@/components/AvatarGroup';
import { FiEdit, FiPlus } from 'react-icons/fi';
import { get } from '@vercel/edge-config';
import { Chain } from '@/types/Chains';
import { CHAINS } from '@/configs/chains';

interface Session {
  user: {
    name: string;
    image: string;
  };
  address: string;
  expires: string;
}

export default function Home({
  currentProfile,
  profilesData,
  chainConfigs,
  localChain,
  setLocalChain
}: {
  currentProfile: number;
  profilesData: IProfile[];
  chainConfigs: Chain[];
  localChain: string;
  setLocalChain: (chain: string) => void;
}) {
  const [address, setAddress] = useState<string | null>(null);

  const { data: session, status: sessionStatus } = useSession();
  const { openConnectModal } = useConnectModal();
  const subHeadingColor = useColorModeValue('gray.600', 'gray.400');

  const router = useRouter();

  const txSummaries = trpc.useQueries(
    t =>
      profilesData[currentProfile]?.wallets?.map(addr =>
        t.txs.getSummary({
          chainName: localChain,
          walletAddr: addr.address
        })
      ) ?? []
  );

  const txSummariesWithAddress = txSummaries.map((txSummary, index) => ({
    ...txSummary,
    address: profilesData[currentProfile]?.wallets[index]?.address
  }));

  useEffect(() => {
    setAddress((session as Session)?.address ?? null);
  }, [sessionStatus]);

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
        <GridItem colSpan={{ base: 12, lg: 4 }}>
          <Grid templateColumns="repeat(12, 1fr)" gap={4}>
            <GridItem colSpan={{ base: 12, lg: 12 }}>
              <Card size="lg">
                <CardHeader>
                  <Flex
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Heading size="md">Profile</Heading>
                    <IconButton
                      aria-label="Profile"
                      icon={<FiPlus />}
                      onClick={() => {
                        router.push(`/profile/${currentProfile}`);
                      }}
                    />
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
            <GridItem colSpan={{ base: 6, md: 3, lg: 6 }}>
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
            <GridItem colSpan={{ base: 6, md: 3, lg: 6 }}>
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
            <GridItem colSpan={{ base: 6, md: 3, lg: 6 }}>
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
            <GridItem colSpan={{ base: 6, md: 3, lg: 6 }}>
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
          </Grid>
        </GridItem>
        <GridItem colSpan={{ base: 12, lg: 8 }}>
          <OverviewCard
            txSummaries={txSummariesWithAddress}
            chainConfigs={chainConfigs}
            localChain={localChain}
            setLocalChain={setLocalChain}
          />
        </GridItem>
      </Grid>
    </Flex>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const chainConfigs = process.env.VERCEL_URL ? await get('chains') : CHAINS;
  return {
    props: { chainConfigs }
  };
};
