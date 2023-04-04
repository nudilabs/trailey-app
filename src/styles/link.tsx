import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const xs = defineStyle({
  textDecoration: 'underline'
});

const sm = defineStyle({
  textDecoration: 'underline'
});

const md = defineStyle({
  textDecoration: 'underline'
});

const lg = defineStyle({
  textDecoration: 'underline'
});

const xl = defineStyle({
  textDecoration: 'underline'
});

const linkTheme = defineStyleConfig({
  sizes: { xs, sm, md, lg, xl }
});

export default linkTheme;
