import mysql.connector
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from mysql.connector import Error
import bcrypt

app = FastAPI()

# Conexión a la base de datos
def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host="localhost",        # Tu host (por defecto es localhost)
            user="root",             # Tu usuario de MySQL
            password="deusto",       # Tu contraseña de MySQL
            database="pawsitive_db"  # El nombre de tu base de datos
        )
        if connection.is_connected():
            return connection
    except Error as e:
        raise HTTPException(status_code=500, detail=f"Error de conexión con la base de datos: {e}")

# Definir el modelo de datos que se espera recibir en el login
class LoginRequest(BaseModel):
    username: str
    password: str

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str

# Ruta para manejar el login
@app.post("/api/login")
async def login(request: LoginRequest):
    username = request.username
    password = request.password

    # Conexión a la base de datos
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    # Consulta SQL para verificar las credenciales
    query = "SELECT * FROM usuarios WHERE nombre = %s AND contrasena = %s"
    cursor.execute(query, (username, password))
    
    # Recuperar los resultados
    user = cursor.fetchone()

    if user:
        cursor.close()
        connection.close()
        return {"success": True}
    else:
        cursor.close()
        connection.close()
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    
# Ruta para registrar un nuevo usuario
@app.post("/api/register")
async def register(request: RegisterRequest):
    username = request.username
    password = request.password
    correo = request.email

    # Verificar que el nombre de usuario no esté ya registrado
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    query = "SELECT * FROM usuarios WHERE correo = %s"
    cursor.execute(query, (correo,))
    user = cursor.fetchone()

    if user:
        cursor.close()
        connection.close()
        raise HTTPException(status_code=400, detail="El correo de usuario ya existe")


    # Insertar el nuevo usuario en la base de datos
    query = "INSERT INTO usuarios (nombre, correo, contrasena) VALUES (%s,%s, %s)"
    cursor.execute(query, (username, correo, password))
    connection.commit()

    cursor.close()
    connection.close()

    return {"success": True, "message": "Usuario registrado con éxito"}



if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)
