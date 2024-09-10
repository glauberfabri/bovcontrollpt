const formatResponse = (data, message = 'Operação realizada com sucesso', status = 'success') => {
    return {
      status,
      message,
      data
    };
  };
  
  const formatErrorResponse = (message = 'Erro na operação', errors = [], status = 'error') => {
    return {
      status,
      message,
      errors
    };
  };
  
  module.exports = { formatResponse, formatErrorResponse };
  