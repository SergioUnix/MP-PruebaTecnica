import React from 'react';
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


interface DetallesModalProps {
  expediente: Expediente | null;
  onClose: () => void;
  formatFecha: (isoDate: string | null) => string;
}

const DetallesModal: React.FC<DetallesModalProps> = ({ expediente, onClose, formatFecha }) => {
  if (!expediente) return null;

  return (
    <div className="modal fade show d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Detalles del Expediente #{expediente.Expediente_Id}</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <div className="row mb-3">
              <div className="col-md-6">
                <p><strong>Estado:</strong> {expediente.EstadoExpediente_Nombre}</p>
                <p><strong>Técnico:</strong> {expediente.Tecnico_Nombre}</p>
                <p><strong>Fecha de Registro:</strong> {formatFecha(expediente.Expediente_FechaRegistro)}</p>
                <p><strong>Última Revisión:</strong> {formatFecha(expediente.Expediente_UltimaRevision)}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Descripción General:</strong></p>
                <p>{expediente.Expediente_DatosGenerales}</p>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-12">
                <h5>Revisiones</h5>
                {expediente.Revisiones && expediente.Revisiones.length > 0 ? (
                  <ul className="list-group mb-3">
                    {expediente.Revisiones.map((revision) => (
                      <li key={revision.Revisiones_Id} className="list-group-item">
                        <p><strong>Coordinador:</strong> {revision.Coordinador_Nombre}</p>
                        <p><strong>Fecha:</strong> {formatFecha(revision.Revisiones_FechaRevision)}</p>
                        <p><strong>¿Aprobado?:</strong> {revision.Revisiones_EsAprobado ? 'Sí' : 'No'}</p>
                        <p><strong>Justificación:</strong> {revision.Revisiones_Justificacion}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No hay revisiones registradas.</p>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <h5>Indicios</h5>
                {expediente.Indicios && expediente.Indicios.length > 0 ? (
                  <ul className="list-group">
                    {expediente.Indicios.map((indicio) => (
                      <li key={indicio.Indicios_Id} className="list-group-item">
                        <p><strong>Descripción:</strong> {indicio.Indicios_Descripcion}</p>
                        <p><strong>Color:</strong> {indicio.Indicios_Color}</p>
                        <p><strong>Tamaño:</strong> {indicio.Indicios_Tamano}</p>
                        <p><strong>Peso:</strong> {indicio.Indicios_Peso} kg</p>
                        <p><strong>Ubicación:</strong> {indicio.Indicios_Ubicacion}</p>
                        <p><strong>Técnico:</strong> {indicio.TecnicoIndicios_Nombre}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No hay indicios registrados.</p>
                )}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetallesModal;
