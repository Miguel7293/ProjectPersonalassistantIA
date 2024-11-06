import { useState, useEffect } from 'react';  // Solo importa una vez useState y useEffect
import { useRouter } from 'next/router';
import styles from '../styles/DashBoardForm.module.css';  // Asegúrate de importar el archivo CSS

const DashBoard = () => {
    const [username, setUsername] = useState('');
    const router = useRouter();  // Usamos el hook de enrutamiento de Next.js

    const handleLoginRedirect = () => {
        router.push('/login');  // Redirige al usuario al login
    };

    useEffect(() => {
        // Obtener el nombre de usuario desde localStorage cuando el componente se monta
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);  // Si se encuentra el nombre, actualizamos el estado
            console.log('Nombre de usuario recibido desde el DASHBOARD:', storedUsername);  // Imprimir en consola el nombre de usuario
        } else {
            console.log('No se encontró el nombre de usuario en localStorage');  // Imprimir en consola si no se encuentra el nombre
        }
    }, []);  // Solo se ejecuta una vez cuando el componente se monta

    return (
        <div className={styles.dashboardContainer}>
            <h1 className={styles.dashboardTitle}>Felicitaciones, te logueaste</h1>
            {username && (
                <p className={styles.dashboardMessage}>
                    Bienvenido, <span className={styles.dashboardUser}>{username}</span>!
                </p>
            )}
            <button className={styles.dashboardButton} onClick={handleLoginRedirect}>
                Volver al inicio
            </button>
        </div>
    );
};

export default DashBoard;
