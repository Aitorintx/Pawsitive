const mongoose = require('mongoose');

// Conexión a MongoDB
mongoose.connect('mongodb://mongo-db:27017/adopcionAnimales', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error de conexión a MongoDB:', err));

// Esquema para los animales adoptables
const animalSchema = new mongoose.Schema({
  id: String,
  nombre: String,
  tipo: String,
  edad: String,
  estado: String,
  genero: String,
  desc_fisica: String,
  desc_personalidad: String,
  desc_adicional: String,
  esterilizado: Boolean,
  vacunas: Boolean,
  imagen: String,
  equipo: String,
  region: String,
  comuna: String,
  url: String
});

// Modelo para los animales adoptables
const Animal = mongoose.model('Animal', animalSchema);

module.exports = Animal;