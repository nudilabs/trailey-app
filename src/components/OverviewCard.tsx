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
  Tooltip
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiExternalLink, FiPlusCircle } from 'react-icons/fi';
import TimeFilter from './TimeFilter';

type OverviewData = {
  address: string;
  bridged: { value: number; goal: number };
  txns: {
    smartContract: { value: number; goal: number };
    general: { value: number; goal: number };
    average: { value: number; goal: number };
    value: { value: number; goal: number };
  };
};

const OverviewCard = ({ txData }: { txData: OverviewData[] }) => {
  const hoverBg = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');
  const goalColor = useColorModeValue('gray.500', 'gray.400');
  return (
    <Card size={{ base: 'sm', md: 'md', lg: 'lg' }}>
      <CardHeader>
        <Flex direction="row" justifyContent="space-between">
          <Flex direction="row" alignItems="center" gap={4}>
            <Heading fontSize={{ base: 'md', lg: 'xl' }}>Overview</Heading>
            <Button
              size="xs"
              colorScheme="pink"
              variant="link"
              leftIcon={<FiPlusCircle />}
            >
              Add Wallet
            </Button>
          </Flex>
          <TimeFilter />
        </Flex>
      </CardHeader>
      <CardBody>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Address</Th>
                <Th isNumeric>Bridged</Th>
                <Th isNumeric>Avg Txns / Month</Th>
                <Th isNumeric>Txns</Th>
                <Th isNumeric>Contract Interact.</Th>
                <Th isNumeric>Value</Th>
              </Tr>
            </Thead>
            <Tbody>
              {txData.map(data => (
                <Tr
                  key={data.address}
                  _hover={{
                    bg: hoverBg
                  }}
                >
                  <Td>
                    <Button
                      colorScheme="pink"
                      variant="link"
                      rightIcon={<FiArrowRight />}
                      as="a"
                      href={`/account/${data.address}`}
                    >
                      {data.address}
                    </Button>
                  </Td>
                  <Td isNumeric>
                    <Flex direction="row" alignItems="center" gap={1}>
                      <Text>{data.bridged.value}</Text>
                      <Tooltip label="🏆 Goal">
                        <Text
                          fontSize="xs"
                          color={goalColor}
                        >{` / ${data.bridged.goal} ETH`}</Text>
                      </Tooltip>
                    </Flex>
                  </Td>
                  <Td isNumeric>
                    <Flex direction="row" alignItems="center" gap={1}>
                      <Text>{data.txns.average.value}</Text>
                      <Tooltip label="🏆 Goal">
                        <Text
                          fontSize="xs"
                          color={goalColor}
                        >{` / ${data.txns.average.goal}`}</Text>
                      </Tooltip>
                    </Flex>
                  </Td>
                  <Td isNumeric>
                    <Flex direction="row" alignItems="center" gap={1}>
                      <Text>{data.txns.general.value}</Text>
                      <Tooltip label="🏆 Goal">
                        <Text
                          fontSize="xs"
                          color={goalColor}
                        >{` / ${data.txns.general.goal}`}</Text>
                      </Tooltip>
                    </Flex>
                  </Td>
                  <Td isNumeric>
                    <Flex direction="row" alignItems="center" gap={1}>
                      <Text>{data.txns.smartContract.value}</Text>
                      <Tooltip label="🏆 Goal">
                        <Text
                          fontSize="xs"
                          color={goalColor}
                        >{` / ${data.txns.smartContract.goal}`}</Text>
                      </Tooltip>
                    </Flex>
                  </Td>
                  <Td isNumeric>
                    <Flex direction="row" alignItems="center" gap={1}>
                      <Text>{data.txns.value.value}</Text>
                      <Tooltip label="🏆 Goal">
                        <Text
                          fontSize="xs"
                          color={goalColor}
                        >{` / ${data.txns.value.goal} ETH`}</Text>
                      </Tooltip>
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  );
};

export default OverviewCard;
