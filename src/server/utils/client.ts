import { rpcMapper } from './chains';

export const getTxCount = async (chainName: string, walletAddr: string) => {
  const url = rpcMapper[chainName];
  const body = {
    jsonrpc: '2.0',
    method: 'eth_getTransactionCount',
    params: [walletAddr, 'latest'],
    id: 1
  };
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' }
  });
  const data = await res?.json();
  const txCount = parseInt(data.result, 16);
  return txCount;
};
