import { extendTheme, type ThemeConfig } from '@chakra-ui/react';
import inputTheme from './input';
import linkTheme from './link';
import { tabsTheme } from './tabs';
import { buttonTheme } from './button';
import { tableTheme } from './table';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false
};

const theme = extendTheme({
  config,
  components: {
    Input: inputTheme,
    Link: linkTheme,
    Tabs: tabsTheme,
    Button: buttonTheme,
    Table: tableTheme
  },
  colors: {
    primary: {
      50: '#FFF5F7',
      100: '#FED7E2',
      200: '#FBB6CE',
      300: '#F687B3',
      400: '#ED64A6',
      500: '#D53F8C',
      600: '#B83280',
      700: '#97266D',
      800: '#702459',
      900: '#521B41'
    },
    secondary: {
      50: '#F0FAFF',
      100: '#CCEDFF',
      200: '#A3DBFF',
      300: '#76C5FF',
      400: '#47A3FF',
      500: '#2286F3',
      600: '#1C64D2',
      700: '#1450AC',
      800: '#0E4080',
      900: '#0C3363'
    }
  }
});

export default theme;
