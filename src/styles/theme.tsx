import { extendTheme, Kbd, type ThemeConfig } from '@chakra-ui/react';
import inputTheme from './input';
import linkTheme from './link';
import { tabsTheme } from './tabs';
import { buttonTheme } from './button';
import { tableTheme } from './table';
import { cardTheme } from './card';
import { menuTheme } from './menu';
import { modalTheme } from './modal';

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
    Card: cardTheme,
    Menu: menuTheme,
    Modal: modalTheme
  },
  colors: {
    primary: {
      50: '#F8D3E5',
      100: '#F8BAD8',
      200: '#F8A1CC',
      300: '#F888BF',
      400: '#F870B3',
      500: '#F857A6',
      600: '#DE4E94',
      700: '#C44583',
      800: '#AB3C72',
      900: '#913361'
    },
    'primary-gradient': {
      50: 'linear-gradient(90deg, #F8D3E5 0%, #FFD9D9 100%)',
      100: 'linear-gradient(90deg, #F8BAD8 0%, #FFBFBF 100%)',
      200: 'linear-gradient(90deg, #F8A1CC 0%, #FFA6A6 100%)',
      300: 'linear-gradient(90deg, #F888BF 0%, #FF8C8C 100%)',
      400: 'linear-gradient(90deg, #F870B3 0%, #FF7373 100%)',
      500: 'linear-gradient(90deg, #F857A6 0%, #FF5858 100%)',
      600: 'linear-gradient(90deg, #DE4E94 0%, #E54F4F 100%)',
      700: 'linear-gradient(90deg, #C44583 0%, #CC4646 100%)',
      800: 'linear-gradient(90deg, #AB3C72 0%, #B23E3E 100%)',
      900: 'linear-gradient(90deg, #913361 0%, #802C2C 100%)'
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
