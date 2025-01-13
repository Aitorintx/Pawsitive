# Usamos una imagen de Node.js para construir el servicio
FROM node:16

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application's code
COPY . .

# Exponemos el puerto que escuchará el API Gateway
EXPOSE 3000

# Comando para iniciar el servicio
CMD ["node", "gateway.js"]