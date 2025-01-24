interface WarrantyInfo {
  month: number;
  day: number;
  percentage: number;
}

export const calculateWarrantyLeft = (purchaseDate: Date): WarrantyInfo => {
  const now = new Date();
  const warrantyEnd = new Date(purchaseDate);
  warrantyEnd.setFullYear(warrantyEnd.getFullYear() + 1); // 1 year warranty

  const diffTime = warrantyEnd.getTime() - now.getTime();
  const totalWarrantyTime = warrantyEnd.getTime() - purchaseDate.getTime();
  
  // Calculate months and days left
  const daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const monthsLeft = Math.floor(daysLeft / 30);
  const remainingDays = daysLeft % 30;
  
  // Calculate percentage left
  const percentageLeft = Math.max(0, Math.min(100, Math.round((diffTime / totalWarrantyTime) * 100)));

  return {
    month: monthsLeft,
    day: remainingDays,
    percentage: percentageLeft
  };
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
}; 