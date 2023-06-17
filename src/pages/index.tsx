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
  chakra,
  Tooltip,
  useToast,
  Skeleton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Tr,
  Td,
  Image,
  TableContainer,
  Table,
  Tbody
} from '@chakra-ui/react';
import { GetServerSideProps } from 'next';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Spline from '@splinetool/react-spline';
import { trpc } from '@/connectors/Trpc';
import { FiExternalLink, FiRefreshCw } from 'react-icons/fi';
import { get } from '@vercel/edge-config';
import { Chain } from '@/types/Chains';
import { CHAINS } from '@/configs/chains';
import SearchBar from '@/components/SearchBar';
import ChainSelector from '@/components/ChainSelector';
import moment from 'moment';
import { LastResync } from '@/types/LastResync';
import { formatPrettyNumber, getFormattedAddress } from '@/utils/format';
import Avatar from '@/components/Avatar';

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
  const [lastResynced, setLastResynced] = useState<LastResync[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [currentChain, setCurrentChain] = useState<Chain | undefined>(
    chainConfigs.find(chain => chain.name === localChain)
  );
  const [tabIndex, setTabIndex] = useState(0);
  const toolTipLabel = 'compared to prior week';
  const toast = useToast();
  const lightBackgroundColor = useColorModeValue('gray.50', 'gray.900');

  const subHeadingColor = useColorModeValue('gray.600', 'gray.400');
  const hightlightColor = useColorModeValue(
    'primary-gradient.500',
    'primary-gradient.200'
  );
  const dividerColor = useColorModeValue('gray.300', 'gray.700');

  const router = useRouter();

  useEffect(() => {
    setCurrentChain(chainConfigs.find(chain => chain.name === localChain));
  }, [localChain]);

  const txSummaries = trpc.useQueries(
    t =>
      bundlesData[currentBundle]?.wallets?.map(addr =>
        t.txs.getSummary({
          chainName: localChain,
          walletAddr: addr.address
        })
      ) ?? []
  );

  const txSummariesByMonth = trpc.useQueries(
    t =>
      bundlesData[currentBundle]?.wallets?.map(addr =>
        t.txs.getSummaryByMonth({
          chainName: localChain,
          walletAddr: addr.address
        })
      ) ?? []
  );

  const txSummariesWithAddress = txSummaries.map((txSummary, index) => ({
    ...txSummary,
    address: bundlesData[currentBundle]?.wallets[index]?.address
  }));

  const txSummariesByMonthWithAddress = txSummariesByMonth.map(
    (txSummary, index) => ({
      ...txSummary,
      address: bundlesData[currentBundle]?.wallets[index]?.address
    })
  );

  const txsSummariesByContract = trpc.useQueries(
    t =>
      bundlesData[currentBundle]?.wallets?.map(addr =>
        t.txs.getSummaryByContract({
          chainName: localChain,
          walletAddr: addr.address
        })
      ) ?? []
  );

  const txSummariesByContractWithAddress = txsSummariesByContract.map(
    (txSummary, index) => ({
      ...txSummary,
      address: bundlesData[currentBundle]?.wallets[index]?.address
    })
  );

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

  const handleResync = () => {
    handleSubmit({ preventDefault: () => {} });
    const currentDate = new Date();
    const lastResyncs: LastResync[] = [];
    txSummaries.forEach((summary: any) => {
      const obj = {
        chain: localChain,
        address: summary.address,
        timestamp: currentDate
      };
      const localStorage = window.localStorage;
      const lrsFromLocal = localStorage.getItem('trailey.lrs');
      // find the old lrs in storage
      if (lrsFromLocal) {
        let lrsFromLocalObj = JSON.parse(lrsFromLocal);
        let currentLsrObj = lrsFromLocalObj.find(
          (item: { chain: string; address: string }) =>
            item.chain === localChain && item.address === summary.address
        );
        if (currentLsrObj) {
          // if found, update the timestamp
          currentLsrObj.timestamp = currentDate;
        } else {
          lrsFromLocalObj.push(obj);
        }
        localStorage.setItem('trailey.lrs', JSON.stringify(lrsFromLocalObj));

        // Push the updated currentLsrObj or obj into lastResyncs array
        lastResyncs.push(currentLsrObj || obj);
      } else {
        // if not found, create a new one
        localStorage.setItem('trailey.lrs', JSON.stringify([obj]));

        lastResyncs.push(obj);
      }

      setLastResynced(lastResyncs);

      toast({
        title: `Resyncing ${getFormattedAddress(summary.address)}...`,
        status: 'info',
        duration: 2000,
        isClosable: true,
        position: 'top-right'
      });
    });

    if (lastResyncs.length === 0) {
      setLastResynced([]);
    }
    // set timer to 10 seconds
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 2000);
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
      <Flex
        direction="row"
        justifyContent="space-between"
        px={4}
        alignItems="center"
      >
        {bundlesData[currentBundle] && (
          <Flex direction="column">
            <Heading>{bundlesData[currentBundle].name}</Heading>
            <Flex direction="row" alignItems="center" gap={2}>
              <Text
                color={subHeadingColor}
              >{`Bundle (${bundlesData[currentBundle].wallets.length} Wallets)`}</Text>
              <Button
                size="xs"
                onClick={() => {
                  router.push(`/bundle/${currentBundle}`);
                }}
              >
                Add Wallet
              </Button>
            </Flex>
          </Flex>
        )}
        <Flex direction="row" gap={4} alignItems="center">
          <Tooltip
            label={
              lastResynced &&
              lastResynced.length > 0 &&
              moment(lastResynced[0]?.timestamp)
                .add(10, 'minutes')
                .isAfter(new Date())
                ? 'You can resync once every 10 minutes'
                : 'Resync data'
            }
            hasArrow
          >
            <IconButton
              size="sm"
              variant="ghost"
              aria-label="refresh"
              icon={<FiRefreshCw />}
              onClick={handleResync}
              isLoading={isSyncing}
              isDisabled={
                lastResynced &&
                lastResynced.length > 0 &&
                moment(lastResynced[0]?.timestamp)
                  .add(10, 'minutes')
                  .isAfter(new Date())
              }
            />
          </Tooltip>
          <Box>
            <ChainSelector
              chainConfigs={chainConfigs}
              localChain={localChain}
              setLocalChain={setLocalChain}
            />
          </Box>
        </Flex>
      </Flex>
      <Grid templateColumns="repeat(12, 1fr)" gap={4}>
        {txSummariesWithAddress.map((summary: any, i: number) => {
          const byContract = txSummariesByContractWithAddress.find(
            (obj: any) => obj.address === summary.address
          );
          console.log('byContract: ', byContract);
          return (
            <GridItem colSpan={{ base: 12, md: 6, lg: 3 }} key={i}>
              <Card key={i}>
                <CardHeader
                  borderBottomColor={dividerColor}
                  borderBottomWidth={1}
                  py={4}
                >
                  <Flex direction="row" justifyContent="space-between">
                    <Text fontSize="sm" color={subHeadingColor}>
                      {summary.name}
                    </Text>
                    <Button
                      colorScheme="primary"
                      variant="link"
                      rightIcon={<FiExternalLink />}
                      onClick={() => {
                        router.push(`/address/${summary.address}`);
                      }}
                    >
                      More Details
                    </Button>
                  </Flex>
                </CardHeader>
                <CardBody px={0}>
                  <Flex direction="column" gap={4}>
                    <Flex direction="row" alignItems="center" gap={2} px={4}>
                      <Avatar address={summary.address} size={48} />
                      <Flex direction="column">
                        <Heading size="md">
                          {getFormattedAddress(summary.address)}
                        </Heading>
                        <Text color={subHeadingColor}>{`${formatPrettyNumber(
                          summary?.data?.txCount.allTime ?? 0,
                          0
                        )} transactions`}</Text>
                      </Flex>
                    </Flex>
                    <Grid templateColumns="repeat(12, 1fr)" gap={2} px={4}>
                      <GridItem colSpan={4}>
                        <Flex
                          direction="column"
                          bg={lightBackgroundColor}
                          p={3}
                          rounded="md"
                        >
                          {summary?.data ? (
                            <Text>
                              {formatPrettyNumber(
                                summary?.data?.txCount.allTime ?? 0,
                                0
                              )}
                            </Text>
                          ) : (
                            <Skeleton height="24px" width="100%" />
                          )}
                          <Text color={subHeadingColor}>Txs</Text>
                        </Flex>
                      </GridItem>
                      <GridItem colSpan={4}>
                        <Flex
                          direction="column"
                          bg={lightBackgroundColor}
                          p={3}
                          rounded="md"
                        >
                          {summary?.data ? (
                            <Text>
                              {currentChain?.is_testnet
                                ? `${currentChain?.symbol} ${formatPrettyNumber(
                                    summary?.data?.valueSum.allTime ?? 0
                                  )}`
                                : `$${formatPrettyNumber(
                                    summary?.data?.valueQuoteSum.allTime ?? 0
                                  )}`}
                            </Text>
                          ) : (
                            <Skeleton height="24px" width="100%" />
                          )}
                          <Text color={subHeadingColor}>Vol</Text>
                        </Flex>
                      </GridItem>
                      <GridItem colSpan={4}>
                        <Flex
                          direction="column"
                          bg={lightBackgroundColor}
                          p={3}
                          rounded="md"
                        >
                          {summary?.data ? (
                            <Text>
                              {currentChain?.is_testnet
                                ? `${currentChain?.symbol} ${formatPrettyNumber(
                                    summary?.data?.gasSum.allTime ?? 0
                                  )}`
                                : `$${formatPrettyNumber(
                                    summary?.data?.gasQuoteSum.allTime ?? 0
                                  )}`}
                            </Text>
                          ) : (
                            <Skeleton height="24px" width="100%" />
                          )}
                          <Text color={subHeadingColor}>Fees</Text>
                        </Flex>
                      </GridItem>
                    </Grid>
                    <Tabs
                      colorScheme="primary"
                      onChange={index => setTabIndex(index)}
                      index={tabIndex}
                    >
                      <TabList
                        justifyContent="center"
                        borderColor={dividerColor}
                      >
                        <Tab>Protocols</Tab>
                        <Tab>Performance</Tab>
                      </TabList>

                      <TabPanels p={2}>
                        <TabPanel>
                          <TableContainer>
                            <Table variant="compact">
                              <Tbody>
                                {currentChain &&
                                  currentChain.protocols.map(
                                    (protocol, index) => {
                                      const contractInteractions =
                                        byContract?.data?.contracts
                                          .filter(contract =>
                                            protocol.addresses.some(
                                              address =>
                                                address.toLowerCase() ===
                                                contract?.address?.toLowerCase()
                                            )
                                          )
                                          .reduce(
                                            (accumulator, contract) => {
                                              accumulator.txCount.allTime +=
                                                parseInt(
                                                  contract.txCount
                                                    .allTime as unknown as string
                                                ) || 0;
                                              accumulator.lastTx =
                                                accumulator.lastTx ||
                                                contract.lastTx;
                                              return accumulator;
                                            },
                                            {
                                              txCount: {
                                                allTime: 0
                                              },
                                              lastTx: null as string | null // Set the initial value to string | null
                                            }
                                          );

                                      return (
                                        <Tr key={index}>
                                          <Td>
                                            <Flex
                                              direction="row"
                                              alignItems="center"
                                            >
                                              <Image
                                                src={protocol.logo_url}
                                                alt={protocol.label}
                                                boxSize="24px"
                                                mr="2"
                                                rounded="lg"
                                              />
                                              <Flex direction="column">
                                                <Flex
                                                  direction="row"
                                                  alignItems="center"
                                                  gap={1}
                                                  fontSize="xs"
                                                  fontWeight="bold"
                                                >
                                                  <Text
                                                    as="a"
                                                    href={protocol.protocol_url}
                                                    target="_blank"
                                                    textDecor={
                                                      protocol.protocol_url
                                                        ? 'underline'
                                                        : 'none'
                                                    }
                                                  >
                                                    {protocol?.label}
                                                  </Text>
                                                  <Box
                                                    display={
                                                      protocol.protocol_url
                                                        ? 'block'
                                                        : 'none'
                                                    }
                                                  >
                                                    <FiExternalLink />
                                                  </Box>
                                                </Flex>
                                              </Flex>
                                            </Flex>
                                          </Td>
                                          <Td>
                                            {byContract?.data ? (
                                              <Text fontSize="sm">
                                                {`${
                                                  contractInteractions?.txCount
                                                    .allTime ?? 0
                                                }txs`}
                                              </Text>
                                            ) : (
                                              <Skeleton
                                                height="20px"
                                                width="40px"
                                              />
                                            )}
                                          </Td>

                                          <Td>
                                            {byContract?.data ? (
                                              <Text
                                                fontSize="xs"
                                                color={subHeadingColor}
                                              >
                                                {contractInteractions?.lastTx
                                                  ? moment
                                                      .utc(
                                                        contractInteractions?.lastTx
                                                      )
                                                      .fromNow()
                                                  : 'N/A'}
                                              </Text>
                                            ) : (
                                              <Skeleton
                                                height="20px"
                                                width="40px"
                                              />
                                            )}
                                          </Td>
                                        </Tr>
                                      );
                                    }
                                  )}
                              </Tbody>
                            </Table>
                          </TableContainer>
                        </TabPanel>
                        <TabPanel>
                          <p>two!</p>
                        </TabPanel>
                      </TabPanels>
                    </Tabs>
                  </Flex>
                </CardBody>
              </Card>
            </GridItem>
          );
        })}
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
