import {
  Image,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Box,
  Badge,
  Button
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { Chain } from '@/types/Chains';

const ChainSelector = ({
  chainConfigs,
  localChain,
  setLocalChain
}: {
  chainConfigs: Chain[];
  localChain: string;
  setLocalChain: (chain: string) => void;
}) => {
  // const router = useRouter();
  const [currentChain, setCurrentChain] = useState<Chain | undefined>();

  useEffect(() => {
    const selectedChain = chainConfigs.find(
      chain => chain.name.toLowerCase() === localChain
    );
    setCurrentChain(selectedChain);
  }, [localChain]);

  const handleSelectChain = (chain: string) => {
    setLocalChain(chain);
    localStorage.setItem('abtrail.chain', chain);
  };

  return (
    <Menu>
      <MenuButton
        _hover={{ bg: useColorModeValue('gray.100', 'gray.800') }}
        p={2}
        rounded="xl"
        // bgColor={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
        borderWidth={1}
        borderColor={useColorModeValue('gray.200', 'gray.700')}
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
            gap={2}
            alignContent={'center'}
            onClick={() => handleSelectChain(chain.name.toLowerCase())}
          >
            <Image
              src={chain.logo_url}
              alt={chain.label}
              boxSize={5}
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
