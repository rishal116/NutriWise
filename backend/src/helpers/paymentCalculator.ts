export const calculateCommission = (totalAmount: number) => {
  const ADMIN_PERCENT = 20;

  const adminAmount = Math.round((totalAmount * ADMIN_PERCENT) / 100);
  const nutritionistAmount = totalAmount - adminAmount;

  return { adminAmount, nutritionistAmount };
};