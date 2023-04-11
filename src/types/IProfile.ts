export interface IProfile {
  name: string;
  wallets: Wallet[];
}

export interface Wallet {
  address: string;
}
