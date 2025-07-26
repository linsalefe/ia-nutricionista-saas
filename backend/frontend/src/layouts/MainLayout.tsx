// src/layouts/MainLayout.tsx
import React from 'react';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useLoading } from '../contexts/LoadingContext';
import LinearProgress from '@mui/material/LinearProgress';
import { useLocation } from 'react-router-dom';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { loading } = useLoading();
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f7fe' }}>
      <CssBaseline />

      {/* Sidebar (estilo Materially) */}
      <Sidebar />

      <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header fixo */}
        <Header />
        <Toolbar sx={{ minHeight: 64 }} />

        {/* Loading progress */}
        {loading && (
          <LinearProgress
            sx={{ position: 'fixed', top: 64, left: 240, right: 0, zIndex: 1200 }}
          />
        )}

        {/* Conteúdo com animação de transição */}
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            style={{ flex: 1, overflowY: 'auto' }}
          >
            <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
              {children}
            </Box>
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
}
