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
import { IAccount } from '@/types/Account';
import { Chain } from '@/types/Chains';

type ProfileCardProps = {
  account: IAccount;
  chainConfigs: Chain[];
  txSummary: any;
  handleSubmit: (e: { preventDefault: () => void }) => Promise<void>;
};

export default function ProfileCard({
  account,
  chainConfigs,
  txSummary,
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
              <StatNumber>
                {formatPrettyNumber(txSummary?.txCount.value ?? 0, 0)}
              </StatNumber>
              <StatLabel color={subHeadingColor}>Transactions</StatLabel>
              {txSummary?.valueQuoteSum.percentChange > 0 && (
                <Tooltip label="Percent change from 7 days ago" hasArrow>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    {formatDecimals(txSummary?.txCount.percentChange ?? 0)}%
                  </StatHelpText>
                </Tooltip>
              )}
            </Stat>
            <Stat textAlign="center">
              <StatNumber>
                <Text>
                  ${formatPrettyNumber(txSummary?.valueQuoteSum.value ?? 0)}
                </Text>
              </StatNumber>
              <StatLabel>Total Tx Value</StatLabel>
              {txSummary?.valueQuoteSum.percentChange > 0 && (
                <Tooltip label="Percent change from 7 days ago" hasArrow>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    {formatDecimals(
                      txSummary?.valueQuoteSum.percentChange ?? 0
                    )}
                    %
                  </StatHelpText>
                </Tooltip>
              )}
            </Stat>
            <Stat textAlign="center">
              <StatNumber>
                ${formatPrettyNumber(txSummary?.gasQuoteSum.value ?? 0)}
              </StatNumber>
              <StatLabel color={subHeadingColor}>Fees Paid</StatLabel>
              {txSummary?.valueQuoteSum.percentChange > 0 && (
                <Tooltip label="Percent change from 7 days ago" hasArrow>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    {formatDecimals(txSummary?.gasQuoteSum.percentChange ?? 0)}%
                  </StatHelpText>
                </Tooltip>
              )}
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
