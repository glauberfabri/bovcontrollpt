const express = require('express');
const router = express.Router();
const { addMilkProduction, getMilkProductionByFarmAndMonth } = require('../models/milkProductionModel'); 
const { validateMilkProduction } = require('../middleware/validationMiddleware'); 
const protect = require('../middleware/authMiddleware'); 
const milkPricingService = require('../services/milkPricingService'); // Serviço para cálculo do preço

// Rota para adicionar produção de leite
router.post('/', protect, validateMilkProduction, async (req, res) => {
  try {
    const result = await addMilkProduction(req.body); // Adiciona a produção de leite
    res.status(201).json(result); // Retorna 201 para criação de recurso
  } catch (error) {
    console.error('Error adding milk production:', error.message);
    res.status(500).json({ message: 'Failed to add milk production: ' + error.message });
  }
});

// Rota para obter produção de leite com base em critérios de pesquisa (fazenda, mês, ano)
router.get('/', protect, async (req, res) => {
  const { farmerId, month, year } = req.query;

  try {
    console.log(`Querying milk production for farmerId: ${farmerId}, month: ${month}, year: ${year}`);
    const productions = await getMilkProductionByFarmAndMonth(farmerId, parseInt(month), parseInt(year));

    if (!productions || productions.length === 0) {
      return res.status(404).json({ message: 'No milk production found for the given criteria.' });
    }

    console.log('Milk production found:', productions);
    res.status(200).json(productions);
  } catch (error) {
    console.error('Error querying milk production:', error.message);
    res.status(500).json({ message: 'Failed to fetch milk production: ' + error.message });
  }
});

// Rota para consultar o preço do litro de leite para um mês específico
router.get('/:farmerId/milk-price/:month', protect, async (req, res) => {
  const { farmerId, month } = req.params;
  const { year } = req.query; // Opcionalmente, o ano pode ser enviado como um parâmetro de query

  try {
    // Use o serviço para calcular o preço do leite
    const milkPrice = await milkPricingService.calculateMonthlyMilkPrice(farmerId, parseInt(month), parseInt(year));

    if (!milkPrice) {
      return res.status(404).json({ message: 'No milk production found for the specified farmer and month.' });
    }

    // Retorna o preço em formatos diferentes (BRL e USD)
    res.status(200).json({
      priceBRL: milkPrice.priceBRL,
      priceUSD: milkPrice.priceUSD,
    });
  } catch (error) {
    console.error('Error calculating milk price:', error.message);
    res.status(500).json({ message: 'Failed to calculate milk price: ' + error.message });
  }
});

module.exports = router;
