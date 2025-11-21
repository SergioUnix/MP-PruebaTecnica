// server.js (VERSIÓN CORREGIDA)

const express = require('express');
const app = express();
const dotenv = require('dotenv'); 

const cors = require('cors'); // Importar el paquete cors

// Configurar CORS para permitir solicitudes desde http://localhost:5173
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// --- 1. CONFIGURACIÓN INICIAL Y CARGA DE ENTORNO ---

// PASO CRÍTICO 1: Cargar variables de entorno PRIMERO
dotenv.config(); 

// PASO CRÍTICO 2: Ahora sí, importar mssql y la configuración
// (Solo se ejecutan después de cargar el entorno)
const sql = require('mssql'); 
const dbConfig = require('./db_config'); 

// ... Importaciones que dependen de Express ...
const expedientesRoutes = require('./routes/expedientes'); 
const authRoutes = require('./routes/authRoutes');

// Definir el puerto de escucha. Usamos el puerto de entorno o 3000 por defecto.
const PORT = process.env.PORT || 3000; 

// --- 2. MIDDLEWARES ---

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));


// // Middleware para validar el token JWT en las rutas protegidas


// --- 3. INICIALIZACIÓN DEL POOL DE CONEXIONES ---

async function initializeDatabase() {
    try {
        await sql.connect(dbConfig);
        console.log('✅ Pool de SQL Server conectado exitosamente.');
    } catch (err) {
        console.error('❌ Error al conectar el Pool de SQL Server:', err.message);
    }
}

// --- 4. DEFINICIÓN DE RUTAS ---

app.get('/', (req, res) => {
    res.send('Servidor DICRI API está en línea. Usa /api/expedientes para acceder a los recursos.');
});

app.use('/api/expedientes', expedientesRoutes);

// Rutas de Autenticación (Login)
app.use('/api/', authRoutes); // <<-- PASO 2: Usar el router de autenticación



// --- 5. INICIAR SERVIDOR E INICIALIZAR DB ---

initializeDatabase();

app.listen(PORT, () => {
    console.log(`🚀 Servidor Express escuchando en http://localhost:${PORT}`);
    console.log('¡Listo para el desarrollo con Nodemon!');
});