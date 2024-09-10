// tests/precoLeiteService.test.js
const { calcularPrecoLitro } = require('../services/milkPricingService.js');

describe('Serviço de Preço de Leite', () => {
  it('deve calcular o preço correto para o volume e distância', () => {
    const preco = calcularPrecoLitro(12000, 60, 1.95, 0.01); // Exemplo de cálculo
    expect(preco).toBeCloseTo(23516.9); // Verifique o valor esperado
  });

  it('deve calcular o preço correto sem bônus para volume abaixo de 10.000 litros', () => {
    const preco = calcularPrecoLitro(8000, 40, 1.80); // Outro exemplo de cálculo
    expect(preco).toBeCloseTo(14398); // Verifique o valor esperado para esse caso
  });
});
