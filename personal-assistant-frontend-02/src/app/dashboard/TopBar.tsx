'use client';

import { AppBar, Toolbar, Typography, IconButton, Avatar, Box, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';

interface TopBarProps {
  userName: string;
  onMenuClick: () => void; // Función que se ejecuta al hacer clic en el botón del menú
  onMenuOptionSelect: (option: string) => void; // Nueva función para cambiar de sección
}

const TopBar: React.FC<TopBarProps> = ({ userName, onMenuClick, onMenuOptionSelect }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleMenuOptionClick = (option: string) => {
    handleCloseMenu();
    onMenuOptionSelect(option); // Notificar al Dashboard sobre la selección
  };

  return (
    <AppBar
      sx={{
        backgroundColor: 'black',
        zIndex: 1201,
      }}
    >
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={onMenuClick} sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Personal Assistant
        </Typography>

        <Box display="flex" alignItems="center">
          <Typography variant="body1" sx={{ marginRight: 2 }}>
            {userName}
          </Typography>
          <Avatar 
            alt={userName} 
            src="/static/images/avatar/1.jpg" 
            onClick={handleAvatarClick} 
            sx={{ cursor: 'pointer' }} 
          />
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={() => handleMenuOptionClick('dashboard')}>Dashboard</MenuItem>
          <MenuItem onClick={() => handleMenuOptionClick('schedules')}>Schedules</MenuItem>
          <MenuItem onClick={() => handleMenuOptionClick('projects')}>Projects</MenuItem>
          <MenuItem onClick={() => handleMenuOptionClick('settings')}>Settings</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
