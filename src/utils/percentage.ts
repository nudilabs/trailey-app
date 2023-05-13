export const getPercentageChangeSinceLastWeek = (
  allTime?: number,
  lastWeek?: number
) => {
  if (allTime === undefined || lastWeek === undefined) {
    return 0;
  }
  const percentageChange = ((allTime - lastWeek) / lastWeek) * 100;
  return Number(percentageChange.toFixed(2));
};
