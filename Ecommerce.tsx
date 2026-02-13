import React, { useEffect, useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useFavorites } from './contexts/FavoritesContext';
import { useCart } from './contexts/CartContext';
import LoginModal from './components/LoginModal';
import CartModal from './components/CartModal';
import HeroCarousel from './components/HeroCarousel';
import { PRODUCTS_DATA, ProductData } from './data/products';

const Ecommerce: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { favorites, addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { addToCart, getCartCount } = useCart();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    const scrollTopBtn = document.getElementById('scrollTop');

    const handleScroll = () => {
      if (scrollTopBtn) {
        if (window.pageYOffset > 300) {
          scrollTopBtn.style.opacity = '1';
          scrollTopBtn.style.pointerEvents = 'auto';
        } else {
          scrollTopBtn.style.opacity = '0';
          scrollTopBtn.style.pointerEvents = 'none';
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).style.opacity = '1';
          (entry.target as HTMLElement).style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    document.querySelectorAll('.product-card').forEach(card => {
      (card as HTMLElement).style.opacity = '0';
      (card as HTMLElement).style.transform = 'translateY(20px)';
      (card as HTMLElement).style.transition = 'all 0.6s ease-out';
      observer.observe(card);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFavoriteClick = (productId: string) => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    if (isFavorite(productId)) {
      removeFromFavorites(productId);
      showNotificationToast('Eliminado de favoritos');
    } else {
      addToFavorites(productId);
      showNotificationToast('❤️ Agregado a favoritos');
    }
  };

  const handleAddToCart = (product: ProductData) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.oldPrice || undefined,
      image: `https://images.unsplash.com/${product.img}?w=300&h=300&fit=crop`,
      category: product.category
    });
    showNotificationToast('🛒 Agregado al carrito');
  };

  const showNotificationToast = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleLoginClick = () => {
    if (isAuthenticated) {
      setShowUserMenu(!showUserMenu);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  // Filtrar productos por búsqueda y categoría
  const filteredProducts = PRODUCTS_DATA.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(PRODUCTS_DATA.map(p => p.category)))];

  return (
    <div className="bg-white text-slate-900 font-display antialiased">
      {/* Notification Toast */}
      {showNotification && (
        <div className="fixed top-24 right-6 z-[150] bg-white border-2 border-primary shadow-2xl shadow-primary/20 rounded-xl px-6 py-4 animate-slide-up">
          <p className="font-semibold text-slate-900">{notificationMessage}</p>
        </div>
      )}

      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo - Clickable */}
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/30">
                <span className="material-icons text-white">bolt</span>
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-900">
                Electro<span className="gradient-text">Store</span>
              </span>
            </button>

            {/* Search Bar */}
            <div className="hidden md:flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 flex-1 max-w-md mx-8">
              <span className="material-icons text-slate-400 text-sm">search</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar electrodomésticos..."
                className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-slate-500 text-slate-900"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="hover:bg-slate-200 rounded-full p-1">
                  <span className="material-icons text-sm text-slate-400">close</span>
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => isAuthenticated ? null : setIsLoginModalOpen(true)}
                className="relative p-2 hover:bg-orange-50 rounded-lg transition-colors"
                title={isAuthenticated ? 'Mis Favoritos' : 'Inicia sesión para ver favoritos'}
              >
                <span className={`material-icons ${favorites.length > 0 ? 'text-red-500' : 'text-slate-700'}`}>
                  {favorites.length > 0 ? 'favorite' : 'favorite_border'}
                </span>
                {favorites.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              <button
                onClick={() => setIsCartModalOpen(true)}
                className="relative p-2 hover:bg-orange-50 rounded-lg transition-colors"
              >
                <span className="material-icons text-slate-700">shopping_cart</span>
                {getCartCount() > 0 && (
                  <span className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={handleLoginClick}
                  className="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-lg shadow-primary/30 active:scale-95"
                >
                  <span className="material-icons text-sm">person</span>
                  {isAuthenticated ? user?.name?.split(' ')[0] : 'Ingresar'}
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && isAuthenticated && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-slide-up">
                    <div className="p-3 border-b border-slate-200">
                      <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                      <p className="text-xs text-slate-600">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-orange-50 transition-colors flex items-center gap-2 text-slate-900"
                    >
                      <span className="material-icons text-sm">logout</span>
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Content Container with proper spacing for fixed navbar */}
      <div className="pt-16">
        {/* Main Message Banner */}
        <div className="bg-gradient-to-r from-orange-50 via-orange-100 to-orange-50 border-b border-orange-200 animate-fade-in">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-center gap-3">
              <span className="material-icons text-primary animate-pulse">local_offer</span>
              <p className="text-sm md:text-base font-semibold text-slate-900">
                <span className="text-primary">¡SUPER OFERTAS!</span> Hasta 50% de descuento en electrodomésticos seleccionados | Envío gratis en compras mayores a ₲ 1.700.000
              </p>
            </div>
          </div>
        </div>

        {/* Hero Carousel */}
        <HeroCarousel />
      </div>

      {/* Category Filter */}
      <section className="py-8 px-6 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${selectedCategory === category
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
              >
                {category === 'all' ? 'Todos' : category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Products Section - 4 Columns */}
      <section id="productos" className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2 text-slate-900">
                {searchTerm ? `Resultados para "${searchTerm}"` : 'Todos los Productos'}
              </h2>
              <p className="text-slate-600">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'producto encontrado' : 'productos encontrados'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 ring-primary/30 text-slate-900">
                <option>Más Relevantes</option>
                <option>Menor Precio</option>
                <option>Mayor Precio</option>
                <option>Más Vendidos</option>
              </select>
            </div>
          </div>

          {/* Products Grid - 4 Columns */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="product-card bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all group border border-slate-100">
                  <div className="relative bg-white p-6">
                    <img
                      src={`https://images.unsplash.com/${product.img}?w=400&h=400&fit=crop`}
                      alt={product.name}
                      className="w-full h-56 object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      onClick={() => handleFavoriteClick(product.id)}
                      className={`absolute top-3 right-3 w-10 h-10 backdrop-blur-sm rounded-full flex items-center justify-center transition-all shadow-lg ${isFavorite(product.id)
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-white hover:bg-primary'
                        }`}
                    >
                      <span className={`material-icons text-sm ${isFavorite(product.id) ? 'text-white' : 'text-slate-700 group-hover:text-white'}`}>
                        {isFavorite(product.id) ? 'favorite' : 'favorite_border'}
                      </span>
                    </button>
                    {product.badge && (
                      <span className={`absolute top-3 left-3 ${product.badgeColor} text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg`}>
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-5 bg-slate-50">
                    <p className={`text-xs ${product.categoryColor} font-bold mb-2 uppercase tracking-wide`}>{product.category}</p>
                    <h3 className="font-bold text-base mb-2 line-clamp-2 text-slate-900 min-h-[3rem]">{product.name}</h3>
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`material-icons text-sm ${i < product.rating ? 'text-yellow-400' : 'text-slate-300'}`}>star</span>
                      ))}
                      <span className="text-xs text-slate-600 ml-1">({Math.floor(Math.random() * 200) + 50})</span>
                    </div>
                    <div className="mb-4">
                      {product.oldPriceFormatted && (
                        <span className="text-sm text-slate-500 line-through block mb-1">{product.oldPriceFormatted}</span>
                      )}
                      <span className="text-2xl font-bold text-primary block">{product.priceFormatted}</span>
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95"
                    >
                      <span className="material-icons text-sm">add_shopping_cart</span>
                      Agregar al Carrito
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-icons text-slate-400 text-5xl">search_off</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No se encontraron productos</h3>
              <p className="text-slate-600 mb-6">Intenta con otros términos de búsqueda o categorías</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-all"
              >
                Ver Todos los Productos
              </button>
            </div>
          )}

          {/* Load More Button */}
          {filteredProducts.length > 0 && (
            <div className="text-center mt-12">
              <button className="bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-primary text-slate-900 font-semibold px-8 py-3 rounded-lg transition-all inline-flex items-center gap-2">
                Ver Más Productos
                <span className="material-icons text-sm">expand_more</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Categories Banner Section */}
      <section className="py-16 px-6 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3 text-slate-900">Explora por Categoría</h2>
            <p className="text-slate-600">Encuentra exactamente lo que necesitas</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: 'kitchen', name: 'Heladeras', count: '+150 productos', color: 'primary' },
              { icon: 'local_laundry_service', name: 'Lavarropas', count: '+85 productos', color: 'blue-500' },
              { icon: 'microwave', name: 'Hornos', count: '+62 productos', color: 'purple-500' },
              { icon: 'ac_unit', name: 'Climatización', count: '+95 productos', color: 'amber-500' },
              { icon: 'countertops', name: 'Cocinas', count: '+48 productos', color: 'cyan-500' },
              { icon: 'cleaning_services', name: 'Lavavajillas', count: '+34 productos', color: 'pink-500' },
              { icon: 'blender', name: 'Pequeños', count: '+120 productos', color: 'emerald-500' },
              { icon: 'smart_display', name: 'Smart Home', count: '+76 productos', color: 'indigo-500' },
            ].map((cat, idx) => (
              <div
                key={idx}
                className="group relative bg-white border-2 border-slate-200 hover:border-primary rounded-2xl p-6 transition-all cursor-pointer overflow-hidden hover:shadow-xl"
              >
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform group-hover:bg-primary">
                    <span className="material-icons text-4xl text-primary group-hover:text-white transition-colors">{cat.icon}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-1 text-slate-900">{cat.name}</h3>
                  <p className="text-sm text-slate-600">{cat.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/30">
                  <span className="material-icons text-white">bolt</span>
                </div>
                <span className="text-xl font-bold text-slate-900">Electro<span className="gradient-text">Store</span></span>
              </div>
              <p className="text-sm text-slate-600 mb-4">
                Tu tienda de confianza para electrodomésticos de calidad. Más de 20 años en el mercado.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-9 h-9 bg-white hover:bg-orange-50 border border-slate-200 rounded-lg flex items-center justify-center transition-all">
                  <span className="material-icons text-sm text-slate-700">facebook</span>
                </a>
                <a href="#" className="w-9 h-9 bg-white hover:bg-orange-50 border border-slate-200 rounded-lg flex items-center justify-center transition-all">
                  <span className="material-icons text-sm text-slate-700">camera_alt</span>
                </a>
                <a href="#" className="w-9 h-9 bg-white hover:bg-orange-50 border border-slate-200 rounded-lg flex items-center justify-center transition-all">
                  <span className="material-icons text-sm text-slate-700">chat</span>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-slate-900">Enlaces Rápidos</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-primary transition-colors">Sobre Nosotros</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Catálogo Completo</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Ofertas Especiales</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Financiación</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-slate-900">Atención al Cliente</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-primary transition-colors">Centro de Ayuda</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Envíos y Entregas</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Devoluciones</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Garantías</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contacto</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-slate-900">Contacto</h4>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="material-icons text-primary text-sm mt-0.5">location_on</span>
                  <span>Av. Principal 1234, Buenos Aires, Argentina</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-icons text-primary text-sm">phone</span>
                  <span>0800-555-ELECTRO</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-icons text-primary text-sm">email</span>
                  <span>ventas@electrostore.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-icons text-primary text-sm">schedule</span>
                  <span>Lun-Vie: 9:00-20:00</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-8 mb-8">
            <h4 className="font-bold mb-4 text-center text-slate-900">Medios de Pago</h4>
            <div className="flex flex-wrap justify-center gap-4">
              {['VISA', 'MASTERCARD', 'AMEX', 'MERCADO PAGO', 'TRANSFERENCIA'].map(method => (
                <div key={method} className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-xs font-semibold text-slate-700">{method}</div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-8 text-center text-sm text-slate-600">
            <p>&copy; 2026 ElectroStore. Todos los derechos reservados. | <a href="#" className="hover:text-primary transition-colors">Términos y Condiciones</a> | <a href="#" className="hover:text-primary transition-colors">Política de Privacidad</a></p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a href="https://wa.me/5491234567890" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/50 transition-all hover:scale-110 z-50">
        <span className="material-icons text-white text-2xl">chat</span>
      </a>

      {/* Scroll to Top Button */}
      <button id="scrollTop" onClick={scrollToTop} className="fixed bottom-6 left-6 w-12 h-12 bg-orange-100 hover:bg-primary border-2 border-primary rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110 z-50 opacity-0 pointer-events-none">
        <span className="material-icons text-primary hover:text-white">arrow_upward</span>
      </button>

      {/* Modals */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <CartModal isOpen={isCartModalOpen} onClose={() => setIsCartModalOpen(false)} />
    </div>
  );
};

export default Ecommerce;
