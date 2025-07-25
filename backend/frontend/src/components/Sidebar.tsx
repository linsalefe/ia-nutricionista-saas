import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  Box,
  Typography
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListIcon from '@mui/icons-material/List';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { Link, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const menuItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { label: 'Listagem', icon: <ListIcon />, path: '/list' },
  { label: 'Chat', icon: <ChatIcon />, path: '/chat' },
  { label: 'Análise de Imagem', icon: <PhotoCameraIcon />, path: '/image' },
  { label: 'Configurações', icon: <SettingsIcon />, path: '/settings' },
];

export default function Sidebar() {
  const isMobile = useMediaQuery('(max-width:900px)');
  const location = useLocation();

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: '#1e293b',
          color: '#fff',
          borderRight: 0,
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight={700} color="white">
          IA Nutricionista
        </Typography>
      </Box>

      <List>
        {menuItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.label}
              component={Link}
              to={item.path}
              selected={active}
              sx={{
                mx: 1,
                mb: 1,
                borderRadius: 2,
                color: '#fff',
                bgcolor: active ? 'primary.main' : 'transparent',
                '&:hover': {
                  bgcolor: 'primary.main',
                  color: '#fff',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#fff' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
}
