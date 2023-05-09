import { background, defineStyle, defineStyleConfig } from '@chakra-ui/react';

const md = defineStyle({
  borderRadius: 'xl'
});

const sm = defineStyle({
  borderRadius: 'full'
});

const xs = defineStyle({
  borderRadius: 'full'
});

const solid = defineStyle({
  // borderRadius: 'full', // remove the border radius
  // color: 'black',
  fontWeight: 'semibold' // change the font weight
});

const outline = defineStyle({
  // borderRadius: 'full', // remove the border radius
  fontWeight: 'semibold' // change the font weight
});

const connected = defineStyle({
  background: 'gray.200',
  color: 'black',
  fontWeight: 'semibold',
  _hover: {
    background: 'gray.300'
  },

  _dark: {
    background: 'whiteAlpha.200',
    color: 'white',
    _hover: {
      background: 'whiteAlpha.300'
    }
  }
});

const ghost = defineStyle({
  // borderRadius: 'full', // remove the border radius
  fontWeight: 'semibold', // change the font weight
  // add a black and white filter
  filter: 'grayscale(1) brightness(1)',
  _hover: {
    filter: 'none'
  }
});

export const buttonTheme = defineStyleConfig({
  variants: { solid, ghost, outline, connected },
  sizes: { md, sm, xs }
});
