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
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FiGrid } from 'react-icons/fi';

type ChainData = {
  name: string;
  icon: string;
};

const ChainSelector = ({ chainData }: { chainData: ChainData[] }) => {
  const router = useRouter();
  const [selectedChain, setSelectedChain] = useState(
    router.query.chain || chainData[0].name.toLowerCase()
  );

  const handleSelectChain = (chain: string) => {
    setSelectedChain(chain);
    const query = { ...router.query, chain };
    router.push({ query });
  };

  return (
    <Card maxW="fit-content" rounded="full">
      <CardBody p={1} gap={1}>
        {chainData.map((chain, index) => (
          <Button
            size="sm"
            key={chain.name}
            variant={
              selectedChain === chain.name.toLowerCase() ? 'solid' : 'ghost'
            }
            onClick={() => handleSelectChain(chain.name.toLowerCase())}
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
