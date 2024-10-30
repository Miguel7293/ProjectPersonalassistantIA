// server.js
const express = require('express');
const cors = require('cors');
const app = express();

// Configuración
app.use(express.json());
app.use(cors());

// Ruta de prueba para verificar que el servidor está funcionando
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente');
});

// Ruta de ejemplo para autenticación (login)
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Validar usuario (ejemplo simple)
  if (username === 'usuario' && password === 'contraseña') {
    // Aquí generarías un token JWT y lo enviarías de vuelta
    res.json({ message: 'Autenticación exitosa', token: 'token-de-ejemplo' });
  } else {
    res.status(401).json({ message: 'Credenciales incorrectas' });
  }
});

// Inicializar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
