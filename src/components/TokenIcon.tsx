import { Flex, Image } from '@chakra-ui/react';

function TokenIcon({ token }: { token: any }) {
  return (
    <Flex position="relative" minW={6}>
      <Image
        src={token.chain.icon}
        alt={token.chain.name}
        boxSize="3.5"
        rounded="full"
        position="absolute"
        top={-1}
        left={-1}
      />
      <Image src={token.icon} alt={token.denom} boxSize="6" rounded="full" />
    </Flex>
  );
}

export default TokenIcon;
