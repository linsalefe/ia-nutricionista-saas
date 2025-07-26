// src/components/Header.tsx
import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, useTheme } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

export default function Header() {
  const theme = useTheme();

  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={0}
      sx={{
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Título do SaaS */}
        <Typography variant="h6" noWrap sx={{ color: theme.palette.text.primary }}>
          NutriFlow
        </Typography>

        {/* Botão de logout */}
        <IconButton
          onClick={() => {
            localStorage.removeItem('token');
            window.location.reload();
          }}
          color="inherit"
        >
          <ExitToAppIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
