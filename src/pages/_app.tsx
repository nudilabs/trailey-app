import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import Layout from '@/components/Layout';
import theme from '@/styles/theme';
import { useState } from 'react';
import { IProfile } from '@/types/IProfile';

export default function App({ Component, pageProps }: AppProps) {
  const [currentProfile, setCurrentProfile] = useState(0);
  const [profilesData, setProfilesData] = useState<IProfile[]>([]);
  const profileProps = {
    currentProfile,
    setCurrentProfile,
    profilesData,
    setProfilesData
  };
  return (
    <ChakraProvider theme={theme}>
      <Layout {...profileProps}>
        <Component {...profileProps} {...pageProps} />
      </Layout>
    </ChakraProvider>
  );
}
