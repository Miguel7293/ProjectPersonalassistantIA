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

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const [userData, setUserData] = useState<{
    token: string | null;
    username: string | null;
    id: string | null;
  }>({
    token: null,
    username: null,
    id: null,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const id = localStorage.getItem('id');

    setUserData({ token, username, id });
  }, []);

  // Manejar la selección desde el menú del avatar
  const handleMenuOptionSelect = (option: string) => {
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
          onMenuClick={toggleSidebar}
          onMenuOptionSelect={handleMenuOptionSelect} // Pasar función al TopBar
        />
      </Box>

      <Box display="flex" flexGrow={1} sx={{ marginTop: '64px' }}>
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} sidebarOpen={sidebarOpen} />

        {/* Contenido Principal */}
        <Box flexGrow={1} p={3} bgcolor="background.default">
          {activeTab === 'dashboard' && <DashboardSection />}
          {activeTab === 'schedules' && <SchedulesSection />}
          {activeTab === 'projects' && <ProjectsSection userData={userData} />}
          {activeTab === 'chat' && <ChatIASection userData={userData} />}
          {activeTab === 'create' && <CreateNewProjectSection userData={userData} />}
          {activeTab === 'settings' && < SettingsSection />}
        </Box>
      </Box>
    </Box>
  );
}
