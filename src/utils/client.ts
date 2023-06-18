import { Chain, createPublicClient, http } from 'viem';
import {
  mainnet,
  optimism,
  arbitrum,
  scrollTestnet,
  baseGoerli,
  polygonZkEvm,
  polygon,
  bsc
} from 'viem/chains';

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http()
});

export const customPublicClient = (chainName: string = 'eth-mainnet') => {
  return createPublicClient({
    chain: chainsMapper[chainName],
    transport: http()
  });
};

export const lineaTestnet = {
  id: 59140,
  name: 'Linea Testnet',
  network: 'linea-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH'
  },
  rpcUrls: {
    public: { http: ['https://rpc.goerli.linea.build'] },
    default: { http: ['https://rpc.goerli.linea.build'] }
  },
  blockExplorers: {
    blockscout: {
      name: 'Blockscout',
      url: 'https://explorer.goerli.linea.build/'
    },
    default: { name: 'Blockscout', url: 'https://explorer.goerli.linea.build/' }
  }
} as const satisfies Chain;

export const chainsMapper: {
  [key: string]: Chain;
} = {
  'eth-mainnet': mainnet,
  'matic-mainnet': polygon,
  'bsc-mainnet': bsc,
  'arbitrum-mainnet': arbitrum,
  'optimism-mainnet': optimism,
  'scroll-alpha-testnet': scrollTestnet,
  'base-testnet': baseGoerli,
  'polygon-zkevm-mainnet': polygonZkEvm,
  'linea-testnet': lineaTestnet
};
