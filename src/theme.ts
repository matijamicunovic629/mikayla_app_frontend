import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  fonts: {
    heading: `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`,
    body: `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`,
  },
  colors: {
    brand: {
      50: '#f5f3ff',
      100: '#ede9fe',
      200: '#ddd6fe',
      300: '#c4b5fd',
      400: '#a78bfa',
      500: '#8b5cf6',
      600: '#7c3aed',
      700: '#6d28d9',
      800: '#5b21b6',
      900: '#4c1d95',
    },
  },
  semanticTokens: {
    colors: {
      'bg.canvas': {
        default: 'white',
        _dark: '#0a0a0f',
      },
      'bg.surface': {
        default: 'white',
        _dark: '#141420',
      },
      'bg.subtle': {
        default: 'gray.50',
        _dark: '#1a1a2e',
      },
      'bg.muted': {
        default: 'gray.100',
        _dark: '#232338',
      },
      'border.default': {
        default: 'gray.200',
        _dark: '#2d2d44',
      },
      'border.subtle': {
        default: 'gray.300',
        _dark: '#3a3a52',
      },
      'text.default': {
        default: 'gray.800',
        _dark: '#ffffff',
      },
      'text.muted': {
        default: 'gray.600',
        _dark: '#a0a0b8',
      },
      'text.subtle': {
        default: 'gray.500',
        _dark: '#6b6b84',
      },
      'accent.primary': {
        default: 'purple.500',
        _dark: '#8b5cf6',
      },
      'accent.secondary': {
        default: 'cyan.500',
        _dark: '#22d3ee',
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
  components: {
    Button: {
      baseStyle: {
        fontWeight: '600',
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
      },
      variants: {
        solid: {
          position: 'relative',
          bg: 'transparent',
          border: 'none',
          padding: '2px',
          borderRadius: '12px',
          backgroundImage: 'linear-gradient(135deg, #22d3ee 0%, #8b5cf6 100%)',
          color: 'white',
          _before: {
            content: '""',
            position: 'absolute',
            inset: '2px',
            bg: '#0a0a0f',
            borderRadius: '10px',
            zIndex: -1,
          },
          _hover: {
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.6), 0 0 40px rgba(34, 211, 238, 0.4)',
            transform: 'translateY(-1px)',
            _before: {
              bg: 'rgba(139, 92, 246, 0.1)',
            },
          },
          transition: 'all 0.3s ease',
        },
        outline: {
          borderColor: 'border.default',
          borderWidth: '1px',
          _hover: {
            bg: 'bg.subtle',
            borderColor: 'accent.primary',
          },
        },
        ghost: {
          _hover: {
            bg: 'bg.subtle',
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          bg: 'bg.surface',
          borderRadius: 'xl',
          borderWidth: '1px',
          borderColor: 'border.default',
          overflow: 'hidden',
        },
      },
    },
    Input: {
      variants: {
        outline: {
          field: {
            bg: 'bg.surface',
            borderColor: 'border.default',
            _hover: {
              borderColor: 'border.subtle',
            },
            _focus: {
              borderColor: 'accent.primary',
              boxShadow: '0 0 0 1px var(--chakra-colors-purple-500)',
            },
          },
        },
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
