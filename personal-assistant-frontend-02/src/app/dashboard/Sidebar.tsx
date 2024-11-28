'use client';

import { Box, List, ListItemButton, ListItemIcon, ListItemText, Divider, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ScheduleIcon from '@mui/icons-material/Schedule';
import FolderIcon from '@mui/icons-material/Folder';
import ChatIcon from '@mui/icons-material/Chat';
import AddCircleIcon from '@mui/icons-material/AddCircle';

// Definimos los tipos para las props
interface SidebarProps {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const menuItems = [
    { label: 'Dashboard', icon: <DashboardIcon />, id: 'dashboard' },
    { label: 'Schedules', icon: <ScheduleIcon />, id: 'schedules' },
    { label: 'Projects', icon: <FolderIcon />, id: 'projects' },
    { label: 'Chat IA', icon: <ChatIcon />, id: 'chat' },
    { label: 'Create Project', icon: <AddCircleIcon />, id: 'create' },
  ];

  return (
    <Box
      width={240}
      bgcolor="primary.main"
      color="white"
      minHeight="100vh"
      display="flex"
      flexDirection="column"
    >
      <Typography variant="h5" align="center" py={2}>
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
                color: 'white',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
