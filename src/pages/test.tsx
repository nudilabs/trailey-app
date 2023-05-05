import { trpc } from '@/utils/trpc';

const addresses = [
  {
    chainName: 'eth-mainnet',
    walletAddr: '0xae2Fc483527B8EF99EB5D9B44875F005ba1FaE13',
    timeSpan: 65
  },
  {
    chainName: 'eth-mainnet',
    walletAddr: '0xae2Fc483527B8EF99EB5D9B44875F005ba1FaE13',
    timeSpan: 60
  }
];

const Test = () => {
  // const { data, isLoading, isFetching, error, isError } =
  //   trpc.getTxCountByChainAndTimeSpan.useQuery({
  //     chainName: 'eth-mainnet',
  //     walletAddr: '0xae2Fc483527B8EF99EB5D9B44875F005ba1FaE13',
  //     timeSpan: 65
  //   });
  const txQueries = trpc.useQueries(t =>
    addresses.map(addr =>
      t.getTxSummaryByChainAndTimeSpan({
        chainName: addr.chainName,
        walletAddr: addr.walletAddr,
        timeSpan: addr.timeSpan
      })
    )
  );

  if (txQueries.some(query => query.isLoading)) {
    return <p>Loading...</p>;
  }

  if (txQueries.some(query => query.isError)) {
    return <p>Error</p>;
  }

  return (
    <div>
      {txQueries.map((query, i) => (
        <p key={i}>
          {addresses[i].chainName} {addresses[i].walletAddr}{' '}
          {addresses[i].timeSpan} {query.data?.message}
        </p>
      ))}
    </div>
  );
};
export default Test;
