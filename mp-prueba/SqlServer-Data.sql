sqlcmd -S localhost -U sa -P "P@ssw0rd1234" -d MPDatos -Q "

-- Insertar los Tipos de Usuario
INSERT INTO Catalogos.TC_TipoUsuario (TipoUsuario_Rol) VALUES
('Tecnico Registrador'),
('Coordinador Revisor'),
('Administrador');
GO
-- Insertar los Estados de Expediente
INSERT INTO Catalogos.TC_EstadoExpediente (EstadoExpediente_Nombre) VALUES
('Pendiente de Revision'),
('Aprobado'),
('Rechazado');

GO
INSERT INTO DICRI.TS_Usuario (TipoUsuarioId_Usuario, Usuario_Nombre, Usuario_Email, Usuario_PasswordHash) VALUES
-- Técnicos (Rol ID: 1)
(1, 'Ricardo Lopez', 'rlopez@dicri.gob.gt', 'hash_tec_001'),
(1, 'Maria Soto', 'msoto@dicri.gob.gt', 'hash_tec_002'),
(1, 'Carlos Perez', 'cperez@dicri.gob.gt', 'hash_tec_003'),
-- Coordinadores (Rol ID: 2)
(2, 'Ana Ramirez', 'aramirez@dicri.gob.gt', 'hash_coord_001'),
(2, 'Javier Torres', 'jtorres@dicri.gob.gt', 'hash_coord_002');
GO

INSERT INTO DICRI.TT_Expediente (
    EstadoExpedienteId_Expediente, 
    TecnicoId_Expediente, 
    Expediente_DatosGenerales, 
    Expediente_UltimaRevision
) 
VALUES
-- Expediente 1: Aprobado (ID 2), registrado por Ricardo (ID 1)
(2, 1, 'Caso de hurto en Zona 10. Se recuperó arma blanca y teléfono móvil.', CONVERT(DATETIME, '2025-10-20 14:30:00', 120)),

-- Expediente 2: Rechazado (ID 3), registrado por Maria (ID 2)
(3, 2, 'Incendio provocado en edificio comercial. La evidencia fotográfica es deficiente.', CONVERT(DATETIME, '2025-11-05 10:00:00', 120)),

-- Expediente 3: Pendiente (ID 1), registrado por Carlos (ID 3)
(1, 3, 'Análisis de documentos falsificados de alto perfil. Se requiere validación de 3 indicios.', NULL),

-- Expediente 4: Aprobado (ID 2), registrado por Ricardo (ID 1)
(2, 1, 'Caso de extorsión. Se recolectaron grabaciones de voz y 5 cartas. Todo completo.', CONVERT(DATETIME, '2025-11-15 09:15:00', 120)),

-- Expediente 5: Pendiente (ID 1), registrado por Maria (ID 2)
(1, 2, 'Homicidio. Muestra biológica en proceso de análisis de ADN. Se espera informe de laboratorio.', NULL);
GO


INSERT INTO DICRI.TT_Revisiones (
    ExpedienteId_Revisiones, 
    CoordinadorId_Revisiones, 
    Revisiones_EsAprobado, 
    Revisiones_Justificacion, 
    Revisiones_FechaRevision
) 
VALUES
-- Revisión Expediente 1 (Aprobado)
(1, 4, 1, 'Toda la cadena de custodia está completa y sellada.', CONVERT(DATETIME, '2025-10-20 14:30:00', 120)),

-- Revisión Expediente 2 (Rechazado)
(2, 5, 0, 'Rechazado: Faltó indicar la ubicación exacta de 3 indicios clave en el inventario.', CONVERT(DATETIME, '2025-11-05 10:00:00', 120)),

-- Revisión Expediente 4 (Aprobado)
(4, 4, 1, 'Los indicios cumplen con los parámetros de registro. Caso listo para archivo.', CONVERT(DATETIME, '2025-11-15 09:15:00', 120));
GO

INSERT INTO DICRI.TT_Indicios (ExpedienteId_Indicios, TecnicoId_Indicios, Indicios_Descripcion, Indicios_Color, Indicios_Tamano, Indicios_Peso, Indicios_Ubicacion) VALUES
-- Expediente 1
(1, 1, 'Arma blanca (Cuchillo). Longitud total de 20cm.', 'Plateado', '20 cm', 0.25, 'Almacén 1 / Caja F-10'),
(1, 1, 'Teléfono móvil, modelo antiguo.', 'Negro', '6 x 12 cm', 0.15, 'Almacén 1 / Caja F-10'),
-- Expediente 2
(2, 2, 'Muestra de tela carbonizada, 10x10 cm.', 'Negro', '10 x 10 cm', 0.05, 'Laboratorio 3 / Bandeja A-2'),
(2, 2, 'Bidón de gasolina vacío, con residuos orgánicos.', 'Amarillo', '40 litros', 1.50, 'Laboratorio 3 / Bandeja A-2'),
-- Expediente 3
(3, 3, 'Pasaporte falso, con el nombre de Juan Pérez.', 'Azul', 'Estándar', 0.08, 'Caja de Seguridad D-4'),
-- Expediente 4
(4, 1, 'Grabación de voz en USB. Contenido: 3 archivos de audio.', 'Blanco', '2 cm', 0.01, 'Oficina DICRI / Archivo 12B'),
(4, 1, 'Carta de extorsión, escrita a mano.', 'Blanco', 'Carta', 0.01, 'Oficina DICRI / Archivo 12B'),
(4, 1, 'Carta de extorsión, impresa.', 'Blanco', 'Carta', 0.01, 'Oficina DICRI / Archivo 12B'),
-- Expediente 5
(5, 2, 'Guante de látex con mancha roja (presunta sangre).', 'Blanco', 'Unitalla', 0.01, 'Laboratorio 1 / Congelador C-5');
GO

"