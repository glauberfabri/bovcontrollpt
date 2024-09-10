const calculateMilkPrice = (liters, distance, month) => {
    let basePrice, distanceCost, bonus = 0;
    
    // Definir o preço base e o custo por km de acordo com o semestre
    if (month >= 1 && month <= 6) {
      basePrice = 1.80;
      distanceCost = distance <= 50 ? 0.05 : 0.06;
    } else {
      basePrice = 1.95;
      distanceCost = distance <= 50 ? 0.05 : 0.06;
      // Aplicar bônus para produções acima de 10.000 litros
      if (liters > 10000) {
        bonus = 0.01;
      }
    }
  
    // Calcular o preço final por litro
    const pricePerLiter = (basePrice - (distanceCost * distance)) + bonus;
    return pricePerLiter;
  };
  
  const calculateTotalPayment = (liters, pricePerLiter) => {
    return liters * pricePerLiter;
  };
  
  module.exports = {
    calculateMilkPrice,
    calculateTotalPayment
  };
  