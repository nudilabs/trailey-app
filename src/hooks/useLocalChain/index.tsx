import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const useLocalChain = (
  initialState = 'scroll-alpha-testnet'
): [string, (chain: string) => void] => {
  const router = useRouter();
  const [state, setState] = useState<string>(initialState);

  useEffect(() => {
    const savedChain = localStorage.getItem('biway.localChain');
    if (savedChain) {
      setState(savedChain);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('biway.localChain', state);
  }, [state]);

  useEffect(() => {
    const { chain } = router.query;
    if (typeof chain === 'string') {
      setState(chain || initialState);
    }
  }, [router.query.chain, initialState]);

  const setLocalChain = (chain: string) => {
    console.log('setLocalChain', chain);
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, chain }
      },
      undefined,
      {
        shallow: true
      }
    );
  };

  return [state, setLocalChain];
};

export default useLocalChain;
