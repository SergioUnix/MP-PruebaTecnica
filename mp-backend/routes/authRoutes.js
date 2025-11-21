
const express = require('express');
const router = express.Router();
const sql = require('mssql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Clave secreta para JWT (debería estar en variables de entorno)
const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_aqui';

// Endpoint para login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('📝 Email recibido:', email);
  console.log('📝 Contraseña recibida:', password);

  if (!email || !password) {
    return res.status(400).json({ message: "El email y la contraseña son obligatorios." });
  }

  try {
    const request = new sql.Request();
    request.input('p_email', sql.VarChar(100), email);
    request.input('p_password', sql.VarChar(100), password);

    const result = await request.execute('DICRI.SP_ValidarLogin');
    console.log('📥 Resultado del procedimiento almacenado:', result.recordsets);

    const loginResultado = result.recordsets[1][0].LoginResultado;

    if (loginResultado === -1) {
      return res.status(401).json({ message: "Usuario no encontrado." });
    }

    if (loginResultado !== 0) {
      return res.status(500).json({ message: "Error interno del servidor al validar el login." });
    }

    const usuario = result.recordsets[0][0];
    console.log('🔑 Contraseña almacenada en la base de datos:', usuario.Usuario_PasswordHash);

    // Comparación directa de cadenas de texto
    const passwordMatch = (password === usuario.Usuario_PasswordHash);
    console.log('🔑 ¿Coincide la contraseña?', passwordMatch);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta." });
    }

    const token = jwt.sign(
      {
        usuarioId: usuario.Usuario_Id,
        email: usuario.Usuario_Email,
        nombre: usuario.Usuario_Nombre,
        tipoUsuario: usuario.TipoUsuarioId_Usuario,
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: "Login exitoso",
      token,
      usuario: {
        id: usuario.Usuario_Id,
        nombre: usuario.Usuario_Nombre,
        email: usuario.Usuario_Email,
        tipoUsuario: usuario.TipoUsuarioId_Usuario,
      },
    });
  } catch (err) {
    console.error("Error al validar login:", err.message);
    res.status(500).json({ message: "Error interno del servidor." });
  }
});


module.exports = router;
