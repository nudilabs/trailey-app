import {
  Grid,
  GridItem,
  Card,
  CardBody,
  Button,
  Image,
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
import { FiGrid } from 'react-icons/fi';

type ChainData = {
  name: string;
  icon: string;
};

const ChainSelector = ({
  chainData,
  activeChain
}: {
  chainData: ChainData[];
  activeChain: string;
}) => {
  if (!activeChain) {
    activeChain = chainData[0].name.toLowerCase();
  }

  return (
    <Card maxW="fit-content" rounded="full">
      <CardBody p={1} gap={1}>
        {chainData.map((chain, index) => (
          <Button
            size="sm"
            key={chain.name}
            variant={
              activeChain && chain.name.toLowerCase() === activeChain
                ? 'solid'
                : 'ghost'
            }
            as="a"
            href={`?chain=${chain.name.toLowerCase()}`}
          >
            <Image
              src={chain.icon}
              alt={chain.name}
              boxSize={6}
              rounded="full"
            />
          </Button>
        ))}
      </CardBody>
    </Card>
  );
};

export default ChainSelector;
