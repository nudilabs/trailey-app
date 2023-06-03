export interface IBundle {
  name: string;
  wallets: Wallet[];
}

export interface Wallet {
  address: string;
  type: string;
}
