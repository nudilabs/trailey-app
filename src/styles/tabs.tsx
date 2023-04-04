import { tabsAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tabsAnatomy.keys);

// define the base component styles
const baseStyle = definePartsStyle({
  tabpanel: {
    px: 0
  },
  tab: {
    filter: 'grayscale(100%)',
    _selected: {
      filter: 'grayscale(0%)'
    }
  }
});

// export the component theme
export const tabsTheme = defineMultiStyleConfig({ baseStyle });
