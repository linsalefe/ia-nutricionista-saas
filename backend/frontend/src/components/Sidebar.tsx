import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, useMediaQuery } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListIcon from '@mui/icons-material/List';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link } from 'react-router-dom';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

const menuItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { label: 'Listagem', icon: <ListIcon />, path: '/list' },
  { label: 'Chat', icon: <ChatIcon />, path: '/chat' },
  { label: 'Análise de Imagem', icon: <PhotoCameraIcon />, path: '/image' },
  { label: 'Configurações', icon: <SettingsIcon />, path: '/settings' },
];

export default function Sidebar() {
  const isMobile = useMediaQuery('(max-width:900px)');

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box', borderRadius: 2, mt: 8 },
      }}
    >
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.label}
            component={Link}
            to={item.path}
            sx={{ borderRadius: 2, my: 1 }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
