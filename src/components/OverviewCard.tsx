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
  Td,
  useColorModeValue,
  Button
} from '@chakra-ui/react';
import TokenIcon from './TokenIcon';
import { FiExternalLink } from 'react-icons/fi';

type OverviewData = {
  address: string;
  bridged: number;
  txns: {
    smartContract: number;
    general: number;
    average: number;
    value: number;
  };
};

const OverviewCard = ({ txData }: { txData: OverviewData[] }) => {
  const hoverBg = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');
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
                <Th isNumeric>Bridged</Th>
                <Th isNumeric>Avg Txns / Month</Th>
                <Th isNumeric>Txns</Th>
                <Th isNumeric>Contract Interact.</Th>
                <Th isNumeric>Value</Th>
              </Tr>
            </Thead>
            <Tbody>
              {txData.map(data => (
                <Tr
                  key={data.address}
                  _hover={{
                    bg: hoverBg
                  }}
                >
                  <Td>
                    <Button
                      colorScheme="pink"
                      variant="link"
                      rightIcon={<FiExternalLink />}
                    >
                      {data.address}
                    </Button>
                  </Td>
                  <Td isNumeric>{data.bridged} ETH</Td>
                  <Td isNumeric>{data.txns.average}</Td>
                  <Td isNumeric>{data.txns.general}</Td>
                  <Td isNumeric>{data.txns.smartContract}</Td>
                  <Td isNumeric>{data.txns.value} ETH</Td>
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
