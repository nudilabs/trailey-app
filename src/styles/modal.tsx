import { modalAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
  // define the part you're going to style
  overlay: {
    // bg: 'blackAlpha.200' //change the background
  },
  dialog: {
    borderRadius: 'xl',
    bg: `gray.50`,
    _dark: {
      bg: `gray.800`
    }
  }
});

export const modalTheme = defineMultiStyleConfig({
  baseStyle
});
