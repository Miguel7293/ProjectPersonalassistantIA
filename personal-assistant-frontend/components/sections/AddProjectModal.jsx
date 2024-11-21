import React, { useState } from 'react';
import styles from '../../styles/Modal.module.css';

const AddProjectModal = ({ onClose, onProjectAdded }) => {
    const [projectName, setProjectName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSubmit = async () => {
        const response = await fetch('http://localhost:5000/api/v1/project/operation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sqlQuery: 'INSERT',
                Name: projectName,
                Start_Date: startDate,
                End_Date: endDate,
            }),
        });
        if (response.ok) {
            onProjectAdded(); // Notificar que se añadió un proyecto
            onClose(); // Cerrar modal
        }
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <h2>Añadir Proyecto</h2>
                <input
                    type="text"
                    placeholder="Nombre del Proyecto"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                />
                <input
                    type="date"
                    placeholder="Fecha de Inicio"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                    type="date"
                    placeholder="Fecha de Fin"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <button onClick={handleSubmit}>Añadir</button>
                <button onClick={onClose} className={styles.closeButton}>Cerrar</button>
            </div>
        </div>
    );
};

export default AddProjectModal;
