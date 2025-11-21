
GO
-- Script completo para recrear el Stored Procedure DICRI.SP_ValidarLogin
IF OBJECT_ID('DICRI.SP_ValidarLogin', 'P') IS NOT NULL
    DROP PROCEDURE DICRI.SP_ValidarLogin;
GO
    ---crear el procedimiento almacenado DICRI.SP_ValidarLogin
    CREATE  PROCEDURE DICRI.SP_ValidarLogin
    @p_email VARCHAR(100), -- Usamos el email como nombre de usuario (UNIQUE)
    @p_password VARCHAR(100) -- NOTA: Este parámetro se IGNORA en el cuerpo del SP,
    --       pero se mantiene para la estructura de la llamada.
    AS
    BEGIN
    -- Declaramos variables para el resultado y los datos del usuario
    DECLARE @resultado INT;
    DECLARE @v_usuario_id INT;

    -- Inicializamos el resultado en un valor no válido por defecto
    SET @resultado = -9;

    -- 1. Buscar el usuario por Email para obtener su ID
    SELECT
        @v_usuario_id = U.Usuario_Id
    FROM 
        DICRI.TS_Usuario AS U
    WHERE 
        U.Usuario_Email = @p_email;

    -- 2. Asignación del código de estado
    IF @v_usuario_id IS NULL
    BEGIN
        SET @resultado = -1; -- Código: Usuario no encontrado
    END
    ELSE
    BEGIN
        -- Usuario encontrado.
        -- Devolvemos código 0 y los datos para que el backend valide el hash.
        SET @resultado = 0; 
    END

    -- 3. Devolver los datos del usuario (Solo si es encontrado)
    IF @resultado = 0
    BEGIN
        -- Si el usuario fue encontrado (Código 0), devolvemos los datos y el hash.
        SELECT
            Usuario_Id,
            TipoUsuarioId_Usuario,
            Usuario_Nombre,
            Usuario_Email,
            Usuario_PasswordHash -- CLAVE: Hash para que el backend compare
        FROM 
            DICRI.TS_Usuario
        WHERE 
            Usuario_Id = @v_usuario_id;
    END

    -- 4. Devolver el código de estado (siempre se devuelve).
    SELECT LoginResultado = @resultado;


    END
    GO

    ---.------------------------------------------------------
    -- -- Probar SP
    -- EXEC DICRI.SP_ValidarLogin 
    --     @p_email = 'rlopez@dicri.gob.gt', 
    --     @p_password = 'hash_tec_001'; 
    -- GO
