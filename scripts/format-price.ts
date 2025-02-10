export function formatCurrency(value: number | string): string {
  const numericValue =
    typeof value === "string"
      ? parseFloat(value.replace(/\./g, "").replace(",", "."))
      : value;

  if (isNaN(numericValue)) {
    return `AOA 0, 00`
  }

  const formattedValue = numericValue.toLocaleString("pt-PT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `AOA ${formattedValue}`;
}
