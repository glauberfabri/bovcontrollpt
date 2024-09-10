const express = require('express');
const path = require('path');
const { connectDB } = require('./config/database');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');
const dotenv = require('dotenv');
const milkProductionRoutes = require('./routes/milkProductionRoutes');
const farmerRoutes = require('./routes/farmerRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorMiddleware'); // Middleware para tratamento de erros

dotenv.config();

const app = express();
app.use(express.json()); // Para permitir JSON no corpo da requisição

// Conectar ao MongoDB
connectDB();

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, '../public')));

// Definir a nova página de login como a página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html')); // Corrigir o caminho
});

// Rotas da API
app.use('/api/farmers', farmerRoutes); // Rotas de fazendeiros
app.use('/api/auth', authRoutes); // Rotas de autenticação
app.use('/api/milk-productions', milkProductionRoutes); // Rotas de produção de leite

// Middleware de tratamento de erros
app.use(errorHandler);

// Iniciar o servidor somente se o arquivo for executado diretamente
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
