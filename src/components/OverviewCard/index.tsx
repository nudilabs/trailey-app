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

import { formatPrettyNumber, getFormattedAddress } from '@/utils/format';
import { useRouter } from 'next/router';
import Avatar from '../Avatar';
import ChainSelector from '../ChainSelector';
import { Chain } from '@/types/Chains';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { LastResync } from '@/types/LastResync';

const OverviewCard = ({
  txSummaries,
  txSummariesByMonth,
  localChain,
  setLocalChain,
  chainConfigs,
  handleSubmit
}: {
  txSummaries: any[];
  txSummariesByMonth: any[];
  localChain: string;
  setLocalChain: (chain: string) => void;
  chainConfigs: Chain[];
  handleSubmit: (e: { preventDefault: () => void }) => Promise<void>;
}) => {
  const [lastResynced, setLastResynced] = useState<LastResync[]>();
  const [isSyncing, setIsSyncing] = useState(false);
  const [symbol, setSymbol] = useState('ETH');

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
      const lrsFromLocal = localStorage.getItem('abtrail.lrs');
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
        localStorage.setItem('abtrail.lrs', JSON.stringify(lrsFromLocalObj));
        lastResyncs.push(currentLsrObj);
      } else {
        // if not found, create a new one
        localStorage.setItem('abtrail.lrs', JSON.stringify([obj]));
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
    const lastResyncedString = localStorage.getItem('abtrail.lrs');
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

  useEffect(() => {
    if (chainConfigs) {
      const symbol = chainConfigs?.find(
        (chain: Chain) => chain.name === localChain
      )?.symbol;
      if (symbol) setSymbol(symbol);
    }
  }, []);

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
                <Th>Active Months</Th>
                <Th>Contract Interactions</Th>
                <Th>{`${symbol} Volume`}</Th>
                <Th>Fees Paid</Th>
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
                  const activeMonths =
                    txSummariesByMonth.find(
                      (item: any) => item.address === summary.address
                    )?.data.txsByMonth.length || 0;
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
                              router.push(`/address/${summary.address}`);
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
                      <Td>{activeMonths}</Td>
                      <Td>
                        {formatPrettyNumber(
                          summary.data.contractCount.allTime,
                          0
                        )}
                      </Td>
                      <Td>
                        $
                        {formatPrettyNumber(summary.data.valueQuoteSum.allTime)}
                      </Td>
                      <Td>
                        ${formatPrettyNumber(summary.data.gasQuoteSum.allTime)}
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
  if (value <= 0) {
    return 0;
  }
  if (value <= average) {
    return ((value - min) / (average - min)) * 0.5 * 100;
  } else {
    return (0.5 + ((value - average) / (max - average)) * 0.5) * 100;
  }
};
