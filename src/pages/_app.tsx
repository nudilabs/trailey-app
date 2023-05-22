import '@/styles/globals.css';
import '@fontsource/outfit/400.css';
import '@fontsource/poppins/700.css';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import Layout from '@/components/Layout';
import theme from '@/styles/theme';
import { useEffect, useState } from 'react';
import { IProfile } from '@/types/IProfile';
// Rainbowkit
import '@rainbow-me/rainbowkit/styles.css';
import {
  darkTheme,
  getDefaultWallets,
  lightTheme,
  RainbowKitProvider
} from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { lineaTestnet, mainnet, scrollTestnet } from 'wagmi/chains';
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
import { useRouter } from 'next/router';

const { chains, provider } = configureChains(
  [mainnet, scrollTestnet, lineaTestnet],
  [alchemyProvider({ apiKey: ENV.ALCHEMY_ID }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'Biway Analytics',
  projectId: 'BiwayAnalytics',
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
  const [currentProfile, setCurrentProfile] = useState(0);
  const [profilesData, setProfilesData] = useState<IProfile[]>([]);
  const [localChain, setLocalChain] = useState('scroll-alpha-testnet'); // default to mainnet
  const profileProps = {
    currentProfile,
    setCurrentProfile,
    profilesData,
    setProfilesData,
    localChain,
    setLocalChain
  };

  const getSiweMessageOptions: GetSiweMessageOptions = () => ({
    statement: 'Sign in to Biway Analytics'
  });

  const [isDarkTheme, setIsDarkTheme] = useState(true); // light mode by default

  useEffect(() => {
    const localStorage = window.localStorage;
    // Get item from local storage
    const profiles = localStorage.getItem('biway.profiles');
    if (profiles) setProfilesData(JSON.parse(profiles));
    const currentProfileId = localStorage.getItem('profileId');
    if (currentProfileId) setCurrentProfile(parseInt(currentProfileId));
    const localChain = localStorage.getItem('biway.chain');
    if (localChain) setLocalChain(localChain);

    // rainbowkit colormode
    const rainbowTheme = localStorage.getItem('chakra-ui-color-mode');
    const isDark = rainbowTheme === 'dark';
    if (isDark) setIsDarkTheme(true);
  }, [
    currentProfile,
    setCurrentProfile,
    setProfilesData,
    isDarkTheme,
    localChain,
    setLocalChain
  ]);

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
                    accentColor: '#68D36D',
                    accentColorForeground: 'black',
                    borderRadius: 'medium',
                    overlayBlur: 'small'
                  })
                : lightTheme({
                    accentColor: '#38A146',
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
