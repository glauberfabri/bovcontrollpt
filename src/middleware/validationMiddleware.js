const Joi = require('joi');
const { ObjectId } = require('mongodb');

// Esquema de validação para registro de fazendeiro
const farmerSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'O nome é obrigatório.',
    'any.required': 'O nome é obrigatório.'
  }),
  farmName: Joi.string().required().messages({
    'string.empty': 'O nome da fazenda é obrigatório.',
    'any.required': 'O nome da fazenda é obrigatório.'
  }),
  distance: Joi.number().positive().required().messages({
    'number.base': 'A distância deve ser um número positivo.',
    'any.required': 'A distância é obrigatória.'
  }),
});

// Middleware de validação de fazendeiro
const validateFarm = (req, res, next) => {
  const { error } = farmerSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next(); // Passa para o próximo middleware ou controlador
};

// Esquema de validação para registro de fazendeiro com senha
const registerSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'O nome é obrigatório.',
    'any.required': 'O nome é obrigatório.'
  }),
  farmName: Joi.string().required().messages({
    'string.empty': 'O nome da fazenda é obrigatório.',
    'any.required': 'O nome da fazenda é obrigatório.'
  }),
  distance: Joi.number().positive().required().messages({
    'number.base': 'A distância deve ser um número positivo.',
    'any.required': 'A distância é obrigatória.'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'A senha deve ter no mínimo 6 caracteres.',
    'any.required': 'A senha é obrigatória.'
  }),
});

// Middleware para validar o registro
const validateRegister = (req, res, next) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next(); // Passa para o próximo middleware ou controlador
};

// Esquema de validação para login
const loginSchema = Joi.object({
  farmName: Joi.string().required().messages({
    'string.empty': 'O nome da fazenda é obrigatório.',
    'any.required': 'O nome da fazenda é obrigatório.'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'A senha é obrigatória.',
    'any.required': 'A senha é obrigatória.'
  }),
});

// Middleware para validar o login
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
  farmerId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
    'string.pattern.base': 'O ID do fazendeiro deve ser um ObjectId válido.',
    'any.required': 'O ID do fazendeiro é obrigatório.'
  }),
  liters: Joi.number().positive().required().messages({
    'number.positive': 'A quantidade de litros deve ser um número positivo.',
    'any.required': 'A quantidade de litros é obrigatória.'
  }),
  date: Joi.date().required().messages({
    'date.base': 'A data deve ser válida.',
    'any.required': 'A data é obrigatória.'
  }),
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
