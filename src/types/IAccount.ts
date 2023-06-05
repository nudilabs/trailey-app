import { Address } from 'viem';

export interface IAccount {
  address: Address;
  ensName: string;
  avatarUrl: string | null;
}
