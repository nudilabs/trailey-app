import { extendTheme, type ThemeConfig } from '@chakra-ui/react';
import inputTheme from './input';
import linkTheme from './link';
import { tabsTheme } from './tabs';
import { buttonTheme } from './button';

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
    Button: buttonTheme
  }
});

export default theme;