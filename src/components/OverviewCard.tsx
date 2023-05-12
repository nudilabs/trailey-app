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
  const router = useRouter();

  return (
    <Card size="lg">
      <CardHeader>
        <Flex direction="row" alignItems="center" gap={4}>
          <Heading fontSize={{ base: 'md', lg: 'xl' }}>Overview</Heading>
          <Spacer />
          <TimeFilter />
          <IconButton aria-label="Add Wallet" icon={<FiPlus />} />
        </Flex>
      </CardHeader>
      <CardBody>
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>Address</Th>
                <Th>Txs</Th>
                <Th>Value</Th>
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
                      <Flex direction="row" alignItems="center" gap={2}>
                        <Avatar address={data.address} size={24} />
                        <Button
                          colorScheme="primary"
                          variant="link"
                          rightIcon={<FiArrowRight />}
                          onClick={() => {
                            router.push(`/account/${data.address}`);
                          }}
                        >
                          {getFormattedAddress(data.address)}
                        </Button>
                      </Flex>
                    </Td>
                    <Td>
                      <Tooltip label={getPercentile(Number(data.txCount))}>
                        <Progress
                          hasStripe
                          size="sm"
                          rounded="full"
                          value={(Number(data.txCount) / percentile[50]) * 100}
                          colorScheme={getProgressBarColor(
                            Number(data.txCount)
                          )}
                        />
                      </Tooltip>
                    </Td>
                    <Td>
                      <Tooltip label={getPercentile(Number(data.txValueSum))}>
                        <Progress
                          hasStripe
                          size="sm"
                          rounded="full"
                          value={
                            (Number(data.txValueSum) / percentile[50]) * 100
                          }
                          colorScheme={getProgressBarColor(
                            Number(data.txValueSum)
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
