const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.MONGO_URI;

async function testPassword() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('bovcontrol');
    const farmerCollection = db.collection('farmers');

    // Busque o fazendeiro diretamente
    const farmer = await farmerCollection.findOne({ farmName: 'Green Farm' });

    if (!farmer) {
      console.log('Fazendeiro não encontrado');
      return;
    }

    console.log('Fazendeiro encontrado:', farmer);

    // Teste a comparação de senha
    const isPasswordValid = await bcrypt.compare('password123', farmer.password);
    console.log('Resultado da comparação com senha "password123":', isPasswordValid);

    const isPasswordValid2 = await bcrypt.compare('admin', farmer.password);
    console.log('Resultado da comparação com senha "admin":', isPasswordValid2);

  } catch (error) {
    console.error('Erro ao testar senha:', error.message);
  } finally {
    await client.close();
  }
}

testPassword();
