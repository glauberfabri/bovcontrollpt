const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

let db;
let client;

const connectDB = async () => {
  try {
    client = new MongoClient(process.env.MONGO_URI); // Criando o cliente MongoDB
    await client.connect(); // Conectando ao MongoDB
    db = client.db(); // Seleciona o banco de dados
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1); // Sair do processo em caso de falha de conexão
  }
};

const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};

const closeDB = async () => {
  if (client) {
    await client.close(); // Fechar o cliente MongoDB
    console.log('MongoDB connection closed');
  }
};

module.exports = {
  connectDB,
  getDB,
  closeDB,
};
