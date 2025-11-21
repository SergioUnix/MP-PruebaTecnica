GO

-- Script completo para recrear el Stored Procedure DICRI.SP_ObtenerExpedientesCompletos
IF OBJECT_ID('DICRI.SP_ObtenerExpedientesCompletos', 'P') IS NOT NULL
    DROP PROCEDURE DICRI.SP_ObtenerExpedientesCompletos;
GO

--crear el procedimiento almacenado DICRI.SP_ObtenerExpedientesCompletos
CREATE PROCEDURE DICRI.SP_ObtenerExpedientesCompletos
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        -- Datos del Expediente
        E.Expediente_Id,
        E.Expediente_FechaRegistro,
        E.Expediente_DatosGenerales,
        E.Expediente_UltimaRevision,
        E.Usuario_Creacion,
        E.Usuario_Modificacion,

        -- Datos del Estado del Expediente
        EE.EstadoExpediente_Id AS EstadoExpediente_Id,
        EE.EstadoExpediente_Nombre AS EstadoExpediente_Nombre,

        -- Datos del Técnico que registró el expediente
        TU.Usuario_Id AS Tecnico_Id,
        TU.Usuario_Nombre AS Tecnico_Nombre,
        TU.Usuario_Email AS Tecnico_Email,

        -- Datos de las Revisiones (si existen)
        (
            SELECT
                R.Revisiones_Id,
                R.Revisiones_EsAprobado,
                R.Revisiones_Justificacion,
                R.Revisiones_FechaRevision,
                CU.Usuario_Nombre AS Coordinador_Nombre,
                CU.Usuario_Email AS Coordinador_Email
            FROM
                DICRI.TT_Revisiones R
            INNER JOIN
                DICRI.TS_Usuario CU ON R.CoordinadorId_Revisiones = CU.Usuario_Id
            WHERE
                R.ExpedienteId_Revisiones = E.Expediente_Id
            FOR JSON PATH
        ) AS Revisiones,

        -- Datos de los Indicios (si existen)
        (
            SELECT
                I.Indicios_Id,
                I.Indicios_Descripcion,
                I.Indicios_Color,
                I.Indicios_Tamano,
                I.Indicios_Peso,
                I.Indicios_Ubicacion,
                IU.Usuario_Nombre AS TecnicoIndicios_Nombre,
                IU.Usuario_Email AS TecnicoIndicios_Email
            FROM
                DICRI.TT_Indicios I
            INNER JOIN
                DICRI.TS_Usuario IU ON I.TecnicoId_Indicios = IU.Usuario_Id
            WHERE
                I.ExpedienteId_Indicios = E.Expediente_Id
            FOR JSON PATH
        ) AS Indicios

    FROM
        DICRI.TT_Expediente E
    INNER JOIN
        Catalogos.TC_EstadoExpediente EE ON E.EstadoExpedienteId_Expediente = EE.EstadoExpediente_Id
    INNER JOIN
        DICRI.TS_Usuario TU ON E.TecnicoId_Expediente = TU.Usuario_Id
    ORDER BY
        E.Expediente_FechaRegistro DESC;
END;
GO


-- ----PROBAR EL PROCEDIMIENTO   ---------------------------------------------------
-- EXEC DICRI.SP_ObtenerExpedientesCompletos;
-- GO



