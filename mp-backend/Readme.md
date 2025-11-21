--Ejecutar Servidor
node server.js

--Generar imagen de docker
docker build -t mp-backend .


--verificar las imagenes creadas
docker images

--ejecutar la imagen creada
docker run -d -p 3000:3000 --name mi-contenedor-backend mp-backend



--basicos
docker ps
docker stop mp-backend



--docker compose

docker compose down -v

docker compose up -d






----Para el contenedor de sql server ----------------------------------------------------------------------------------------------------------
verificar si el proceso de sql server esta corriendo- dentro del contenedor.
ps aux | grep sqlservr


--para usuario root, e ingresar al contenedor de sql server colocar
docker exec -u root -it sql_server_mp bash


--Una vez dentro del contenedor como root, ejecuta los siguientes comandos para instalar sqlcmd:
apt-get update
apt-get install -y curl apt-transport-https
curl https://packages.microsoft.com/keys/microsoft.asc | apt-add-repository -
echo "deb [arch=amd64] https://packages.microsoft.com/debian/10/prod bullseye main" > /etc/apt/sources.list.d/mssql-release.list
apt-get update
ACCEPT_EULA=Y apt-get install -y mssql-tools


--Agregar sqlcmd al PATH
echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> /etc/bash.bashrc
source /etc/bash.bashrc

--se verifica que este instalado
ls -la /opt/mssql-tools/bin/sqlcmd


--probar ya una instruccion sql server
sqlcmd -S localhost -U sa -P "P@ssw0rd1234" -Q "SELECT 1"

sqlcmd -S localhost -U sa -P "P@ssw0rd1234" -Q "CREATE DATABASE MPDatos;"




sqlcmd -S localhost -U sa -P "P@ssw0rd1234" -d MPDatos -Q "CREATE SCHEMA DICRI;"
sqlcmd -S localhost -U sa -P "P@ssw0rd1234" -d MPDatos -Q "SELECT * FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'DICRI';"


sqlcmd -S localhost -U sa -P "P@ssw0rd1234" -d MPDatos -Q "CREATE SCHEMA Catalogos;"
sqlcmd -S localhost -U sa -P "P@ssw0rd1234" -d MPDatos -Q "SELECT * FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'Catalogos';"

sqlcmd -S localhost -U sa -P "P@ssw0rd1234" -d MPDatos -Q "SELECT * FROM DICRI.TT_Expediente;"


sqlcmd -S localhost -U sa -P "P@ssw0rd1234" -d MPDatos -Q "
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
GO"