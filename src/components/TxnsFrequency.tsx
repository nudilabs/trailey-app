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
import TokenIcon from './TokenIcon';

type TxnsFrequencyData = {
  address: string;
  txns: {
    smartContract: number;
    general: number;
  };
};

const TxnsFrequency = ({ txData }: { txData: TxnsFrequencyData[] }) => {
  return (
    <Card size={{ base: 'sm', md: 'md', lg: 'lg' }}>
      <CardHeader>
        <Flex direction="row" justifyContent="space-between">
          <Heading fontSize={{ base: 'md', lg: 'xl' }}>Txns Frequency</Heading>
          <Heading fontSize={{ base: 'md', lg: 'xl' }}>66</Heading>
        </Flex>
      </CardHeader>
      <CardBody>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Address</Th>
                <Th isNumeric>General</Th>
                <Th isNumeric>Contract Interactions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {txData.map(data => (
                <Tr key={data.address}>
                  <Td>{data.address}</Td>
                  <Td isNumeric>{data.txns.general.toLocaleString('en-US')}</Td>
                  <Td isNumeric>
                    {data.txns.smartContract.toLocaleString('en-US')}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  );
};

export default TxnsFrequency;
