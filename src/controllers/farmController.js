const { addFarm, getFarmById } = require('../models/farmModel');

// Controlador para adicionar uma fazenda
const addFarmController = async (req, res) => {
  try {
    const { name, distance } = req.body;
    const farmData = { name, distance };

    const newFarm = await addFarm(farmData);
    res.status(201).json(newFarm);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controlador para obter uma fazenda por ID
const getFarmByIdController = async (req, res) => {
  try {
    const { farmId } = req.params;
    const farm = await getFarmById(farmId);

    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }
    res.status(200).json(farm);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addFarmController,
  getFarmByIdController,
};
