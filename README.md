# bovcontrollpt# Desafio de Desenvolvimento Backend


A Bovcontrol tem como missão digitalizar a pecuária, coletando e analisando dados para aumentar a produtividade, eficiência e rentabilidade do agronegócio. Este documento descreve a solução para o desafio proposto, incluindo as tecnologias usadas e instruções para iniciar o projeto.

## Tecnologias Utilizadas

- **JavaScript**: Linguagem principal para o desenvolvimento da API.
- **Express**: Framework para construção da API REST.
- **Swagger**: Ferramenta para documentação da API (opcional).
- **Node.js**: Ambiente de execução para o código JavaScript.
- **MongoDB**: Banco de dados NoSQL para armazenamento dos dados.
- **dotenv**: Biblioteca para gerenciar variáveis de ambiente.

## Bibliotecas e Dependências

- `express`: Framework para criar a API REST.
- `mongodb`: Driver nativo para conectar ao MongoDB.
- `dotenv`: Para carregar variáveis de ambiente do arquivo `.env`.
- `swagger-ui-express` e `swagger-jsdoc` (opcional): Para documentação da API.

Instalação das dependências:


npm install express mongodb dotenv swagger-ui-express swagger-jsdoc


Estrutura do Projeto
src/config/database.js:
Configuração e conexão com o banco de dados MongoDB usando o driver nativo do MongoDB.

src/routes/
Contém as rotas da API que lidam com as solicitações HTTP, associando as ações aos controladores.

fazendaRoutes.js: Rota para cadastro e consulta de fazendas.
producaoRoutes.js: Rota para registro e consulta da produção diária de leite.
precoRoutes.js: Rota para consultar o preço do litro de leite mensal e anual.
authRoutes.js: Rota para autenticação de usuários (login e registro).
src/controllers/
Contém a lógica de controle das rotas, onde a manipulação das requisições e respostas é gerenciada.

fazendaController.js: Controla a criação de fazendeiros e fazendas, além de consultas de volume e produção.
producaoController.js: Controla o registro e consulta de produções de leite diárias.
precoController.js: Controla a lógica para cálculo do preço do leite.
authController.js: Controla o registro e autenticação de usuários.
src/models/
Contém os modelos de dados que definem como os dados são armazenados e recuperados do banco de dados.

fazendaModel.js: Modelo para manipular os dados relacionados às fazendas.
producaoModel.js: Modelo para manipular os dados de produção de leite.
userModel.js: Modelo para manipular os dados de usuários, incluindo registro e autenticação.
src/services/
Contém as regras de negócios e a lógica principal de cálculo.

precoLeiteService.js: Serviço que realiza o cálculo do preço do leite conforme as regras de distância, volume e bônus.
src/tests/
Contém os testes unitários para verificar a funcionalidade das rotas, controladores e serviços.

fazendaController.test.js: Testa as funcionalidades relacionadas às fazendas.
producaoController.test.js: Testa as funcionalidades relacionadas à produção diária de leite.
precoLeiteService.test.js: Testa a lógica de cálculo de preço do leite.
authController.test.js: Testa o registro e autenticação de usuários.
Essa estrutura foi organizada para garantir baixa acoplagem, alta coesão e separação clara de responsabilidades, facilitando a manutenibilidade, escalabilidade e testes unitários.




Clone o Repositório

bash => git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
Instale as Dependências

bash => npm install
Configure as Variáveis de Ambiente

Crie um arquivo .env na raiz do projeto e adicione as seguintes variáveis:


MONGO_URI=mongodb://localhost:27017/bovcontrol (ou use o mongo Atlas)
PORT=5000
Inicie o Servidor

bash => npm start
O servidor estará disponível em http://localhost:3000.

Rodar os Testes
Para garantir que tudo está funcionando corretamente, você pode rodar os testes:
bash => npm test



Funcionalidades Implementadas
Funcionalidades Implementadas
Cadastro de Fazendeiro e Fazenda

Rota: POST /api/fazendeiros
Descrição: Cadastra um novo fazendeiro e sua fazenda, incluindo informações como nome, localização e distância até a fábrica.
Código: src/routes/fazendaRoutes.js
Cadastro da Produção de Leite Diário

Rota: POST /api/producoes
Descrição: Registra a produção diária de leite em litros para uma fazenda específica.
Código: src/routes/producaoRoutes.js
Consulta do Volume de Leite Entregue

Rota: GET /api/producoes/:fazenda_id/:mes
Descrição: Consulta o volume total de leite entregue por dia e a média mensal para uma fazenda e mês específicos.
Código: src/routes/producaoRoutes.js
Consulta do Preço do Litro de Leite

Rota: GET /api/precos/:fazenda_id/:ano/:mes
Descrição: Consulta o preço do litro de leite pago a um fazendeiro para um mês específico, com exibição nos formatos numérico brasileiro e inglês.
Código: src/routes/precoRoutes.js
Consulta do Preço do Litro de Leite para Cada Mês do Ano

Rota: GET /api/preco-anual/:fazenda_id/:ano
Descrição: Consulta o preço do litro de leite para cada mês do ano, dado uma fazenda e ano como parâmetros, com exibição nos formatos numérico brasileiro e inglês.
Código: src/routes/precoRoutes.js

Essas rotas seguem as regras de negócios para cálculo do preço com base no volume de produção, distância até a fábrica e bônus para grandes volumes de leite, conforme definido no cenário do desafio.

Conclusão
Este README fornece uma visão geral de como o desafio foi implementado, as tecnologias e bibliotecas utilizadas, e as instruções para iniciar o projeto. Se tiver dúvidas ou precisar de mais detalhes, sinta-se à vontade para entrar em contato.