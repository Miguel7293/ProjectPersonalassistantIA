// components/Sidebar.js
import styles from '../styles/Sidebar.module.css';

const Sidebar = ({ activeTab, setActiveTab }) => {
    return (
        <nav className={styles.sidebar}>
            <ul className={styles.menuList}>
                <li
                    className={activeTab === 'dashboard' ? styles.active : ''}
                    onClick={() => setActiveTab('dashboard')}
                >
                    Dashboard
                </li>
                <li
                    className={activeTab === 'schedules' ? styles.active : ''}
                    onClick={() => setActiveTab('schedules')}
                >
                    Schedules
                </li>
                <li
                    className={activeTab === 'projects' ? styles.active : ''}
                    onClick={() => setActiveTab('projects')}
                >
                    Projects
                </li>
                <li
                    className={activeTab === 'chat' ? styles.active : ''}
                    onClick={() => setActiveTab('chat')}
                >
                    Chat IA
                </li>
                <li
                    className={activeTab === 'create' ? styles.active : ''}
                    onClick={() => setActiveTab('create')}
                >
                    Create new project
                </li>
            </ul>
        </nav>
    );
};

export default Sidebar;
