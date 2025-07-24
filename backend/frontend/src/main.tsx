import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from './theme/theme';
import { ThemeModeProvider, useThemeMode } from './contexts/ThemeModeContext';
import '@fontsource/inter/400.css';
import '@fontsource/inter/700.css';
import './index.css';
import { LoadingProvider } from './contexts/LoadingContext';

function ThemedApp() {
  const { mode } = useThemeMode();
  return (
    <ThemeProvider theme={getTheme(mode)}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
<ThemeModeProvider>
  <LoadingProvider>
    <ThemedApp />
  </LoadingProvider>
</ThemeModeProvider>
);
