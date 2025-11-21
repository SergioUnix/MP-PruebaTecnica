# Instrucciones para el Frontend y Docker

## Comandos de npm

### Iniciar Servidor de Desarrollo
```bash
npm run dev
```

### Generar Archivos para Producción
```bash
npm run build
```

### Previsualizar Versión de Producción
```bash
npm run preview
```

---

## Docker: Construcción y Ejecución

### Generar Imagen de Docker
```bash
docker build -t mp-imagen-doc .
```

### Verificar Imágenes Creadas
```bash
docker images
```

### Crear la Nerwork sino ha sido creada antes de levantar el contenedor.
```bash
docker network create app_network

```


### Ejecutar la Imagen Creada
```bash

docker run -d -p 5173:80 --name mi-contenedor-frontend --network app_network mp-imagen-doc


```

### Comandos Básicos de Docker
```bash
docker ps
docker stop mp-imagen-doc
```
