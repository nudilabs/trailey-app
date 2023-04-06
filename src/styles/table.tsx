import { tableAnatomy } from '@chakra-ui/anatomy';
import {
  createMultiStyleConfigHelpers,
  useColorModeValue
} from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tableAnatomy.keys);

// define the base component styles
const baseStyle = definePartsStyle({
  tbody: {
    tr: {
      _hover: {
        bg: 'blackAlpha.50'
      },
      _dark: {
        _hover: {
          bg: 'whiteAlpha.50'
        }
      }
    }
  }
});

// export the component theme
export const tableTheme = defineMultiStyleConfig({ baseStyle });
