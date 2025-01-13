const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Usaremos axios para hacer solicitudes HTTP
const app = express();

app.use(cors({
    origin: 'http://localhost:8000',  // Permite solicitudes desde el frontend (http://localhost:8000)
    methods: 'GET,POST',             // Permite los métodos GET y POST
    allowedHeaders: ['Content-Type','Authorization']   // Permite encabezados Content-Type
}));

app.use(express.json()); // Para que el body se procese como JSON

// Ruta para manejar la autenticación
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Realizamos una solicitud POST al microservicio FastAPI
        const response = await axios.post('http://flask_backend:5000/api/login', { username, password });

        if (response.data.success) {
            // Si el login es exitoso
            res.json({ success: true, token: response.data.token });
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
        const response = await axios.post('http://flask_backend:5000/api/register', { username, password, email });

        // Enviar respuesta al frontend
        res.json(response.data);
    } catch (error) {
        console.error('Error al conectar con FastAPI:', error);
        res.status(500).json({ success: false, message: error.response.data.detail });
    }
});

app.get('/api/mascotas', async (req, res) => {
    const token = req.headers['authorization']; // Obtener el token del encabezado
    try {
        // Enviar la solicitud al backend (FastAPI) para obtener las mascotas
        const response = await axios.get('http://flask_backend:5000/api/mascotas', {
            headers: {
                'Authorization': token  // Pasar el token en el encabezado
            }
        });

        // Responder al frontend con los datos obtenidos de FastAPI
        res.json(response.data);
    } catch (error) {
        console.error('Error al obtener las mascotas:', error);
        res.status(500).json({ message: 'Error al obtener las mascotas' });
    }
});

app.post('/api/regMascota', async (req, res) => {
    const { nombre, raza, fecha_nacimiento } = req.body;
    const token = req.headers['authorization']

    try {
        // Enviar solicitud POST a FastAPI para registrar un nuevo usuario
        const response = await axios.post('http://flask_backend:5000/api/regMascota',{ nombre, raza, fecha_nacimiento },  {
            headers: {
                'Authorization': token  // Pasar el token en el encabezado
            }
        });
        console.log(response)
        // Enviar respuesta al frontend
        res.json(response.data);
    } catch (error) {
        console.error('Error al conectar con FastAPI:', error);
        res.status(500).json({ success: false, message: error.response.data.detail });
    }
});

app.get('/api/eventos', async (req, res) => {
    const token = req.headers['authorization']; // Obtener el token del encabezado
    try {
        // Enviar la solicitud al backend (FastAPI) para obtener las mascotas
        const response = await axios.get('http://flask_backend:5000/api/eventos', {
            headers: {
                'Authorization': token  // Pasar el token en el encabezado
            }
        });

        // Responder al frontend con los datos obtenidos de FastAPI
        res.json(response.data);
    } catch (error) {
        console.error('Error al obtener los eventos:', error);
        res.status(500).json({ message: 'Error al obtener los eventos' });
    }
});

app.post('/api/regEvento', async (req, res) => {
    const { evento, fechaHora, mascota } = req.body;
    const token = req.headers['authorization']

    try {
        // Enviar solicitud POST a FastAPI para registrar un nuevo usuario
        const response = await axios.post('http://flask_backend:5000/api/regEvento',{ evento, fechaHora, mascota },  {
            headers: {
                'Authorization': token  // Pasar el token en el encabezado
            }
        });
        console.log(response)
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