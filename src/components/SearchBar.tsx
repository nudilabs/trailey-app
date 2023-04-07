import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Kbd,
  useColorModeValue
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import { FiSearch } from 'react-icons/fi';

export default function SearchBar() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

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

  function handleSearch() {
    if (searchTerm.trim()) {
      router.push(`/account/${searchTerm.trim()}`);
      setSearchTerm('');
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
    <InputGroup display={{ base: 'none', md: 'flex' }} width="440px">
      <InputLeftElement color={useColorModeValue('gray.300', 'gray.600')}>
        <FiSearch onClick={handleSearch} />
      </InputLeftElement>
      <InputRightElement mr="1">
        <Kbd>⌘K</Kbd>
      </InputRightElement>
      <Input
        placeholder="Search address or ens..."
        value={searchTerm}
        onChange={handleChange}
        ref={inputRef}
        onKeyDown={handleKeyDown}
      />
    </InputGroup>
  );
}
