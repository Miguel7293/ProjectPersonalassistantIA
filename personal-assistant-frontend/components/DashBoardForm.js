import { useState } from 'react';
import styles from '../styles/DashBoardForm.module.css';
import Sidebar from './Sidebar';

// Importa las secciones
import DashboardSection from './sections/DashboardSection';
import SchedulesSection from './sections/SchedulesSection';
import ProjectsSection from './sections/ProjectsSection';
import ChatIASection from './sections/ChatIASection';
import CreateNewProjectSection from './sections/CreateNewProjectSection';

const DashBoardForm = () => {
    const [activeTab, setActiveTab] = useState('dashboard'); // Estado para la pestaña activa
    const [menuVisible, setMenuVisible] = useState(true); // Estado para mostrar/ocultar el menú

    return (
        <div className={styles.dashboardContainer}>
            {/* Botón para minimizar el menú */}
            <button
                className={styles.menuToggleButton}
                onClick={() => setMenuVisible(!menuVisible)}
            >
                {menuVisible ? '=_=' : '0_0'}
            </button>

            <div className={styles.dashboardContent}>
                {/* Menú lateral */}
                {menuVisible && (
                    <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                )}

                {/* Contenido principal */}
                <main className={styles.mainContent}>
                    {activeTab === 'dashboard' && <DashboardSection />}
                    {activeTab === 'schedules' && <SchedulesSection />}
                    {activeTab === 'projects' && <ProjectsSection />}
                    {activeTab === 'chat' && <ChatIASection />}
                    {activeTab === 'create' && <CreateNewProjectSection />}
                </main>
            </div>
        </div>
    );
};

export default DashBoardForm;
