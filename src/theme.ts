import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: true,
};

const theme = extendTheme({
  config,
  semanticTokens: {
    colors: {
      'bg.canvas': {
        default: 'white',
        _dark: 'gray.900',
      },
      'bg.surface': {
        default: 'white',
        _dark: 'gray.800',
      },
      'bg.subtle': {
        default: 'gray.50',
        _dark: 'gray.700',
      },
      'bg.muted': {
        default: 'gray.100',
        _dark: 'gray.600',
      },
      'border.default': {
        default: 'gray.200',
        _dark: 'gray.700',
      },
      'border.subtle': {
        default: 'gray.300',
        _dark: 'gray.600',
      },
      'text.default': {
        default: 'gray.800',
        _dark: 'white',
      },
      'text.muted': {
        default: 'gray.600',
        _dark: 'gray.400',
      },
      'text.subtle': {
        default: 'gray.500',
        _dark: 'gray.500',
      },
      'icon.green': {
        default: 'green.50',
        _dark: 'green.900',
      },
      'icon.red': {
        default: 'red.50',
        _dark: 'red.900',
      },
      'icon.blue': {
        default: 'blue.50',
        _dark: 'blue.900',
      },
      'icon.orange': {
        default: 'orange.50',
        _dark: 'orange.900',
      },
      'icon.purple': {
        default: 'purple.50',
        _dark: 'purple.900',
      },
      'icon.cyan': {
        default: 'cyan.50',
        _dark: 'cyan.900',
      },
      'icon.gray': {
        default: 'gray.50',
        _dark: 'gray.700',
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: 'bg.canvas',
        color: 'text.default',
      },
    },
  },
});

export default theme;
