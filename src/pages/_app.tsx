import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ChakraProvider, useColorMode } from '@chakra-ui/react';
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
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import ENV from '@/utils/Env';

const { chains, provider } = configureChains(
  [mainnet, polygon, optimism, arbitrum],
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

export default function App({ Component, pageProps }: AppProps) {
  const [currentProfile, setCurrentProfile] = useState(0);
  const [profilesData, setProfilesData] = useState<IProfile[]>([]);
  const profileProps = {
    currentProfile,
    setCurrentProfile,
    profilesData,
    setProfilesData
  };

  const [isDarkTheme, setIsDarkTheme] = useState(false); // light mode by default

  useEffect(() => {
    const localStorage = window.localStorage;
    // Get item from local storage
    const profiles = localStorage.getItem('profiles');
    if (profiles) setProfilesData(JSON.parse(profiles));
    const currentProfileId = localStorage.getItem('profileId');
    if (currentProfileId) setCurrentProfile(parseInt(currentProfileId));

    // rainbowkit colormode
    const rainbowTheme = localStorage.getItem('chakra-ui-color-mode');
    const isDark = rainbowTheme === 'dark';
    if (isDark) setIsDarkTheme(true);
  }, [currentProfile, setCurrentProfile, setProfilesData, isDarkTheme]);

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        theme={
          isDarkTheme
            ? darkTheme({
                accentColor: '#BFFE58',
                accentColorForeground: 'black',
                borderRadius: 'medium',
                overlayBlur: 'small'
              })
            : lightTheme({
                accentColor: '#A3D94B',
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
    </WagmiConfig>
  );
}
