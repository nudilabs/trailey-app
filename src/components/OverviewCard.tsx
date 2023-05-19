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

const OverviewCard = ({
  txSummaries,
  isLoading,
  localChain,
  setLocalChain,
  chainConfigs
}: {
  txSummaries: any;
  isLoading: boolean;
  localChain: string;
  setLocalChain: (chain: string) => void;
  chainConfigs: Chain[];
}) => {
  const goalColor = useColorModeValue('gray.500', 'gray.400');
  const router = useRouter();

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
                txSummaries.map((data: any, i: number) => (
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
                      <Tooltip
                        label={getPercentile(Number(data?.txCount?.value))}
                      >
                        <Progress
                          hasStripe
                          size="sm"
                          rounded="full"
                          value={
                            (Number(data?.txCount?.value) / percentile[50]) *
                            100
                          }
                          colorScheme={getProgressBarColor(
                            Number(data?.txCount?.value)
                          )}
                        />
                      </Tooltip>
                    </Td>
                    <Td>
                      <Tooltip
                        label={getPercentile(Number(data.valueQuoteSum))}
                      >
                        <Progress
                          hasStripe
                          size="sm"
                          rounded="full"
                          value={
                            (Number(data.valueQuoteSum?.value) /
                              percentile[50]) *
                            100
                          }
                          colorScheme={getProgressBarColor(
                            Number(data.valueQuoteSum?.value)
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
