# Usamos una imagen oficial de Python
FROM python:3.9-slim

# Seteamos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos el archivo de dependencias
COPY ./requirements.txt /app/requirements.txt

# Instalamos las dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copiamos el código fuente del backend
COPY . /app

# Exponemos el puerto que escuchará Flask
EXPOSE 5000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5000", "--timeout-keep-alive", "300"]