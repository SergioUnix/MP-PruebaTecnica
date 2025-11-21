GO
-- Crear o recrear el Stored Procedure DICRI.SP_CrearRevisionExpediente
IF OBJECT_ID('DICRI.SP_CrearRevisionExpediente', 'P') IS NOT NULL
    DROP PROCEDURE DICRI.SP_CrearRevisionExpediente;
GO

CREATE PROCEDURE DICRI.SP_CrearRevisionExpediente
    @ExpedienteId INT,
    @CoordinadorId INT,
    @EsAprobado BIT,
    @Justificacion VARCHAR(400),
    @RevisionId INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Validar que el expediente exista
        IF NOT EXISTS (SELECT 1 FROM DICRI.TT_Expediente WHERE Expediente_Id = @ExpedienteId)
        BEGIN
            RAISERROR('El expediente con ID %d no existe.', 16, 1, @ExpedienteId);
            RETURN;
        END

        -- Validar que el coordinador exista
        IF NOT EXISTS (SELECT 1 FROM DICRI.TS_Usuario WHERE Usuario_Id = @CoordinadorId)
        BEGIN
            RAISERROR('El coordinador con ID %d no existe.', 16, 1, @CoordinadorId);
            RETURN;
        END

        -- Validar que la justificación no esté vacía
        IF LTRIM(RTRIM(ISNULL(@Justificacion, ''))) = ''
        BEGIN
            RAISERROR('La justificación es obligatoria.', 16, 1);
            RETURN;
        END

        -- Insertar la revisión
        INSERT INTO DICRI.TT_Revisiones (
            ExpedienteId_Revisiones,
            CoordinadorId_Revisiones,
            Revisiones_EsAprobado,
            Revisiones_Justificacion,
            Revisiones_FechaRevision,
            Usuario_Creacion
        )
        VALUES (
            @ExpedienteId,
            @CoordinadorId,
            @EsAprobado,
            @Justificacion,
            GETDATE(),
            GETDATE()
        );

        -- Obtener el ID de la revisión recién creada
        SET @RevisionId = SCOPE_IDENTITY();

        -- Determinar el nuevo estado del expediente según el resultado de la revisión
        DECLARE @NuevoEstado INT;

        IF @EsAprobado = 1
            SET @NuevoEstado = 2; -- 2: Aprobado
        ELSE
            SET @NuevoEstado = 3; -- 3: Rechazado

        -- Actualizar el expediente con la última fecha de revisión, la fecha de modificación y el nuevo estado
        UPDATE DICRI.TT_Expediente
        SET
            Expediente_UltimaRevision = GETDATE(),
            Usuario_Modificacion = GETDATE(),
            EstadoExpedienteId_Expediente = @NuevoEstado
        WHERE Expediente_Id = @ExpedienteId;

        COMMIT TRANSACTION;

        -- Devolver el ID de la revisión creada
        SELECT @RevisionId AS RevisionId;
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



-- --probar el procedimiento almacenado DICRI.SP_CrearRevisionExpediente
-- -- Declarar variables para la prueba
-- DECLARE @RevisionId INT;
-- DECLARE @ExpedienteId INT = 6;      -- Cambia este valor por un ID de expediente existente
-- DECLARE @CoordinadorId INT = 1;     -- Cambia este valor por un ID de coordinador existente
-- DECLARE @EsAprobado BIT = 1;         -- 1 para aprobado, 0 para rechazado
-- DECLARE @Justificacion VARCHAR(400) = 'El expediente cumple con todos los requisitos necesarios.';

-- -- Ejecutar el Stored Procedure para una revisión aprobada
-- EXEC DICRI.SP_CrearRevisionExpediente
--     @ExpedienteId = @ExpedienteId,
--     @CoordinadorId = @CoordinadorId,
--     @EsAprobado = @EsAprobado,
--     @Justificacion = @Justificacion,
--     @RevisionId = @RevisionId OUTPUT;