import React, { useState } from 'react';
import { trpc } from '@/connectors/Trpc';

const SyncWalletPage = () => {
  const [chainName, setChainName] = useState('');
  const [walletAddr, setWalletAddr] = useState('');
  const { mutate } = trpc.txs.syncWalletTxs.useMutation();
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const data = mutate({
      chainName,
      walletAddr
    });
    // Handle form submission logic here
    // console.log('Input 1:', chainName);
    console.log('data', data);
    // console.log('Input 2:', walletAddr);
  };

  return (
    <div>
      <h1>Sync Wallet Page</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="chain-id">Chain-Id:</label>
          <input
            type="text"
            id="chainName"
            value={chainName}
            onChange={e => setChainName(e.target.value)}
            style={{ margin: '20px', width: '50%' }}
          />
        </div>
        <div>
          <label htmlFor="wallet-adrr">Wallet-Adrr:</label>
          <input
            type="text"
            id="walletAddr"
            value={walletAddr}
            onChange={e => setWalletAddr(e.target.value)}
            style={{ margin: '20px', width: '50%' }}
          />
        </div>
        <button
          type="submit"
          style={{ margin: '20px', width: '50%', backgroundColor: 'white' }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default SyncWalletPage;
