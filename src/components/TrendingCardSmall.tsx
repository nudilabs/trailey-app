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
  Button,
  CardFooter,
  Image
} from '@chakra-ui/react';
import TokenIcon from './TokenIcon';
import { FiArrowRight } from 'react-icons/fi';
import { getEmojiForIndex } from '@/utils/format';

type BridgedData = {
  token: {
    denom: string;
    contract: string;
    icon: string;
    chain: {
      name: string;
      icon: string;
    };
  };
  wallets: number;
  txns: number;
  price: number;
  balance: number;
  value: number;
};

type ChainData = {
  name: string;
  icon: string;
};

const TrendingCardSmall = ({ chainData }: { chainData: ChainData[] }) => {
  return (
    <Card size={{ base: 'sm', md: 'md', lg: 'lg' }}>
      <CardHeader>
        <Flex direction="row" justifyContent="space-between">
          <Heading fontSize={{ base: 'md', lg: 'xl' }}>🔥 Trending</Heading>
        </Flex>
      </CardHeader>
      <CardBody>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>Chain</Th>
              </Tr>
            </Thead>
            <Tbody>
              {chainData.slice(0, 3).map((chain, index) => (
                <Tr key={index}>
                  <Td>{getEmojiForIndex(index)}</Td>
                  <Td>
                    <Flex direction="row" gap={2} alignItems="center">
                      <Image
                        src={chain.icon}
                        alt={chain.name}
                        boxSize="18px"
                        rounded="full"
                      />
                      {chain.name}{' '}
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </CardBody>
      <CardFooter>
        <Button
          size="sm"
          colorScheme="pink"
          variant="link"
          rightIcon={<FiArrowRight />}
          as="a"
          href="/trending"
        >
          View Trending
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TrendingCardSmall;
