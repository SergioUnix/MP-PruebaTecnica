CREATE DATABASE MPDatos;

-- Creación del Schema principal 
CREATE SCHEMA DICRI;
GO

-- Creación de un Schema para catálogos
CREATE SCHEMA Catalogos;
GO

-- Catálogo de Tipos de Usuario (Roles)
CREATE TABLE Catalogos.TC_TipoUsuario (
    TipoUsuario_Id INT IDENTITY(1,1) NOT NULL, 
    TipoUsuario_Rol VARCHAR(50) NOT NULL, 
    TipoUsuario_Estatus BIT NOT NULL DEFAULT 1, -- Campo con estatus por ser Catálogo
    Usuario_Creacion DATETIME NOT NULL DEFAULT GETDATE(),
    Usuario_Modificacion DATETIME NULL,
    CONSTRAINT PK_TipoUsuario PRIMARY KEY (TipoUsuario_Id),
    CONSTRAINT Uq_TipoUsuario_Rol UNIQUE (TipoUsuario_Rol)
);
GO

-- Catálogo de Estados del Expediente
CREATE TABLE Catalogos.TC_EstadoExpediente (
    EstadoExpediente_Id INT IDENTITY(1,1) NOT NULL,
    EstadoExpediente_Nombre VARCHAR(50) NOT NULL,
    CONSTRAINT PK_EstadoExpediente PRIMARY KEY (EstadoExpediente_Id),
    CONSTRAINT Uq_EstadoExpediente_Nombre UNIQUE (EstadoExpediente_Nombre)
);
GO

--Tabla de Usuarios (Sistema)
CREATE TABLE DICRI.TS_Usuario (
    Usuario_Id INT IDENTITY(1,1) NOT NULL,
    TipoUsuarioId_Usuario INT NOT NULL, 
    Usuario_Nombre VARCHAR(100) NOT NULL,
    Usuario_Email VARCHAR(100) NOT NULL, -- unico
    Usuario_PasswordHash VARCHAR(255) NOT NULL,
    Usuario_Creacion DATETIME NOT NULL DEFAULT GETDATE(),
    Usuario_Modificacion DATETIME NULL,
    CONSTRAINT PK_Usuario PRIMARY KEY (Usuario_Id),
    CONSTRAINT Uq_Usuario_Email UNIQUE (Usuario_Email),
    CONSTRAINT FK_Usuario_TipoUsuario FOREIGN KEY (TipoUsuarioId_Usuario)REFERENCES Catalogos.TC_TipoUsuario (TipoUsuario_Id)
);
GO


CREATE TABLE DICRI.TT_Expediente (
    Expediente_Id INT IDENTITY(1,1) NOT NULL,
    EstadoExpedienteId_Expediente INT NOT NULL, 
    TecnicoId_Expediente INT NOT NULL, -- quien registra
    Expediente_FechaRegistro DATETIME NOT NULL DEFAULT GETDATE(),
    Expediente_DatosGenerales TEXT,
    Expediente_UltimaRevision DATETIME NULL,
    Usuario_Creacion DATETIME NOT NULL DEFAULT GETDATE(),
    Usuario_Modificacion DATETIME NULL,
    CONSTRAINT PK_Expediente PRIMARY KEY (Expediente_Id),
    CONSTRAINT FK_Expediente_EstadoExpediente FOREIGN KEY (EstadoExpedienteId_Expediente) REFERENCES Catalogos.TC_EstadoExpediente (EstadoExpediente_Id),
    CONSTRAINT FK_Expediente_Usuario FOREIGN KEY (TecnicoId_Expediente) REFERENCES DICRI.TS_Usuario (Usuario_Id)
);
GO

-- Revisiones del Expediente
CREATE TABLE DICRI.TT_Revisiones (
    Revisiones_Id INT IDENTITY(1,1) NOT NULL,
    ExpedienteId_Revisiones INT NOT NULL,
    CoordinadorId_Revisiones INT NOT NULL, 
    Revisiones_EsAprobado BIT NOT NULL,
    Revisiones_Justificacion TEXT NOT NULL,
    Revisiones_FechaRevision DATETIME NOT NULL DEFAULT GETDATE(),
    Usuario_Creacion DATETIME NOT NULL DEFAULT GETDATE(),
    Usuario_Modificacion DATETIME NULL,
    CONSTRAINT PK_Revisiones PRIMARY KEY (Revisiones_Id),
    CONSTRAINT FK_Revisiones_Expediente FOREIGN KEY (ExpedienteId_Revisiones) REFERENCES DICRI.TT_Expediente (Expediente_Id),
    CONSTRAINT FK_Revisiones_Coordinador FOREIGN KEY (CoordinadorId_Revisiones) REFERENCES DICRI.TS_Usuario (Usuario_Id)
);
GO

-- Indicios
CREATE TABLE DICRI.TT_Indicios (
    Indicios_Id INT IDENTITY(1,1) NOT NULL,
    ExpedienteId_Indicios INT NOT NULL,
    TecnicoId_Indicios INT NOT NULL,
    Indicios_Descripcion TEXT NOT NULL,
    Indicios_Color VARCHAR(50),
    Indicios_Tamano VARCHAR(50),
    Indicios_Peso DECIMAL(10, 2),
    Indicios_Ubicacion VARCHAR(255),
    Usuario_Creacion DATETIME NOT NULL DEFAULT GETDATE(),
    Usuario_Modificacion DATETIME NULL,
    CONSTRAINT PK_Indicios PRIMARY KEY (Indicios_Id),
    CONSTRAINT FK_Indicios_Expediente FOREIGN KEY (ExpedienteId_Indicios) REFERENCES DICRI.TT_Expediente (Expediente_Id),
    CONSTRAINT FK_Indicios_Usuario FOREIGN KEY (TecnicoId_Indicios) REFERENCES DICRI.TS_Usuario (Usuario_Id)
);
GO





-- Otorgar permisos de ejecución para todos los procedimientos almacenados en la base de datos
GRANT EXECUTE TO rol_sa;
GO

-- Otorgar permisos de ejecución para todos los procedimientos almacenados en el esquema DICRI
DECLARE @sql NVARCHAR(MAX) = N'';
SELECT @sql = @sql + N'GRANT EXECUTE ON [' + ROUTINE_SCHEMA + '].[' + ROUTINE_NAME +'] TO sa;' + CHAR(13)
FROM INFORMATION_SCHEMA.ROUTINES
WHERE ROUTINE_TYPE = 'PROCEDURE';

GO
EXEC sp_executesql @sql;
GO





