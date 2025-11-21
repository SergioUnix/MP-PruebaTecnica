// routes/expedientes.js

const express = require('express');
const router = express.Router();
const sql = require('mssql');
// Ya no necesitamos dbConfig aquí porque el Pool se conecta en server.js
// const dbConfig = require('../db_config'); 


// ----------------------------------------------------
// RUTA GET /api/expedientes: Obtener todos los expedientes con JOIN
// ----------------------------------------------------
router.get('/', async (req, res) => {
    try {
        // Usamos una nueva Solicitud (Request) del Pool de Conexiones ya abierto
        const request = new sql.Request(); 
        
        // Consulta SQL con INNER JOIN para obtener nombres legibles
        const query = `
            SELECT
                E.Expediente_Id,
                E.Expediente_FechaRegistro,
                E.Expediente_DatosGenerales,
                E.Expediente_UltimaRevision,
                EE.EstadoExpediente_Nombre AS Estado,
                U.Usuario_Nombre AS Tecnico_Registra
            FROM 
                DICRI.TT_Expediente E
            INNER JOIN 
                Catalogos.TC_EstadoExpediente EE 
                ON E.EstadoExpedienteId_Expediente = EE.EstadoExpediente_Id
            INNER JOIN 
                DICRI.TS_Usuario U 
                ON E.TecnicoId_Expediente = U.Usuario_Id
            ORDER BY
                E.Expediente_FechaRegistro DESC; -- Opcional: Ordenar por fecha reciente
        `;

        const result = await request.query(query);
        
        res.status(200).json({
            count: result.recordset.length,
            expedientes: result.recordset
        });

    } catch (err) {
        // En un ambiente de Pool, un error aquí suele ser un problema de SQL o de permisos
        console.error("Error de DB al obtener expedientes:", err.message);
        res.status(500).json({ message: "Error interno del servidor al consultar expedientes.", details: err.message });
    }
    // NOTA: No se usa sql.close() porque el Pool permanece abierto en server.js
});

router.get('/completos', async (req, res) => {
    try {
        const request = new sql.Request();
        const result = await request.execute('DICRI.SP_ObtenerExpedientesCompletos');

        const expedientesProcesados = result.recordset.map(expediente => {
            // Verificar si Revisiones no es null o undefined antes de parsear
            if (expediente.Revisiones) {
                try {
                    expediente.Revisiones = JSON.parse(expediente.Revisiones);
                } catch (e) {
                    expediente.Revisiones = [];
                }
            } else {
                expediente.Revisiones = [];
            }

            // Verificar si Indicios no es null o undefined antes de parsear
            if (expediente.Indicios) {
                try {
                    expediente.Indicios = JSON.parse(expediente.Indicios);
                } catch (e) {
                    expediente.Indicios = [];
                }
            } else {
                expediente.Indicios = [];
            }

            return expediente;
        });

        res.status(200).json({
            count: expedientesProcesados.length,
            expedientes: expedientesProcesados
        });
    } catch (err) {
        console.error("Error al obtener expedientes completos:", err.message);
        res.status(500).json({
            message: "Error interno del servidor al consultar expedientes completos.",
            details: err.message
        });
    }
});



// --Crear un nuevo expediente
router.post('/', async (req, res) => {
  const { EstadoExpedienteId_Expediente, TecnicoId_Expediente, Expediente_DatosGenerales } = req.body;
console.log(req.body)
  // Validación básica
  if (!EstadoExpedienteId_Expediente || !TecnicoId_Expediente || !Expediente_DatosGenerales) {
    return res.status(400).json({ message: "Faltan campos obligatorios: EstadoExpedienteId, TecnicoId y DatosGenerales." });
  }

  try {
    const request = new sql.Request();
    request.input('EstadoExpedienteId_Expediente', sql.Int, EstadoExpedienteId_Expediente);
    request.input('TecnicoId_Expediente', sql.Int, TecnicoId_Expediente);
    request.input('Expediente_DatosGenerales', sql.NVarChar(sql.MAX), Expediente_DatosGenerales);
    request.output('Expediente_Id', sql.Int);

    const result = await request.execute('DICRI.SP_CrearExpediente');

    const expedienteId = result.output.Expediente_Id;

    res.status(201).json({
      message: "Expediente creado exitosamente",
      Expediente_Id: expedienteId
    });
  } catch (err) {
    console.error('Error al insertar expediente:', err.message);
    if (err.message.includes('FOREIGN KEY')) {
      return res.status(409).json({ message: "Error: El ID de Técnico o Estado no existe (Clave Foránea)." });
    }
    res.status(500).json({ message: "Error interno del servidor al crear expediente." });
  }
});


// En tu archivo de rutas de indicios.js
router.post('/indicios', async (req, res) => {
  const { ExpedienteId, TecnicoId, Descripcion, Color, Tamano, Peso, Ubicacion } = req.body;
console.log(req.body);
  // Validación básica
  if (!ExpedienteId || !TecnicoId || !Descripcion) {
    return res.status(400).json({
      success: false,
      message: "Faltan campos obligatorios: ExpedienteId, TecnicoId y Descripcion."
    });
  }

  try {
    const request = new sql.Request();
    request.input('ExpedienteId_Indicios', sql.Int, ExpedienteId);
    request.input('TecnicoId_Indicios', sql.Int, TecnicoId);
    request.input('Indicios_Descripcion', sql.NVarChar(sql.MAX), Descripcion);
    request.input('Indicios_Color', sql.NVarChar(50), Color || null);
    request.input('Indicios_Tamano', sql.NVarChar(50), Tamano || null);
    request.input('Indicios_Peso', sql.Decimal(10, 2), Peso || null);
    request.input('Indicios_Ubicacion', sql.NVarChar(255), Ubicacion || null);
    request.output('Indicios_Id', sql.Int);

    const result = await request.execute('DICRI.SP_CrearIndicio');

    const indicioId = result.output.Indicios_Id;

    res.status(201).json({
      success: true,
      message: "Indicio creado exitosamente",
      data: {
        Indicio_Id: indicioId
      }
    });
  } catch (err) {
    console.error('Error al insertar indicio:', err);

    let statusCode = 500;
    let message = "Error interno del servidor al crear indicio.";

    if (err.message.includes('FOREIGN KEY')) {
      statusCode = 409;
      message = "Error: El ID de Expediente o Técnico no existe (Clave Foránea).";
    } else if (err.message.includes('El expediente especificado no existe')) {
      statusCode = 404;
      message = err.message;
    } else if (err.message.includes('El técnico especificado no existe')) {
      statusCode = 404;
      message = err.message;
    }

    res.status(statusCode).json({
      success: false,
      message: message
    });
  }
});


// En tu archivo de rutas de revisiones.js
router.post('/revision', async (req, res) => {
  const { ExpedienteId, CoordinadorId, EsAprobado, Justificacion } = req.body;
  console.log(req.body); // Para depuración

  // Validación básica
  if (!ExpedienteId || !CoordinadorId || EsAprobado === undefined || !Justificacion) {
    return res.status(400).json({
      success: false,
      message: "Faltan campos obligatorios: ExpedienteId, CoordinadorId, EsAprobado y Justificacion."
    });
  }

  try {
    const request = new sql.Request();
    request.input('ExpedienteId', sql.Int, ExpedienteId);
    request.input('CoordinadorId', sql.Int, CoordinadorId);
    request.input('EsAprobado', sql.Bit, EsAprobado);
    request.input('Justificacion', sql.NVarChar(400), Justificacion);
    request.output('RevisionId', sql.Int);

    const result = await request.execute('DICRI.SP_CrearRevisionExpediente');
    const revisionId = result.output.RevisionId;

    res.status(201).json({
      success: true,
      message: "Revisión creada exitosamente",
      data: {
        RevisionId: revisionId,
        EsAprobado: EsAprobado
      }
    });
  } catch (err) {
    console.error('Error al crear revisión:', err);

    let statusCode = 500;
    let message = "Error interno del servidor al crear la revisión.";

    // Manejo de errores específicos
    if (err.message.includes('FOREIGN KEY')) {
      statusCode = 409;
      message = "Error: El ID de Expediente o Coordinador no existe (Clave Foránea).";
    } else if (err.message.includes('El expediente con ID')) {
      statusCode = 404;
      message = err.message;
    } else if (err.message.includes('El coordinador con ID')) {
      statusCode = 404;
      message = err.message;
    } else if (err.message.includes('La justificación es obligatoria')) {
      statusCode = 400;
      message = err.message;
    }

    // Devolver respuesta de error
    res.status(statusCode).json({
      success: false,
      message: message,
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// En tu archivo de rutas de estadísticas.js
router.get('/estadisticas', async (req, res) => {
  try {
    const request = new sql.Request();
    const result = await request.execute('DICRI.SP_EstadisticasSistema');

    // El resultado es un array de registros, tomamos el primero
    const estadisticas = result.recordset[0];

    res.status(200).json({
      success: true,
      message: "Estadísticas obtenidas exitosamente",
      data: {
        ExpedientesAprobados: estadisticas.ExpedientesAprobados,
        ExpedientesPendientes: estadisticas.ExpedientesPendientes,
        ExpedientesRechazados: estadisticas.ExpedientesRechazados,
        UsuariosTotales: estadisticas.UsuariosTotales
      }
    });
  } catch (err) {
    console.error('Error al obtener estadísticas:', err);

    res.status(500).json({
      success: false,
      message: "Error interno del servidor al obtener estadísticas.",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});


module.exports = router;