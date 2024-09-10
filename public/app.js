// Função auxiliar para exibir mensagens
const showResult = (message) => {
  document.getElementById('result').innerText = message;
};

// Função para obter o token JWT do localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Função para remover o token JWT do localStorage e fazer logout
const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/index.html'; // Redireciona para a página de login
};

// Verifica se o token JWT existe no localStorage antes de acessar a página de inserção
const token = getToken();
if (!token && window.location.pathname === '/insercao.html') {
  // Redireciona para a página de login se o token não estiver presente
  window.location.href = '/index.html';
}

// Login
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
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
}

// Cadastro de fazendeiro
const farmerForm = document.getElementById('farmer-form');
if (farmerForm) {
  farmerForm.addEventListener('submit', async (e) => {
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

      if (response.ok) {
        showResult('Fazendeiro cadastrado com sucesso! ID: ' + result._id);
      } else {
        showResult(result.message || 'Erro ao cadastrar fazendeiro');
      }
    } catch (error) {
      showResult('Erro ao cadastrar fazendeiro: ' + error.message);
    }
  });
}

// Registro de produção de leite
const milkProductionForm = document.getElementById('milk-production-form');
if (milkProductionForm) {
  milkProductionForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const farmerId = document.getElementById('farmerId').value; // Verifique se o ID está correto
    const liters = document.getElementById('liters').value;
    const date = document.getElementById('date').value;

    if (!farmerId) {
      showResult('O ID do fazendeiro é obrigatório');
      return;
    }

    const data = { farmerId, liters, date }; // Adiciona farmerId no corpo da requisição

    try {
      const token = getToken();
      const response = await fetch(`/api/farmers/${farmerId}/milk-production`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Enviar token JWT
        },
        body: JSON.stringify(data), // Envia o corpo com o farmerId incluído
      });

      const result = await response.json();

      if (response.ok) {
        showResult('Produção de leite registrada com sucesso!');
      } else {
        showResult(result.message || 'Erro ao registrar produção');
      }
    } catch (error) {
      showResult('Erro ao registrar produção: ' + error.message);
    }
  });

}

// Consulta de preço do leite
const milkPriceForm = document.getElementById('milk-price-form');
if (milkPriceForm) {
  milkPriceForm.addEventListener('submit', async (e) => {
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

      if (response.ok) {
        showResult(`Preço do leite (BRL): ${result.pricePerLiter}, Preço (USD): ${result.pricePerLiterUSD}`);
      } else {
        showResult(result.message || 'Erro ao consultar preço');
      }
    } catch (error) {
      showResult('Erro ao consultar preço: ' + error.message);
    }
  });
}

// Função de logout direto ao clicar
const logoutButtons = document.querySelectorAll('#logout-sidebar, #logout');
logoutButtons.forEach(button => {
  button.addEventListener('click', () => {
    logout();
  });
});
