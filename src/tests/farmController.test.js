const request = require('supertest');
const app = require('../src/app'); // Verifique o caminho para o arquivo do servidor

describe('API de Pecuária', () => {
  let farmerId;

  // Teste para cadastrar um novo fazendeiro
  it('deve criar um novo fazendeiro', async () => {
    const response = await request(app)
      .post('/api/farmer/register')
      .send({
        name: 'João Silva',
        farmName: 'Fazenda São João',
        distance: 50,
        password: 'senha123'
      });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe('João Silva');
    expect(response.body.token).toBeTruthy();
    
    // Armazena o ID do fazendeiro para usar nos testes seguintes
    farmerId = response.body._id;
  });

  // Teste para registrar produção de leite
  it('deve registrar uma produção de leite', async () => {
    const response = await request(app)
      .post(`/api/farmer/${farmerId}/milk-production`)
      .send({
        liters: 1200,
        date: '2024-09-01'
      });

    expect(response.status).toBe(201);
    expect(response.body.liters).toBe(1200);
  });

  // Teste para consultar o preço do leite
  it('deve retornar o preço do leite para o mês', async () => {
    const month = 9; // Setembro
    const response = await request(app)
      .get(`/api/farmer/${farmerId}/milk-price/${month}`);

    expect(response.status).toBe(200);
    expect(response.body.totalLiters).toBe(1200);
    expect(response.body.pricePerLiter).toBeTruthy(); // Verifica se o preço foi calculado
  });

  // Teste para retornar todas as fazendas (se houver endpoint para listar fazendeiros)
  it('deve retornar todos os fazendeiros', async () => {
    const response = await request(app).get('/api/farmers');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
  
  // Teste para consultar as produções de leite do fazendeiro
  it('deve retornar as produções de leite do fazendeiro', async () => {
    const month = 9;
    const response = await request(app)
      .get(`/api/farmer/${farmerId}/milk-productions`);

    expect(response.status).toBe(200);
    expect(response.body[0].liters).toBe(1200);
  });
});
