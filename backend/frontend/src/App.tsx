// src/App.tsx
import { useState, useMemo } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from './theme/theme';
import MainLayout from './layouts/MainLayout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import DashboardPage from './pages/DashboardPage';
import ListPage from './pages/ListPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ChatPage from './pages/ChatPage';
import PrivateRoute from './components/PrivateRoute';
import ImageAnalysisPage from './pages/ImageAnalysisPage';
import MealDetailPage from './pages/MealDetailPage';
import Error404Page from './pages/Error404Page';

function App() {
  // se quiser persistir em localStorage, basta ler/gravar aqui
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  // recalcula o tema apenas quando o mode mudar
  const theme = useMemo(() => getTheme(mode), [mode]);

  // opcional: passe `setMode` via context ou props para trocar o tema em SettingsPage
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Router>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Rotas privadas dentro do layout principal */}
          <Route
            path="*"
            element={
              <PrivateRoute>
                {/* você pode injetar o toggle no MainLayout ou no SettingsPage */}
                <MainLayout mode={mode} onToggleMode={() => setMode(prev => prev === 'light' ? 'dark' : 'light')}>
                  <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/image" element={<ImageAnalysisPage />} />
                    <Route path="/meal/:id" element={<MealDetailPage />} />
                    <Route path="/list" element={<ListPage />} />
                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="*" element={<Error404Page />} />
                  </Routes>
                </MainLayout>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
