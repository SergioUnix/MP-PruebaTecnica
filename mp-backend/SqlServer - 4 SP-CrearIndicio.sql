GO
-- Crear o recrear el Stored Procedure DICRI.SP_CrearIndicio
IF OBJECT_ID('DICRI.SP_CrearIndicio', 'P') IS NOT NULL
    DROP PROCEDURE DICRI.SP_CrearIndicio;
GO

CREATE PROCEDURE DICRI.SP_CrearIndicio
    @ExpedienteId_Indicios INT,
    @TecnicoId_Indicios INT,
    @Indicios_Descripcion NVARCHAR(MAX),
    @Indicios_Color VARCHAR(50) = NULL,
    @Indicios_Tamano VARCHAR(50) = NULL,
    @Indicios_Peso DECIMAL(10, 2) = NULL,
    @Indicios_Ubicacion VARCHAR(255) = NULL,
    @Indicios_Id INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Insertar el indicio
        INSERT INTO DICRI.TT_Indicios (
            ExpedienteId_Indicios,
            TecnicoId_Indicios,
            Indicios_Descripcion,
            Indicios_Color,
            Indicios_Tamano,
            Indicios_Peso,
            Indicios_Ubicacion,
            Usuario_Creacion
        )
        VALUES (
            @ExpedienteId_Indicios,
            @TecnicoId_Indicios,
            @Indicios_Descripcion,
            @Indicios_Color,
            @Indicios_Tamano,
            @Indicios_Peso,
            @Indicios_Ubicacion,
            GETDATE()  -- Fecha actual para Usuario_Creacion
        );

        -- Obtener el ID del indicio recién creado
        SET @Indicios_Id = SCOPE_IDENTITY();

        COMMIT TRANSACTION;

        -- Devolver el ID del indicio creado
        SELECT @Indicios_Id AS Indicios_Id;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        -- Devolver información del error
        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
GO




-- PRINT '=== Prueba 1: Crear indicio con datos válidos ===';
-- DECLARE @Indicios_Id1 INT;
-- EXEC DICRI.SP_CrearIndicio
--     @ExpedienteId_Indicios = 1,
--     @TecnicoId_Indicios = 1,
--     @Indicios_Descripcion = 'Arma blanca (Cuchillo). Longitud total de 20cm.',
--     @Indicios_Color = 'Plateado',
--     @Indicios_Tamano = '20 cm',
--     @Indicios_Peso = 0.25,
--     @Indicios_Ubicacion = 'Almacén 1 / Caja F-10',
--     @Indicios_Id = @Indicios_Id1 OUTPUT;
-- SELECT @Indicios_Id1 AS 'ID del nuevo indicio creado';