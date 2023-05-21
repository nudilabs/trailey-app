import { IAccount } from '@/types/Account';
import { Chain } from '@/types/Chains';
import { TxSummaryByContract } from '@/types/TxSummary';
import { formatPrettyNumber, getColorScheme } from '@/utils/format';
import {
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  IconButton,
  Tooltip,
  Image,
  Text,
  Badge,
  useColorModeValue,
  Box
} from '@chakra-ui/react';
import { FiExternalLink, FiInfo } from 'react-icons/fi';

type TopProtocolsUsageCardProps = {
  txsSummaryByContract: TxSummaryByContract | undefined;
  currentChain: Chain;
  account: IAccount;
};

export default function TopProtocolsUsageCard({
  txsSummaryByContract,
  currentChain,
  account
}: TopProtocolsUsageCardProps) {
  const subHeadingColor = useColorModeValue('blackAlpha.500', 'whiteAlpha.500');
  const subCardColor = useColorModeValue('white', 'red');
  return (
    <Card size="lg" h="100%">
      <CardHeader>
        <Flex direction="row" justifyContent="space-between">
          <Heading size="md">Top Protocols Usage</Heading>
          <Tooltip
            label="The % change is the increase in usage since last week"
            hasArrow
          >
            <IconButton
              aria-label="Previous"
              icon={<FiInfo />}
              variant="link"
            />
          </Tooltip>
        </Flex>
      </CardHeader>
      <CardBody>
        <Flex direction="column" gap={4} overflow="scroll">
          {txsSummaryByContract &&
            txsSummaryByContract.contracts.map(
              (contract: any, index: number) => {
                const protocol = currentChain.protocols.find(protocol => {
                  if (contract.address && protocol.address) {
                    return (
                      contract.address.toLowerCase() ===
                      protocol.address.toLowerCase()
                    );
                  }
                  return false;
                });

                if (!protocol) return null;
                return (
                  <Card
                    key={index}
                    size="md"
                    minWidth="240px"
                    variant={'protocol'}
                  >
                    <CardBody>
                      <Flex direction="column">
                        <Flex direction="row" alignItems="center" gap={2}>
                          {protocol?.logo_url && (
                            <Image
                              src={protocol?.logo_url}
                              boxSize="24px"
                              alt={protocol?.label}
                            />
                          )}
                          <Text
                            fontSize="xs"
                            fontWeight="bold"
                            color={subHeadingColor}
                            as="a"
                            href={`https://etherscan.io/address/${protocol?.address}?fromaddress=${account.address}`}
                            target="_blank"
                            textDecor="underline"
                          >
                            {protocol?.label}
                          </Text>
                          <Box fontSize="xs" color={subHeadingColor}>
                            <FiExternalLink />
                          </Box>
                        </Flex>
                        <Flex direction="row" alignItems="center">
                          <Heading fontSize="xl" fontWeight="bold">
                            {contract?.txCount.allTime ?? 0}
                          </Heading>
                          <Badge
                            ml={2}
                            colorScheme={getColorScheme(
                              contract?.txCount.percentChange ?? 0
                            )}
                            rounded="md"
                          >
                            {contract?.txCount.percentChange.toFixed(2)}%
                          </Badge>
                        </Flex>
                        <Flex direction="row" alignItems="center">
                          <Text
                            fontSize="xs"
                            fontWeight="bold"
                            color={subHeadingColor}
                          >
                            $
                            {formatPrettyNumber(
                              contract?.valueQuoteSum.allTime ?? 0
                            )}{' '}
                            (value)
                          </Text>
                        </Flex>
                      </Flex>
                    </CardBody>
                  </Card>
                );
              }
            )}
        </Flex>
      </CardBody>
    </Card>
  );
}
