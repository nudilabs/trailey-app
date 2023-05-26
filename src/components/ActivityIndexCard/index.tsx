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
  Circle,
  Tooltip,
  CardHeader
} from '@chakra-ui/react';
import { TxSummary } from '@/types/TxSummary';
import { FiInfo } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { Chain } from '@/types/Chains';

type ActivityIndexCardProps = {
  txSummary: TxSummary | undefined;
  localChain: string;
  chainConfigs: Chain[];
};

// const scores = {
//   txCount: {
//     min: 1,
//     average: 35,
//     max: 500
//   },
//   contractCount: {
//     min: 1,
//     average: 35,
//     max: 500
//   },
//   valueQuoteSum: {
//     min: 1,
//     average: 1000,
//     max: 1000000
//   },
//   gasQuoteSum: {
//     min: 1,
//     average: 35,
//     max: 500
//   }
// };

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

export default function ActivityIndexCard({
  txSummary,
  chainConfigs,
  localChain
}: ActivityIndexCardProps) {
  const [scores, setScores] = useState<any>({});
  const [score, setScore] = useState<number>(0);
  let normalizedTxCount = 0;
  let normalizedContractCount = 0;
  let normalizedValueQuoteSum = 0;
  let normalizedGasQuoteSum = 0;

  //colors
  const red = useColorModeValue('red.500', 'red.400');
  const yellow = useColorModeValue('yellow.500', 'yellow.400');
  const average = useColorModeValue('gray.700', 'gray.400');
  const green = useColorModeValue('green.500', 'green.400');

  const getScoreColor = (score: number): string => {
    if (score <= 45) {
      return red;
    } else if (score <= 49) {
      return yellow;
    } else if (score == 50) {
      return average;
    } else {
      return green;
    }
  };

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

  useEffect(() => {
    setScore(overallScore);
  }, [overallScore]);

  useEffect(() => {
    if (chainConfigs) {
      const scores = chainConfigs?.find(
        (chain: Chain) => chain.name === localChain
      )?.scores;
      setScores(scores);
    }
  }, [localChain]);

  return (
    <Card size="lg">
      <CardHeader>
        <Flex justifyContent="space-between">
          <Heading size="md">Performance</Heading>
          <Tooltip
            label="The Activity Index is a score between 0 and 100 that measures the overall activity of a blockchain address. It is calculated by combining the normalized values of the number of transactions, number of contract interactions, total value transferred, and total gas used."
            placement="top"
            hasArrow
          >
            <Box>
              <FiInfo />
            </Box>
          </Tooltip>
        </Flex>
      </CardHeader>
      <CardBody>
        <Flex direction="column" gap={4}>
          <Flex justifyContent="center">
            <CircularProgress
              value={score}
              color={getScoreColor(score)}
              size={32}
              thickness={12}
              capIsRound
              trackColor={useColorModeValue('gray.100', 'gray.700')}
            >
              <CircularProgressLabel fontSize={24} fontWeight="bold">
                {formatDecimals(score, 1)}
              </CircularProgressLabel>
            </CircularProgress>
          </Flex>
          {/* <Flex justifyContent="center">
            <Heading size="md">Performance</Heading>
          </Flex> */}
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Metrics</Th>
                </Tr>
              </Thead>
              {txSummary && (
                <Tbody>
                  <Tr
                    onMouseEnter={() => setScore(normalizedTxCount)}
                    onMouseLeave={() => setScore(overallScore)}
                  >
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
                  <Tr
                    onMouseEnter={() => setScore(normalizedContractCount)}
                    onMouseLeave={() => setScore(overallScore)}
                  >
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
                  <Tr
                    onMouseEnter={() => setScore(normalizedValueQuoteSum)}
                    onMouseLeave={() => setScore(overallScore)}
                  >
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
                  <Tr
                    onMouseEnter={() => setScore(normalizedGasQuoteSum)}
                    onMouseLeave={() => setScore(overallScore)}
                  >
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
          <Flex justifyContent="center">
            <Flex direction="row" w="87%" mt={4}>
              <Flex direction="column" w="30%">
                <Flex
                  px={2}
                  bgColor={red}
                  direction="row"
                  h="8px"
                  w="100%"
                  border="1px solid"
                  borderColor={useColorModeValue('white', 'gray.900')}
                  roundedStart="full"
                />
                <Text
                  fontSize="xs"
                  color={useColorModeValue('black', 'gray.400')}
                >
                  0
                </Text>
              </Flex>
              <Flex direction="column" w="20%">
                <Flex
                  px={2}
                  bgColor={yellow}
                  direction="row"
                  h="8px"
                  w="100%"
                  border="1px solid"
                  borderColor={useColorModeValue('white', 'gray.900')}
                />
                <Text
                  fontSize="xs"
                  color={useColorModeValue('black', 'gray.400')}
                >
                  30
                </Text>
              </Flex>
              <Flex direction="column" w="50%">
                <Flex
                  px={2}
                  bgColor={green}
                  direction="row"
                  h="8px"
                  w="100%"
                  alignItems="center"
                  justifyContent="center"
                  border="1px solid"
                  borderColor={useColorModeValue('white', 'gray.900')}
                  roundedEnd="full"
                />
                <Text
                  fontSize="xs"
                  color={useColorModeValue('black', 'gray.400')}
                >
                  50
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
}
