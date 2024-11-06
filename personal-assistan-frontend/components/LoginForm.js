import { useState } from 'react';
import { useRouter } from 'next/router';
import api from '../utils/api';
import styles from '../styles/LoginForm.module.css';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/v1/users/login', { email, password });
            if (response.data.ok) {
                localStorage.setItem('token', response.data.jwt);
                router.push('/');
            } else {
                setError('Invalid email or password');
            }
        } catch (err) {
            console.error(err);
            setError('Login failed');
        }
    };

    // Función para redirigir a la página de registro
    const handleSignupRedirect = () => {
        router.push('/register');
    };

    return (
        <div className={styles.container}>
            <div className={styles.form}>
                <h2 className={styles.title}>Log In</h2>
                {error && <p className={styles.error}>{error}</p>}
                <form onSubmit={handleSubmit}>
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
                    <button type="submit" className={styles.button}>Log In</button>
                </form>
                <p className={styles.signup} onClick={handleSignupRedirect}>Sign up</p>
            </div>
        </div>
    );
};

export default LoginForm;
