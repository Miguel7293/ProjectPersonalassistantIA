import React, { useState } from 'react';
import styles from '../../styles/Modal.module.css';

const EditProjectModal = ({ projectId, onClose, onProjectUpdated }) => {
    const [projectName, setProjectName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleUpdate = async () => {
        const response = await fetch('http://localhost:5000/api/v1/project/operation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sqlQuery: 'UPDATE',
                Project_ID: projectId,
                Name: projectName,
                Start_Date: startDate,
                End_Date: endDate,
            }),
        });
        if (response.ok) {
            onProjectUpdated();
            onClose();
        }
    };

    const handleDelete = async () => {
        const response = await fetch('http://localhost:5000/api/v1/project/operation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sqlQuery: 'DELETE',
                Project_ID: projectId,
            }),
        });
        if (response.ok) {
            onProjectUpdated();
            onClose();
        }
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <h2>Editar Proyecto</h2>
                <input
                    type="text"
                    placeholder="Nuevo Nombre del Proyecto"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                />
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <button onClick={handleUpdate}>Guardar Cambios</button>
                <button onClick={handleDelete}>Eliminar Proyecto</button>
                <button onClick={onClose} className={styles.closeButton}>Cerrar</button>
            </div>
        </div>
    );
};

export default EditProjectModal;
