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
  MenuItem
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  FiArrowRight,
  FiExternalLink,
  FiFlag,
  FiPlusCircle,
  FiSettings
} from 'react-icons/fi';
import TimeFilter from './TimeFilter';
import Link from 'next/link';

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
  const goalColor = useColorModeValue('gray.500', 'gray.400');
  return (
    <Card size={{ base: 'sm', md: 'md', lg: 'lg' }}>
      <CardHeader>
        <Flex direction="row" alignItems="center" gap={4}>
          <Flex direction="row" alignItems="center" gap={4}>
            <Heading fontSize={{ base: 'md', lg: 'xl' }}>Overview</Heading>
          </Flex>
          <Spacer />
          <TimeFilter />
          <Menu isLazy>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<FiSettings />}
              variant="outline"
              size="sm"
            />
            <MenuList>
              <MenuItem icon={<FiPlusCircle />}>Add Wallet</MenuItem>
              <MenuItem icon={<FiFlag />}>Edit Goals</MenuItem>
            </MenuList>
          </Menu>
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
                <Tr key={data.address}>
                  <Td>
                    <Link href={`/account/${data.address}`} passHref>
                      <Button
                        colorScheme="primary"
                        variant="link"
                        rightIcon={<FiArrowRight />}
                      >
                        {data.address}
                      </Button>
                    </Link>
                  </Td>
                  <Td isNumeric>
                    <Flex direction="row" alignItems="center" gap={1}>
                      <Text>{data.bridged.value}</Text>
                      <Tooltip label="🏆 Weekly Goal">
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
                      <Tooltip label="🏆 Weekly Goal">
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
                      <Tooltip label="🏆 Weekly Goal">
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
                      <Tooltip label="🏆 Weekly Goal">
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
                      <Tooltip label="🏆 Weekly Goal">
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
