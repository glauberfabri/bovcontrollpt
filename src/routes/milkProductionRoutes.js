const express = require('express');
const router = express.Router();
const { addMilkProduction, getMilkProductionByFarmAndMonth } = require('../models/milkProductionModel'); // Ajuste conforme o nome do arquivo do modelo
const { validateMilkProduction } = require('../middleware/validationMiddleware'); // Middleware de validação
const protect = require('../middleware/authMiddleware'); // Middleware de autenticação

// Rota para adicionar produção de leite
router.post('/', protect, validateMilkProduction, async (req, res) => {
  try {
    const result = await addMilkProduction(req.body); // Use o método 'create' do modelo
    res.status(201).json(result); // Retorne 201 para criação de recurso
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

module.exports = router;
