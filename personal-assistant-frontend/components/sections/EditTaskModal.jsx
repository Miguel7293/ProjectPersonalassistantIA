import React, { useState } from 'react';
import styles from '../../styles/Modal.module.css';

const EditTaskModal = ({ taskId, onClose, onTaskUpdated }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [status, setStatus] = useState('Pending');

    const handleUpdate = async () => {
        const response = await fetch('http://localhost:5000/api/v1/task/task/operation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sqlQuery: 'UPDATE',
                Task_ID: taskId,
                Title: title,
                Description: description,
                Start_Date: startDate,
                End_Date: endDate,
                Due_Date: dueDate,
                Status: status,
            }),
        });
        if (response.ok) {
            onTaskUpdated();
            onClose();
        }
    };

    const handleDelete = async () => {
        const response = await fetch('http://localhost:5000/api/v1/task/task/operation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sqlQuery: 'DELETE',
                Task_ID: taskId,
            }),
        });
        if (response.ok) {
            onTaskUpdated();
            onClose();
        }
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <h2>Editar Tarea</h2>
                <input
                    type="text"
                    placeholder="Título"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    placeholder="Descripción"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="Pending">Pendiente</option>
                    <option value="Completed">Completada</option>
                </select>
                <button onClick={handleUpdate}>Guardar Cambios</button>
                <button onClick={handleDelete}>Eliminar Tarea</button>
                <button onClick={onClose} className={styles.closeButton}>Cerrar</button>
            </div>
        </div>
    );
};

export default EditTaskModal;
