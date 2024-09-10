const { getDB } = require('../config/database');
const { ObjectId } = require('mongodb'); // Importar ObjectId para buscas por ID

// Função para acessar a coleção de fazendeiros
const getFarmerCollection = () => {
  const db = getDB(); // Obtenha a instância do banco de dados
  return db.collection('farmers'); // Certificar-se de que a coleção 'farmers' está sendo usada
};

// Criar um novo fazendeiro
const createFarmer = async (farmerData) => {
  try {
    // Validação básica dos dados
    if (!farmerData || !farmerData.name || !farmerData.farmName) {
      throw new Error('Farmer data is incomplete: Name and farm name are required');
    }

    const farmerCollection = getFarmerCollection();
    const result = await farmerCollection.insertOne(farmerData);

    if (result.insertedId) {
      console.log('Farmer inserted successfully with ID:', result.insertedId);
    } else {
      throw new Error('Failed to insert farmer, no ID returned');
    }

    return result;
  } catch (error) {
    console.error('Error creating farmer:', error.message);
    throw new Error('Failed to create farmer: ' + error.message);
  }
};

// Buscar um fazendeiro por `name` ou `farmName`
const getFarmerByNameOrFarmName = async (identifier) => {
  try {
    const farmerCollection = getFarmerCollection(); // Usar a coleção correta 'farmers'
    // Buscar fazendeiro por 'name' ou 'farmName'
    const farmer = await farmerCollection.findOne({
      $or: [{ name: identifier }, { farmName: identifier }],
    });

    if (!farmer) {
      console.log(`Farmer not found with name or farm name: ${identifier}`);
      return null;
    }

    return farmer;
  } catch (error) {
    console.error('Error retrieving farmer by name or farm name:', error.message);
    throw new Error('Failed to retrieve farmer by name or farm name: ' + error.message);
  }
};

// Buscar um fazendeiro por ID
const getFarmerById = async (farmerId) => {
  try {
    if (!ObjectId.isValid(farmerId)) {
      throw new Error('Invalid farmer ID format');
    }

    const farmerCollection = getFarmerCollection();
    const farmer = await farmerCollection.findOne({ _id: new ObjectId(farmerId) });

    if (!farmer) {
      throw new Error('Farmer not found with ID: ' + farmerId);
    }

    return farmer;
  } catch (error) {
    console.error('Error retrieving farmer by ID:', error.message);
    throw new Error('Failed to retrieve farmer by ID: ' + error.message);
  }
};

module.exports = {
  createFarmer,
  getFarmerById,
  getFarmerByNameOrFarmName, // Atualizado para verificar tanto 'name' quanto 'farmName'
};
