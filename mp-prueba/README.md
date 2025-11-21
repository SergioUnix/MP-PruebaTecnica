npm run dev -- Inicia el servidor de desarrollo.
npm run build -- Genera los archivos optimizados para producción en la carpeta dist/.
npm run preview -- Previsualiza la versión de producción localmente después de construirla.

--Generar imagen de docker
docker build -t mp-imagen-doc .


--verificar las imagenes creadas
docker images

--ejecutar la imagen creada
docker run -d -p 80:80 --name mi-contenedor-node --network app_network mp-imagen-doc




--basicos
docker ps
docker stop mp-imagen-doc

