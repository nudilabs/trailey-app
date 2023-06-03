type TxSum = {
  allTime: number;
  lastWeek: number;
  percentChange: number;
};

export type TxSummary = {
  // address?: string;
  txCount: TxSum;
  contractCount: TxSum;
  valueSum: TxSum;
  valueQuoteSum: TxSum;
  gasSum: TxSum;
  gasQuoteSum: TxSum;
};

export type TxSummaryByContract = {
  contracts: {
    address: string;
    txCount: TxSum;
    valueQuoteSum: TxSum;
    gasQuoteSum: TxSum;
    lastTx: string | null;
  }[];
};

export type TxSummaryByMonth = {
  txsByMonth: {
    date: string;
    txCount: number;
    contractCount: number;
    valueQuoteSum: number;
    gasQuoteSum: number;
  }[];
};
