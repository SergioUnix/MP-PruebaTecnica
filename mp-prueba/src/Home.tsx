// src/Home.tsx
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import './App.css';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface Estadisticas {
  ExpedientesAprobados: number;
  ExpedientesPendientes: number;
  ExpedientesRechazados: number;
  UsuariosTotales: number;
}

const Home: React.FC = () => {
  const [estadisticas, setEstadisticas] = useState<Estadisticas>({
    ExpedientesAprobados: 0,
    ExpedientesPendientes: 0,
    ExpedientesRechazados: 0,
    UsuariosTotales: 0
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró token de autenticación');
        }

        const response = await fetch(`${backendUrl}/api/expedientes/estadisticas`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error al obtener estadísticas: ${response.statusText}`);
        }

        const data = await response.json();
        setEstadisticas(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido al obtener estadísticas');
        console.error('Error al obtener estadísticas:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEstadisticas();
  }, []);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container mt-4">
          <div className="p-5 mb-4 bg-light rounded-3">
            <div className="container-fluid py-5">
              <h1 className="display-5 fw-bold">¡Bienvenido a tu Dashboard!</h1>
              <p className="col-md-8 fs-4">
                Cargando estadísticas...
              </p>
            </div>
          </div>
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container mt-4">
          <div className="p-5 mb-4 bg-light rounded-3">
            <div className="container-fluid py-5">
              <h1 className="display-5 fw-bold">¡Bienvenido a tu Dashboard!</h1>
              <p className="col-md-8 fs-4">
                Aquí puedes ver un resumen rápido de la actividad del sistema.
                Usa la barra de navegación para acceder a las diferentes secciones.
              </p>
            </div>
          </div>
          <div className="alert alert-danger" role="alert">
            {error}
            <button className="btn btn-sm btn-primary ms-3" onClick={() => window.location.reload()}>
              Reintentar
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        {/* Jumbotron/Alerta de Bienvenida con Bootstrap */}
        <div className="p-5 mb-4 bg-light rounded-3">
          <div className="container-fluid py-5">
            <h1 className="display-5 fw-bold">Institucional</h1>
            <p className="col-md-8 fs-4 mx-auto">
              El Ministerio Público, previo a las reformas constitucionales que regularon su funcionamiento, se encontraba integrado a la Procuraduría General de la Nación, conforme el Decreto 512 del Congreso de la República.
            </p>
          </div>
        </div>


        {/* Resumen Rápido (Cards) */}
        <h2 className="mb-3">Métricas Clave</h2>
        <div className="row">
          {/* Card 1 - Expedientes Aprobados */}
          <div className="col-md-3 mb-3">
            <div className="card text-white bg-success">
              <div className="card-body">
                <h5 className="card-title">Expedientes Aprobados</h5>
                <p className="card-text fs-3">{estadisticas.ExpedientesAprobados}</p>
                <a href="/Expedientes" className="text-white">Ver Expedientes &rarr;</a>
              </div>
            </div>
          </div>

          {/* Card 2 - Expedientes Rechazados */}
          <div className="col-md-3 mb-3">
            <div className="card text-white bg-danger">
              <div className="card-body">
                <h5 className="card-title">Expedientes Rechazados</h5>
                <p className="card-text fs-3">{estadisticas.ExpedientesRechazados}</p>
                <a href="/Expedientes" className="text-white">Ver Expedientes &rarr;</a>
              </div>
            </div>
          </div>

          {/* Card 3 - Expedientes Pendientes */}
          <div className="col-md-3 mb-3">
            <div className="card text-dark bg-warning">
              <div className="card-body">
                <h5 className="card-title">Expedientes Pendientes</h5>
                <p className="card-text fs-3">{estadisticas.ExpedientesPendientes}</p>
                <a href="/Expedientes" className="text-dark">Ver Expedientes &rarr;</a>
              </div>
            </div>
          </div>

          {/* Card 4 - Usuarios Totales */}
          <div className="col-md-3 mb-3">
            <div className="card text-white bg-primary">
              <div className="card-body">
                <h5 className="card-title">Usuarios en el Sistema</h5>
                <p className="card-text fs-3">{estadisticas.UsuariosTotales}</p>
                <a href="/usuarios" className="text-white">Gestionar Usuarios &rarr;</a>
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
