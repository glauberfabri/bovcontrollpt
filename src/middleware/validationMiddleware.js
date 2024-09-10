const Joi = require('joi');
// Esquema de validação para registro de fazendeiro
const farmerSchema = Joi.object({
    name: Joi.string().required(),
    farmName: Joi.string().required(),
    distance: Joi.number().required(),
  });
  
  // Middleware de validação de fazendeiro
  const validateFarm = (req, res, next) => {
    const { error } = farmerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    next(); // Passa para o próximo middleware ou controlador
  };

// Esquema de validação para registro de fazendeiro
const registerSchema = Joi.object({
  name: Joi.string().required(),
  farmName: Joi.string().required(),
  distance: Joi.number().required(),
  password: Joi.string().min(6).required(),
});

// Middleware para validar o registro
const validateRegister = (req, res, next) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next(); // Passa para o próximo middleware ou controlador
};


const loginSchema = Joi.object({
    farmName: Joi.string().required(),
    password: Joi.string().required(),
  });
  
  const validateLogin = (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      console.error("Erro de validação:", error.details[0].message); // Log de debug
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
  };

// Esquema de validação para produção de leite
const milkProductionSchema = Joi.object({
    farmerId: Joi.string().required(),
    liters: Joi.number().positive().required(),
    date: Joi.date().required(),
  });
  
  // Middleware para validar a produção de leite
  const validateMilkProduction = (req, res, next) => {
    const { error } = milkProductionSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    next(); // Passa para o próximo middleware ou controlador
  };

module.exports = {
  validateRegister,
  validateLogin,
  validateMilkProduction,
  validateFarm,
};
