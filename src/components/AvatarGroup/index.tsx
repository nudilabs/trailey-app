import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import Avatar from '@/components/Avatar';

const AvatarGroup = ({
  wallets,
  max
}: {
  wallets: { address: string; type: string }[];
  max: number;
}) => {
  const avatarBorderColor = useColorModeValue('white', 'blackAlpha.900');
  const subHeadingColor = useColorModeValue('gray.600', 'gray.400');
  return (
    <Flex direction="row">
      {wallets.map((wallet, i) => (
        <Box key={i}>
          {i < max && (
            <Box
              mr={-3}
              rounded="full"
              border="2px"
              borderColor={avatarBorderColor}
            >
              <Avatar address={wallet.address} size={40} />
            </Box>
          )}
        </Box>
      ))}
      {wallets.length > max && (
        <Box
          mr={-3}
          rounded="full"
          border="2px"
          borderColor={avatarBorderColor}
          bg={subHeadingColor}
          w={'44px'}
          h={'44px'}
        >
          <Text
            fontSize="xs"
            fontWeight="bold"
            color={avatarBorderColor}
            textAlign="center"
            lineHeight="42px"
          >
            +{wallets.length - max}
          </Text>
        </Box>
      )}
    </Flex>
  );
};

export default AvatarGroup;
