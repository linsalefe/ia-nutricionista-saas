import { createTheme } from '@mui/material/styles';

export const getTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      primary: { main: '#4F46E5' },
      secondary: { main: '#06B6D4' },
      success: { main: '#22C55E' },
      error: { main: '#EF4444' },
      background: {
        default: mode === 'light' ? '#F3F4F6' : '#111827',
        paper: mode === 'light' ? '#FFFFFF' : '#1E293B',
      },
      grey: {
        100: '#F3F4F6',
        200: '#E5E7EB',
        400: '#9CA3AF',
        900: '#111827',
      },
    },
    typography: {
      fontFamily: 'Inter, Roboto, Arial, sans-serif',
      h1: { fontWeight: 700, fontSize: '2.5rem' },
      h2: { fontWeight: 700, fontSize: '2rem' },
      h3: { fontWeight: 700 },
      body1: { fontSize: '1rem' },
      body2: { fontSize: '0.875rem' },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: {
      borderRadius: 16,
    },
    components: {
      MuiButton: {
        styleOverrides: { root: { borderRadius: 16, boxShadow: 'none' } },
      },
      MuiCard: {
        styleOverrides: { root: { borderRadius: 16, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.05)' } },
      },
      MuiPaper: {
        styleOverrides: { root: { borderRadius: 16 } },
      },
    },
  });
