import { cardAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(cardAnatomy.keys);

// define the base component styles
const baseStyle = definePartsStyle({
  // define the part you're going to style
  container: {
    _dark: {
      backgroundColor: 'blackAlpha.400'
    }
  }
});

const variants = {
  protocol: definePartsStyle({
    container: {
      _dark: {
        backgroundColor: 'gray.800'
      }
    }
  })
};

const sizes = {
  // define custom styles for xl size
  lg: definePartsStyle({
    container: {
      rounded: '3xl',
      shadow: 'none',
      borderWidth: 1,
      borderColor: {
        light: 'blackAlpha.200',
        dark: 'whiteAlpha.800'
      }
    },
    header: {
      paddingBottom: 1
    }
  }),
  md: definePartsStyle({
    container: {
      rounded: '2xl',
      shadow: 'none',
      borderWidth: 1,
      borderColor: {
        light: 'blackAlpha.200',
        dark: 'whiteAlpha.800'
      }
    },
    header: {
      paddingBottom: 1
    }
  }),
  sm: definePartsStyle({
    container: {
      rounded: '3xl',
      shadow: 'none',
      borderWidth: 1,
      borderColor: {
        light: 'blackAlpha.200',
        dark: 'whiteAlpha.800'
      }
    }
  })
};

// export the component theme
export const cardTheme = defineMultiStyleConfig({
  baseStyle,
  sizes,
  variants
});
