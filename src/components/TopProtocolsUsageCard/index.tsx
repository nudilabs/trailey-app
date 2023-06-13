import { IAccount } from '@/types/IAccount';
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
  Box,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Skeleton
} from '@chakra-ui/react';
import { FiExternalLink, FiInfo } from 'react-icons/fi';
import moment from 'moment';

type TopProtocolsUsageCardProps = {
  txsSummaryByContract: TxSummaryByContract | undefined;
  currentChain: Chain;
};

export default function TopProtocolsUsageCard({
  txsSummaryByContract,
  currentChain
}: TopProtocolsUsageCardProps) {
  const interactedContractCount = currentChain.protocols.reduce(
    (count, protocol) => {
      const hasInteraction = txsSummaryByContract?.contracts.some(contract =>
        protocol.addresses.some(
          address =>
            address.toLowerCase() === (contract?.address?.toLowerCase() || '')
        )
      );
      count += hasInteraction ? 1 : 0;
      return count;
    },
    0
  );

  const protocolsCount = currentChain.protocols.length;

  return (
    <Card size="lg" h="100%">
      <CardHeader>
        <Flex direction="row" justifyContent="space-between">
          <Flex direction="row" gap={2}>
            <Heading size="md">Top Protocols Usage</Heading>
            {interactedContractCount !== undefined ? (
              <Text size="md">{`${interactedContractCount} / ${protocolsCount}`}</Text>
            ) : (
              <Skeleton height="20px" width="40px" />
            )}
          </Flex>
          <Tooltip
            label="Your engagement with a curated list of protocols on a chosen blockchain. It represents your activity and interactions with the protocols deemed most prominent or influential within that particular ecosystem."
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
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Protocol</Th>
                <Th>Interactions</Th>
                <Th>Last Active</Th>
                {!currentChain.is_testnet && <Th>Volume ($)</Th>}
              </Tr>
            </Thead>
            <Tbody>
              {currentChain.protocols.map((protocol, index) => {
                const contractInteractions = txsSummaryByContract?.contracts
                  .filter(contract =>
                    protocol.addresses.some(
                      address =>
                        address.toLowerCase() ===
                        contract?.address?.toLowerCase()
                    )
                  )
                  .reduce(
                    (accumulator, contract) => {
                      accumulator.txCount.allTime +=
                        parseInt(
                          contract.txCount.allTime as unknown as string
                        ) || 0;
                      accumulator.lastTx =
                        accumulator.lastTx || contract.lastTx;
                      return accumulator;
                    },
                    {
                      txCount: {
                        allTime: 0
                      },
                      lastTx: null as string | null // Set the initial value to string | null
                    }
                  );

                return (
                  <Tr key={index}>
                    <Td>
                      <Flex direction="row" alignItems="center">
                        <Image
                          src={protocol.logo_url}
                          alt={protocol.label}
                          boxSize="24px"
                          mr="2"
                          rounded="lg"
                        />
                        <Flex direction="column">
                          <Flex
                            direction="row"
                            alignItems="center"
                            gap={1}
                            fontSize="xs"
                            fontWeight="bold"
                          >
                            <Text
                              as="a"
                              href={protocol.protocol_url}
                              target="_blank"
                              textDecor={
                                protocol.protocol_url ? 'underline' : 'none'
                              }
                            >
                              {protocol?.label}
                            </Text>
                            <Box
                              display={protocol.protocol_url ? 'block' : 'none'}
                            >
                              <FiExternalLink />
                            </Box>
                          </Flex>
                        </Flex>
                      </Flex>
                    </Td>
                    <Td>
                      {txsSummaryByContract ? (
                        contractInteractions?.txCount.allTime ?? 0
                      ) : (
                        <Skeleton height="20px" />
                      )}
                    </Td>

                    <Td>
                      {txsSummaryByContract ? (
                        contractInteractions?.lastTx ? (
                          moment.utc(contractInteractions?.lastTx).fromNow()
                        ) : (
                          'N/A'
                        )
                      ) : (
                        <Skeleton height="20px" />
                      )}
                    </Td>
                    {!currentChain.is_testnet && (
                      <Td>
                        {txsSummaryByContract ? (
                          `Coming soon`
                        ) : (
                          <Skeleton height="20px" />
                        )}
                      </Td>
                    )}
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  );
}
