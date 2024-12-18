import { AppBar, Toolbar, Typography, IconButton, Avatar, Box, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';

interface TopBarProps {
  userName: string; // Solo el nombre del usuario
  image_url: string | null; // URL de la imagen del avatar
  onMenuClick: () => void; // Función que se ejecuta al hacer clic en el botón del menú
  onMenuOptionSelect: (option: string) => void; // Función para cambiar de sección
  onLogout: () => void; // Función para manejar el logout
}

const TopBar: React.FC<TopBarProps> = ({ userName, image_url, onMenuClick, onMenuOptionSelect, onLogout }) => {
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

  const handleLogoutClick = () => {
    handleCloseMenu();
    onLogout(); // Ejecutar la función de logout
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
            src={image_url || '/static/images/avatar/default.jpg'} // Usar imagen por defecto si no hay URL
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
          <MenuItem onClick={() => handleMenuOptionClick('schedules')}>Notifications</MenuItem>
          <MenuItem onClick={() => handleMenuOptionClick('projects')}>Projects</MenuItem>
          <MenuItem onClick={() => handleMenuOptionClick('settings')}>Settings</MenuItem>
          <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
