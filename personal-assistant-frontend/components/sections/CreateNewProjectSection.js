// components/sections/CreateNewProjectSection.js
import { useState } from 'react';
import styles from '../../styles/CreateNewProjectSection.module.css';

const CreateNewProjectSection = () => {
    const [formData, setFormData] = useState({
        Name: '',
        Start_Date: '',
        End_Date: ''
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requestPayload = {
            sqlQuery: 'INSERT',
            ...formData
        };

        try {
            const response = await fetch('http://localhost:5000/api/v1/project/operation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestPayload)
            });

            if (response.ok) {
                const result = await response.json();
                setMessage('Project created successfully!');
                setFormData({ Name: '', Start_Date: '', End_Date: '' });
            } else {
                const errorData = await response.json();
                setMessage(`Error: ${errorData.msg || 'Failed to create project'}`);
            }
        } catch (error) {
            setMessage('Server error. Please try again later.');
        }
    };

    return (
        <div className={styles.createProjectContainer}>
            <h1 className={styles.title}>Create a New Project</h1>

            <form className={styles.form} onSubmit={handleSubmit}>
                {/* Project Name */}
                <div className={styles.formGroup}>
                    <label htmlFor="Name" className={styles.label}>Project Name</label>
                    <input
                        type="text"
                        id="Name"
                        name="Name"
                        value={formData.Name}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="Enter project name"
                        required
                    />
                </div>

                {/* Start Date */}
                <div className={styles.formGroup}>
                    <label htmlFor="Start_Date" className={styles.label}>Start Date</label>
                    <input
                        type="date"
                        id="Start_Date"
                        name="Start_Date"
                        value={formData.Start_Date}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                </div>

                {/* End Date */}
                <div className={styles.formGroup}>
                    <label htmlFor="End_Date" className={styles.label}>End Date</label>
                    <input
                        type="date"
                        id="End_Date"
                        name="End_Date"
                        value={formData.End_Date}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>

                {/* Submit Button */}
                <div className={styles.formGroup}>
                    <button type="submit" className={styles.submitButton}>
                        Create Project
                    </button>
                </div>
            </form>

            {/* Feedback Message */}
            {message && <p className={styles.message}>{message}</p>}
        </div>
    );
};

export default CreateNewProjectSection;
