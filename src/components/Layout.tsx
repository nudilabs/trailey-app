import SidebarWithHeader from './SidebarWithHeader';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarWithHeader>
      <main>{children}</main>
    </SidebarWithHeader>
  );
}
