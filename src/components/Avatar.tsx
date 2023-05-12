import React, { useEffect, useMemo, useState } from 'react';
import { AvatarComponent } from '@rainbow-me/rainbowkit';
import { emojiAvatarForAddress } from '@/utils/format';

import { Box, Spinner, Text } from '@chakra-ui/react';

export const Avatar: AvatarComponent = ({ address, ensImage, size }) => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (ensImage) {
      const img = new Image();
      img.src = ensImage;
      img.onload = () => setLoaded(true);
    }
  }, [ensImage]);

  const { color: backgroundColor, emoji } = useMemo(
    () => emojiAvatarForAddress(address),
    [address]
  );
  return ensImage ? (
    loaded ? (
      <Box
        backgroundSize="cover"
        borderRadius="full"
        style={{
          backgroundImage: `url(${ensImage})`,
          backgroundPosition: 'center',
          height: size,
          width: size
        }}
      />
    ) : (
      <Box
        alignItems="center"
        backgroundSize="cover"
        borderRadius="full"
        color="modalText"
        display="flex"
        justifyContent="center"
        style={{
          height: size,
          width: size
        }}
      >
        <Spinner />
      </Box>
    )
  ) : (
    <Box
      alignItems="center"
      display="flex"
      justifyContent="center"
      overflow="hidden"
      rounded="full"
      style={{
        ...(!ensImage && { backgroundColor }),
        height: size,
        width: size
      }}
    >
      <Text fontSize={size / 2} textAlign="center">
        {emoji}
      </Text>
    </Box>
  );
};
