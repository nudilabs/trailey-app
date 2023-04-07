import { useRouter } from 'next/router';
import { Helmet } from 'react-helmet';
import SidebarWithHeader from './SidebarWithHeader';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { pathname } = router;

  const pageTitle =
    pathname === '/'
      ? 'Home'
      : pathname.charAt(1).toUpperCase() + pathname.slice(2);

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        {/* <meta name="description" content="Your page description" /> */}
      </Helmet>
      <SidebarWithHeader>
        <main>{children}</main>
      </SidebarWithHeader>
    </>
  );
}
