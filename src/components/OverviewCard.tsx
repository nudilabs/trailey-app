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

type BridgedData = {
  address: string;
  token: {
    symbol: string;
    amount: number;
  };
  value: number;
};

const OverviewCard = ({ txData }: { txData: BridgedData[] }) => {
  return (
    <Card size={{ base: 'sm', md: 'md', lg: 'lg' }}>
      <CardHeader>
        <Flex direction="row" justifyContent="space-between">
          <Heading fontSize={{ base: 'md', lg: 'xl' }}>Overview</Heading>
          {/* <Heading fontSize={{ base: 'md', lg: 'xl' }}>$420.69</Heading> */}
        </Flex>
      </CardHeader>
      <CardBody>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Address</Th>
                <Th isNumeric>Amount</Th>
                <Th isNumeric>Value</Th>
              </Tr>
            </Thead>
            <Tbody>
              {txData.map(data => (
                <Tr key={data.address}>
                  <Td>{data.address}</Td>
                  <Td isNumeric>
                    {`${data.token.amount.toLocaleString('en-US', {
                      maximumFractionDigits: 4
                    })} ${data.token.symbol}`}
                  </Td>
                  <Td isNumeric>
                    ~
                    {data.value.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD'
                    })}
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

export default OverviewCard;
