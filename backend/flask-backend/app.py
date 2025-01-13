import mysql.connector
from fastapi import Depends,FastAPI, HTTPException, Header
from pydantic import BaseModel
from mysql.connector import Error
import jwt
from  datetime import datetime,timedelta, date


app = FastAPI()

SECRET_KEY = "mysecretkey"



# Conexión a la base de datos
def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host="mysql",           # Tu host (por defecto es localhost)
            user="root",             # Tu usuario de MySQL
            password="deusto",       # Tu contraseña de MySQL
            database="pawsitive_db"  # El nombre de tu base de datos
        )
        if connection.is_connected():
            return connection
    except Error as e:
        raise HTTPException(status_code=500, detail=f"Error de conexión con la base de datos: {e}")
    
def init_db():
    connection = get_db_connection()
    cursor = connection.cursor()

    # Crear tabla de usuarios (si no existe)
    create_users_table = """
    CREATE TABLE IF NOT EXISTS usuarios (
        id_usuario INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        correo VARCHAR(255) NOT NULL UNIQUE,
        contrasena VARCHAR(255) NOT NULL
    );
    """
    cursor.execute(create_users_table)

    # Crear tabla de mascotas (si no existe)
    create_pets_table = """
    CREATE TABLE IF NOT EXISTS mascotas (
        id_mascota INT AUTO_INCREMENT PRIMARY KEY,
        id_usuario INT NOT NULL,
        nombre VARCHAR(255) NOT NULL,
        raza VARCHAR(255) NOT NULL,
        fecha_nacimiento DATE NOT NULL,
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
    );
    """
    cursor.execute(create_pets_table)

    # Crear tabla de eventos (si no existe)
    create_events_table = """
    CREATE TABLE IF NOT EXISTS eventos (
        id_evento INT AUTO_INCREMENT PRIMARY KEY,
        id_mascota INT NOT NULL,
        tipo_recordatorio VARCHAR(255) NOT NULL,
        fecha DATE NOT NULL,
        hora DATETIME NOT NULL,
        FOREIGN KEY (id_mascota) REFERENCES mascotas(id_mascota)
    );
    """
    cursor.execute(create_events_table)

    connection.commit()  # Guardar cambios
    cursor.close()
    connection.close()

def insert_initial_data():
    connection = get_db_connection()
    cursor = connection.cursor()

    # Verificar si la tabla de usuarios tiene datos
    cursor.execute("SELECT COUNT(*) FROM usuarios")
    result = cursor.fetchone()
    if result[0] == 0:  # Si no hay usuarios, insertar datos
        insert_user = """
        INSERT INTO usuarios (nombre, correo, contrasena) 
        VALUES (%s, %s, %s)
        """
        cursor.execute(insert_user, ('admin', 'admin@pawsitive.com', 'admin123'))
    
    # Insertar mascotas predeterminadas si no existen
    cursor.execute("SELECT COUNT(*) FROM mascotas")
    result = cursor.fetchone()
    if result[0] == 0:  # Si no hay mascotas, insertar datos
        insert_pet = """
        INSERT INTO mascotas (id_usuario, nombre, raza, fecha_nacimiento) 
        VALUES (%s, %s, %s, %s)
        """
        cursor.execute(insert_pet, (1, 'Fido', 'Perro', '2022-01-01'))

    # Insertar eventos predeterminados si no existen
    cursor.execute("SELECT COUNT(*) FROM eventos")
    result = cursor.fetchone()
    if result[0] == 0:  # Si no hay eventos, insertar datos
        insert_event = """
        INSERT INTO eventos (id_mascota, tipo_recordatorio, fecha, hora) 
        VALUES (%s, %s, %s, %s)
        """
        cursor.execute(insert_event, (1, 'Vacunación', '2025-02-01', '10:00:00'))

    connection.commit()  # Guardar cambios
    cursor.close()
    connection.close()

@app.on_event("startup")
def startup():
    init_db()  # Crear tablas si no existen
    insert_initial_data()
    


# Definir el modelo de datos que se espera recibir en el login
class LoginRequest(BaseModel):
    username: str
    password: str

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str

class MascotaRequest(BaseModel):
    nombre: str
    raza: str
    fecha_nacimiento: str
    
class EventoRequest(BaseModel):
    evento: str
    fechaHora:str
    mascota:str

def create_jwt_token(id_usuario: int):
    # Crear un token JWT
    expiration = datetime.utcnow() + timedelta(hours=1)  # El token expirará en 1 hora
    payload = {
        "sub": str(id_usuario),
        "exp": expiration
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    payload = jwt.decode(token, SECRET_KEY, algorithms="HS256")
    print(payload['sub'])
    

    return token

def get_current_user(authorization: str = Header(None)):
    if authorization is None:
        raise HTTPException(status_code=401, detail="Token no proporcionado")
    
    try:
        token = authorization.split(" ")[1]  # Recuperar el token del encabezado
        print(token)
        payload = jwt.decode(token, SECRET_KEY, algorithms="HS256")
        return  payload['sub'] # Esto es el id_usuario
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="El token ha expirado")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")

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
        token = create_jwt_token(user['id_usuario'])
        return {"success": True, "token":token}
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

@app.get("/api/mascotas")
async def obtener_mascotas(user_id: str = Depends(get_current_user)):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    query = "SELECT * FROM mascotas WHERE id_usuario = %s"
    cursor.execute(query, (user_id,))
    mascotas= cursor.fetchall()
    cursor.close()
    connection.close()
    if not mascotas:
        return {"message": "NO TIENES MASCOTAS REGISTRADAS"}
    return mascotas

@app.post("/api/regMascota")
async def registrar_mascota(request: MascotaRequest, user_id: str = Depends(get_current_user)):
    nombre = request.nombre
    raza = request.raza
    fecha_nacimiento = request.fecha_nacimiento

    try:

        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        query = "INSERT INTO mascotas (ID_Usuario, Nombre, Raza, Fecha_Nacimiento) VALUES (%s,%s,%s,%s)"
        cursor.execute(query, (user_id, nombre, raza,fecha_nacimiento))
        connection.commit()

        return {"success": True, "message": "Usuario registrado con éxito"}
    except Error as e:
        if connection:
            connection.rollback() 
        raise HTTPException(status_code=500, detail=f"Error al registrar la mascota: {str(e)}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error inesperado: {str(e)}")

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@app.get("/api/eventos")
async def obtener_eventos(user_id: str = Depends(get_current_user)):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    
    query = """
        SELECT e.Tipo_Recordatorio, e.Fecha, e.Hora, m.Nombre 
        FROM eventos e 
        JOIN mascotas m ON e.id_mascota = m.id_mascota 
        WHERE m.ID_Usuario = %s
    """
    cursor.execute(query, (user_id,))
    eventos = cursor.fetchall()
    
    cursor.close()
    connection.close()

    if not eventos:
        raise HTTPException(status_code=404, detail="No se encontraron eventos para el usuario")

    # Formatear eventos para enviar en la respuesta
    eventos_formateados = [
        {
            "tipo_recordatorio": evento["Tipo_Recordatorio"],
            "fecha": evento["Fecha"],
            "hora": evento["Hora"],
            "mascota": evento["Nombre"]
        }
        for evento in eventos
    ]
    
    return eventos_formateados

@app.post("/api/regEvento")
async def registrar_mascota(request: EventoRequest, user_id: str = Depends(get_current_user)):
    evento = request.evento
    fechaHora = request.fechaHora
    mascota = request.mascota

    fecha, hora = fechaHora.split("T")
    hora = hora + ":00"

    if mascota == "undefined" or mascota is None:
        raise HTTPException(status_code=400, detail="Mascota no seleccionada")

    try:

        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        query= "SELECT id_mascota from mascotas WHERE ID_Usuario=%s && Nombre=%s"
        cursor.execute(query, (user_id,mascota))
        id_mascota= cursor.fetchone()
        if not id_mascota:
            raise HTTPException(status_code=404, detail="No se encontró la mascota para este usuario")
        id_mascota = id_mascota["ID_Mascota"]

        query = "INSERT INTO eventos (id_mascota, Tipo_Recordatorio, Fecha, Hora) VALUES (%s,%s,%s,%s)"
        cursor.execute(query, (id_mascota, evento, fecha,hora))
        connection.commit()

        return {"success": True, "message": "Usuario registrado con éxito"}
    except Error as e:
        if connection:
            connection.rollback() 
        raise HTTPException(status_code=500, detail=f"Error al registrar la mascota: {str(e)}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error inesperado: {str(e)}")

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)
