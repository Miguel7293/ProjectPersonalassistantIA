'use client';
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000', // URL del backend
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
