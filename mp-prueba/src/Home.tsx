// src/Home.tsx

import React from 'react';
// Importa el componente Navbar desde tu carpeta de componentes
import Navbar from './components/Navbar'; 
// Asumo que tienes un archivo CSS para estilos generales
import './App.css'; 

const Home: React.FC = () => {
  return (
    <>
      <Navbar /> {/* Incluye la barra de navegación */}
      <div className="container mt-4">
        {/* Jumbotron/Alerta de Bienvenida con Bootstrap */}
        <div className="p-5 mb-4 bg-light rounded-3">
          <div className="container-fluid py-5">
            <h1 className="display-5 fw-bold">¡Bienvenido a tu Dashboard!</h1>
            <p className="col-md-8 fs-4">
              Aquí puedes ver un resumen rápido de la actividad del sistema. 
              Usa la barra de navegación para acceder a las diferentes secciones.
            </p>
          </div>
        </div>

        {/* Resumen Rápido (Cards) */}
        <h2 className="mb-3">Métricas Clave</h2>
        <div className="row">
          {/* Card 1 */}
          <div className="col-md-4 mb-3">
            <div className="card text-white bg-primary">
              <div className="card-body">
                <h5 className="card-title">Expedientes</h5>
                <p className="card-text fs-3">250</p>
                <a href="/Expedientes" className="text-white">Ver Inventario &rarr;</a>
              </div>
            </div>
          </div>
          
          {/* Card 2 */}
          <div className="col-md-4 mb-3">
            <div className="card text-white bg-success">
              <div className="card-body">
                <h5 className="card-title">Nuevos Usuarios</h5>
                <p className="card-text fs-3">12</p>
                <a href="/usuarios" className="text-white">Gestionar Usuarios &rarr;</a>
              </div>
            </div>
          </div>
          
          {/* Card 3 */}
          <div className="col-md-4 mb-3">
            <div className="card text-dark bg-warning">
              <div className="card-body">
                <h5 className="card-title">Reportes Pendientes</h5>
                <p className="card-text fs-3">5</p>
                <a href="/reportes" className="text-dark">Ver Reportes &rarr;</a>
              </div>
            </div>
          </div>
        </div>
        
        <hr className="my-4" />
        
        {/* Contenido Adicional */}
        <p className="text-center text-muted">Sistema en línea y operando.</p>
        
      </div>
    </>
  );
};

export default Home;