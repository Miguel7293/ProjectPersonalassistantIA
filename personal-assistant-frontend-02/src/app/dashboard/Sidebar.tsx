'use client';

import { Box, List, ListItemButton, ListItemIcon, ListItemText, Divider, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ScheduleIcon from '@mui/icons-material/Schedule';
import FolderIcon from '@mui/icons-material/Folder';
import ChatIcon from '@mui/icons-material/Chat';
import AddCircleIcon from '@mui/icons-material/AddCircle';

interface SidebarProps {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  sidebarOpen: boolean; // Estado para controlar si el Sidebar está abierto
}

const Sidebar = ({ activeTab, setActiveTab, sidebarOpen }: SidebarProps) => {
  const menuItems = [
    { label: 'Dashboard', icon: <DashboardIcon />, id: 'dashboard' },
    { label: 'Notifications', icon: <ScheduleIcon />, id: 'schedules' },
    { label: 'Projects', icon: <FolderIcon />, id: 'projects' },
    { label: 'Chat IA', icon: <ChatIcon />, id: 'chat' },
    { label: 'Create Project', icon: <AddCircleIcon />, id: 'create' },
  ];

  return (
    <Box
      sx={{
        width: sidebarOpen ? 240 : 60, // Cambia entre ancho completo y colapsado
        transition: 'width 0.3s ease-in-out', // Animación suave del ancho
        bgcolor: 'background.paper',
        color: 'text.primary',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden', // Oculta contenido extra al colapsar
        boxShadow: sidebarOpen ? 2 : 0, // Sombra cuando está abierto
      }}
    >
      <Typography
        variant="h5"
        align="center"
        py={2}
        sx={{
          opacity: sidebarOpen ? 1 : 0, // Oculta el título al colapsar
          transition: 'opacity 0.3s ease-in-out', // Transición de opacidad
        }}
      >
        Dashboard
      </Typography>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.id}
            selected={activeTab === item.id}
            onClick={() => setActiveTab(item.id)}
            sx={{
              '&.Mui-selected': {
                bgcolor: 'secondary.main',
                color: 'text.primary',
              },
              '&:hover': {
                bgcolor: 'primary.main',
                color: 'white',
              },
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.3s ease-in-out', // Transición general para el botón
            }}
          >
            <ListItemIcon
              sx={{
                color: 'inherit',
                minWidth: sidebarOpen ? 40 : 24, // Ajusta el tamaño de los íconos
                transition: 'min-width 0.3s ease-in-out', // Suaviza el tamaño
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              sx={{
                display: sidebarOpen ? 'block' : 'none', // Oculta el texto al colapsar
                transition: 'opacity 0.3s ease-in-out', // Transición de opacidad
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
