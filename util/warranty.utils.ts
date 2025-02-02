interface WarrantyInfo {
  month: number;
  day: number;
  percentage: number;
}

export const calculateWarrantyLeft = (warrantyEndDate: Date, purchaseDate: Date): WarrantyInfo => {
  const now = new Date();

  if (now > warrantyEndDate) {
    return { month: 0, day: 0, percentage: 0 };
  }

  // console.log("warrantyEndDate", warrantyEndDate)
  // console.log("purchaseDate", purchaseDate)
  // calculate the total duration from warranty end date to purchase date in days
  const totalDuration = warrantyEndDate.getTime() - purchaseDate.getTime();
  const totalDays = Math.floor(totalDuration / (1000 * 60 * 60 * 24));
  // console.log("totalDays", totalDays)

  // calculate the remaining days between totalDays from today in days not negative number
  const remainingDays = Math.max(0, totalDays - Math.floor((now.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24)));
  // console.log("remainingDays", remainingDays)

  // calculate the remaining percentage from remaining days and total days
  const remainingPercentage = Math.round((remainingDays / totalDays) * 100);
  // console.log("remainingPercentage", remainingPercentage)

  // if the total days is with month then it will show the month and day else it will show the days
  const remainingMonths = Math.floor(remainingDays / 30);
  const remainingExtraDays = remainingDays % 30;
  // console.log("remainingMonths", remainingMonths)
  // console.log("remainingExtraDays", remainingExtraDays)

  // // calculate the total duration of warranty in remaining in percentage
  // const totalDuration = warrantyEndDate.getTime() - purchaseDate.getTime();
  // console.log("totalDuration", totalDuration)
  // const remainingDuration = warrantyEndDate.getTime() - now.getTime();
  // console.log("remainingDuration", remainingDuration)



  // // Convert milliseconds to days
  // const totalDays = Math.floor(totalDuration / (1000 * 60 * 60 * 24));
  // const remainingDays = Math.floor(remainingDuration / (1000 * 60 * 60 * 24));

  // // Convert remaining days to months and days
  // const remainingMonths = Math.floor(remainingDays / 30); // Approximate month calculation
  // const remainingExtraDays = remainingDays % 30;

  // // Fix the percentage calculation
  // const percentageLeft = Math.max(0, Math.min(100, (remainingDays / totalDays) * 100));
  // console.log("percentageLeft", percentageLeft)
  

  return {
    month: remainingMonths,
    day: remainingExtraDays,
    percentage:remainingPercentage,
  };
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};
