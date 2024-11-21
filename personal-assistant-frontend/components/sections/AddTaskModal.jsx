import React, { useState } from 'react';
import styles from '../../styles/Modal.module.css';

const AddTaskModal = ({ projectId, onClose, onTaskAdded }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [dueDate, setDueDate] = useState('');

    const handleSubmit = async () => {
        const response = await fetch('http://localhost:5000/api/v1/task/task/operation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sqlQuery: 'INSERT',
                Project_ID: projectId,
                Title: title,
                Description: description,
                Start_Date: startDate,
                End_Date: endDate,
                Due_Date: dueDate,
                Status: 'Pending',
            }),
        });
        if (response.ok) {
            onTaskAdded();
            onClose();
        }
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <h2>Añadir Tarea</h2>
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
                <button onClick={handleSubmit}>Añadir</button>
                <button onClick={onClose} className={styles.closeButton}>Cerrar</button>
            </div>
        </div>
    );
};

export default AddTaskModal;
