const getEmptyChange = () => ({
  allTime: 0,
  lastWeek: 0,
  percentChange: 0
});

export const getDefaultSummary = () => ({
  txCount: getEmptyChange(),
  contractCount: getEmptyChange(),
  valueSum: getEmptyChange(),
  valueQuoteSum: getEmptyChange(),
  gasSum: getEmptyChange(),
  gasQuoteSum: getEmptyChange()
});

export const calculateChange = (
  allTime: number,
  lastWeek: number,
  lastTwoWeeks: number
) => {
  const percentChange = ((lastWeek - lastTwoWeeks) / lastTwoWeeks) * 100;
  return {
    allTime,
    lastWeek,
    percentChange
  };
};
