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
  erc20ValueQuoteSum: TxSum;
};

export type TxSummaryByContract = {
  contracts: {
    address: string | null;
    txCount: number;
    valueQuoteSum: number;
    erc20ValueQuoteSum: number;
    gasQuoteSum: number;
    lastTx: string;
  }[];
};

export type TxSummaryByMonth = {
  txsByMonth: {
    date: string;
    txCount: number;
    contractCount: number;
    valueQuoteSum: number;
    erc20ValueQuoteSum: number;
    gasQuoteSum: number;
  }[];
};
