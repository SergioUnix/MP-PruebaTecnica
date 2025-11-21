import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DetallesModal from './DetallesModal';
import AgregarIndicioModal from './AgregarIndicioModal';
const AgregarIndicioModalAny: any = AgregarIndicioModal;
import RealizarRevisionModal from './RealizarRevisionModal';
import Navbar from './components/Navbar'; 
import CrearExpediente from './CrearExpediente'; // Importa el nuevo componente


// Expedientes.ts
interface Revision {
  Revisiones_Id: number;
  Revisiones_EsAprobado: boolean;
  Revisiones_Justificacion: string;
  Revisiones_FechaRevision: string;
  Coordinador_Nombre: string;
  Coordinador_Email: string;
}

interface Indicio {
  Indicios_Id: number;
  Indicios_Descripcion: string;
  Indicios_Color: string;
  Indicios_Tamano: string;
  Indicios_Peso: number;
  Indicios_Ubicacion: string;
  TecnicoIndicios_Nombre: string;
  TecnicoIndicios_Email: string;
}

interface Expediente {
  Expediente_Id: number;
  Expediente_FechaRegistro: string;
  Expediente_DatosGenerales: string;
  Expediente_UltimaRevision: string | null;
  EstadoExpediente_Nombre: string;
  Tecnico_Nombre: string;
  Tecnico_Email: string;
  Revisiones: Revision[];
  Indicios: Indicio[];
}

interface NuevoIndicio {
  Descripcion: string;
  Color: string;
  Tamano: string;
  Peso: number;
  Ubicacion: string;
}

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  tipoUsuario: number;
}


const Expedientes: React.FC = () => {
  const navigate = useNavigate();
  const [expedientes, setExpedientes] = useState<Expediente[]>([]);
  const [selectedExpediente, setSelectedExpediente] = useState<Expediente | null>(null);
  const [modalType, setModalType] = useState<'detalles' | 'revision' | 'indicio' | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpedientes = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }

      const response = await fetch('http://localhost:3000/api/expedientes/completos', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error al obtener los expedientes: ${response.statusText}`);
      }

      const data = await response.json();
      setExpedientes(data.expedientes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido al obtener expedientes');
      console.error('Error al obtener expedientes:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpedientes();
  }, [fetchExpedientes]);

  const formatFecha = (isoDate: string | null): string => {
    if (!isoDate) return 'N/A';
    try {
      const date = new Date(isoDate);
      return date.toLocaleDateString('es-GT', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return 'Fecha inválida';
    }
  };



  const handleVerDetalles = (expediente: Expediente) => {
    setSelectedExpediente(expediente);
    setModalType('detalles');
  };

  const handleAgregarIndicio = (expediente: Expediente) => {
    setSelectedExpediente(expediente);
    setModalType('indicio');
  };

  const handleRealizarRevision = (expediente: Expediente) => {
    setSelectedExpediente(expediente);
    setModalType('revision');
  };

  const handleCloseModal = () => {
    setSelectedExpediente(null);
    setModalType(null);
  };

  const getEstadoColor = (estado: string): string => {
    const estadoNormalizado = estado?.toLowerCase().trim();
    switch (estadoNormalizado) {
      case 'aprobado':
        return 'success';
      case 'rechazado':
        return 'danger';
      case 'pendiente de revisión':
      case 'pendiente':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const isPendienteRevision = (estado: string): boolean => {
    const estadoNormalizado = estado?.toLowerCase().trim();
    return estadoNormalizado === 'pendiente de revision' || estadoNormalizado === 'pendiente';
  };

  const handleSubmitIndicio = async (indicio: NuevoIndicio) => {
    if (!selectedExpediente) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }
      
      const usuarioString = localStorage.getItem('usuario');
      if (!usuarioString) {
        throw new Error('No se encontró información del usuario');
      }
      const usuario: Usuario = JSON.parse(usuarioString);
      
      const response = await fetch('http://localhost:3000/api/expedientes/indicios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ExpedienteId: selectedExpediente.Expediente_Id,
          TecnicoId: usuario.id, // Aquí debes obtener el ID del técnico logueado
          ...indicio
        }),
      });

      if (!response.ok) {
        throw new Error(`Error al agregar el indicio: ${response.statusText}`);
      }

      await fetchExpedientes();
      handleCloseModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido al agregar indicio');
      console.error('Error al agregar indicio:', err);
    }
  };

  const handleSubmitRevision = async (aprobado: boolean, justificacion: string) => {
    if (!selectedExpediente) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }

      const usuarioString = localStorage.getItem('usuario');
      if (!usuarioString) {
        throw new Error('No se encontró información del usuario');
      }
      const usuario: Usuario = JSON.parse(usuarioString);

      const response = await fetch('http://localhost:3000/api/expedientes/revision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ExpedienteId: selectedExpediente.Expediente_Id,
          CoordinadorId: usuario.id, // Aquí debes obtener el ID del coordinador logueado
          EsAprobado: aprobado,
          Justificacion: justificacion
        }),
      });

      if (!response.ok) {
        throw new Error(`Error al realizar la revisión: ${response.statusText}`);
      }

      await fetchExpedientes();
      handleCloseModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido al realizar revisión');
      console.error('Error al realizar revisión:', err);
    }
  };

 // ... (todos tus estados existentes)
  const [showCrearExpediente, setShowCrearExpediente] = useState(false);

  // ... (todas tus funciones existentes)

  const handleCrearExpediente = () => {
    setShowCrearExpediente(true);
  };

  const handleExpedienteCreado = () => {
    fetchExpedientes(); // Refresca la lista de expedientes
    setShowCrearExpediente(false);
  };

  

  return (
    <>
    <Navbar />
       <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>📋 Listado de Expedientes</h2>
          <button className="btn btn-success btn-lg" onClick={handleCrearExpediente}>
            <i className="bi bi-plus-lg me-2"></i>
            Crear Nuevo Expediente
          </button>
        </div>


        {isLoading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-2">Cargando expedientes...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger" role="alert">
            {error}
            <button className="btn btn-sm btn-primary ms-3" onClick={fetchExpedientes}>
              Reintentar
            </button>
          </div>
        ) : expedientes.length === 0 ? (
          <div className="alert alert-info text-center mt-5" role="alert">
            No hay expedientes registrados. ¡Crea uno para empezar!
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th scope="col"># ID</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Técnico</th>
                  <th scope="col">Fecha Registro</th>
                  <th scope="col">Última Revisión</th>
                  <th scope="col">Descripción General</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {expedientes.map((exp) => (
                  <tr key={exp.Expediente_Id}>
                    <th scope="row">{exp.Expediente_Id}</th>
                    <td>
                      <span className={`badge bg-${getEstadoColor(exp.EstadoExpediente_Nombre)} text-uppercase`}>
                        {exp.EstadoExpediente_Nombre}
                      </span>
                    </td>
                    <td>{exp.Tecnico_Nombre}</td>
                    <td>{formatFecha(exp.Expediente_FechaRegistro)}</td>
                    <td>{formatFecha(exp.Expediente_UltimaRevision)}</td>
                    <td>
                      <div style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {exp.Expediente_DatosGenerales}
                      </div>
                    </td>
                    <td>
                    <div className="d-flex gap-2">
                        <button
                        className="btn btn-info btn-sm"
                        style={{ minWidth: '100px' }}
                        onClick={() => handleVerDetalles(exp)}
                        >
                        Detalles
                        </button>
                        <button
                        className="btn btn-primary btn-sm"
                        style={{ minWidth: '120px' }}
                        onClick={() => handleAgregarIndicio(exp)}
                        >
                        Agregar Indicio
                        </button>
                        {isPendienteRevision(exp.EstadoExpediente_Nombre) && (
                        <button
                            className="btn btn-warning btn-sm text-white"
                            style={{ minWidth: '130px' }}
                            onClick={() => handleRealizarRevision(exp)}
                        >
                            Realizar Revisión
                        </button>
                        )}
                    </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modales */}
      {modalType === 'detalles' && selectedExpediente && (
        <DetallesModal
          expediente={selectedExpediente}
          onClose={handleCloseModal}
          formatFecha={formatFecha}
        />
      )}
      {modalType === 'indicio' && selectedExpediente && (
        <AgregarIndicioModalAny
          expediente={selectedExpediente}
          onClose={handleCloseModal}
          onSubmit={handleSubmitIndicio}
        />
      )}
      

      {modalType === 'revision' && selectedExpediente && (
        <RealizarRevisionModal
          expediente={selectedExpediente}
          onClose={handleCloseModal}
          onSubmit={handleSubmitRevision}
          formatFecha={formatFecha}
        />
      )}

        {/* Modal para crear expediente */}
      {showCrearExpediente && (
        <CrearExpediente
          onClose={() => setShowCrearExpediente(false)}
          onExpedienteCreado={handleExpedienteCreado}
        />
      )}
    </>
  );
};

export default Expedientes;
// Exporta todas las interfaces al final del archivo
export type { Revision, Indicio, Expediente, NuevoIndicio };
