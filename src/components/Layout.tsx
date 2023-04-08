import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Progress } from '@chakra-ui/react';
import SidebarWithHeader from './SidebarWithHeader';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { pathname } = router;

  const pageTitle =
    pathname === '/'
      ? 'Home'
      : pathname.charAt(1).toUpperCase() + pathname.slice(2);

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
          colorScheme="pink"
          isIndeterminate
          position="fixed"
          top="0"
          left="0"
          right="0"
        />
      )}
      <SidebarWithHeader>
        <main>{children}</main>
      </SidebarWithHeader>
    </>
  );
}
