const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.MONGO_URI;

async function testConnection() {
  const client = new MongoClient(uri);

  try {
    // Conectar ao MongoDB
    await client.connect();
    console.log('MongoDB connected successfully');

    // Testar listando os bancos de dados disponíveis
    const databasesList = await client.db().admin().listDatabases();
    console.log('Databases:');
    databasesList.databases.forEach((db) => console.log(` - ${db.name}`));

  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

testConnection();
