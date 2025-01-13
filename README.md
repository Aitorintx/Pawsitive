0) Software que se necesita instalar
    ·  Docker y Docker Compose: Para poder crear contenedores, ejecutar los servicios y gestionar múltiples contenedores.
    ·  Node.js: Para gestionar todos los archivos basados en node.js
1) Servicios que hay que arrancar
    · API Gateway: Un servicio que actúa como puerta de enlace entre el cliente y los microservicios.
    · Flask Backend: El servicio de backend principal basado en Flask, encargado de gestionar las mascotas, eventos y usuarios.
    · Node Backend: Un servicio de backend adicional para otras funcionalidades del sistema.
    · Frontend: El cliente que interactúa con el usuario.
    · MySQL: Base de datos para almacenar usuarios, mascotas y eventos.
    · MongoDB: Usado para almacenar datos en la arquitectura que requieren almacenamiento NoSQL.
2) Dependencias que hay que instalar
    Antes de arrancar los servicios, asegúrate de tener las dependencias necesarias para cada uno de los servicios backend:

    Flask Backend: Dentro del directorio flask-backend, ejecuta: pip install -r requirements.txt
    Este archivo contiene: { Flask==2.1.1, Flask-SQLAlchemy==2.5.1, fastapi==0.75.0, mysql-connector-python==8.0.26, pydantic==1.8.2,
                             uvicorn==0.15.0,pyjwt==2.4.0}
    Todos los node.js dentro de cada uno de los directorios, ejecuta: npm install
    Este archivo contiene: {"axios": "^1.7.9", "cors": "^2.8.5", "express": "^4.21.2", "mongoose": "^8.9.4"}
3) Cómo arrancar la parte servidora
    Para ejecutar todos los servicios de forma coordinada, utiliza Docker Compose. Esto levantará todos los servicios descritos en el archivo docker-compose.yml.
    Arrancar los servicios: docker-compose up --build
4) Cómo acceder a la parte cliente
    Una vez que los servicios están en marcha, puedes acceder a la parte cliente y servidora de la aplicación a través de tu navegador.

    Acceso al Frontend: http://localhost:8000
    Acceso a la API (Backend de Flask): http://localhost:5000/docs

