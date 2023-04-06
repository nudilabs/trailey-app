import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const solid = defineStyle({
  borderRadius: 'full', // remove the border radius
  fontWeight: 'bold' // change the font weight
});

const outline = defineStyle({
  borderRadius: 'full', // remove the border radius
  fontWeight: 'bold' // change the font weight
});

const ghost = defineStyle({
  borderRadius: 'full', // remove the border radius
  fontWeight: 'bold', // change the font weight
  // add a black and white filter
  filter: 'grayscale(1) brightness(1)',
  _hover: {
    filter: 'none'
  }
});

export const buttonTheme = defineStyleConfig({
  variants: { solid, ghost, outline }
});
