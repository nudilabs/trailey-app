import { cardAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(cardAnatomy.keys);

// define the base component styles
const baseStyle = definePartsStyle({
  // define the part you're going to style
  container: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'gray.200',
    shadow: 'none',
    _dark: {
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'gray.700',
      backgroundColor: 'blackAlpha.400'
    }
  }
});

const variants = {
  protocol: definePartsStyle({
    container: {
      _dark: {
        backgroundColor: 'gray.900'
      }
    }
  })
};

const sizes = {
  // define custom styles for xl size
  lg: definePartsStyle({
    container: {
      rounded: '3xl'
    },
    header: {
      paddingBottom: 1
    }
  }),
  md: definePartsStyle({
    container: {
      rounded: '3xl'
    },
    header: {
      paddingBottom: 1
    }
  }),
  sm: definePartsStyle({
    container: {
      rounded: '3xl'
    }
  })
};

// export the component theme
export const cardTheme = defineMultiStyleConfig({
  baseStyle,
  sizes,
  variants
});
