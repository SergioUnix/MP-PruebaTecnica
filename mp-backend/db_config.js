// db_config.js

const config = {
    // Leer variables de entorno
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD, 
    server: process.env.DB_SERVER, 
    database: process.env.DB_DATABASE, 
    port: parseInt(process.env.DB_PORT, 10) || 1433,
    
    options: {
        enableArithAbort: true,
        trustServerCertificate: true, 
    },
};

module.exports = config;