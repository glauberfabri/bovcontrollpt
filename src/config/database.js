const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

let db;
let client;

const connectDB = async () => {
  try {
    client = new MongoClient(process.env.MONGO_URI, {
      useNewUrlParser: true, // Remova se a versão não precisar disso
      useUnifiedTopology: true, // Remova se a versão não precisar disso
    });

    await client.connect();
    db = client.db(); // Defina o banco de dados

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
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
    await client.close(); // Fechar o client em vez de db
    console.log('MongoDB connection closed');
  }
};

module.exports = {
  connectDB,
  getDB,
  closeDB,
};
