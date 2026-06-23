import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ErrorBoundary from '../components/ErrorBoundary';
import { LanguageProvider } from '../../i18n/LanguageContext';
import { CartProvider } from '../../features/cart/CartContext';
import { CartDrawer } from '../../features/cart/CartDrawer';

// Root layout: monta los providers (antes en main.tsx) para que vite-react-ssg
// los tenga en el árbol al prerenderizar cada ruta.
const MainLayout = () => {
  return (
    <LanguageProvider>
      <ErrorBoundary>
        <CartProvider>
          <div className="min-h-screen flex flex-col font-sans">
            <Navbar />
            <main className="flex-grow">
              <Suspense fallback={null}>
                <Outlet />
              </Suspense>
            </main>
            <Footer />
            <CartDrawer />
          </div>
        </CartProvider>
      </ErrorBoundary>
    </LanguageProvider>
  );
};

export default MainLayout;
