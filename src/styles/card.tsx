import { cardAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(cardAnatomy.keys);

// define the base component styles
const baseStyle = definePartsStyle({});

const sizes = {
  // define custom styles for xl size
  xl: definePartsStyle({
    container: {
      borderRadius: '24px',
      padding: '28px'
    }
  })
};

// export the component theme
export const cardTheme = defineMultiStyleConfig({
  baseStyle,
  sizes
});
