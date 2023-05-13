import {
  Image,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Box,
  Badge
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { Chain } from '@/types/Chains';

const ChainSelector = ({ chainConfigs }: { chainConfigs: Chain[] }) => {
  const router = useRouter();
  const [selectedChain, setSelectedChain] = useState(
    router.query.chain || chainConfigs[0].name.toLowerCase()
  );
  const currentChain = chainConfigs.find(
    chain => chain.name.toLowerCase() === selectedChain
  );

  const handleSelectChain = (chain: string) => {
    setSelectedChain(chain);
    const query = { ...router.query, chain };
    router.push({ query });
  };

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
          {currentChain?.is_testnet && <Badge colorScheme="red">Testnet</Badge>}
        </Flex>
      </MenuButton>
      <MenuList>
        {chainConfigs.map((chain, index) => (
          <MenuItem
            key={index}
            gap={1}
            alignContent={'center'}
            onClick={() => handleSelectChain(chain.name.toLowerCase())}
          >
            <Image
              src={chain.logo_url}
              alt={chain.label}
              boxSize={6}
              rounded="full"
            />
            {chain.label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default ChainSelector;
