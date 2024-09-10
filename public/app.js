// Função auxiliar para exibir mensagens
const showResult = (message) => {
    document.getElementById('result').innerText = message;
  };
  
  // Função para obter o token JWT do localStorage
  const getToken = () => {
    return localStorage.getItem('token');
  };
  
  // Verifica se o token JWT existe no localStorage antes de acessar a página de inserção
  const token = getToken();
  if (!token && window.location.pathname === '/insercao.html') {
    // Redireciona para a página de login se o token não estiver presente
    window.location.href = '/index.html';
  }
  
  // Login
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const farmName = document.getElementById('farmName').value;
    const password = document.getElementById('password').value;
  
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ farmName, password }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        // Armazenar o token JWT no localStorage
        localStorage.setItem('token', result.token);
        // Redirecionar para a página de inserção de dados após login bem-sucedido
        window.location.href = '/insercao.html';
      } else {
        showResult(result.message);
      }
    } catch (error) {
      showResult('Erro ao realizar login: ' + error.message);
    }
  });
  
  // Cadastro de fazendeiro
  document.getElementById('farmer-form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const name = document.getElementById('name').value;
    const farmName = document.getElementById('farmName').value;
    const distance = document.getElementById('distance').value;
  
    const data = { name, farmName, distance };
  
    try {
      const token = getToken();
      const response = await fetch('/api/farmers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Enviar token JWT
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
      showResult('Fazendeiro cadastrado com sucesso! ID: ' + result._id);
    } catch (error) {
      showResult('Erro ao cadastrar fazendeiro: ' + error.message);
    }
  });
  
  // Registro de produção de leite
  document.getElementById('milk-production-form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const farmerId = document.getElementById('farmerId').value;
    const liters = document.getElementById('liters').value;
    const date = document.getElementById('date').value;
  
    const data = { liters, date };
  
    try {
      const token = getToken();
      const response = await fetch(`/api/farmers/${farmerId}/milk-production`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Enviar token JWT
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
      showResult('Produção de leite registrada com sucesso!');
    } catch (error) {
      showResult('Erro ao registrar produção: ' + error.message);
    }
  });
  
  // Consulta de preço do leite
  document.getElementById('milk-price-form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const farmerId = document.getElementById('farmerIdPrice').value;
    const month = document.getElementById('month').value;
  
    try {
      const token = getToken();
      const response = await fetch(`/api/farmers/${farmerId}/milk-price/${month}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Enviar token JWT
        },
      });
  
      const result = await response.json();
      showResult(`Preço do leite (BRL): ${result.pricePerLiter}, Preço (USD): ${result.pricePerLiterUSD}`);
    } catch (error) {
      showResult('Erro ao consultar preço: ' + error.message);
    }
  });
  