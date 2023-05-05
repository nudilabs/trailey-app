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
  SkeletonText
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
import { getFormattedAddress } from '@/utils/format';
import { getEthFromWei } from '@/utils/format';

type OverviewData = {
  message: string;
  txCount?: string | undefined;
  txValueSum?: string | undefined;
  contractCount?: string | undefined;
  feesPaidSum?: string | undefined;
  address: string;
};

const OverviewCard = ({
  txData,
  isLoading
}: {
  txData: OverviewData[];
  isLoading: boolean;
}) => {
  const goalColor = useColorModeValue('gray.500', 'gray.400');
  return (
    <Card size={{ base: 'lg', md: 'xl' }}>
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
          <Table variant="unstyled">
            <Thead>
              <Tr>
                <Th>Address</Th>
                <Th>Bridged</Th>
                <Th>Txns</Th>
                <Th>Contract Interact.</Th>
                <Th>Value ($)</Th>
                <Th>Gas Fees (ETH)</Th>
              </Tr>
            </Thead>
            <Tbody>
              {isLoading ? (
                <Tr>
                  <Td colSpan={6}>
                    <SkeletonText noOfLines={4} spacing="4" />
                  </Td>
                </Tr>
              ) : (
                txData.map((data, i) => (
                  <Tr key={i}>
                    <Td>
                      <Link href={`/account/${data.address}`} passHref>
                        <Button
                          colorScheme="primary"
                          variant="link"
                          rightIcon={<FiArrowRight />}
                        >
                          {getFormattedAddress(data.address)}
                        </Button>
                      </Link>
                    </Td>
                    <Td>
                      <Flex direction="row" alignItems="center" gap={1}>
                        <Text>0</Text>
                        <Tooltip label="🏆 Weekly Goal">
                          <Text fontSize="xs" color={goalColor}>{` / 0`}</Text>
                        </Tooltip>
                      </Flex>
                    </Td>
                    <Td>
                      <Flex direction="row" alignItems="center" gap={1}>
                        <Text>{data.txCount}</Text>
                        <Tooltip label="🏆 Weekly Goal">
                          <Text fontSize="xs" color={goalColor}>{` / 0`}</Text>
                        </Tooltip>
                      </Flex>
                    </Td>
                    <Td>
                      <Flex direction="row" alignItems="center" gap={1}>
                        <Text>{data.contractCount}</Text>
                        <Tooltip label="🏆 Weekly Goal">
                          <Text fontSize="xs" color={goalColor}>{` / 0`}</Text>
                        </Tooltip>
                      </Flex>
                    </Td>
                    <Td>
                      <Flex direction="row" alignItems="center" gap={1}>
                        <Text>{Number(data.txValueSum).toFixed(2)}</Text>
                        <Tooltip label="🏆 Weekly Goal">
                          <Text fontSize="xs" color={goalColor}>{` / 0 `}</Text>
                        </Tooltip>
                      </Flex>
                    </Td>
                    <Td>
                      <Flex direction="row" alignItems="center" gap={1}>
                        <Text>{getEthFromWei(data.feesPaidSum)}</Text>
                        <Tooltip label="🏆 Weekly Goal">
                          <Text fontSize="xs" color={goalColor}>{` / 0`}</Text>
                        </Tooltip>
                      </Flex>
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
