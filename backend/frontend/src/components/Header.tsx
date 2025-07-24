import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem, Snackbar, Alert } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useThemeMode } from '../contexts/ThemeModeContext';
import { useState } from 'react';

export default function Header() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { mode, toggleMode } = useThemeMode();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    // Limpa storage, histórico, feedback
    localStorage.removeItem('token');
    sessionStorage.clear();
    setSnackbar({ open: true, message: 'Logout realizado!', severity: 'success' });
    setTimeout(() => {
      handleClose();
      navigate('/login');
      window.location.reload(); // limpa contextos react (opcional, mas reforça)
    }, 1000);
  };

  return (
    <AppBar position="fixed" color="default" elevation={1} sx={{ bgcolor: 'background.paper' }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" fontWeight={700} color="primary" sx={{ textDecoration: 'none' }}>
            IA Nutricionista
          </Typography>
        </Box>
        <Button
          onClick={toggleMode}
          color="inherit"
          sx={{ mr: 1, minWidth: 0, px: 1 }}
          aria-label="Alternar modo claro/escuro"
        >
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </Button>
        {!token ? (
          <>
            <Button
              variant="contained"
              color="primary"
              sx={{ ml: 2, px: 4, borderRadius: 2 }}
              onClick={handleClick}
            >
              Login/Cadastrar
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
              <MenuItem component={RouterLink} to="/login" onClick={handleClose}>Login</MenuItem>
              <MenuItem component={RouterLink} to="/signup" onClick={handleClose}>Cadastro</MenuItem>
            </Menu>
          </>
        ) : (
          <Button
            variant="outlined"
            color="primary"
            sx={{ ml: 2, px: 4, borderRadius: 2 }}
            onClick={handleLogout}
          >
            Sair
          </Button>
        )}
      </Toolbar>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={1200}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity as any} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AppBar>
  );
}
