import { useRouter } from 'next/router';
import styles from '../../styles/ModifingTaskSection.module.css';

const ModifingTaskSection = () => {
    const router = useRouter();
    const { id } = router.query;

    return (
        <div className={styles.taskContainer}>
            <h1 className={styles.title}>Modify Task</h1>
            <p className={styles.taskInfo}>You are working on Task ID: {id}</p>
        </div>
    );
};

export default ModifingTaskSection;
