// src/App.tsx
import { useState, useMemo, useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from './theme/theme';
import MainLayout from './layouts/MainLayout';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

import WelcomePage from './pages/WelcomePage';
import DashboardPage from './pages/DashboardPage';
import ListPage from './pages/ListPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ChatPage from './pages/ChatPage';
import ImageAnalysisPage from './pages/ImageAnalysisPage';
import MealDetailPage from './pages/MealDetailPage';
import Error404Page from './pages/Error404Page';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('themeMode') as 'light' | 'dark') || 'light';
  });

  // Persistir escolha de tema
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Onboarding */}
          <Route path="/welcome" element={<WelcomePage />} />

          {/* Rotas públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Rotas privadas */}
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <MainLayout
                  mode={mode}
                  onToggleMode={() =>
                    setMode((prev) => (prev === 'light' ? 'dark' : 'light'))
                  }
                >
                  <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/image" element={<ImageAnalysisPage />} />
                    <Route path="/meal/:id" element={<MealDetailPage />} />
                    <Route path="/list" element={<ListPage />} />
                    <Route path="/chat" element={<ChatPage />} />
                    <Route
                      path="/settings"
                      element={
                        <SettingsPage
                          mode={mode}
                          onToggleMode={() =>
                            setMode((prev) =>
                              prev === 'light' ? 'dark' : 'light'
                            )
                          }
                        />
                      }
                    />
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
