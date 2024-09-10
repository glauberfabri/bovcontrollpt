// src/tests/responseService.test.js

const { formatResponse, formatErrorResponse } = require('../services/responseService');

describe('Serviço de Resposta (responseService)', () => {
  
  // Teste para formatResponse
  it('deve formatar a resposta de sucesso corretamente com dados', () => {
    const data = { nome: 'Fazenda Teste', distancia: 50 };
    const message = 'Dados retornados com sucesso';
    const status = 'success';

    const response = formatResponse(data, message, status);

    expect(response).toEqual({
      status: 'success',
      message: 'Dados retornados com sucesso',
      data: { nome: 'Fazenda Teste', distancia: 50 },
    });
  });

  it('deve formatar a resposta de sucesso corretamente com valores padrão', () => {
    const data = { nome: 'Fazenda Teste', distancia: 50 };

    const response = formatResponse(data);

    expect(response).toEqual({
      status: 'success',
      message: 'Operação realizada com sucesso',
      data: { nome: 'Fazenda Teste', distancia: 50 },
    });
  });

  // Teste para formatErrorResponse
  it('deve formatar a resposta de erro corretamente com mensagens personalizadas', () => {
    const message = 'Erro ao processar a operação';
    const errors = ['Campo obrigatório ausente', 'Formato inválido'];
    const status = 'error';

    const response = formatErrorResponse(message, errors, status);

    expect(response).toEqual({
      status: 'error',
      message: 'Erro ao processar a operação',
      errors: ['Campo obrigatório ausente', 'Formato inválido'],
    });
  });

  it('deve formatar a resposta de erro corretamente com valores padrão', () => {
    const response = formatErrorResponse();

    expect(response).toEqual({
      status: 'error',
      message: 'Erro na operação',
      errors: [],
    });
  });
});
