export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
};

export const calculateWarrantyLeft = (purchaseDate: Date) => {
  const today = new Date();
  const warrantyEndDate = new Date(purchaseDate);
  warrantyEndDate.setFullYear(warrantyEndDate.getFullYear() + 1);

  const timeLeft = warrantyEndDate.getTime() - today.getTime();
  const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
  const monthsLeft = Math.ceil(daysLeft / 30);

  return {
    month: Math.max(0, monthsLeft),
    day: Math.max(0, daysLeft),
    percentage: Math.max(0, Math.min(100, (daysLeft / 365) * 100))
  };
}; 