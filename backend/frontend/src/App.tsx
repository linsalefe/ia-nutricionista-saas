// src/App.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { getTheme } from './theme/theme';
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

import PrivateRoute from './components/PrivateRoute';
import MainLayout from './layouts/MainLayout';

import DashboardPage from './pages/DashboardPage';
import ImageAnalysisPage from './pages/ImageAnalysisPage';
import MealDetailPage from './pages/MealDetailPage';
import ListPage from './pages/ListPage';
import ChatPage from './pages/ChatPage';
import SettingsPage from './pages/SettingsPage';
import Error404Page from './pages/Error404Page';

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>(() =>
    (localStorage.getItem('themeMode') as 'light' | 'dark') || 'light'
  );

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

          {/* Autenticação */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* App protegido */}
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
                    {/* Rota principal do SaaS */}
                    <Route path="/" element={<DashboardPage />} />

                    {/* Demais páginas internas */}
                    <Route path="image" element={<ImageAnalysisPage />} />
                    <Route path="meal/:id" element={<MealDetailPage />} />
                    <Route path="list" element={<ListPage />} />
                    <Route path="chat" element={<ChatPage />} />
                    <Route
                      path="settings"
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
