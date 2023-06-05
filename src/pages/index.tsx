import OverviewCard from '@/components/OverviewCard';
import { IBundle } from '@/types/IBundle';
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
  Stack,
  Text,
  useColorModeValue,
  IconButton,
  CardHeader,
  chakra
} from '@chakra-ui/react';
import { GetServerSideProps } from 'next';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Spline from '@splinetool/react-spline';
import { trpc } from '@/connectors/Trpc';
import AvatarGroup from '@/components/AvatarGroup';
import { FiPlus } from 'react-icons/fi';
import { get } from '@vercel/edge-config';
import { Chain } from '@/types/Chains';
import { CHAINS } from '@/configs/chains';
import SearchBar from '@/components/SearchBar';

export default function Home({
  currentBundle,
  bundlesData,
  chainConfigs,
  localChain,
  setLocalChain
}: {
  currentBundle: number;
  bundlesData: IBundle[];
  chainConfigs: Chain[];
  localChain: string;
  setLocalChain: (chain: string) => void;
}) {
  const [address, setAddress] = useState<string | null>(null);

  const subHeadingColor = useColorModeValue('gray.600', 'gray.400');
  const hightlightColor = useColorModeValue(
    'primary-gradient.500',
    'primary-gradient.200'
  );
  const dividerColor = useColorModeValue('gray.300', 'gray.700');

  const router = useRouter();

  const txSummaries = trpc.useQueries(
    t =>
      bundlesData[currentBundle]?.wallets?.map(addr =>
        t.txs.getSummary({
          chainName: localChain,
          walletAddr: addr.address
        })
      ) ?? []
  );

  const txSummariesWithAddress = txSummaries.map((txSummary, index) => ({
    ...txSummary,
    address: bundlesData[currentBundle]?.wallets[index]?.address
  }));

  const { mutate } = trpc.txs.syncWalletTxs.useMutation();
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    txSummariesWithAddress.forEach(txSummary => {
      mutate({
        chainName: localChain,
        walletAddr: txSummary.address
      });
    });
  };

  if (bundlesData.length === 0) {
    return (
      <Flex minH="calc(100vh - 88px)" alignItems="center" overflowY="hidden">
        <Container maxW="container.lg" py={{ base: 12, md: 0 }}>
          <Grid templateColumns="repeat(12, 1fr)">
            <GridItem
              colSpan={{ base: 12, lg: 7 }}
              paddingRight={{ base: 0, lg: 24 }}
            >
              <Flex
                direction="column"
                gap={8}
                justifyContent={{ base: 'normal', md: 'center' }}
                height="100%"
              >
                <Stack>
                  <Heading
                    lineHeight="tall"
                    fontSize={{ base: '3xl', md: '5xl' }}
                  >
                    Keep track of your{' '}
                    <chakra.span
                      bg={hightlightColor}
                      bgClip="text"
                      fontWeight="extrabold"
                    >
                      onchain
                    </chakra.span>{' '}
                    journey
                  </Heading>
                  <Text fontSize="lg" color={subHeadingColor}>
                    Simplify your crypto experience with an easy-to-use
                    dashboard
                  </Text>
                </Stack>
                <Flex direction="column">
                  <SearchBar btn showError />
                  <Flex
                    direction="row"
                    gap={2}
                    px={12}
                    py={7}
                    alignItems="center"
                  >
                    <Box bg={dividerColor} w="100%" h="1px" />
                    <Text color="gray.500">or</Text>
                    <Box bg={dividerColor} w="100%" h="1px" />
                  </Flex>
                  <Button
                    onClick={() => {
                      router.push('/bundle');
                    }}
                    colorScheme={'secondary'}
                    size="sm"
                    rounded="lg"
                  >
                    Create bundle
                  </Button>
                </Flex>
              </Flex>
            </GridItem>
            <GridItem
              colSpan={{ base: 12, lg: 5 }}
              alignContent={'center'}
              justifyContent={'center'}
              height={{ lg: 'calc(100vh - 88px)' }}
              display={{ base: 'none', lg: 'block' }}
            >
              <Spline scene="https://prod.spline.design/Z9MpbnCCPiLWzE5w/scene.splinecode" />
            </GridItem>
          </Grid>
        </Container>
      </Flex>
    );
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
                        router.push(`/bundle/${currentBundle}`);
                      }}
                    />
                  </Flex>
                </CardHeader>
                <CardBody>
                  <Flex direction="column" gap={4}>
                    <AvatarGroup
                      wallets={bundlesData[currentBundle].wallets}
                      max={5}
                    />
                    {bundlesData[currentBundle] && (
                      <Flex direction="column">
                        <Heading>{bundlesData[currentBundle].name}</Heading>
                        <Text color={subHeadingColor}>
                          {bundlesData[currentBundle].wallets.length} Wallets
                        </Text>
                      </Flex>
                    )}
                  </Flex>
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
            handleSubmit={handleSubmit}
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
