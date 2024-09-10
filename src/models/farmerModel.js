const { getDB } = require('../config/database');
const { ObjectId } = require('mongodb'); // Importar ObjectId para buscas por ID

// Função para acessar a coleção de fazendeiros
const getFarmerCollection = () => {
  const db = getDB(); // Obtenha a instância do banco de dados
  return db.collection('farmers'); // Retornar a coleção de fazendeiros
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

// Buscar um fazendeiro por nome da fazenda
const getFarmerByFarmName = async (farmName) => {
  try {
    const db = getDB(); // Certifique-se que a conexão está inicializada
    const farmer = await db.collection('users').findOne({ farmName });

    if (!farmer) {
      console.log(`Farmer not found with farm name: ${farmName}`);
      return null;
    }
    
    return farmer;
  } catch (error) {
    console.error('Error retrieving farmer by farm name:', error.message);
    throw new Error('Failed to retrieve farmer by farm name: ' + error.message);
  }
};


module.exports = {
  createFarmer,
  getFarmerById,
  getFarmerByFarmName,
};
