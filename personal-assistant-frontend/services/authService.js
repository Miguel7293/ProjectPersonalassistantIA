// authService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const login = async (username, password) => {
  const response = await axios.post(`${API_URL}/login`, { username, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token); // Guardar el token en el almacenamiento local
  }
  return response.data;
};
