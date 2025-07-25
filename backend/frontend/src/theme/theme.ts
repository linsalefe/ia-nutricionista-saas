// src/theme/theme.ts
import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';

export const getTheme = (mode: 'light' | 'dark') => {
  let theme = createTheme({
    palette: {
      mode,
      primary: {
        light: '#8CE8F4',
        main: '#2AB7CA',
        dark: '#1B8A92',
        contrastText: '#FFFFFF',
      },
      secondary: {
        light: '#B47BE0',
        main: '#8E44AD',
        dark: '#5F2D7A',
        contrastText: '#FFFFFF',
      },
      background: {
        default: mode === 'light' ? '#F5F7FA' : '#1A202C',
        paper: mode === 'light' ? '#FFFFFF' : '#2D3748',
      },
      text: {
        primary: mode === 'light' ? '#2E3A59' : '#E2E8F0',
        secondary: mode === 'light' ? '#677294' : '#A0AEC0',
      },
    },
    typography: {
      fontFamily: [
        'Poppins',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h4: {
        fontWeight: 700,
        fontSize: '2rem',
        lineHeight: 1.3,
      },
      h6: {
        fontWeight: 600,
        fontSize: '1.125rem',
        lineHeight: 1.4,
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 16,
    },
    shadows: [
      'none',
      '0px 4px 12px rgba(0,0,0,0.05)',     // 1
      '0px 8px 24px rgba(0,0,0,0.08)',     // 2
      ...Array(23).fill('none'),
    ],
    components: {
      MuiCssBaseline: {
        styleOverrides: `
          body {
            margin: 0;
            background: ${
              mode === 'light'
                ? 'linear-gradient(180deg, #F5F7FA 0%, #E2E8F0 100%)'
                : 'linear-gradient(180deg, #2D3748 0%, #1A202C 100%)'
            };
          }
        `,
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: '0px 4px 12px rgba(0,0,0,0.05)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
    },
  });

  theme = responsiveFontSizes(theme);
  return theme;
};
