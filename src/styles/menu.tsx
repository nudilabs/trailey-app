import { menuAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(menuAnatomy.keys);

// define the base component styles
const baseStyle = definePartsStyle({
  // define the part you're going to style
  button: {
    // this will style the MenuButton component
  },
  list: {
    // this will style the MenuList component
    bgColor: 'gray.50',
    borderColor: 'gray.200',
    _dark: {
      bgColor: 'gray.900',
      borderColor: 'gray.700'
    }
  },
  item: {
    // this will style the MenuItem and MenuItemOption components
    bgColor: 'gray.50',
    _dark: {
      bgColor: 'gray.900'
    },
    _hover: {
      _dark: {
        bgColor: 'gray.800'
      },
      _light: {
        bgColor: 'gray.100'
      }
    }
  },
  groupTitle: {
    // this will style the text defined by the title prop
    // in the MenuGroup and MenuOptionGroup components
    textTransform: 'uppercase',
    color: 'white',
    textAlign: 'center',
    letterSpacing: 'wider',
    opacity: '0.7'
  },
  command: {
    // this will style the text defined by the command
    // prop in the MenuItem and MenuItemOption components
    opacity: '0.8',
    fontFamily: 'mono',
    fontSize: 'sm',
    letterSpacing: 'tighter',
    pl: '4'
  },
  divider: {
    // this will style the MenuDivider component
    my: '4',
    borderColor: 'white',
    borderBottom: '2px dotted'
  }
});
// export the base styles in the component theme
export const menuTheme = defineMultiStyleConfig({ baseStyle });
