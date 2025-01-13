const axios = require('axios');
const Animal = require('./db');  // Importar el modelo para MongoDB

const apiUrl = 'https://huachitos.cl/api/animales';

// Función para obtener los animales de la API
async function obtenerAnimales() {
  try {
    const response = await axios.get(apiUrl); // O el endpoint correspondiente

    if (response.data && Array.isArray(response.data.data)) {
      await guardarAnimalesEnDB(response.data.data);
    } else {
      console.error("No se encontraron datos de animales en la respuesta.");
    }
  } catch (error) {
    console.error("Error al obtener datos de la API:", error);
  }
}

// Función para guardar los animales en MongoDB
async function guardarAnimalesEnDB(animales) {
  try {
    // Comprobamos si ya existen animales en la base de datos
    const count = await Animal.countDocuments(); // Contamos los documentos existentes

    if (count > 0) {
      console.log("Los animales ya están en la base de datos. No se insertarán nuevos.");
      return; // Si ya hay animales, no insertamos más
    }

    for (const animal of animales) {
      // Verificar si el animal ya existe en la base de datos por su ID (o nombre)
      const existe = await Animal.findOne({ id: animal.id });

      if (!existe) { // Si el animal no existe, lo guardamos
        const nuevoAnimal = new Animal({
          id: animal.id,
          nombre: animal.nombre,
          tipo: animal.tipo,
          edad: animal.edad,
          estado: animal.estado,
          genero: animal.genero,
          desc_fisica: animal.desc_fisica,
          desc_personalidad: animal.desc_personalidad,
          desc_adicional: animal.desc_adicional,
          esterilizado: animal.esterilizado,
          vacunas: animal.vacunas,
          imagen: animal.imagen,
          equipo: animal.equipo,
          region: animal.region,
          comuna: animal.comuna,
          url: animal.url
        });

        await nuevoAnimal.save();
        console.log(`Animal ${animal.nombre} guardado exitosamente.`);
      } else {
        console.log(`El animal ${animal.nombre} ya existe en la base de datos.`);
      }
    }
  } catch (error) {
    console.error("Error al guardar los animales en la base de datos:", error);
  }
}

module.exports = { obtenerAnimales }
