const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.MONGO_URI;

async function hashPasswords() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('bovcontrol'); // Certifique-se de usar o nome correto do banco de dados
    const farmerCollection = db.collection('farmers');

    const farmers = await farmerCollection.find().toArray();

    for (const farmer of farmers) {
      // Verifique se a senha já está em formato de hash (inicia com '$2a$')
      if (!farmer.password.startsWith('$2a$')) {
        // Se a senha não estiver hashada, criptografe-a
        const hashedPassword = await bcrypt.hash(farmer.password, 10);
        
        // Atualize o fazendeiro no banco de dados
        await farmerCollection.updateOne(
          { _id: farmer._id },
          { $set: { password: hashedPassword } }
        );
        console.log(`Senha criptografada para o fazendeiro ${farmer.farmName}`);
      }
    }
  } catch (error) {
    console.error('Erro ao criptografar senhas:', error.message);
  } finally {
    await client.close();
  }
}

hashPasswords();
