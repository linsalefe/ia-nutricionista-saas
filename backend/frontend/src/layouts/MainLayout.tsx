import { Box, CssBaseline, Toolbar } from '@mui/material';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useLoading } from '../contexts/LoadingContext';
import LinearProgress from '@mui/material/LinearProgress';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { loading } = useLoading();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f7fe' }}>
      <CssBaseline />

      {/* Sidebar (estilo Materially) */}
      <Sidebar />

      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* Header fixo */}
        <Header />
        <Toolbar sx={{ minHeight: 64 }} />

        {/* Loading progress */}
        {loading && (
          <LinearProgress
            sx={{ position: 'fixed', top: 64, left: 240, right: 0, zIndex: 1200 }}
          />
        )}

        {/* Conteúdo da página */}
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>{children}</Box>
      </Box>
    </Box>
  );
}
