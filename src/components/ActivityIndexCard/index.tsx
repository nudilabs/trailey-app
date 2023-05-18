import { formatDecimals } from '@/utils/format';
import {
  Box,
  Flex,
  Text,
  useColorModeValue,
  Card,
  CardBody,
  CircularProgress,
  CircularProgressLabel,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Circle
} from '@chakra-ui/react';
import { TxSummary } from '@/types/TxSummary';

type ActivityIndexCardProps = {
  txSummary: TxSummary | undefined;
};

const scores = {
  txCount: {
    min: 1,
    average: 50,
    max: 100
  },
  contractCount: {
    min: 1,
    average: 41,
    max: 100
  },
  valueQuoteSum: {
    min: 1,
    average: 1000000,
    max: 2000000
  },
  gasQuoteSum: {
    min: 1,
    average: 5079,
    max: 10000
  }
};

const weights = {
  txCount: 0.2,
  contractCount: 0.2,
  valueQuoteSum: 0.3,
  gasQuoteSum: 0.3
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

const getScoreColor = (score: number): string => {
  if (score <= 45) {
    return 'red.500';
  } else if (score <= 50) {
    return 'yellow.500';
  } else {
    return 'green.500';
  }
};

export default function ActivityIndexCard({
  txSummary
}: ActivityIndexCardProps) {
  let normalizedTxCount = 0;
  let normalizedContractCount = 0;
  let normalizedValueQuoteSum = 0;
  let normalizedGasQuoteSum = 0;

  // Calculate normalized value for the minimum to average range
  if (txSummary) {
    normalizedTxCount = calculateNormalizedValue(
      txSummary.txCount.allTime,
      scores.txCount.min,
      scores.txCount.average,
      scores.txCount.max
    );
    normalizedContractCount = calculateNormalizedValue(
      txSummary.contractCount.allTime,
      scores.contractCount.min,
      scores.contractCount.average,
      scores.contractCount.max
    );
    normalizedValueQuoteSum = calculateNormalizedValue(
      txSummary.valueQuoteSum.allTime,
      scores.valueQuoteSum.min,
      scores.valueQuoteSum.average,
      scores.valueQuoteSum.max
    );
    normalizedGasQuoteSum = calculateNormalizedValue(
      txSummary.gasQuoteSum.allTime,
      scores.gasQuoteSum.min,
      scores.gasQuoteSum.average,
      scores.gasQuoteSum.max
    );
  }

  const weightedScores = {
    txCount: normalizedTxCount * weights.txCount,
    contractCount: normalizedContractCount * weights.contractCount,
    valueQuoteSum: normalizedValueQuoteSum * weights.valueQuoteSum,
    gasQuoteSum: normalizedGasQuoteSum * weights.gasQuoteSum
  };

  const overallScore =
    weightedScores.txCount +
    weightedScores.contractCount +
    weightedScores.valueQuoteSum +
    weightedScores.gasQuoteSum;

  return (
    <Card size="lg">
      <CardBody>
        <Flex direction="column" gap={4}>
          <Flex justifyContent="center">
            <CircularProgress
              value={overallScore}
              color={getScoreColor(overallScore)}
              size={32}
              thickness={12}
              capIsRound
            >
              <CircularProgressLabel fontSize={24} fontWeight="bold">
                {formatDecimals(overallScore, 1)}
              </CircularProgressLabel>
            </CircularProgress>
          </Flex>
          <Flex justifyContent="center">
            <Heading size="md">Performance</Heading>
          </Flex>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Metrics</Th>
                </Tr>
              </Thead>
              {txSummary && (
                <Tbody>
                  <Tr>
                    <Td>
                      <Flex
                        alignItems="center"
                        gap={2}
                        justifyContent="space-between"
                      >
                        <Flex alignItems="center" gap={2}>
                          <Circle
                            size={3}
                            bg={getScoreColor(normalizedTxCount)}
                          />
                          <Text>Transactions</Text>
                        </Flex>
                        <Text color={getScoreColor(normalizedTxCount)}>
                          {formatDecimals(normalizedTxCount)}
                        </Text>
                      </Flex>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>
                      <Flex
                        alignItems="center"
                        gap={2}
                        justifyContent="space-between"
                      >
                        <Flex alignItems="center" gap={2}>
                          <Circle
                            size={3}
                            bg={getScoreColor(normalizedContractCount)}
                          />
                          <Text>Contract Interactions</Text>
                        </Flex>
                        <Text color={getScoreColor(normalizedContractCount)}>
                          {formatDecimals(normalizedContractCount)}
                        </Text>
                      </Flex>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>
                      <Flex
                        alignItems="center"
                        gap={2}
                        justifyContent="space-between"
                      >
                        <Flex alignItems="center" gap={2}>
                          <Circle
                            size={3}
                            bg={getScoreColor(normalizedValueQuoteSum)}
                          />
                          <Text>Transaction Value</Text>
                        </Flex>
                        <Text color={getScoreColor(normalizedValueQuoteSum)}>
                          {formatDecimals(normalizedValueQuoteSum)}
                        </Text>
                      </Flex>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>
                      <Flex
                        alignItems="center"
                        gap={2}
                        justifyContent="space-between"
                      >
                        <Flex alignItems="center" gap={2}>
                          <Circle
                            size={3}
                            bg={getScoreColor(normalizedGasQuoteSum)}
                          />
                          <Text>Fees Paid</Text>
                        </Flex>
                        <Text color={getScoreColor(normalizedGasQuoteSum)}>
                          {formatDecimals(normalizedGasQuoteSum)}
                        </Text>
                      </Flex>
                    </Td>
                  </Tr>
                </Tbody>
              )}
            </Table>
          </TableContainer>
          <Flex
            border={'1px solid'}
            borderColor={useColorModeValue('gray.200', 'gray.600')}
            rounded="full"
            py={1}
            px={8}
            justifyContent={'space-between'}
            alignItems={'center'}
            mt={4}
          >
            <Flex alignItems="center" gap={2}>
              <Box h="6px" w="32px" bgColor="red.500" rounded={'lg'} />
              <Text fontSize={14}>{'> 0'}</Text>
            </Flex>
            <Flex alignItems="center" gap={2}>
              <Box h="6px" w="32px" bgColor="yellow.500" rounded={'lg'} />
              <Text fontSize={14}>{`> 45`}</Text>
            </Flex>
            <Flex alignItems="center" gap={2}>
              <Box h="6px" w="32px" bgColor="green.500" rounded={'lg'} />
              <Text fontSize={14}>{'> 50'}</Text>
            </Flex>
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
}
