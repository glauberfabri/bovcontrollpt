const { addFarm, getFarmById } = require('../models/farmModel');

// Controlador para adicionar uma fazenda
const addFarmController = async (req, res) => {
  try {
    const { name, distance } = req.body;

    // Validação simples dos campos obrigatórios
    if (!name || typeof distance !== 'number') {
      return res.status(400).json({ message: 'Name and distance are required, and distance must be a number.' });
    }

    const farmData = { name, distance };

    const newFarm = await addFarm(farmData);
    res.status(201).json(newFarm);
  } catch (error) {
    console.error('Error adding farm:', error.message);
    res.status(500).json({ message: 'Failed to add farm: ' + error.message });
  }
};

// Controlador para obter uma fazenda por ID
const getFarmByIdController = async (req, res) => {
  try {
    const { farmId } = req.params;

    // Verificação simples do ID
    if (!farmId) {
      return res.status(400).json({ message: 'Farm ID is required.' });
    }

    const farm = await getFarmById(farmId);

    if (!farm) {
      return res.status(404).json({ message: 'Farm not found with ID: ' + farmId });
    }
    res.status(200).json(farm);
  } catch (error) {
    console.error('Error fetching farm:', error.message);
    res.status(500).json({ message: 'Failed to retrieve farm: ' + error.message });
  }
};

module.exports = {
  addFarmController,
  getFarmByIdController,
};
