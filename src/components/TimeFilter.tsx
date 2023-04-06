import { Flex, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

function TimeFilter() {
  const options = [
    { label: '24h', value: '24h' },
    { label: '7d', value: '7d' },
    { label: '30d', value: '30d' },
    { label: 'All Time', value: 'all' }
  ];

  const router = useRouter();
  const [selectedTime, setSelectedTime] = useState(router.query.time || '7d');

  const handleSelectTime = (time: string) => {
    setSelectedTime(time);
    const query = { ...router.query, time };
    router.push({ query });
  };

  return (
    <Flex
      direction="row"
      alignItems="center"
      gap={2}
      border="1px"
      borderColor="gray.200"
      borderRadius="full"
      p={1}
    >
      {options.map(option => (
        <Button
          key={option.value}
          size="xs"
          colorScheme="pink"
          variant={selectedTime === option.value ? 'solid' : 'ghost'}
          onClick={() => handleSelectTime(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </Flex>
  );
}

export default TimeFilter;
