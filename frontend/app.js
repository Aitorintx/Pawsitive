const express = require('express');
const path = require('path');
const app = express();

// Servir archivos estáticos desde la carpeta 'frontend'
app.use('/static',express.static(path.join(__dirname, 'static')));

// Rutas para servir los archivos HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'index.html'));
});

app.get('/registro', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'registro.html'));
});
app.get('/pantallaInicio', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'pantallaInicio.html'));
});

app.get('/calendario', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'calendario.html'));
});

app.get('/mascota', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'mascota.html'));
});

// Configurar el puerto
const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Servidor de frontend corriendo en http://localhost:${PORT}`);
});
