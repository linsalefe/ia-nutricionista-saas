import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeMode } from '../contexts/ThemeModeContext';
import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

export default function Header() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { mode, toggleMode } = useThemeMode();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.clear();
    setSnackbar({ open: true, message: 'Logout realizado!', severity: 'success' });
    setTimeout(() => {
      handleClose();
      navigate('/login');
      window.location.reload();
    }, 1000);
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: '#fff',
          color: 'text.primary',
          zIndex: 1201,
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 4 } }}>
          <Typography variant="h6" fontWeight={600}>
            Painel
          </Typography>

          <Box display="flex" alignItems="center">
            <IconButton onClick={toggleMode} sx={{ mr: 1 }}>
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>

            {!token ? (
              <>
                <Button variant="contained" onClick={handleClick}>
                  Login/Cadastrar
                </Button>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                  <MenuItem component={RouterLink} to="/login" onClick={handleClose}>
                    Login
                  </MenuItem>
                  <MenuItem component={RouterLink} to="/signup" onClick={handleClose}>
                    Cadastro
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button variant="outlined" color="primary" onClick={handleLogout}>
                Sair
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity as any} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
