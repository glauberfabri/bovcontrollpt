const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createFarmer, getFarmerByFarmName } = require('../models/farmerModel');
const generateToken = require('../utils/generateToken');
const { validateRegister, validateLogin } = require('../middleware/validationMiddleware'); // Importar middleware de validação

const router = express.Router();

// Rota para registro de fazendeiro
router.post('/register', validateRegister, async (req, res) => {
  const { name, farmName, distance, password } = req.body;

  try {
    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar fazendeiro com os dados recebidos
    const farmerData = { name, farmName, distance, password: hashedPassword };
    const newFarmer = await createFarmer(farmerData);

    // Retorna o novo fazendeiro com o token JWT
    res.status(201).json({
      _id: newFarmer.insertedId,
      name: farmerData.name,
      token: generateToken(newFarmer.insertedId),
    });
    console.log(`Novo fazendeiro registrado com sucesso: ${name}`);
  } catch (error) {
    console.error('Erro na rota de registro:', error.message);
    res.status(500).json({ message: 'Falha ao registrar fazendeiro' });
  }
});

router.post('/login', validateLogin, async (req, res) => {
  console.log("Recebido no corpo da requisição:", req.body);  // Debug
  
  const { farmName, password } = req.body;

  try {
    // Verifica se o fazendeiro existe com base no nome da fazenda
    const farmer = await getFarmerByFarmName(farmName);

    if (!farmer) {
      console.log("Farmer not found:", farmName);  // Debug
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Verifica se a senha está correta
    const isPasswordValid = await bcrypt.compare(password, farmer.password);

    if (isPasswordValid) {
      // Se a senha estiver correta, retorna os dados do fazendeiro com o token JWT
      res.json({
        _id: farmer._id,
        name: farmer.name,
        token: generateToken(farmer._id),
      });
    } else {
      console.log("Senha inválida para o fazendeiro:", farmName);  // Debug
      res.status(401).json({ message: 'Credenciais inválidas' });
    }
  } catch (error) {
    console.error('Erro na rota de login:', error);
    res.status(500).json({ message: 'Falha ao realizar login' });
  }
});




module.exports = router;
