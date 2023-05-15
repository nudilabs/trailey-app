import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  IconButton,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  Tooltip,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import ChainSelector from '../ChainSelector';
import { FiRefreshCw } from 'react-icons/fi';
import { Avatar } from '../Avatar';
import {
  formatDecimals,
  formatPrettyNumber,
  getEthFromWei,
  getFormattedAddress
} from '@/utils/format';
import { Account } from '@/types/Account';
import { Chain } from '@/types/Chains';

type ProfileCardProps = {
  account: Account;
  chainConfigs: Chain[];
  totalTxs: number;
  txsChange: number;
  totalValue: number;
  valueChange: number;
  totalFees: number;
  feesChange: number;
  handleSubmit: (e: { preventDefault: () => void }) => Promise<void>;
};

export default function ProfileCard({
  account,
  chainConfigs,
  totalTxs,
  txsChange,
  totalValue,
  valueChange,
  totalFees,
  feesChange,
  handleSubmit
}: ProfileCardProps) {
  const subHeadingColor = useColorModeValue('blackAlpha.500', 'whiteAlpha.500');
  const toast = useToast();
  return (
    <Card size="lg">
      <CardHeader>
        <Flex
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <ChainSelector chainConfigs={chainConfigs} />
          <Flex direction="row" alignItems="center" gap={1}>
            <Text
              color={useColorModeValue('blackAlpha.500', 'whiteAlpha.500')}
              fontSize="xs"
            >
              Resynced 2 days ago
            </Text>
            <IconButton
              size="sm"
              variant="ghost"
              aria-label="refresh"
              icon={<FiRefreshCw />}
              onClick={handleSubmit}
            />
          </Flex>
        </Flex>
      </CardHeader>
      <CardBody>
        <Flex direction="column" alignItems="center" gap={3}>
          <Avatar
            address={account.address}
            size={100}
            ensImage={account.avatarUrl}
          />
          <Flex direction="column" alignItems="center" gap={2}>
            <Heading
              size={account.ensName.length > 19 ? 'md' : 'lg'}
              textAlign="center"
              marginTop={2}
            >
              {account.ensName}
            </Heading>
            <Button
              color={subHeadingColor}
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(account.address);
                toast({
                  title: 'Copied to clipboard',
                  status: 'info',
                  duration: 1500,
                  isClosable: true,
                  position: 'top-right'
                });
              }}
            >
              {getFormattedAddress(account.address)}
            </Button>
          </Flex>
          <Flex direction="row" width="100%" justifyContent="space-between">
            <Stat textAlign="center">
              <StatNumber>{formatPrettyNumber(totalTxs)}</StatNumber>
              <StatLabel color={subHeadingColor}>Transactions</StatLabel>
              <Tooltip label="Percent change from 7 days ago" hasArrow>
                <StatHelpText>
                  <StatArrow type="increase" />
                  {txsChange.toFixed(2)}%
                </StatHelpText>
              </Tooltip>
            </Stat>
            <Stat textAlign="center">
              <StatNumber>
                <Text>${formatDecimals(totalValue)}</Text>
              </StatNumber>
              <StatLabel>Total Tx Value</StatLabel>
              <Tooltip label="Percent change from 7 days ago" hasArrow>
                <StatHelpText>
                  <StatArrow type="increase" />
                  {valueChange.toFixed(2)}%
                </StatHelpText>
              </Tooltip>
            </Stat>
            <Stat textAlign="center">
              <StatNumber>{getEthFromWei(totalFees)}</StatNumber>
              <StatLabel color={subHeadingColor}>Fees Paid</StatLabel>
              <Tooltip label="Percent change from 7 days ago" hasArrow>
                <StatHelpText>
                  <StatArrow type="increase" />
                  {feesChange.toFixed(2)}%
                </StatHelpText>
              </Tooltip>
            </Stat>
          </Flex>
        </Flex>
      </CardBody>
      <CardFooter>
        <Text
          color={useColorModeValue('blackAlpha.500', 'whiteAlpha.500')}
          fontSize="xs"
        >
          Powered by Biway Analytics
        </Text>
      </CardFooter>
    </Card>
  );
}
