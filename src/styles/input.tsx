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

const baseStyle = definePartsStyle({
  element: {
    color: 'gray.500'
  }
});

const inputTheme = defineMultiStyleConfig({ baseStyle, sizes });

export default inputTheme;
