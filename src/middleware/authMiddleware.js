const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  // Obter o token do cabeçalho de autorização
  let token = req.headers.authorization;

  // Verificar se o token começa com "Bearer"
  if (token && token.startsWith('Bearer ')) {
    // Remover o prefixo "Bearer" do token
    token = token.split(' ')[1];

    // Verificar o token JWT
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error('Erro ao verificar token:', err.message);  // Log detalhado do erro

        // Diferenciar entre token expirado e token inválido
        const message = err.name === 'TokenExpiredError'
          ? 'Token expirado, por favor faça login novamente'
          : 'Token inválido, autenticação falhou';

        return res.status(401).json({ message });
      }

      // Armazenar o usuário decodificado no request (disponível nas próximas funções)
      req.user = decoded;
      next();
    });
  } else {
    // Caso o token não seja fornecido no cabeçalho
    return res.status(401).json({ message: 'Não autorizado, token não encontrado' });
  }
};

module.exports = protect;
