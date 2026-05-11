export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(value);

export const formatWeight = (grams: number) => `${grams.toFixed(2)} g`;

export const formatDate = (value: string) => new Date(value).toLocaleString("en-IN");
