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
  Tfoot,
  Text,
  Tooltip,
  IconButton,
  Spacer,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  SkeletonText,
  Progress
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  FiArrowRight,
  FiExternalLink,
  FiFlag,
  FiPlus,
  FiPlusCircle,
  FiSettings
} from 'react-icons/fi';
import TimeFilter from './TimeFilter';
import Link from 'next/link';
import { getFormattedAddress } from '@/utils/format';
import { getEthFromWei } from '@/utils/format';
import { useRouter } from 'next/router';
import { Avatar } from './Avatar';
import ChainSelector from './ChainSelector';
import { Chain } from '@/types/Chains';

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
    average: 3.5,
    max: 50
  }
};

const OverviewCard = ({
  txSummaries,
  localChain,
  setLocalChain,
  chainConfigs
}: {
  txSummaries: any[];
  localChain: string;
  setLocalChain: (chain: string) => void;
  chainConfigs: Chain[];
}) => {
  const router = useRouter();

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
                txSummaries.map((summary: any, i: number) => (
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
                        label={normalizedContractCount[summary.address].toFixed(
                          2
                        )}
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
                        label={normalizedValueQuoteSum[summary.address].toFixed(
                          2
                        )}
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
                ))
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
