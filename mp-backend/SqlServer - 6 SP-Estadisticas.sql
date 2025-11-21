GO

-- Crear o recrear el Stored Procedure DICRI.SP_EstadisticasSistema
IF OBJECT_ID('DICRI.SP_EstadisticasSistema', 'P') IS NOT NULL
    DROP PROCEDURE DICRI.SP_EstadisticasSistema;
GO

CREATE PROCEDURE DICRI.SP_EstadisticasSistema
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- Contar expedientes aprobados (EstadoExpedienteId_Expediente = 2)
        DECLARE @ExpedientesAprobados INT;
        SELECT @ExpedientesAprobados = COUNT(*)
        FROM DICRI.TT_Expediente
        WHERE EstadoExpedienteId_Expediente = 2;

        -- Contar expedientes pendientes (EstadoExpedienteId_Expediente = 1)
        DECLARE @ExpedientesPendientes INT;
        SELECT @ExpedientesPendientes = COUNT(*)
        FROM DICRI.TT_Expediente
        WHERE EstadoExpedienteId_Expediente = 1;

        -- Contar expedientes rechazados (EstadoExpedienteId_Expediente = 3)
        DECLARE @ExpedientesRechazados INT;
        SELECT @ExpedientesRechazados = COUNT(*)
        FROM DICRI.TT_Expediente
        WHERE EstadoExpedienteId_Expediente = 3;

        -- Contar usuarios totales en el sistema
        DECLARE @UsuariosTotales INT;
        SELECT @UsuariosTotales = COUNT(*)
        FROM DICRI.TS_Usuario;

        -- Devolver los resultados como una tabla
        SELECT
            @ExpedientesAprobados AS ExpedientesAprobados,
            @ExpedientesPendientes AS ExpedientesPendientes,
            @ExpedientesRechazados AS ExpedientesRechazados,
            @UsuariosTotales AS UsuariosTotales;
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        -- Devolver información del error
        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
GO



-- --prueba
-- --EXEC DICRI.SP_EstadisticasSistema;
-- -- Ejecutar el Stored Procedure
-- EXEC DICRI.SP_EstadisticasSistema;
