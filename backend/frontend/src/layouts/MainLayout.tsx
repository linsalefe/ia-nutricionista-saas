import { Box } from '@mui/material';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useLoading } from '../contexts/LoadingContext';
import { LinearProgress } from '@mui/material';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { loading } = useLoading();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: 'background.default' }}>
      <Header />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 4, mt: 8 }}>
        {loading && <LinearProgress sx={{ position: 'fixed', top: 64, left: 0, right: 0, zIndex: 9999 }} />}
        {children}
      </Box>
    </Box>
  );
}
