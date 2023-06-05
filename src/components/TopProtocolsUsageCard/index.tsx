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
  account: IAccount;
};

export default function TopProtocolsUsageCard({
  txsSummaryByContract,
  currentChain,
  account
}: TopProtocolsUsageCardProps) {
  const subHeadingColor = useColorModeValue('blackAlpha.500', 'whiteAlpha.500');
  const subCardColor = useColorModeValue('white', 'red');
  const interactedContractCount = txsSummaryByContract?.contracts.filter(
    contract => {
      // Check if the contract address is included in protocols

      return currentChain.protocols.some(
        protocol =>
          protocol?.address?.toLowerCase() === contract?.address?.toLowerCase()
      );
    }
  ).length;

  const protocolsCount = currentChain.protocols.length;

  return (
    <Card size="lg" h="100%">
      <CardHeader>
        <Flex direction="row" justifyContent="space-between">
          <Flex direction="row" gap={2}>
            <Heading size="md">Top Protocols Usage</Heading>
            <Text size="md">{`${interactedContractCount} / ${protocolsCount}`}</Text>
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
                <Th>Volume ($)</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentChain.protocols.map((protocol, index) => {
                const contractInteractions =
                  txsSummaryByContract?.contracts.find(
                    contract =>
                      contract.address.toLowerCase() ===
                      protocol.address.toLowerCase()
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
                              href={`${currentChain.block_explorer_url}address/${protocol.address}`}
                              target="_blank"
                              textDecor="underline"
                            >
                              {protocol?.label}
                            </Text>
                            <FiExternalLink />
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
                          moment(contractInteractions?.lastTx).fromNow()
                        ) : (
                          'N/A'
                        )
                      ) : (
                        <Skeleton height="20px" />
                      )}
                    </Td>
                    <Td>
                      {txsSummaryByContract ? (
                        `Coming soon`
                      ) : (
                        <Skeleton height="20px" />
                      )}
                    </Td>
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
