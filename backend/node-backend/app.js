const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');  // Importar el paquete CORS
const Animal = require('./db');  // Asegúrate de que este archivo contiene el modelo de Animal
const {obtenerAnimales}=require(('./obtenerAnimales'))

const app = express();
const port = 3001;

// Habilitar CORS para el frontend en http://localhost:8000
app.use(cors({
  origin: 'http://localhost:8000',  // Permite solicitudes desde localhost:8000
  methods: 'GET,POST',  // Permite solicitudes GET y POST
  allowedHeaders: 'Content-Type, Authorization'  // Permite encabezados necesarios
}));

// Iniciar la función para obtener y guardar los animales
obtenerAnimales();


app.get('/api/tipos', async (req, res) => {
  try {
    // Ejecutar una consulta de agregación para obtener los tipos únicos de animales
    const tiposUnicos = await Animal.aggregate([{$group: {_id: "$tipo"}},{$project: {_id: 0,  tipo: "$_id"}}]);
    
    // Enviar los resultados
    res.json(tiposUnicos);
  } catch (error) {
    console.error('Error al obtener los tipos de animales:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

app.get('/api/estados', async (req, res) => {
  try {
    // Ejecutar una consulta de agregación para obtener los tipos únicos de animales
    const estadosUnicos = await Animal.aggregate([{$group: {_id: "$estado"}},{$project: {_id: 0,  estado: "$_id"}}]);
    
    // Enviar los resultados
    res.json(estadosUnicos);
  } catch (error) {
    console.error('Error al obtener los estados de animales:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});


app.get('/api/animales/estado-tipo', async (req, res) => {
  try {
    const { estado, tipo } = req.query;  // Obtener el tipo desde los parámetros de la URL

    // Buscar animales que coincidan con el tipo proporcionado
    const animales = await Animal.find({tipo:tipo,estado:estado})   ;  // Solo traer el campo "nombre"

    if (animales.length > 0) {
      // Si se encuentran animales, enviarlos como respuesta
      res.json(animales);
    } else {
      // Si no se encuentran animales del tipo especificado
      res.status(404).json({ message: `No se encontraron animales del tipo ${tipo}` });
    }
  } catch (error) {
    console.error('Error al obtener los animales filtrados por tipo:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Configuración del servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});