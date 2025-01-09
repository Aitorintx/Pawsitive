const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Usaremos axios para hacer solicitudes HTTP
const app = express();

app.use(cors({
    origin: 'http://localhost:8000',  // Permite solicitudes desde el frontend (http://localhost:8000)
    methods: 'GET,POST',             // Permite los métodos GET y POST
    allowedHeaders: 'Content-Type'   // Permite encabezados Content-Type
}));

app.use(express.json()); // Para que el body se procese como JSON

// Ruta para manejar la autenticación
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Realizamos una solicitud POST al microservicio FastAPI
        const response = await axios.post('http://localhost:5000/api/login', { username, password });

        if (response.data.success) {
            // Si el login es exitoso
            res.json({ success: true });
        } else {
            // Si las credenciales son incorrectas
            res.json({ success: false });
        }
    } catch (error) {
        console.error('Error al conectar con FastAPI:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

app.post('/api/register', async (req, res) => {
    const { username, password, email } = req.body;

    try {
        // Enviar solicitud POST a FastAPI para registrar un nuevo usuario
        const response = await axios.post('http://localhost:5000/api/register', { username, password, email });

        // Enviar respuesta al frontend
        res.json(response.data);
    } catch (error) {
        console.error('Error al conectar con FastAPI:', error);
        res.status(500).json({ success: false, message: error.response.data.detail });
    }
});

// Configurar el puerto para el API Gateway
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`API Gateway corriendo en http://localhost:${PORT}`);
});