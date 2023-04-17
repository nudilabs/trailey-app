import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import Layout from '@/components/Layout';
import theme from '@/styles/theme';
import { useEffect, useState } from 'react';
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

  useEffect(() => {
    const localStorage = window.localStorage;
    // Get item from local storage
    const profiles = localStorage.getItem('profiles');
    if (profiles) setProfilesData(JSON.parse(profiles));
    const currentProfileId = localStorage.getItem('profileId');
    if (currentProfileId) setCurrentProfile(parseInt(currentProfileId));
  }, [currentProfile, setCurrentProfile, setProfilesData]);

  return (
    <ChakraProvider theme={theme}>
      <Layout {...profileProps}>
        <Component {...profileProps} {...pageProps} />
      </Layout>
    </ChakraProvider>
  );
}
