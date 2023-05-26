import {
  Card,
  CardHeader,
  CardBody,
  Flex,
  Heading,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  useColorModeValue,
  Button,
  Text,
  Tooltip,
  IconButton,
  Spacer,
  SkeletonText,
  Progress,
  useToast
} from '@chakra-ui/react';

import { FiArrowRight, FiRefreshCw } from 'react-icons/fi';

import { getFormattedAddress } from '@/utils/format';
import { useRouter } from 'next/router';
import { Avatar } from './Avatar';
import ChainSelector from './ChainSelector';
import { Chain } from '@/types/Chains';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { LastResync } from '@/types/LastResync';

const scores = {
  txCount: {
    min: 1,
    average: 35,
    max: 500
  },
  contractCount: {
    min: 1,
    average: 35,
    max: 500
  },
  valueQuoteSum: {
    min: 1,
    average: 1000,
    max: 1000000
  },
  gasQuoteSum: {
    min: 1,
    average: 35,
    max: 500
  }
};

const OverviewCard = ({
  txSummaries,
  localChain,
  setLocalChain,
  chainConfigs,
  handleSubmit
}: {
  txSummaries: any[];
  localChain: string;
  setLocalChain: (chain: string) => void;
  chainConfigs: Chain[];
  handleSubmit: (e: { preventDefault: () => void }) => Promise<void>;
}) => {
  const [lastResynced, setLastResynced] = useState<LastResync[]>();
  const [isSyncing, setIsSyncing] = useState(false);

  const router = useRouter();
  const toast = useToast();

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
      const lrsFromLocal = localStorage.getItem('biway.lrs');
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
        localStorage.setItem('biway.lrs', JSON.stringify(lrsFromLocalObj));
        lastResyncs.push(currentLsrObj);
      } else {
        // if not found, create a new one
        localStorage.setItem('biway.lrs', JSON.stringify([obj]));
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
    // set timer to 10 seconds
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 2000);
  };

  useEffect(() => {
    const localStorage = window.localStorage;
    const lastResyncedString = localStorage.getItem('biway.lrs');
    const lastResyncs: LastResync[] = [];
    txSummaries.forEach((summary: any) => {
      if (lastResyncedString) {
        const lastResynced = JSON.parse(lastResyncedString).find(
          (item: { chain: string; address: string }) =>
            item.chain === localChain && item.address === summary.address
        );
        lastResyncs.push(lastResynced);
      }
    });
    setLastResynced(lastResyncs);
  }, [localChain]);

  const getScoreColor = (score: number): string => {
    if (score <= 45) {
      return 'red';
    } else if (score <= 49) {
      return 'yellow';
    } else if (score == 50) {
      return 'gray';
    } else {
      return 'green';
    }
  };

  let normalizedTxCount: any[] = [];
  let normalizedContractCount: any[] = [];
  let normalizedValueQuoteSum: any[] = [];
  let normalizedGasQuoteSum: any[] = [];

  // Calculate normalized value for the minimum to average range
  if (txSummaries.every((summary: any) => !summary.isLoading)) {
    txSummaries.forEach((summary: any) => {
      normalizedTxCount[summary.address] = calculateNormalizedValue(
        summary.data.txCount.allTime,
        scores.txCount.min,
        scores.txCount.average,
        scores.txCount.max
      );
      normalizedContractCount[summary.address] = calculateNormalizedValue(
        summary.data.contractCount.allTime,
        scores.contractCount.min,
        scores.contractCount.average,
        scores.contractCount.max
      );
      normalizedValueQuoteSum[summary.address] = calculateNormalizedValue(
        summary.data.valueQuoteSum.allTime,
        scores.valueQuoteSum.min,
        scores.valueQuoteSum.average,
        scores.valueQuoteSum.max
      );
      normalizedGasQuoteSum[summary.address] = calculateNormalizedValue(
        summary.data.gasQuoteSum.allTime,
        scores.gasQuoteSum.min,
        scores.gasQuoteSum.average,
        scores.gasQuoteSum.max
      );
    });
  }

  return (
    <Card size="lg">
      <CardHeader>
        <Flex direction="row" alignItems="center" gap={4}>
          <Heading fontSize={{ base: 'md', lg: 'xl' }}>Overview</Heading>
          <Spacer />
          <Flex direction="row" alignItems="center" gap={1}>
            <Tooltip
              label={
                lastResynced &&
                lastResynced.length > 0 &&
                moment(lastResynced[0].timestamp)
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
                  moment(lastResynced[0].timestamp)
                    .add(10, 'minutes')
                    .isAfter(new Date())
                }
              />
            </Tooltip>
          </Flex>
          <ChainSelector
            chainConfigs={chainConfigs}
            localChain={localChain}
            setLocalChain={setLocalChain}
          />
        </Flex>
      </CardHeader>
      <CardBody>
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>Address</Th>
                <Th>Last Synced</Th>
                <Th>Txs</Th>
                <Th>Contracts</Th>
                <Th>Value</Th>
                <Th>Gas</Th>
              </Tr>
            </Thead>
            <Tbody>
              {txSummaries.some((summary: any) => summary.isLoading) ? (
                <Tr>
                  <Td colSpan={6}>
                    <SkeletonText noOfLines={4} spacing="4" />
                  </Td>
                </Tr>
              ) : (
                txSummaries.map((summary: any, i: number) => {
                  const lastResyncStatus =
                    lastResynced &&
                    lastResynced.length > 0 &&
                    lastResynced.find(
                      (item: { chain: string; address: string }) =>
                        item?.chain === localChain &&
                        item?.address === summary.address
                    );
                  return (
                    <Tr key={i}>
                      <Td>
                        <Flex direction="row" alignItems="center" gap={2}>
                          <Avatar address={summary.address} size={24} />
                          <Button
                            colorScheme="primary"
                            variant="link"
                            rightIcon={<FiArrowRight />}
                            onClick={() => {
                              router.push(`/account/${summary.address}`);
                            }}
                          >
                            {getFormattedAddress(summary.address)}
                          </Button>
                        </Flex>
                      </Td>
                      <Td>
                        {lastResyncStatus && (
                          <Text fontSize="sm">
                            {lastResyncStatus?.timestamp
                              ? moment(lastResyncStatus?.timestamp).fromNow()
                              : ''}
                          </Text>
                        )}
                      </Td>
                      <Td>
                        <Tooltip
                          label={normalizedTxCount[summary.address].toFixed(2)}
                        >
                          <Progress
                            hasStripe
                            size="sm"
                            rounded="full"
                            value={normalizedTxCount[summary.address]}
                            colorScheme={getScoreColor(
                              normalizedTxCount[summary.address]
                            )}
                          />
                        </Tooltip>
                      </Td>
                      <Td>
                        <Tooltip
                          label={normalizedContractCount[
                            summary.address
                          ].toFixed(2)}
                        >
                          <Progress
                            hasStripe
                            size="sm"
                            rounded="full"
                            value={normalizedContractCount[summary.address]}
                            colorScheme={getScoreColor(
                              normalizedContractCount[summary.address]
                            )}
                          />
                        </Tooltip>
                      </Td>
                      <Td>
                        <Tooltip
                          label={normalizedValueQuoteSum[
                            summary.address
                          ].toFixed(2)}
                        >
                          <Progress
                            hasStripe
                            size="sm"
                            rounded="full"
                            value={normalizedValueQuoteSum[summary.address]}
                            colorScheme={getScoreColor(
                              normalizedValueQuoteSum[summary.address]
                            )}
                          />
                        </Tooltip>
                      </Td>
                      <Td>
                        <Tooltip
                          label={normalizedGasQuoteSum[summary.address].toFixed(
                            2
                          )}
                        >
                          <Progress
                            hasStripe
                            size="sm"
                            rounded="full"
                            value={normalizedGasQuoteSum[summary.address]}
                            colorScheme={getScoreColor(
                              normalizedGasQuoteSum[summary.address]
                            )}
                          />
                        </Tooltip>
                      </Td>
                    </Tr>
                  );
                })
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  );
};

export default OverviewCard;

const percentile = {
  90: 100,
  75: 50,
  50: 40
};

const getPercentile = (value: number) => {
  if (value < percentile[50])
    return `${value}/${percentile[50]} txs until top 50%`;
  else if (value < percentile[75])
    return `${value}/${percentile[75]} txs until top 25%`;
  else if (value < percentile[90])
    return `${value}/${percentile[90]} txs until top 10%`;
  else return `Top 10%`;
};

const getProgressBarColor = (value: number) => {
  const val = (value / percentile[50]) * 100;
  switch (true) {
    case val < 25:
      return 'red';
    case val < 50:
      return 'orange';
    case val < 75:
      return 'yellow';
    case val < 100:
      return 'green';
    default:
      if (value > percentile[75]) return 'purple';
      return 'blue';
  }
};

const calculateNormalizedValue = (
  value: number,
  min: number,
  average: number,
  max: number
) => {
  if (value <= average) {
    return ((value - min) / (average - min)) * 0.5 * 100;
  } else {
    return (0.5 + ((value - average) / (max - average)) * 0.5) * 100;
  }
};
