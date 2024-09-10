const request = require('supertest');
const app = require('../app');
const { connectDB, getDB, closeDB } = require('../config/database');

let db; // Variável para armazenar a conexão com o banco de dados
let farmer; // Variável para armazenar os dados do fazendeiro
let token; // Token de autenticação para o fazendeiro

beforeAll(async () => {
  // Estabelecer conexão com o banco de dados
  await connectDB();
  db = getDB(); // Obtenha a instância do banco de dados após a conexão
  
  // Limpar a coleção de fazendeiros para garantir um ambiente de teste limpo
  await db.collection('farmers').deleteMany({});

  // Registrar um novo fazendeiro "Green Farm" para usar nos testes
  const res = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Green Farm',
      farmName: 'Green Farm',
      distance: 10,
      password: 'password123',
    });

  farmer = res.body; // Armazenar o fazendeiro registrado
  token = farmer.token; // Armazenar o token JWT gerado
});

afterAll(async () => {
  // Fechar a conexão com o banco de dados após todos os testes
  await closeDB();
});

describe('Auth API', () => {
  it('deve registrar um novo fazendeiro com sucesso', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Another Farmer',
        farmName: 'Blue Farm',
        distance: 15,
        password: 'password456',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  it('deve fazer login com credenciais válidas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        farmName: 'Green Farm',
        password: 'password123',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('não deve fazer login com credenciais inválidas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        farmName: 'Green Farm',
        password: 'wrongpassword',
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe('Credenciais inválidas');
  });

  it('não deve fazer login com uma fazenda inexistente', async () => {
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
