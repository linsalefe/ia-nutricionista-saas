// src/components/Sidebar.tsx
import React from 'react';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  useTheme,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListIcon from '@mui/icons-material/List';
import ChatIcon from '@mui/icons-material/Chat';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SettingsIcon from '@mui/icons-material/Settings';
import { NavLink, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/',          label: 'Dashboard',         icon: <DashboardIcon /> },
  { to: '/list',      label: 'Listagem',          icon: <ListIcon /> },
  { to: '/chat',      label: 'Chat',              icon: <ChatIcon /> },
  { to: '/image',     label: 'Análise de Imagem', icon: <PhotoCameraIcon /> },
  { to: '/settings',  label: 'Configurações',     icon: <SettingsIcon /> },
];

export default function Sidebar() {
  const theme = useTheme();
  const { pathname } = useLocation();

  return (
    <Box
      component="nav"
      sx={{
        width: 240,
        flexShrink: 0,
        bgcolor: theme.palette.primary.dark,
        color: theme.palette.primary.contrastText,
        display: 'flex',
        flexDirection: 'column',
        pt: 2,
      }}
    >
      {/* Título do SaaS */}
      <Box sx={{ px: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ color: 'inherit', fontWeight: 700 }}>
          NutriFlow
        </Typography>
      </Box>

      <Divider sx={{ bgcolor: theme.palette.primary.light }} />

      {/* Links de navegação */}
      <List sx={{ flexGrow: 1, mt: 1 }}>
        {navItems.map(({ to, label, icon }) => (
          <ListItemButton
            key={to}
            component={NavLink}
            to={to}
            sx={{
              mb: 0.5,
              mx: 1,
              borderRadius: 1.5,
              '&.active, &:hover': {
                bgcolor: theme.palette.primary.main,
              },
              color: theme.palette.primary.contrastText,
              ...(pathname === to && {
                bgcolor: theme.palette.primary.main,
              }),
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
              {icon}
            </ListItemIcon>
            <ListItemText primary={label} />
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ bgcolor: theme.palette.primary.light, my: 1 }} />

      {/* Botão de sair */}
      <Box sx={{ px: 1 }}>
        <ListItemButton
          onClick={() => {
            localStorage.removeItem('token');
            window.location.reload();
          }}
          sx={{
            mx: 1,
            borderRadius: 1.5,
            '&:hover': { bgcolor: theme.palette.primary.main },
            color: theme.palette.primary.contrastText,
          }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Sair" />
        </ListItemButton>
      </Box>
    </Box>
  );
}
