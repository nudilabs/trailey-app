type TxSum = {
  allTime: number;
  lastWeek: number;
  percentChange: number;
};

export type TxSummary = {
  txCount: TxSum;
  contractCount: TxSum;
  valueQuoteSum: TxSum;
  gasQuoteSum: TxSum;
};

export type TxSummaryByContract = {
  contracts: {
    address: string;
    txCount: TxSum;
    valueQuoteSum: TxSum;
    gasQuoteSum: TxSum;
  }[];
};
