# Instrucciones para el Backend y Docker

## Ejecutar el Servidor
```bash
node server.js
```

---

## Docker: Construcción y Ejecución

### Generar Imagen de Docker
```bash
docker build -t mp-backend .
```

### Verificar Imágenes Creadas
```bash
docker images
```

### Ejecutar la Imagen Creada
```bash
docker run -d -p 3000:3000 --name mi-contenedor-backend mp-backend
```

### Comandos Básicos de Docker
```bash
docker ps
docker stop mp-backend
```

### Docker Compose
```bash
docker compose down -v
docker compose up -d
```

---

## Instrucciones para el Contenedor de SQL Server

### Verificar si el Proceso de SQL Server Está Corriendo
Dentro del contenedor, ejecuta:
```bash
ps aux | grep sqlservr
```

### Acceder al Contenedor de SQL Server como Root
```bash
docker exec -u root -it sql_server_mp bash
```

### Instalar `sqlcmd` Dentro del Contenedor
Ejecuta los siguientes comandos una vez dentro del contenedor como root:
```bash
apt-get update
apt-get install -y curl apt-transport-https
curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add -
echo "deb [arch=amd64] https://packages.microsoft.com/debian/10/prod bullseye main" > /etc/apt/sources.list.d/mssql-release.list
apt-get update
ACCEPT_EULA=Y apt-get install -y mssql-tools
```

### Agregar `sqlcmd` al PATH
```bash
echo 'export PATH="\$PATH:/opt/mssql-tools/bin"' >> /etc/bash.bashrc
source /etc/bash.bashrc
```

### Verificar Instalación de `sqlcmd`
```bash
ls -la /opt/mssql-tools/bin/sqlcmd
```

---

## Ejemplos de Comandos SQL en el Contenedor

### Probar una Instrucción SQL
```bash
sqlcmd -S localhost -U sa -P "P@ssw0rd1234" -Q "SELECT 1"
```

### Crear una Base de Datos
```bash
sqlcmd -S localhost -U sa -P "P@ssw0rd1234" -Q "CREATE DATABASE MPDatos;"
```

### Crear Esquemas y Consultar Tablas
```bash
sqlcmd -S localhost -U sa -P "P@ssw0rd1234" -d MPDatos -Q "CREATE SCHEMA DICRI;"
sqlcmd -S localhost -U sa -P "P@ssw0rd1234" -d MPDatos -Q "SELECT * FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'DICRI';"
sqlcmd -S localhost -U sa -P "P@ssw0rd1234" -d MPDatos -Q "CREATE SCHEMA Catalogos;"
sqlcmd -S localhost -U sa -P "P@ssw0rd1234" -d MPDatos -Q "SELECT * FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'Catalogos';"
sqlcmd -S localhost -U sa -P "P@ssw0rd1234" -d MPDatos -Q "SELECT * FROM DICRI.TT_Expediente;"
```
