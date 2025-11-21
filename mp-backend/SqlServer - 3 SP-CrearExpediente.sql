GO
-- Script completo para recrear el Stored Procedure DICRI.SP_CrearExpediente
IF OBJECT_ID('DICRI.SP_CrearExpediente', 'P') IS NOT NULL
    DROP PROCEDURE DICRI.SP_CrearExpediente;
GO



--crear el procedimiento almacenado DICRI.SP_CrearExpediente
CREATE PROCEDURE DICRI.SP_CrearExpediente
    @EstadoExpedienteId_Expediente INT,
    @TecnicoId_Expediente INT,
    @Expediente_DatosGenerales NVARCHAR(MAX),
    @Expediente_Id INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        INSERT INTO DICRI.TT_Expediente (
            EstadoExpedienteId_Expediente,
            TecnicoId_Expediente,
            Expediente_DatosGenerales,
            Expediente_FechaRegistro,
            Usuario_Creacion
        )
        VALUES (
            @EstadoExpedienteId_Expediente,
            @TecnicoId_Expediente,
            @Expediente_DatosGenerales,
            GETDATE(),
            GETDATE()
        );

        SET @Expediente_Id = SCOPE_IDENTITY();

        COMMIT TRANSACTION;

        SELECT @Expediente_Id AS Expediente_Id;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
GO





-- -- Ejemplo de ejecución del Stored Procedure DICRI.SP_CrearExpediente
-- DECLARE @Expediente_Id INT;

-- EXEC DICRI.SP_CrearExpediente
--     @EstadoExpedienteId_Expediente = 1,  -- 1 para "Pendiente de revisión"
--     @TecnicoId_Expediente = 1,           -- ID del técnico que crea el expediente
--     @Expediente_DatosGenerales = 'Caso de robo en Zona 1. Se recuperó un teléfono móvil y una billetera con documentos.',
--     @Expediente_Id = @Expediente_Id OUTPUT;


