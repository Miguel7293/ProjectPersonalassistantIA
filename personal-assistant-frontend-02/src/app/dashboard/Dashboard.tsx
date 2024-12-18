'use client';

import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import DashboardSection from './sections/DashboardSection';
import SchedulesSection from './sections/SchedulesSection';
import ProjectsSection from './sections/ProjectsSection';
import ChatIASection from './sections/ChatIASection';
import SettingsSection from './sections/SettingsSection';
import CreateNewProjectSection from './sections/CreateNewProjectSection';
import { useState, useEffect } from 'react';

// Define el tipo UserData
interface UserData {
  token: string | null;
  username: string | null;
  id: string | null;
  email: string | null;
  image_url: string | null;
  unique_code: string | null;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    console.log('Sidebar Open:', !sidebarOpen);  // Log del estado de la barra lateral
  };

  const [userData, setUserData] = useState<UserData>({
    token: null,
    username: null,
    id: null,
    email: null,
    image_url: null,
    unique_code: null,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const id = localStorage.getItem('id');
    const email = localStorage.getItem('email');
    const image_url = localStorage.getItem('image_url');
    const unique_code = localStorage.getItem('unique_code');


    // Log de los datos del usuario recuperados desde localStorage
    console.log('User Data from localStorage:', { token, username, id, email, image_url,unique_code });

    setUserData({ token, username, id, email, image_url,unique_code });
  }, []);

  const handleMenuOptionSelect = (option: string) => {
    console.log('Selected Menu Option:', option);  // Log de la opción del menú seleccionada
    setActiveTab(option);
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      {/* Barra Superior */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          height: '0.1px',
        }}
      >
        <TopBar
          userName={userData.username || 'Usuario'}
          image_url={userData.image_url}
          onMenuClick={toggleSidebar}
          onMenuOptionSelect={handleMenuOptionSelect}
        />
      </Box>

      <Box display="flex" flexGrow={1} sx={{ marginTop: '64px' }}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} sidebarOpen={sidebarOpen} />

        {/* Contenido Principal */}
        <Box flexGrow={1} p={3} bgcolor="background.default">
          {activeTab === 'dashboard' && <DashboardSection />}
          {activeTab === 'schedules' && <SchedulesSection userData={userData}  />}
          {activeTab === 'projects' && <ProjectsSection userData={userData} />}
          {activeTab === 'chat' && <ChatIASection userData={userData} />}
          {activeTab === 'create' && <CreateNewProjectSection userData={userData} />}
          {activeTab === 'settings' && (
            <SettingsSection
              userData={{
                email: userData.email || '',
                image_url: userData.image_url || '',
                username: userData.username || '',
              }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}
