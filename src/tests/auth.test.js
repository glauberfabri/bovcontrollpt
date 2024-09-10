const request = require('supertest');
const app = require('../app');
const { connectDB, getDB, closeDB } = require('../config/database');

let db; // Variável para armazenar a conexão com o banco de dados
let farmer; // Variável para armazenar os dados do fazendeiro

beforeAll(async () => {
  // Estabelecer conexão com o banco de dados
  await connectDB();
  db = getDB(); // Obtenha a instância do banco de dados após a conexão
  
  // Limpar a coleção de fazendeiros para garantir um ambiente de teste limpo
  await db.collection('farmers').deleteMany({});

  // Registrar um novo fazendeiro para usar nos testes
  const res = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'admin',
      farmName: 'admin',
      distance: 10,
      password: 'password123',
    });

  farmer = res.body; // Armazenar o fazendeiro registrado
});

afterAll(async () => {
  // Fechar a conexão com o banco de dados após todos os testes
  await closeDB();
});

describe('Auth API', () => {
  it('should register a new farmer', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Another Farmer',
        farmName: 'Another Farm',
        distance: 15,
        password: 'password456',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should login with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        farmName: 'Test Farm',
        password: 'password123',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not login with invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        farmName: 'Test Farm',
        password: 'wrongpassword',
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe('Credenciais inválidas');

  });

  it('should not login with a non-existing farm', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        farmName: 'Non Existent Farm',
        password: 'password123',
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe('Credenciais inválidas');

  });
});
