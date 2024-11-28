'use client';

import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import DashboardSection from './sections/DashboardSection';
import SchedulesSection from './sections/SchedulesSection';
import ProjectsSection from './sections/ProjectsSection';
import ChatIASection from './sections/ChatIASection';
import CreateNewProjectSection from './sections/CreateNewProjectSection';
import { useState } from 'react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <Box display="flex" minHeight="100vh">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <Box flexGrow={1} p={3} bgcolor="background.default">
        {activeTab === 'dashboard' && <DashboardSection />}
        {activeTab === 'schedules' && <SchedulesSection />}
        {activeTab === 'projects' && <ProjectsSection />}
        {activeTab === 'chat' && <ChatIASection />}
        {activeTab === 'create' && <CreateNewProjectSection />}
      </Box>
    </Box>
  );
}
