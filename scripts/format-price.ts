export function formatCurrency(value: number | string): string {
    // Converte o valor para número caso esteja em formato de string
    const numericValue =
      typeof value === "string"
        ? parseFloat(value.replace(/\./g, "").replace(",", "."))
        : value;
  
    // Verifica se o valor é um número válido
    if (isNaN(numericValue)) {
      return `AOA 0, 00`
    }
  
    // Formata o número para o padrão de moeda
    const formattedValue = numericValue.toLocaleString("pt-PT", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  
    return `AOA ${formattedValue}`;
  }
  