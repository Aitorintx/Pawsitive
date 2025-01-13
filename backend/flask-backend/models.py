from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

# Modelo para el usuario
class Usuario(Base):
    __tablename__ = 'usuarios'
    
    id_usuario = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(100), nullable=False)
    correo = Column(String(100), nullable=False, unique=True)
    contrasena = Column(String(255), nullable=False)
    
    # Relación con la tabla Mascotas
    mascotas = relationship('Mascota', back_populates='usuario')

# Modelo para las mascotas
class Mascota(Base):
    __tablename__ = 'mascotas'
    
    id_mascota = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(100), nullable=False)
    raza = Column(String(50), nullable=False)
    fecha_nacimiento = Column(DateTime, nullable=False)
    
    # Relación con la tabla de usuarios
    id_usuario = Column(Integer, ForeignKey('usuarios.id_usuario'), nullable=False)
    usuario = relationship('Usuario', back_populates='mascotas')

# Modelo para los eventos
class Evento(Base):
    __tablename__ = 'eventos'
    
    id_evento = Column(Integer, primary_key=True, autoincrement=True)
    tipo_recordatorio = Column(String(100), nullable=False)
    fecha = Column(DateTime, nullable=False)
    hora = Column(String(5), nullable=False)
    
    id_mascota = Column(Integer, ForeignKey('mascotas.id_mascota'), nullable=False)
    mascota = relationship('Mascota', back_populates='eventos')

# Relación entre Mascotas y Eventos
Mascota.eventos = relationship('Evento', back_populates='mascota')