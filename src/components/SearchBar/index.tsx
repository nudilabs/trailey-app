import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Kbd,
  Menu,
  MenuItem,
  MenuList,
  Button,
  Flex,
  ButtonSpinner,
  useColorModeValue,
  FormControl,
  FormErrorMessage,
  useToast
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import { FiSearch } from 'react-icons/fi';
import { isAddress } from 'viem';

export default function SearchBar({
  kbd,
  btn,
  showError,
  onClose
}: {
  kbd?: boolean;
  btn?: boolean;
  showError?: boolean;
  onClose?: () => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const toast = useToast();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        if (inputRef.current !== null) {
          inputRef.current.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const recentSearchesFromStorage = localStorage.getItem(
      'abtrail.recentSearches'
    );

    if (recentSearchesFromStorage) {
      const parsedRecentSearches = JSON.parse(recentSearchesFromStorage);
      const updatedRecentSearches = parsedRecentSearches.slice(0, 10);
      setRecentSearches(updatedRecentSearches);
    }
  }, []);

  function handleRecentSearchClick(searchTerm: string) {
    setIsLoading(true);
    router.push(`/address/${searchTerm}`);
    setSearchTerm(searchTerm);
    onClose && onClose();
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }

  function handleSearch() {
    if (!isAddressValid(searchTerm)) {
      setIsError(true);
      toast({
        title: 'Invalid address',
        description: 'Please enter a valid address',
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'top'
      });
      return;
    }
    onClose && onClose();
    if (searchTerm.trim()) {
      // Add the search term to the recent searches
      const updatedRecentSearches = [
        searchTerm.trim(),
        ...recentSearches
      ].slice(0, 10);
      setRecentSearches(updatedRecentSearches);

      // Save the recent searches to local storage
      localStorage.setItem(
        'abtrail.recentSearches',
        JSON.stringify(updatedRecentSearches)
      );
      setSearchTerm('');
      setShowRecentSearches(false);
      router.push(`/address/${searchTerm.trim()}`);
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.target.value);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  }
  const searchBtnBgColor = useColorModeValue('gray.200', 'gray.600');
  const searchBtnColor = useColorModeValue('gray.500', 'gray.400');

  return (
    <Box position="relative" w="100%">
      <FormControl isInvalid={!isAddressValid(searchTerm)}>
        <InputGroup>
          {!btn && (
            <InputLeftElement>
              {isLoading ? <ButtonSpinner /> : <FiSearch />}
            </InputLeftElement>
          )}
          <InputRightElement mr="1" display={kbd ? 'flex' : 'none'}>
            <Kbd>⌘K</Kbd>
          </InputRightElement>
          <Input
            placeholder="Search address"
            value={searchTerm}
            onChange={handleChange}
            ref={inputRef}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowRecentSearches(true)}
            variant="search"
            bgColor={btn ? 'gray.50' : 'transparent'}
            isInvalid={!isAddressValid(searchTerm)}
          />
          {btn && (
            <InputRightElement mr="1">
              {' '}
              {isLoading ? (
                <ButtonSpinner />
              ) : (
                <Button
                  onClick={handleSearch}
                  isLoading={isLoading}
                  size="xs"
                  rounded="md"
                  bgColor={searchBtnBgColor}
                  color={searchBtnColor}
                >
                  {isLoading ? <ButtonSpinner /> : <FiSearch />}
                </Button>
              )}
            </InputRightElement>
          )}
        </InputGroup>
        {showError &&
          isError &&
          !isAddressValid(searchTerm) &&
          searchTerm.length > 0 && (
            <FormErrorMessage>
              {`Invalid input. Please enter a valid address`}
            </FormErrorMessage>
          )}
      </FormControl>
      {recentSearches.length > 0 && (
        <Flex position="absolute" w="100%" top="100%" zIndex="1" marginTop={1}>
          <Menu
            isOpen={showRecentSearches}
            onClose={() => setShowRecentSearches(false)}
          >
            <MenuList>
              <Flex
                justifyContent="space-between"
                alignItems="center"
                px="3"
                py="2"
              >
                <Box>Recent</Box>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setRecentSearches([]);
                    localStorage.removeItem('abtrail.recentSearches');
                  }}
                >
                  Clear
                </Button>
              </Flex>
              {recentSearches.map((searchTerm, i) => (
                <MenuItem
                  key={i}
                  onClick={() => handleRecentSearchClick(searchTerm)}
                >
                  {searchTerm}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Flex>
      )}
    </Box>
  );
}

const isAddressValid = (address: string): boolean => {
  if (isAddress(address)) {
    return true;
  }
  return false;
};
