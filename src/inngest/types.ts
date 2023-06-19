type GetWalletInfo = {
  data: {
    walletAddr: string;
    chainName: string;
  };
};

export type Events = {
  'store/erc20-tx': GetWalletInfo;
};
