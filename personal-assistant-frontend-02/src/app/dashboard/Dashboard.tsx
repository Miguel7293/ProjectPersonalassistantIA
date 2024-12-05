'use client';

import { Box, Typography } from '@mui/material';
import Sidebar from './Sidebar';
import DashboardSection from './sections/DashboardSection';
import SchedulesSection from './sections/SchedulesSection';
import ProjectsSection from './sections/ProjectsSection';
import ChatIASection from './sections/ChatIASection';
import CreateNewProjectSection from './sections/CreateNewProjectSection';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Estado para verificar datos de localStorage
  const [userData, setUserData] = useState<{
    token: string | null;
    username: string | null;
    id: string | null;
  }>({
    token: null,
    username: null,
    id: null,
  });

  // Leer datos del localStorage al cargar el componente
  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const id = localStorage.getItem('id');

    setUserData({ token, username, id });
  }, []);

  return (
    <Box display="flex" minHeight="100vh">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <Box flexGrow={1} p={3} bgcolor="background.default">
        {activeTab === 'dashboard' && <DashboardSection />}
        {activeTab === 'schedules' && <SchedulesSection />}
        {activeTab === 'projects' && <ProjectsSection userData={userData} />}
        {activeTab === 'chat' && <ChatIASection />}
        {activeTab === 'create' && <CreateNewProjectSection userData={userData}/>}
      </Box>  

    </Box>
  );
}
