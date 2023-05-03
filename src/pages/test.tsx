import { trpc } from '@/utils/trpc';

const Test = () => {
  const tx = trpc.getTxCountByChainAndTimeSpan.useQuery({
    chainName: 'eth-mainnet',
    walletAddr: '0xae2Fc483527B8EF99EB5D9B44875F005ba1FaE13',
    timeSpan: 65
  });
  return (
    <div>
      <p>{tx.data?.message}</p>
    </div>
  );
};
export default Test;
