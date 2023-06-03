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
import {
  darkTheme,
  getDefaultWallets,
  lightTheme,
  RainbowKitProvider
} from '@rainbow-me/rainbowkit';
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
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import ENV from '@/utils/Env';
// session
import {
  RainbowKitSiweNextAuthProvider,
  GetSiweMessageOptions
} from '@rainbow-me/rainbowkit-siwe-next-auth';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

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
  appName: 'Abtrail Analytics',
  projectId: 'AbtrailAnalytics',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});

const App = ({
  Component,
  pageProps
}: AppProps<{
  session: Session;
}>) => {
  const [currentBundle, setCurrentBundle] = useState(0);
  const [bundlesData, setBundlesData] = useState<IBundle[]>([]);
  const [localChain, setLocalChain] = useState('eth-mainnet'); // default to mainnet
  const profileProps = {
    currentBundle,
    setCurrentBundle,
    bundlesData,
    setBundlesData,
    localChain,
    setLocalChain
  };

  const getSiweMessageOptions: GetSiweMessageOptions = () => ({
    statement: 'Sign in to Abtrail Analytics'
  });

  const [isDarkTheme, setIsDarkTheme] = useState(true); // light mode by default

  useEffect(() => {
    const localStorage = window.localStorage;
    // Get item from local storage
    const profiles = localStorage.getItem('abtrail.bundles');
    if (profiles) setBundlesData(JSON.parse(profiles));
    const currentBundleId = localStorage.getItem('profileId');
    if (currentBundleId) setCurrentBundle(parseInt(currentBundleId));
    const localChain = localStorage.getItem('abtrail.chain');
    if (localChain) setLocalChain(localChain);
  }, []);

  useEffect(() => {
    // rainbowkit colormode
    const rainbowTheme = window.localStorage.getItem('chakra-ui-color-mode');
    const isDark = rainbowTheme === 'dark';
    setIsDarkTheme(isDark);
  }, []);

  return (
    <WagmiConfig client={wagmiClient}>
      <SessionProvider refetchInterval={0} session={pageProps.session}>
        <RainbowKitSiweNextAuthProvider
          getSiweMessageOptions={getSiweMessageOptions}
        >
          <RainbowKitProvider
            chains={chains}
            theme={
              isDarkTheme
                ? darkTheme({
                    accentColor: '#FFA6A6',
                    accentColorForeground: 'black',
                    borderRadius: 'medium',
                    overlayBlur: 'small'
                  })
                : lightTheme({
                    accentColor: '#FF5858',
                    accentColorForeground: 'white',
                    borderRadius: 'medium',
                    overlayBlur: 'small'
                  })
            }
          >
            <ChakraProvider theme={theme}>
              <Layout {...profileProps}>
                <Component {...profileProps} {...pageProps} />
              </Layout>
            </ChakraProvider>
          </RainbowKitProvider>
        </RainbowKitSiweNextAuthProvider>
      </SessionProvider>
    </WagmiConfig>
  );
};
export default trpc.withTRPC(App);
