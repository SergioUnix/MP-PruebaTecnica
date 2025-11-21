import request from 'supertest';
const app: any = require('../server');
import * as mssql from 'mssql';
import * as jwt from 'jsonwebtoken';

// Mockear los módulos
jest.mock('mssql');
jest.mock('jsonwebtoken');

// Función auxiliar para mockear mssql.Request
const mockRequest = (recordsets: any[], shouldReject: boolean = false) => ({
  input: jest.fn().mockReturnThis(),
  execute: shouldReject
    ? jest.fn().mockRejectedValue(new Error('Error en la base de datos'))
    : jest.fn().mockResolvedValue({ recordsets }),
});

describe('Pruebas para la ruta de login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Debería responder con un token si las credenciales son correctas', async () => {
    const mockUsuario = {
      Usuario_Id: 1,
      Usuario_Email: 'rlopez@dicri.gob.gt',
      Usuario_Nombre: 'Roberto López',
      Usuario_PasswordHash: 'hash_tec_001',
      TipoUsuarioId_Usuario: 1,
    };
    (mssql.Request as unknown as jest.Mock).mockImplementation(() =>
      mockRequest([
        [mockUsuario],
        [{ LoginResultado: 0 }],
      ])
    );
    (jwt.sign as unknown as jest.Mock).mockReturnValue('token_ficticio');
    const response = await request(app)
      .post('/api/login')
      .send({
        email: 'rlopez@dicri.gob.gt',
        password: 'hash_tec_001',
      })
      .expect(200);
    expect(response.body).toHaveProperty('token', 'token_ficticio');
    expect(response.body.usuario.email).toBe('rlopez@dicri.gob.gt');
  });

  it('Debería responder con un error si el usuario no es encontrado', async () => {
    (mssql.Request as unknown as jest.Mock).mockImplementation(() =>
      mockRequest([
        [],
        [{ LoginResultado: -1 }],
      ])
    );
    const response = await request(app)
      .post('/api/login')
      .send({
        email: 'incorrecto@example.com',
        password: 'contraseña_incorrecta',
      })
      .expect(401);
    expect(response.body).toHaveProperty('message', 'Usuario no encontrado.');
  });

  it('Debería responder con un error si la contraseña es incorrecta', async () => {
    const mockUsuario = {
      Usuario_Id: 1,
      Usuario_Email: 'rlopez@dicri.gob.gt',
      Usuario_Nombre: 'Roberto López',
      Usuario_PasswordHash: 'hash_diferente',
      TipoUsuarioId_Usuario: 1,
    };
    (mssql.Request as unknown as jest.Mock).mockImplementation(() =>
      mockRequest([
        [mockUsuario],
        [{ LoginResultado: 0 }],
      ])
    );
    const response = await request(app)
      .post('/api/login')
      .send({
        email: 'rlopez@dicri.gob.gt',
        password: 'hash_incorrecto',
      })
      .expect(401);
    expect(response.body).toHaveProperty('message', 'Contraseña incorrecta.');
  });

  it('Debería responder con un error si falta el email o la contraseña', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({
        email: '',
        password: '',
      })
      .expect(400);
    expect(response.body).toHaveProperty('message', 'El email y la contraseña son obligatorios.');
  });

  it('Debería responder con un error si hay un problema interno', async () => {
    // Guardar la función original de console.error
    const originalConsoleError = console.error;
    // Mockear console.error para evitar que se muestre en la consola
    console.error = jest.fn();

    (mssql.Request as unknown as jest.Mock).mockImplementation(() =>
      mockRequest([], true)
    );

    const response = await request(app)
      .post('/api/login')
      .send({
        email: 'rlopez@dicri.gob.gt',
        password: 'hash_tec_001',
      })
      .expect(500);

    expect(response.body).toHaveProperty('message', 'Error interno del servidor.');

    // Restaurar console.error a su función original
    console.error = originalConsoleError;
  });
});
