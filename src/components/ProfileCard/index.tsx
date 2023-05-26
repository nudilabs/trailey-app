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
import { TxSummary } from '@/types/TxSummary';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { useBalance } from 'wagmi';
import { LastResync } from '@/types/LastResync';

type ProfileCardProps = {
  account: IAccount;
  chainConfigs: Chain[];
  txSummary?: TxSummary;
  handleSubmit: (e: { preventDefault: () => void }) => Promise<void>;
  localChain: string;
  setLocalChain: (chain: string) => void;
  balance:
    | {
        formatted: string;
        symbol: string;
      }
    | undefined;
};

export default function ProfileCard({
  account,
  chainConfigs,
  txSummary,
  handleSubmit,
  balance,
  localChain,
  setLocalChain
}: ProfileCardProps) {
  const subHeadingColor = useColorModeValue('blackAlpha.500', 'whiteAlpha.500');
  const toast = useToast();
  const toolTipLabel = 'compared to prior week';
  const [lastResynced, setLastResynced] = useState<LastResync>();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleResync = () => {
    handleSubmit({ preventDefault: () => {} });
    const currentDate = new Date();
    const obj = {
      chain: localChain,
      address: account.address,
      timestamp: currentDate
    };
    const localStorage = window.localStorage;
    const lrsFromLocal = localStorage.getItem('biway.lrs');
    // find the old lrs in storage
    if (lrsFromLocal) {
      let lrsFromLocalObj = JSON.parse(lrsFromLocal);
      let currentLsrObj = lrsFromLocalObj.find(
        (item: { chain: string; address: string }) =>
          item.chain === localChain && item.address === account.address
      );
      if (currentLsrObj) {
        // if found, update the timestamp
        currentLsrObj.timestamp = currentDate;
      } else {
        lrsFromLocalObj.push(obj);
      }
      localStorage.setItem('biway.lrs', JSON.stringify(lrsFromLocalObj));
      setLastResynced(currentLsrObj);
    } else {
      // if not found, create a new one
      localStorage.setItem('biway.lrs', JSON.stringify([obj]));
      setLastResynced(obj);
    }

    toast({
      title: 'Resyncing...',
      status: 'info',
      duration: 2000,
      isClosable: true,
      position: 'top-right'
    });
    // set timer to 10 seconds
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 2000);
  };

  useEffect(() => {
    const localStorage = window.localStorage;
    const lastResyncedString = localStorage.getItem('biway.lrs');
    if (lastResyncedString) {
      const lastResynced = JSON.parse(lastResyncedString).find(
        (item: { chain: string; address: string }) =>
          item.chain === localChain && item.address === account.address
      );
      setLastResynced(lastResynced);
    }
  }, [localChain]);
  return (
    <Card size="lg">
      <CardHeader>
        <Flex
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <ChainSelector
            chainConfigs={chainConfigs}
            localChain={localChain}
            setLocalChain={setLocalChain}
          />
          <Flex direction="row" alignItems="center" gap={1}>
            {lastResynced && (
              <Text color={subHeadingColor} fontSize="xs">
                {`Last resynced ${moment(lastResynced.timestamp).fromNow()}`}
              </Text>
            )}
            <Tooltip
              label={
                lastResynced &&
                moment(lastResynced.timestamp)
                  .add(10, 'minutes')
                  .isAfter(new Date())
                  ? 'You can resync once every 10 minutes'
                  : 'Resync data'
              }
              hasArrow
            >
              <IconButton
                size="sm"
                variant="ghost"
                aria-label="refresh"
                icon={<FiRefreshCw />}
                onClick={handleResync}
                isLoading={isSyncing}
                isDisabled={
                  lastResynced &&
                  moment(lastResynced.timestamp)
                    .add(10, 'minutes')
                    .isAfter(new Date())
                }
              />
            </Tooltip>
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
            <Flex direction="row" alignItems="center" gap={1}>
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
              {balance && (
                <Text color={subHeadingColor} fontSize="xs">
                  {`${formatPrettyNumber(balance.formatted)} ${balance.symbol}`}
                </Text>
              )}
            </Flex>
          </Flex>
          <Flex direction="row" width="100%" justifyContent="space-between">
            <Stat textAlign="center">
              <StatNumber>
                {formatPrettyNumber(txSummary?.txCount.allTime ?? 0, 0)}
              </StatNumber>
              <StatLabel color={subHeadingColor}>Transactions</StatLabel>
              {txSummary && txSummary.txCount.lastWeek !== 0 && (
                <Tooltip
                  label={`${formatDecimals(
                    txSummary?.txCount.percentChange ?? 0
                  )}% ${toolTipLabel}`}
                  hasArrow
                >
                  <StatHelpText>
                    {`${formatPrettyNumber(
                      txSummary?.txCount.lastWeek,
                      0
                    )} past week`}
                  </StatHelpText>
                </Tooltip>
              )}
            </Stat>
            <Stat textAlign="center">
              <StatNumber>
                <Text>
                  ${formatPrettyNumber(txSummary?.valueQuoteSum.allTime ?? 0)}
                </Text>
              </StatNumber>
              <StatLabel color={subHeadingColor}>Tx Value</StatLabel>
              {txSummary && txSummary.valueQuoteSum.lastWeek !== 0 && (
                <Tooltip
                  label={`${formatDecimals(
                    txSummary?.valueQuoteSum.percentChange ?? 0
                  )}% ${toolTipLabel}`}
                  hasArrow
                >
                  <StatHelpText>
                    {`$${formatPrettyNumber(
                      txSummary?.valueQuoteSum.lastWeek,
                      1
                    )} past week`}
                  </StatHelpText>
                </Tooltip>
              )}
            </Stat>
            <Stat textAlign="center">
              <StatNumber>
                ${formatPrettyNumber(txSummary?.gasQuoteSum.allTime ?? 0)}
              </StatNumber>
              <StatLabel color={subHeadingColor}>Fees Paid</StatLabel>
              {txSummary && txSummary.gasQuoteSum.lastWeek !== 0 && (
                <Tooltip
                  label={`${formatDecimals(
                    txSummary?.gasQuoteSum.percentChange ?? 0
                  )}% ${toolTipLabel}`}
                  hasArrow
                >
                  <StatHelpText>
                    {`$${formatPrettyNumber(
                      txSummary?.gasQuoteSum.lastWeek,
                      1
                    )} past week`}
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
