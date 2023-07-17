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
import { env } from '@/env.mjs';

import { Analytics } from '@vercel/analytics/react';

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
  appName: 'Dropbook Analytics',
  projectId: 'DropbookAnalytics',
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
  const [localChain, setLocalChain] = useState(env.NEXT_PUBLIC_DEFAULT_CHAIN);
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
    const profiles = localStorage.getItem('dropbook.bundles');
    if (profiles) setBundlesData(JSON.parse(profiles));
    const currentBundleId = localStorage.getItem('profileId');
    if (currentBundleId) setCurrentBundle(parseInt(currentBundleId));
    const localChain = localStorage.getItem('dropbook.chain');
    if (localChain) setLocalChain(localChain);
  }, []);

  return (
    <WagmiConfig client={wagmiClient}>
      <ChakraProvider theme={theme}>
        <Layout {...profileProps}>
          <Component {...profileProps} {...pageProps} />
          <Analytics />
        </Layout>
      </ChakraProvider>
    </WagmiConfig>
  );
};
export default trpc.withTRPC(App);
