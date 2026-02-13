import React, { useState, useEffect } from 'react';
import Dashboard from './Dashboard';
import Ecommerce from './Ecommerce';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { CartProvider } from './contexts/CartContext';

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<'store' | 'admin'>('store');

  useEffect(() => {
    // Detectar la ruta actual
    const path = window.location.pathname;
    if (path === '/admin' || path === '/admin/') {
      setCurrentRoute('admin');
    } else {
      setCurrentRoute('store');
    }

    // Escuchar cambios en la URL
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/admin' || path === '/admin/') {
        setCurrentRoute('admin');
      } else {
        setCurrentRoute('store');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (route: 'store' | 'admin') => {
    if (route === 'admin') {
      window.history.pushState({}, '', '/admin');
      setCurrentRoute('admin');
    } else {
      window.history.pushState({}, '', '/');
      setCurrentRoute('store');
    }
  };

  return (
    <AuthProvider>
      <FavoritesProvider>
        <CartProvider>
          <div className="min-h-screen">
            {/* Render Current View */}
            {currentRoute === 'admin' ? (
              <>
                {/* Admin Navigation Button */}
                <div className="fixed top-4 right-4 z-[100]">
                  <button
                    onClick={() => navigateTo('store')}
                    className="glass-effect border border-orange-200 rounded-full px-6 py-2 font-semibold text-sm transition-all hover:bg-orange-50 flex items-center gap-2"
                  >
                    <span className="material-icons text-sm">storefront</span>
                    Ir a Tienda
                  </button>
                </div>
                <Dashboard />
              </>
            ) : (
              <Ecommerce />
            )}
          </div>
        </CartProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
};

export default App;
