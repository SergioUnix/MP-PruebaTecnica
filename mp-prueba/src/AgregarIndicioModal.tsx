import React, { useState } from 'react';

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

interface AgregarIndicioModalProps {
  expediente: Expediente | null;
  onClose: () => void;
  onSubmit: (indicio: NuevoIndicio) => void;
}

const AgregarIndicioModal: React.FC<AgregarIndicioModalProps> = ({ expediente, onClose, onSubmit }) => {
  const [nuevoIndicio, setNuevoIndicio] = useState<NuevoIndicio>({
    Descripcion: '',
    Color: '',
    Tamano: '',
    Peso: 0,
    Ubicacion: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleIndicioChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNuevoIndicio(prev => ({
      ...prev,
      [name]: name === 'Peso' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expediente) return;

    setIsLoading(true);
    setError(null);

    try {
      // Validar que la descripción no esté vacía
      if (!nuevoIndicio.Descripcion.trim()) {
        throw new Error('La descripción del indicio es obligatoria');
      }

      // Llamar a la función onSubmit que recibe por props
      onSubmit(nuevoIndicio);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido al agregar indicio');
      console.error('Error al agregar indicio:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!expediente) return null;

  return (
    <div className="modal fade show d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Agregar Indicio al Expediente #{expediente.Expediente_Id}</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <div className="row mb-3">
              <div className="col-12">
                <p><strong>Expediente:</strong> {expediente.Expediente_DatosGenerales}</p>
                <p><strong>Estado:</strong> {expediente.EstadoExpediente_Nombre}</p>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-12">
                <h5>Indicios Existentes</h5>
                {expediente.Indicios.length > 0 ? (
                  <ul className="list-group mb-3">
                    {expediente.Indicios.map((indicio) => (
                      <li key={indicio.Indicios_Id} className="list-group-item">
                        <p><strong>Descripción:</strong> {indicio.Indicios_Descripcion}</p>
                        <p><strong>Color:</strong> {indicio.Indicios_Color}</p>
                        <p><strong>Tamaño:</strong> {indicio.Indicios_Tamano}</p>
                        <p><strong>Peso:</strong> {indicio.Indicios_Peso} kg</p>
                        <p><strong>Ubicación:</strong> {indicio.Indicios_Ubicacion}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No hay indicios registrados.</p>
                )}
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="Descripcion" className="form-label">Descripción <span className="text-danger">*</span></label>
                    <textarea
                      className="form-control"
                      id="Descripcion"
                      name="Descripcion"
                      value={nuevoIndicio.Descripcion}
                      onChange={handleIndicioChange}
                      required
                      rows={3}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="Color" className="form-label">Color</label>
                    <input
                      type="text"
                      className="form-control"
                      id="Color"
                      name="Color"
                      value={nuevoIndicio.Color}
                      onChange={handleIndicioChange}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="Tamano" className="form-label">Tamaño</label>
                    <input
                      type="text"
                      className="form-control"
                      id="Tamano"
                      name="Tamano"
                      value={nuevoIndicio.Tamano}
                      onChange={handleIndicioChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="Peso" className="form-label">Peso (kg)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="form-control"
                      id="Peso"
                      name="Peso"
                      value={nuevoIndicio.Peso}
                      onChange={handleIndicioChange}
                    />
                  </div>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-12">
                  <div className="mb-3">
                    <label htmlFor="Ubicacion" className="form-label">Ubicación</label>
                    <input
                      type="text"
                      className="form-control"
                      id="Ubicacion"
                      name="Ubicacion"
                      value={nuevoIndicio.Ubicacion}
                      onChange={handleIndicioChange}
                    />
                  </div>
                </div>
              </div>
              {error && (
                <div className="alert alert-danger">{error}</div>
              )}
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={isLoading || !nuevoIndicio.Descripcion.trim()}>
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      Guardando...
                    </>
                  ) : 'Guardar Indicio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgregarIndicioModal;
