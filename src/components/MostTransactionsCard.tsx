import { getEmojiForIndex } from '@/utils/format';
import {
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Image,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react';

type TxData = {
  chain: {
    name: string;
    icon: string;
  };
  txns: number;
};

const MostTransactionsCard = ({ data }: { data: TxData[] }) => {
  return (
    <Card size={{ base: 'sm', md: 'md', lg: 'lg' }}>
      <CardHeader>
        <Flex direction="row" justifyContent="space-between">
          <Heading fontSize={{ base: 'md', lg: 'xl' }}>
            Most Transactions
          </Heading>
        </Flex>
      </CardHeader>
      <CardBody>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>Chain</Th>
                <Th>Txns</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map((c, index) => (
                <Tr key={index}>
                  <Td>{getEmojiForIndex(index)}</Td>
                  <Td>
                    <Flex direction="row" gap={2} alignItems="center">
                      <Image
                        src={c.chain.icon}
                        alt={c.chain.name}
                        boxSize="18px"
                        rounded="full"
                      />
                      {c.chain.name}{' '}
                    </Flex>
                  </Td>
                  <Td>{c.txns.toLocaleString()}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  );
};

export default MostTransactionsCard;
