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
  Td
} from '@chakra-ui/react';

type TxnsValueData = {
  address: string;
  txns: {
    symbol: string;
    amount: number;
  };
};

const TxnsValueCard = ({ txData }: { txData: TxnsValueData[] }) => {
  return (
    <Card size={{ base: 'sm', md: 'md', lg: 'lg' }}>
      <CardHeader>
        <Flex direction="row" justifyContent="space-between">
          <Heading fontSize={{ base: 'md', lg: 'xl' }}>Txns Value</Heading>
          <Heading fontSize={{ base: 'md', lg: 'xl' }}>66</Heading>
        </Flex>
      </CardHeader>
      <CardBody>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Address</Th>
                <Th isNumeric>Txns Value</Th>
              </Tr>
            </Thead>
            <Tbody>
              {txData.map(data => (
                <Tr key={data.address}>
                  <Td>{data.address}</Td>
                  <Td isNumeric>{`${data.txns.amount.toLocaleString('en-US')} ${
                    data.txns.symbol
                  }`}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  );
};

export default TxnsValueCard;
