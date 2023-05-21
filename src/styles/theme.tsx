import { extendTheme, Kbd, type ThemeConfig } from '@chakra-ui/react';
import inputTheme from './input';
import linkTheme from './link';
import { tabsTheme } from './tabs';
import { buttonTheme } from './button';
import { tableTheme } from './table';
import { cardTheme } from './card';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: true
};

const theme = extendTheme({
  fonts: {
    heading: `'Poppins', sans-serif`,
    body: `'Outfit', sans-serif`
  },
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
      50: '#F1FFF0',
      100: '#C7F6C6',
      200: '#9AE69B',
      300: '#68D36D',
      400: '#48BB52',
      500: '#38A146',
      600: '#2F853D',
      700: '#276734',
      800: '#22542C',
      900: '#1C4524'
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
