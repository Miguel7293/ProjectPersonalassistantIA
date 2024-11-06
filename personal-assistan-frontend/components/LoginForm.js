import { useState } from 'react';
import { useRouter } from 'next/router';
import api from '../utils/api';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/v1/users/login', { email, password });

            // Verifica si la respuesta tiene ok: true
            if (response.data.ok) {
                // Almacenar el token en localStorage
                localStorage.setItem('token', response.data.jwt);
                // Redirigir al usuario a la página principal
                router.push('/');
            } else {
                setError('Invalid email or password');
            }
        } catch (err) {
            setError('Login failed');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginForm;
