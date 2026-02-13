import React, { useEffect, useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useFavorites } from './contexts/FavoritesContext';
import LoginModal from './components/LoginModal';

const Ecommerce: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { favorites, addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const products = [
    { id: '1', img: 'photo-1571175443880-49e1d25b2bc5', category: 'HELADERAS', name: 'Heladera No Frost 350L Inverter', price: '$249,999', oldPrice: '$329,999', badge: 'NUEVO', badgeColor: 'bg-green-500', categoryColor: 'text-primary', rating: 4 },
    { id: '2', img: 'photo-1626806787461-102c1bfaaea1', category: 'LAVARROPAS', name: 'Lavarropas Carga Superior 7kg', price: '$159,999', oldPrice: '$209,999', badge: '-25%', badgeColor: 'bg-red-500', categoryColor: 'text-blue-400', rating: 5 },
    { id: '3', img: 'photo-1585659722983-3a675dabf23d', category: 'HORNOS', name: 'Horno Eléctrico Empotrable 60cm', price: '$179,999', oldPrice: null, badge: null, badgeColor: '', categoryColor: 'text-purple-400', rating: 4 },
    { id: '4', img: 'photo-1574269909862-7e1d70bb8078', category: 'MICROONDAS', name: 'Microondas Digital 28L Grill', price: '$89,999', oldPrice: '$119,999', badge: 'OFERTA', badgeColor: 'bg-amber-500', categoryColor: 'text-amber-400', rating: 5 },
    { id: '5', img: 'photo-1588854337221-4cf9fa96059c', category: 'AIRE ACONDICIONADO', name: 'Aire Split Frío/Calor 3500W', price: '$329,999', oldPrice: null, badge: null, badgeColor: '', categoryColor: 'text-cyan-400', rating: 4 },
    { id: '6', img: 'photo-1556911220-bff31c812dba', category: 'LAVAVAJILLAS', name: 'Lavavajillas 12 Cubiertos A++', price: '$279,999', oldPrice: '$399,999', badge: '-30%', badgeColor: 'bg-red-500', categoryColor: 'text-pink-400', rating: 5 },
    { id: '7', img: 'photo-1595515106969-1ce29566ff1c', category: 'COCINAS', name: 'Cocina a Gas 4 Hornallas Vidrio', price: '$199,999', oldPrice: null, badge: null, badgeColor: '', categoryColor: 'text-emerald-400', rating: 4 },
    { id: '8', img: 'photo-1558618666-fcd25c85cd64', category: 'FREEZERS', name: 'Freezer Vertical 250L A+ Inverter', price: '$219,999', oldPrice: null, badge: 'ECO', badgeColor: 'bg-green-500', categoryColor: 'text-primary', rating: 5 },
  ];

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
    } else {
      addToFavorites(productId);
    }
  };

  const handleLoginClick = () => {
    if (isAuthenticated) {
      setShowUserMenu(!showUserMenu);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <div className="bg-white text-slate-900 font-display antialiased">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/30">
                <span className="material-icons text-white">bolt</span>
              </div>
              <span className="text-2xl font-bold tracking-tight">
                Electro<span className="gradient-text">Store</span>
              </span>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex items-center gap-3 bg-white/5 border border-primary/20 rounded-xl px-4 py-2.5 flex-1 max-w-md mx-8">
              <span className="material-icons text-slate-400 text-sm">search</span>
              <input
                type="text"
                placeholder="Buscar electrodomésticos..."
                className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-slate-600"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => isAuthenticated ? null : setIsLoginModalOpen(true)}
                className="relative p-2 hover:bg-primary/10 rounded-lg transition-colors"
                title={isAuthenticated ? 'Mis Favoritos' : 'Inicia sesión para ver favoritos'}
              >
                <span className={`material-icons text-slate-700 ${favorites.length > 0 ? 'text-red-500' : ''}`}>
                  {favorites.length > 0 ? 'favorite' : 'favorite_border'}
                </span>
                {favorites.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              <button className="relative p-2 hover:bg-primary/10 rounded-lg transition-colors">
                <span className="material-icons text-slate-700">shopping_cart</span>
                <span className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">0</span>
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={handleLoginClick}
                  className="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-lg shadow-primary/30 active:scale-95"
                >
                  <span className="material-icons text-sm">person</span>
                  {isAuthenticated ? user?.name?.split(' ')[0] : 'Ingresar'}
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && isAuthenticated && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-primary/20 rounded-xl shadow-2xl shadow-primary/10 overflow-hidden animate-slide-up">
                    <div className="p-3 border-b border-primary/10">
                      <p className="text-sm font-semibold">{user?.name}</p>
                      <p className="text-xs text-slate-400">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-primary/10 transition-colors flex items-center gap-2"
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

      {/* Main Message Banner */}
      <div className="mt-16 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border-b border-primary/20 animate-fade-in">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-center gap-3">
            <span className="material-icons text-primary animate-pulse">local_offer</span>
            <p className="text-sm md:text-base font-semibold">
              <span className="text-primary">¡SUPER OFERTAS!</span> Hasta 50% de descuento en electrodomésticos seleccionados | Envío gratis en compras mayores a $50,000
            </p>
          </div>
        </div>
      </div>

      {/* Hero Section - Ofertas Destacadas */}
      <section className="hero-gradient py-20 px-6 relative overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12 animate-slide-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
              Ofertas Especiales en
              <span className="gradient-text block mt-2">Electrodomésticos</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Descubre las mejores ofertas en electrodomésticos de alta calidad para tu hogar
            </p>
          </div>

          {/* Hero Offers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {/* Offer Cards */}
            {[
              { name: 'Heladera Side by Side', desc: 'Capacidad 500L, Inverter, No Frost', price: '$299,999', oldPrice: '$549,999', discount: '-45%', img: 'photo-1571175443880-49e1d25b2bc5', color: 'primary' },
              { name: 'Lavarropas Automático', desc: 'Carga frontal 8kg, 1400 RPM', price: '$189,999', oldPrice: '$289,999', discount: '-35%', img: 'photo-1626806787461-102c1bfaaea1', color: 'blue-500' },
              { name: 'Horno Eléctrico Smart', desc: 'Multifunción, Convección, 70L', price: '$149,999', oldPrice: '$299,999', discount: '-50%', img: 'photo-1585659722983-3a675dabf23d', color: 'purple-500' },
            ].map((offer, idx) => (
              <div key={idx} className={`group relative bg-gradient-to-br from-${offer.color}/20 to-transparent border border-${offer.color}/30 rounded-2xl p-6 hover:border-${offer.color}/60 transition-all duration-300 overflow-hidden ${idx === 2 ? 'md:col-span-2 lg:col-span-1' : ''}`}>
                <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full offer-badge">
                  {offer.discount}
                </div>
                <div className="relative z-10">
                  <div className="w-full h-48 bg-white/5 rounded-xl mb-4 overflow-hidden">
                    <img src={`https://images.unsplash.com/${offer.img}?w=400&h=300&fit=crop`}
                      alt={offer.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{offer.name}</h3>
                  <p className="text-sm text-slate-400 mb-4">{offer.desc}</p>
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className={`text-3xl font-bold text-${offer.color === 'primary' ? 'primary' : offer.color.replace('500', '400')}`}>{offer.price}</span>
                    <span className="text-lg text-slate-600 line-through">{offer.oldPrice}</span>
                  </div>
                  <button className={`w-full bg-${offer.color} hover:bg-${offer.color}/90 text-white font-semibold py-3 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2`}>
                    <span className="material-icons text-sm">shopping_cart</span>
                    Agregar al Carrito
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Products Section - 4 Columns */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Todos los Productos</h2>
              <p className="text-slate-400">Explora nuestra colección completa de electrodomésticos</p>
            </div>
            <div className="flex items-center gap-3">
              <select className="bg-white/5 border border-primary/20 rounded-lg px-4 py-2 text-sm focus:ring-2 ring-primary/30">
                <option>Más Relevantes</option>
                <option>Menor Precio</option>
                <option>Mayor Precio</option>
                <option>Más Vendidos</option>
              </select>
            </div>
          </div>

          {/* Products Grid - 4 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="product-card bg-white/5 border border-primary/10 rounded-xl overflow-hidden hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10">
                <div className="relative">
                  <img src={`https://images.unsplash.com/${product.img}?w=300&h=300&fit=crop`}
                    alt="Producto"
                    className="w-full h-56 object-cover" />
                  <button
                    onClick={() => handleFavoriteClick(product.id)}
                    className={`absolute top-3 right-3 w-9 h-9 backdrop-blur-sm rounded-full flex items-center justify-center transition-all ${isFavorite(product.id)
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-white/90 hover:bg-primary'
                      }`}
                  >
                    <span className="material-icons text-sm text-white">
                      {isFavorite(product.id) ? 'favorite' : 'favorite_border'}
                    </span>
                  </button>
                  {product.badge && (
                    <span className={`absolute top-3 left-3 ${product.badgeColor} text-white text-xs font-bold px-2 py-1 rounded-md`}>{product.badge}</span>
                  )}
                </div>
                <div className="p-4">
                  <p className={`text-xs ${product.categoryColor} font-semibold mb-1`}>{product.category}</p>
                  <h3 className="font-bold mb-2 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`material-icons text-sm ${i < product.rating ? 'text-yellow-400' : 'text-slate-600'}`}>star</span>
                    ))}
                    <span className="text-xs text-slate-400 ml-1">({Math.floor(Math.random() * 200) + 50})</span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-bold text-primary">{product.price}</span>
                    {product.oldPrice && <span className="text-sm text-slate-600 line-through">{product.oldPrice}</span>}
                  </div>
                  <button className="w-full bg-primary/10 hover:bg-primary text-primary hover:text-white font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2">
                    <span className="material-icons text-sm">add_shopping_cart</span>
                    Agregar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="bg-white/5 hover:bg-white/10 border border-primary/20 hover:border-primary/40 text-white font-semibold px-8 py-3 rounded-lg transition-all inline-flex items-center gap-2">
              Ver Más Productos
              <span className="material-icons text-sm">expand_more</span>
            </button>
          </div>
        </div>
      </section>

      {/* Categories Banner Section */}
      <section className="py-16 px-6 bg-gradient-to-b from-background-dark to-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Explora por Categoría</h2>
            <p className="text-slate-400">Encuentra exactamente lo que necesitas</p>
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
              <div key={idx} className={`group relative bg-gradient-to-br from-${cat.color}/20 to-transparent border border-${cat.color}/30 rounded-2xl p-6 hover:border-${cat.color}/60 transition-all cursor-pointer overflow-hidden`}>
                <div className={`absolute inset-0 bg-${cat.color}/0 group-hover:bg-${cat.color}/10 transition-all`}></div>
                <div className="relative z-10 text-center">
                  <div className={`w-16 h-16 bg-${cat.color}/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <span className={`material-icons text-4xl text-${cat.color === 'primary' ? 'primary' : cat.color.replace('-500', '-400')}`}>{cat.icon}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-1">{cat.name}</h3>
                  <p className="text-sm text-slate-400">{cat.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-primary/10 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/30">
                  <span className="material-icons text-white">bolt</span>
                </div>
                <span className="text-xl font-bold">Electro<span className="gradient-text">Store</span></span>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Tu tienda de confianza para electrodomésticos de calidad. Más de 20 años en el mercado.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-9 h-9 bg-white/5 hover:bg-primary/20 border border-primary/20 rounded-lg flex items-center justify-center transition-all">
                  <span className="material-icons text-sm">facebook</span>
                </a>
                <a href="#" className="w-9 h-9 bg-white/5 hover:bg-primary/20 border border-primary/20 rounded-lg flex items-center justify-center transition-all">
                  <span className="material-icons text-sm">camera_alt</span>
                </a>
                <a href="#" className="w-9 h-9 bg-white/5 hover:bg-primary/20 border border-primary/20 rounded-lg flex items-center justify-center transition-all">
                  <span className="material-icons text-sm">chat</span>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-primary transition-colors">Sobre Nosotros</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Catálogo Completo</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Ofertas Especiales</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Financiación</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Atención al Cliente</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-primary transition-colors">Centro de Ayuda</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Envíos y Entregas</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Devoluciones</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Garantías</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contacto</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Contacto</h4>
              <ul className="space-y-3 text-sm text-slate-400">
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

          <div className="border-t border-primary/10 pt-8 mb-8">
            <h4 className="font-bold mb-4 text-center">Medios de Pago</h4>
            <div className="flex flex-wrap justify-center gap-4">
              {['VISA', 'MASTERCARD', 'AMEX', 'MERCADO PAGO', 'TRANSFERENCIA'].map(method => (
                <div key={method} className="bg-white/5 border border-primary/20 rounded-lg px-4 py-2 text-xs font-semibold">{method}</div>
              ))}
            </div>
          </div>

          <div className="border-t border-primary/10 pt-8 text-center text-sm text-slate-600">
            <p>&copy; 2026 ElectroStore. Todos los derechos reservados. | <a href="#" className="hover:text-primary transition-colors">Términos y Condiciones</a> | <a href="#" className="hover:text-primary transition-colors">Política de Privacidad</a></p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a href="https://wa.me/5491234567890" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/50 transition-all hover:scale-110 z-50">
        <span className="material-icons text-white text-2xl">chat</span>
      </a>

      {/* Scroll to Top Button */}
      <button id="scrollTop" onClick={scrollToTop} className="fixed bottom-6 left-6 w-12 h-12 bg-primary/20 hover:bg-primary border border-primary/30 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110 z-50 opacity-0 pointer-events-none">
        <span className="material-icons text-white">arrow_upward</span>
      </button>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
};

export default Ecommerce;

