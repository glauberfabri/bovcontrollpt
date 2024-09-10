const { getDB } = require('../config/database');
const { ObjectId } = require('mongodb'); // Para buscar e manipular IDs

// Função para acessar a coleção de produção de leite
const getMilkProductionCollection = () => {
  const db = getDB(); // Usar a função getDB para pegar a instância conectada
  if (!db) {
    throw new Error('Database connection failed'); // Lançar erro se a conexão falhar
  }
  return db.collection('milkProductions'); // Retorna a coleção de produções de leite
};

// Função para adicionar produção de leite
const addMilkProduction = async (productionData) => {
  try {
    const milkProductionCollection = getMilkProductionCollection();
    const result = await milkProductionCollection.insertOne(productionData);

    if (result.insertedId) {
      console.log('Milk production inserted successfully with ID:', result.insertedId);
    } else {
      throw new Error('Failed to insert milk production, no ID returned');
    }

    return result;
  } catch (error) {
    console.error('Error adding milk production:', error.message);
    throw new Error('Failed to add milk production: ' + error.message);
  }
};

// Função para buscar produção de leite por fazenda, mês e ano
const getMilkProductionByFarmAndMonth = async (farmerId, month, year) => {
  try {
    // Certifique-se de que o farmerId seja um ObjectId válido
    if (!ObjectId.isValid(farmerId)) {
      throw new Error('ID do fazendeiro inválido.');
    }

    const milkProductionCollection = getMilkProductionCollection();
    
    const productions = await milkProductionCollection.find({
      farmerId: new ObjectId(farmerId), // Converta para ObjectId aqui
      month: month,
      year: year,
    }).toArray();

    if (!productions || productions.length === 0) {
      console.log(`No milk production found for farmerId: ${farmerId}, month: ${month}, year: ${year}`);
      return [];
    }

    console.log(`Found ${productions.length} milk production(s) for farmerId: ${farmerId}, month: ${month}, year: ${year}`);
    return productions;
  } catch (error) {
    console.error('Error fetching milk production by farm and month:', error.message);
    throw new Error('Failed to fetch milk production: ' + error.message);
  }
};

// Função para buscar todas as produções de leite por fazenda
const getAllMilkProductionsByFarm = async (farmerId) => {
  try {
    // Certifique-se de que o farmerId seja um ObjectId válido
    if (!ObjectId.isValid(farmerId)) {
      throw new Error('ID do fazendeiro inválido.');
    }

    const milkProductionCollection = getMilkProductionCollection();

    const productions = await milkProductionCollection.find({
      farmerId: new ObjectId(farmerId),
    }).toArray();

    if (!productions || productions.length === 0) {
      console.log(`No milk production found for farmerId: ${farmerId}`);
      return [];
    }

    console.log(`Found ${productions.length} milk production(s) for farmerId: ${farmerId}`);
    return productions;
  } catch (error) {
    console.error('Error fetching all milk productions by farm:', error.message);
    throw new Error('Failed to fetch milk production: ' + error.message);
  }
};

// Função para deletar uma produção de leite
const deleteMilkProductionById = async (productionId) => {
  try {
    // Certifique-se de que o productionId seja um ObjectId válido
    if (!ObjectId.isValid(productionId)) {
      throw new Error('ID de produção inválido.');
    }

    const milkProductionCollection = getMilkProductionCollection();
    const result = await milkProductionCollection.deleteOne({ _id: new ObjectId(productionId) });

    if (result.deletedCount === 0) {
      throw new Error('No milk production found to delete');
    }

    console.log('Milk production deleted successfully with ID:', productionId);
    return result;
  } catch (error) {
    console.error('Error deleting milk production:', error.message);
    throw new Error('Failed to delete milk production: ' + error.message);
  }
};

module.exports = {
  addMilkProduction,
  getMilkProductionByFarmAndMonth,
  getAllMilkProductionsByFarm,
  deleteMilkProductionById,
};
