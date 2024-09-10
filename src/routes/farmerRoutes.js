const express = require('express');
const { ObjectId } = require('mongodb'); // Adicione isso para usar ObjectId
const { createFarmer, getFarmerById, getFarmerByNameOrFarmName } = require('../models/farmerModel');
const { addMilkProduction, getMilkProductionByFarmAndMonth } = require('../models/milkProductionModel');
const { calculateMilkPrice, calculateTotalPayment } = require('../services/milkPricingService');
const protect = require('../middleware/authMiddleware'); // Middleware de autenticação
const { validateFarm, validateMilkProduction } = require('../middleware/validationMiddleware'); // Validação modular


const router = express.Router();

// Rota para cadastro de fazendeiro e fazenda
router.post('/', protect, validateFarm, async (req, res) => {
  try {
    const { name, farmName, distance } = req.body;

    // Verificar se já existe um fazendeiro com o mesmo nome ou fazenda
    const existingFarmer = await getFarmerByNameOrFarmName(farmName);
    if (existingFarmer) {
      return res.status(400).json({ message: 'Farm or farmer with this name already exists.' });
    }

    const farmerData = { name, farmName, distance };
    const newFarmer = await createFarmer(farmerData);
    res.status(201).json(newFarmer);
  } catch (error) {
    console.error('Error creating farmer:', error);
    res.status(500).json({ message: 'Failed to create farmer' });
  }
});

// Rota para registrar a produção diária de leite
router.post('/:farmerId/milk-production', protect, validateMilkProduction, async (req, res) => {
  try {
    const { farmerId } = req.params;
    const { liters, date } = req.body;

    // Verifique se o farmerId está sendo convertido corretamente para ObjectId
    if (!ObjectId.isValid(farmerId)) {
      return res.status(400).json({ message: 'ID do fazendeiro inválido.' });
    }

    const month = new Date(date).getMonth() + 1; // Extrair o mês da data
    const year = new Date(date).getFullYear();   // Extrair o ano da data

    const productionData = {
      farmerId: new ObjectId(farmerId), // Converta para ObjectId
      liters,
      date,
      month,
      year,
    };

    const newProduction = await addMilkProduction(productionData);
    res.status(201).json(newProduction);
  } catch (error) {
    console.error('Error adding milk production:', error);
    res.status(500).json({ message: error.message });
  }
});

// Rota para consultar o preço do litro de leite para um fazendeiro em um determinado mês
router.get('/:farmerId/milk-price/:month', protect, async (req, res) => {
  try {
    const { farmerId, month } = req.params;
    const year = new Date().getFullYear(); // Usar o ano atual

    const productions = await getMilkProductionByFarmAndMonth(farmerId, parseInt(month), year);

    if (!productions || productions.length === 0) {
      return res.status(404).json({ message: 'No milk production found for this farm and month.' });
    }

    const totalLiters = productions.reduce((sum, p) => sum + p.liters, 0);
    const farmer = await getFarmerById(farmerId);
    const pricePerLiter = calculateMilkPrice(totalLiters, farmer.distance, parseInt(month));
    const totalPayment = calculateTotalPayment(totalLiters, pricePerLiter);

    res.status(200).json({
      totalLiters,
      pricePerLiter: pricePerLiter.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      pricePerLiterUSD: pricePerLiter.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      totalPayment: totalPayment.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      totalPaymentUSD: totalPayment.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
    });
  } catch (error) {
    console.error('Error calculating milk price:', error);
    res.status(500).json({ message: 'Failed to calculate milk price' });
  }
});

// Rota para listar a produção de leite com filtros e paginação
router.get('/:farmerId/milk-productions', protect, async (req, res) => {
  try {
    const { farmerId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Parsing query params
    const parsedPage = Math.max(1, parseInt(page, 10)); // Página deve ser ao menos 1
    const parsedLimit = Math.max(1, Math.min(100, parseInt(limit, 10))); // Limite entre 1 e 100

    const productions = await getMilkProductionByFarmAndMonth(farmerId, parsedPage, parsedLimit);
    res.status(200).json(productions);
  } catch (error) {
    console.error('Error fetching milk productions:', error);
    res.status(500).json({ message: 'Failed to fetch milk productions' });
  }
});

module.exports = router;
