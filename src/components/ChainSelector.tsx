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
  Td,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useColorMode,
  useColorModeValue,
  Box,
  Badge
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FiChevronDown, FiGrid } from 'react-icons/fi';
import { Chain } from '@/types/Chains';

const ChainSelector = () => {
  const [chains, setChains] = useState<Chain[]>([]);

  const router = useRouter();
  const [selectedChain, setSelectedChain] = useState(
    router.query.chain || chains[0].name.toLowerCase()
  );
  const currentChain = chains.find(
    chain => chain.name.toLowerCase() === selectedChain
  );

  const handleSelectChain = (chain: string) => {
    setSelectedChain(chain);
    const query = { ...router.query, chain };
    router.push({ query });
  };

  useEffect(() => {
    const fetchChains = async () => {
      const response = await fetch('/chains');
      const data = await response.json();
      setChains(data);
    };
    fetchChains();
  });

  return (
    <Menu>
      <MenuButton
        _hover={{ bg: useColorModeValue('blackAlpha.50', 'whiteAlpha.50') }}
        p={2}
        rounded="lg"
      >
        <Flex align="center" gap={1}>
          <Image
            src={currentChain?.logo_url}
            alt={currentChain?.name}
            boxSize={6}
            rounded="full"
          />
          <Box color={useColorModeValue('gray.400', 'gray.600')}>
            <FiChevronDown />
          </Box>
          {currentChain?.is_testnet && (
            <Badge colorScheme="red">{currentChain.name} Testnet</Badge>
          )}
        </Flex>
      </MenuButton>
      <MenuList>
        {chains.map((chain, index) => (
          <MenuItem
            key={index}
            gap={1}
            alignContent={'center'}
            onClick={() => handleSelectChain(chain.name.toLowerCase())}
          >
            <Image
              src={chain.logo_url}
              alt={chain.name}
              boxSize={6}
              rounded="full"
            />
            {chain.name}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default ChainSelector;
