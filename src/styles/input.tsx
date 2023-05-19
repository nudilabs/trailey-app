import { inputAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys);

const xs = defineStyle({
  // borderRadius: 'full'
});

const sm = defineStyle({
  borderRadius: 'xl'
});

const md = defineStyle({
  borderRadius: 'xl'
});

const lg = defineStyle({
  // borderRadius: 'full'
});

const sizes = {
  xs: definePartsStyle({ field: xs, addon: xs, element: xs }),
  sm: definePartsStyle({ field: sm, addon: sm, element: sm }),
  md: definePartsStyle({ field: md, addon: md, element: md }),
  lg: definePartsStyle({ field: lg, addon: lg, element: lg })
};

const search = definePartsStyle({
  field: {
    border: '1px solid',
    borderColor: 'gray.200',
    background: 'gray.100',

    // Let's also provide dark mode alternatives
    _dark: {
      borderColor: 'gray.700',
      background: 'gray.800',
      _placeholder: {
        color: 'gray.500'
      }
    }
  },
  element: {
    _dark: {
      colors: 'red'
    }
  },
  addon: {
    border: '1px solid',
    borderColor: 'gray.200',
    background: 'gray.200',
    color: 'gray.500',

    _dark: {
      borderColor: 'gray.600',
      background: 'gray.600',
      color: 'gray.400'
    }
  }
});

const baseStyle = definePartsStyle({
  element: {
    color: 'gray.500'
  }
});

const inputTheme = defineMultiStyleConfig({
  baseStyle,
  sizes,
  variants: { search }
});

export default inputTheme;
