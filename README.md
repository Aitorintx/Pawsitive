# Proyecto: Gestión de Mascotas y Eventos

Este proyecto proporciona una solución web para gestionar mascotas y sus eventos. Utiliza una arquitectura basada en microservicios con un backend en Flask para la API, y un frontend en React/HTML5. Los datos son gestionados en una base de datos MySQL, con Docker para orquestar los servicios.

## 0) Software que se necesita instalar

- **Docker y Docker Compose**: Para poder crear contenedores, ejecutar los servicios y gestionar múltiples contenedores.
- **Node.js**: Para gestionar todos los archivos basados en node.js.

## 1) Servicios que hay que arrancar

- **API Gateway**: Un servicio que actúa como puerta de enlace entre el cliente y los microservicios.
- **Flask Backend**: El servicio de backend principal basado en Flask, encargado de gestionar las mascotas, eventos y usuarios.
- **Node Backend**: Un servicio de backend adicional para otras funcionalidades del sistema.
- **Frontend**: El cliente que interactúa con el usuario.
- **MySQL**: Base de datos para almacenar usuarios, mascotas y eventos.
- **MongoDB**: Usado para almacenar datos en la arquitectura que requieren almacenamiento NoSQL.

## 2) Dependencias que hay que instalar

Antes de arrancar los servicios, asegúrate de tener las dependencias necesarias para cada uno de los servicios backend:

- **Flask Backend**: Dentro del directorio `flask-backend`, ejecuta:
  ```bash
  pip install -r requirements.txt
Este archivo contiene: { Flask==2.1.1, Flask-SQLAlchemy==2.5.1, fastapi==0.75.0, mysql-connector-python==8.0.26, pydantic==1.8.2, uvicorn==0.15.0, pyjwt==2.4.0 }
- **Todos los node.js**: Dentro de cada uno de los directorios, ejecuta: 
  ```bash
  npm install
Este archivo contiene: { "axios": "^1.7.9", "cors": "^2.8.5", "express": "^4.21.2", "mongoose": "^8.9.4" }

## 3) Cómo arrancar la parte servidora

Para ejecutar todos los servicios de forma coordinada, utiliza Docker Compose. Esto levantará todos los servicios descritos en el archivo `docker-compose.yml`.

### Arrancar los servicios:

1. En el directorio raíz del proyecto, ejecuta el siguiente comando para arrancar los servicios:

   ```bash
   docker-compose up --build

## 4) Cómo acceder a la parte cliente

Una vez que todos los servicios estén en marcha, podrás acceder a la parte cliente de la aplicación y a las rutas de la API desde tu navegador.

### Acceso al Frontend
El frontend de la aplicación se encuentra en el contenedor `frontend` y será accesible a través de tu navegador web.

- **URL para el Frontend**: [http://localhost:8000](http://localhost:8000)

### Acceso a la API (Backend de Flask)
El backend de Flask está expuesto a través del puerto 5000. En este backend, podrás interactuar con la API mediante los distintos endpoints disponibles.

- **Documentación de la API (Swagger)**: [http://localhost:5000/docs](http://localhost:5000/docs)

---

Con estos pasos, podrás interactuar tanto con el frontend como con los servicios de backend, accediendo a la interfaz de usuario y haciendo peticiones a la API directamente desde tu navegador.


