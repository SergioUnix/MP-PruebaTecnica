import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  tipoUsuario: number;
}

interface CrearExpedienteProps {
  onClose: () => void;
  onExpedienteCreado: () => void;
}

const CrearExpediente: React.FC<CrearExpedienteProps> = ({ onClose, onExpedienteCreado }) => {
  const [datosGenerales, setDatosGenerales] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Obtener usuario del localStorage
      const usuarioString = localStorage.getItem('usuario');
      if (!usuarioString) {
        throw new Error('No se encontró información del usuario');
      }

      const usuario: Usuario = JSON.parse(usuarioString);
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }

      const response = await fetch('http://localhost:3000/api/expedientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          EstadoExpedienteId_Expediente: 1, // 1 = Pendiente de revisión
          TecnicoId_Expediente: usuario.id, // ID del usuario que crea el expediente
          Expediente_DatosGenerales: datosGenerales
        }),
      });

      if (!response.ok) {
        throw new Error(`Error al crear el expediente: ${response.statusText}`);
      }

      onExpedienteCreado();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido al crear el expediente');
      console.error('Error al crear expediente:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Crear Nuevo Expediente</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="datosGenerales" className="form-label">Datos Generales</label>
                <textarea
                  className="form-control"
                  id="datosGenerales"
                  rows={4}
                  value={datosGenerales}
                  onChange={(e) => setDatosGenerales(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="alert alert-danger">{error}</div>
              )}
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Creando...' : 'Crear Expediente'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearExpediente;
