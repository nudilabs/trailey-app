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
  Tooltip
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
    localStorage.setItem('trailey.chain', chain);
  };

  return (
    <Menu>
      <MenuButton
        _hover={{ bg: useColorModeValue('blackAlpha.50', 'whiteAlpha.50') }}
        p={2}
        rounded="lg"
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
          <Box key={index}>
            {!chain.name ? (
              <Tooltip
                label={'coming soon'}
                key={index}
                hasArrow
                placement="right"
              >
                <MenuItem
                  key={index}
                  gap={2}
                  alignContent={'center'}
                  onClick={() => handleSelectChain(chain.name.toLowerCase())}
                  // disable if no name or chainId
                  isDisabled={!chain.name}
                >
                  <Image
                    src={chain.logo_url}
                    alt={chain.label}
                    boxSize={5}
                    rounded="full"
                  />
                  {chain.label}
                </MenuItem>
              </Tooltip>
            ) : (
              <MenuItem
                key={index}
                gap={2}
                alignContent={'center'}
                onClick={() => handleSelectChain(chain.name.toLowerCase())}
                // disable if no name or chainId
                isDisabled={!chain.name}
              >
                <Image
                  src={chain.logo_url}
                  alt={chain.label}
                  boxSize={5}
                  rounded="full"
                />
                {chain.label}
              </MenuItem>
            )}
          </Box>
        ))}
      </MenuList>
    </Menu>
  );
};

export default ChainSelector;
