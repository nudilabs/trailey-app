import {
  Flex,
  Button,
  useColorModeValue,
  Select,
  useMediaQuery
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

function TimeFilter() {
  const options = [
    { label: '24h', value: '24h' },
    { label: '7d', value: '7d' },
    { label: '30d', value: '30d' },
    { label: 'All Time', value: 'all' }
  ];

  const router = useRouter();
  const [selectedTime, setSelectedTime] = useState(router.query.time || '7d');

  useEffect(() => {
    setSelectedTime(router.query.time || '7d');
  }, [router.query.time]);

  const handleSelectTime = (time: string) => {
    setSelectedTime(time);
    const query = { ...router.query, time };
    router.push({ query });
  };

  const [isLargerThanMobile] = useMediaQuery('(min-width: 640px)');

  return (
    <Flex
      direction={isLargerThanMobile ? 'row' : 'column'}
      alignItems={isLargerThanMobile ? 'center' : 'stretch'}
      gap={2}
      border="1px"
      borderColor={useColorModeValue('gray.200', 'gray.600')}
      borderRadius="full"
      p={1}
    >
      {isLargerThanMobile ? (
        options.map(option => (
          <Button
            key={option.value}
            size="xs"
            colorScheme="primary"
            variant={selectedTime === option.value ? 'solid' : 'ghost'}
            onClick={() => handleSelectTime(option.value)}
          >
            {option.label}
          </Button>
        ))
      ) : (
        <Select
          value={selectedTime}
          onChange={event => handleSelectTime(event.target.value)}
          size="sm"
          rounded="full"
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      )}
    </Flex>
  );
}

export default TimeFilter;
