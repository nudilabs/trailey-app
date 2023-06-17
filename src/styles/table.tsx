import { tableAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tableAnatomy.keys);

// define the base component styles
const baseStyle = definePartsStyle({
  thead: {
    th: {
      _dark: {
        borderBottom: '1px solid',
        borderColor: 'gray.700'
      }
    }
  },
  tbody: {
    td: {
      borderTop: '1px solid',
      borderBottom: 'none',
      borderColor: 'blackAlpha.100',
      _dark: {
        borderTop: '1px solid',
        borderBottom: 'none',
        borderColor: 'gray.700'
      }
    },
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

const variants = {
  compact: definePartsStyle({
    thead: {
      th: {
        _dark: {
          borderBottom: '1px solid',
          borderColor: 'transparent'
        }
      }
    },
    tbody: {
      td: {
        borderTop: '1px solid',
        borderBottom: 'none',
        borderColor: 'transparent',
        py: 2,
        _dark: {
          borderTop: '1px solid',
          borderBottom: 'none',
          borderColor: 'transparent'
        }
      },
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
  })
};

// export the component theme
export const tableTheme = defineMultiStyleConfig({ baseStyle, variants });
