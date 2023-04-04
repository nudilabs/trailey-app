import MostTransactionsCard from '@/components/MostTransactionsCard';
import {
  Card,
  CardBody,
  CardHeader,
  Flex,
  Grid,
  GridItem,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react';

const MOCK_MOST_TX_DATA = [
  {
    chain: {
      name: 'Ethereum',
      icon: '/eth.png'
    },
    txns: 100000
  }
];

export default function Trending() {
  return (
    <Grid templateColumns="repeat(12, 1fr)" gap={6}>
      <GridItem colSpan={{ base: 12, md: 8 }}>
        <MostTransactionsCard data={MOCK_MOST_TX_DATA} />
      </GridItem>
    </Grid>
  );
}
