import { useState } from 'react';
import { useRouter } from 'next/router';
import api from '../utils/api';
import styles from '../styles/RegisterForm.module.css';

const RegisterForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/v1/users/register', { name, email, password });
            if (response.data.ok) {
                router.push('/login'); // Redirige al login si el registro es exitoso
            } else {
                setError('Error registering user');
            }
        } catch (err) {
            setError('Registration failed');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.form}>
                <h2 className={styles.title}>Sign In</h2>
                {error && <p className={styles.error}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className={styles.inputField}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={styles.inputField}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={styles.inputField}
                    />
                    <button type="submit" className={styles.button}>Sign In</button>
                </form>
            </div>
        </div>
    );
};

export default RegisterForm;
