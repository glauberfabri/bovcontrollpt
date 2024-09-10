const { connectDB } = require('../config/database');
const { ObjectId } = require('mongodb'); // Para buscar e manipular IDs

// Função para acessar a coleção de produção de leite
const getMilkProductionCollection = async () => {
  const db = await connectDB(); // Garante que a conexão está estabelecida
  return db.collection('milkProductions'); // Retorna a coleção de produções de leite
};

// Função para adicionar produção de leite
const addMilkProduction = async (productionData) => {
  try {
    const milkProductionCollection = await getMilkProductionCollection();
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

// Função para buscar produção de leite por fazenda e mês
const getMilkProductionByFarmAndMonth = async (farmerId, month, year) => {
  try {
    const milkProductionCollection = await getMilkProductionCollection();
    const productions = await milkProductionCollection.find({
      farmerId: new ObjectId(farmerId),
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

module.exports = {
  addMilkProduction,
  getMilkProductionByFarmAndMonth,
};
