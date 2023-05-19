import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Kbd,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorModeValue,
  Button,
  Flex
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import { FiChevronDown, FiSearch } from 'react-icons/fi';

export default function SearchBar({
  kbd,
  onClose
}: {
  kbd?: boolean;
  onClose?: () => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);

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
    const recentSearchesFromStorage = localStorage.getItem('recentSearches');

    if (recentSearchesFromStorage) {
      setRecentSearches(JSON.parse(recentSearchesFromStorage));
    }
  }, []);

  function handleRecentSearchClick(searchTerm: string) {
    router.push(`/account/${searchTerm}`);
    setSearchTerm(searchTerm);
    if (onClose) {
      onClose();
    }
  }

  function handleSearch() {
    if (searchTerm.trim()) {
      router.push(`/account/${searchTerm.trim()}`);

      // Add the search term to the recent searches
      setRecentSearches([searchTerm.trim(), ...recentSearches]);

      // Save the recent searches to local storage
      localStorage.setItem(
        'recentSearches',
        JSON.stringify([searchTerm.trim(), ...recentSearches])
      );
      setSearchTerm('');

      setShowRecentSearches(false);
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

  return (
    <Box position="relative" w="100%">
      <InputGroup>
        <InputLeftElement>
          <FiSearch onClick={handleSearch} />
        </InputLeftElement>
        <InputRightElement mr="1" display={kbd ? 'flex' : 'none'}>
          <Kbd>⌘K</Kbd>
        </InputRightElement>
        <Input
          placeholder="Search address or ENS"
          value={searchTerm}
          onChange={handleChange}
          ref={inputRef}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowRecentSearches(true)}
          variant="search"
        />
      </InputGroup>
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
                    localStorage.removeItem('recentSearches');
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
