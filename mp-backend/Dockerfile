
FROM node:20-alpine

# 2. CONFIGURACIÓN DEL CONTENEDOR

# Establece el directorio de trabajo dentro del contenedor. 
# Aquí es donde se copiarán los archivos y se ejecutarán los comandos.
WORKDIR /usr/src/app

# 3. INSTALACIÓN DE DEPENDENCIAS

# Copia los archivos de definición del proyecto
# Esto permite que Docker use el cache de la capa si estos archivos no cambian.
COPY package*.json ./

# Instala todas las dependencias. 
# El flag --production omite las dependencias de desarrollo (como nodemon), 
# ya que solo son necesarias para el desarrollo local.
RUN npm install --production

# Copia el resto del código fuente del proyecto al directorio de trabajo
# ¡Importante!: Asegúrate de crear un archivo .dockerignore para excluir node_modules y .env
COPY . .

# El puerto 3000 es el que Express está configurado para escuchar (en server.js)
EXPOSE 3000

# Define el comando que se ejecuta cuando el contenedor se inicia. 
# Usamos 'node server.js' en lugar de 'npm run dev' porque nodemon es solo para desarrollo.
CMD [ "node", "server.js" ]