import '@/styles/globals.css';
import '@fontsource/outfit/400.css';
import '@fontsource/poppins/700.css';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import Layout from '@/components/Layout';
import theme from '@/styles/theme';
import { useEffect, useState } from 'react';
import { IBundle } from '@/types/IBundle';
// Rainbowkit
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import {
  mainnet,
  arbitrum,
  optimism,
  bsc,
  polygon,
  goerli,
  lineaTestnet,
  scrollTestnet,
  baseGoerli
} from 'wagmi/chains';

import { publicProvider } from 'wagmi/providers/public';

import { trpc } from '../connectors/Trpc';

const { chains, provider } = configureChains(
  [
    mainnet,
    arbitrum,
    optimism,
    bsc,
    polygon,
    goerli,
    lineaTestnet,
    scrollTestnet,
    baseGoerli
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'Trailey Analytics',
  projectId: 'TraileyAnalytics',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});

const App = ({ Component, pageProps }: AppProps<{}>) => {
  const [currentBundle, setCurrentBundle] = useState(0);
  const [bundlesData, setBundlesData] = useState<IBundle[]>([]);
  const [localChain, setLocalChain] = useState('arbitrum-mainnet'); // default to mainnet
  const profileProps = {
    currentBundle,
    setCurrentBundle,
    bundlesData,
    setBundlesData,
    localChain,
    setLocalChain
  };

  useEffect(() => {
    const localStorage = window.localStorage;
    // Get item from local storage
    const profiles = localStorage.getItem('trailey.bundles');
    if (profiles) setBundlesData(JSON.parse(profiles));
    const currentBundleId = localStorage.getItem('profileId');
    if (currentBundleId) setCurrentBundle(parseInt(currentBundleId));
    const localChain = localStorage.getItem('trailey.chain');
    if (localChain) setLocalChain(localChain);
  }, []);

  return (
    <WagmiConfig client={wagmiClient}>
      <ChakraProvider theme={theme}>
        <Layout {...profileProps}>
          <Component {...profileProps} {...pageProps} />
        </Layout>
      </ChakraProvider>
    </WagmiConfig>
  );
};
export default trpc.withTRPC(App);
