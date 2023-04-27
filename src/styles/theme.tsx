import { extendTheme, Kbd, type ThemeConfig } from '@chakra-ui/react';
import inputTheme from './input';
import linkTheme from './link';
import { tabsTheme } from './tabs';
import { buttonTheme } from './button';
import { tableTheme } from './table';
import { cardTheme } from './card';

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
    Table: tableTheme,
    Card: cardTheme
  },
  colors: {
    primary: {
      50: '#DCFEA5',
      100: '#D3FE8C',
      200: '#C9FE72',
      300: '#BFFE58',
      400: '#B6F254',
      500: '#ADE550',
      600: '#A3D94B',
      700: '#99CC47',
      800: '#90BF42',
      900: '#87B23E'
    },
    secondary: {
      200: '#CBD5E0',
      300: '#A0AEC0',
      500: '#2D3748',
      600: '#1A202C'
    }
  }
});

export default theme;
