import { Chain } from '@/types/Chains';
import { formatDecimals, formatPrettyNumber } from '@/utils/format';
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
  useColorModeValue
} from '@chakra-ui/react';
import { FiInfo } from 'react-icons/fi';

type TopProtocolsUsageCardProps = {
  txsSummaryByContract: any;
  currentChain: Chain;
};

export default function TopProtocolsUsageCard({
  txsSummaryByContract,
  currentChain
}: TopProtocolsUsageCardProps) {
  const subHeadingColor = useColorModeValue('blackAlpha.500', 'whiteAlpha.500');
  return (
    <Card size="lg">
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
        <Flex direction="row" gap={4} overflow="scroll">
          {txsSummaryByContract &&
            txsSummaryByContract?.contracts.map(
              (contract: any, index: number) => {
                const protocol = currentChain.protocols.find(
                  p => p.address === contract.address
                );
                if (!protocol) return null;
                return (
                  <Card key={index} size="md" minWidth="240px">
                    <CardBody>
                      <Flex direction="column">
                        <Flex direction="row" alignItems="center">
                          {protocol?.logo_url && (
                            <Image
                              src={protocol?.logo_url}
                              boxSize="24px"
                              mr={1}
                              alt={protocol?.label}
                            />
                          )}
                          <Text
                            fontSize="xs"
                            fontWeight="bold"
                            color={subHeadingColor}
                          >
                            {protocol?.label}
                          </Text>
                        </Flex>
                        <Flex direction="row" alignItems="center">
                          <Heading fontSize="xl" fontWeight="bold">
                            {contract?.txCount.value ?? 0}
                          </Heading>
                          <Badge
                            ml={2}
                            colorScheme={
                              contract?.txCount.percentChange ?? 0 > 0
                                ? 'green'
                                : 'gray'
                            }
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
                              contract?.valueQuoteSum.value ?? 0
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
