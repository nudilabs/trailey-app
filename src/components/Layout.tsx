import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Progress } from '@chakra-ui/react';
import SidebarWithHeader from './SidebarWithHeader';
import { IProfile } from '@/types/IProfile';

interface LayoutProps {
  currentProfile: number;
  setCurrentProfile: React.Dispatch<React.SetStateAction<number>>;
  profilesData: IProfile[];
  setProfilesData: React.Dispatch<React.SetStateAction<IProfile[]>>;
  children: React.ReactNode;
}

export default function Layout({
  currentProfile,
  setCurrentProfile,
  profilesData,
  setProfilesData,
  children
}: LayoutProps) {
  const router = useRouter();
  const [pathname, setPathname] = useState('/');

  const pageTitle =
    pathname === '/' || pathname === '/account/[address]'
      ? 'Biway'
      : `Biway | ${pathname.charAt(1).toUpperCase() + pathname.slice(2)}`;

  useEffect(() => {
    setPathname(router.pathname);
  }, [router.pathname]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        {/* <meta name="description" content="Your page description" /> */}
      </Helmet>
      {isLoading && (
        <Progress
          size="xs"
          colorScheme="primary"
          isIndeterminate
          position="fixed"
          top="0"
          left="0"
          right="0"
        />
      )}
      <SidebarWithHeader
        currentProfile={currentProfile}
        setCurrentProfile={setCurrentProfile}
        profilesData={profilesData}
        setProfilesData={setProfilesData}
      >
        <main>{children}</main>
      </SidebarWithHeader>
    </>
  );
}
