import { SWRConfig } from 'swr';
import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import Cookies from 'js-cookie';
import { AuthProvider } from './hooks/useAuth.tsx';
import Footer from './components/Footer/Footer.tsx';
import Loading from './pages/Loading/Loading.tsx';
import Sidebar from './components/Sidebar/Sidebar.tsx';
import { ThemeProvider } from './hooks/useTheme.tsx';
import { Toaster } from '@/components/ui/sonner';
import fetcher from './utils/fetcher/fetcher.ts';
import { AUTH_TOKEN } from './constants/auth.ts';
import { TEMP_JWT_TOKEN_HARDCODED } from './constants/shared.ts';

export default function Root() {
  const authRegex = /\/auth/;
  const currentLocation = useLocation();
  const isAuthPage = authRegex.test(currentLocation.pathname);

  // TODO: Remove Manual setting of cookie afterwards
  Cookies.set(AUTH_TOKEN, TEMP_JWT_TOKEN_HARDCODED);

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <SWRConfig
          value={{
            fetcher,
            shouldRetryOnError: false,
            revalidateOnFocus: false,
          }}
        >
          <main className="box-border min-h-screen">
            <Sidebar />
            <Suspense fallback={<Loading />}>
              <Outlet />
            </Suspense>
            {!isAuthPage && <Footer />}
          </main>
          <Toaster richColors visibleToasts={9} />
        </SWRConfig>
      </AuthProvider>
    </ThemeProvider>
  );
}
