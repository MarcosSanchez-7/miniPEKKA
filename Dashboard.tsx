import React, { useState, useEffect, useCallback } from 'react';
import KPICard from './components/KPICard';
import Logo from './components/Logo';
import { Product, StockStatus } from './types';
import { INITIAL_PRODUCTS } from './constants';
import { getInventoryInsights } from './services/geminiService';

import { fetchProducts, createProduct, updateProduct, deleteProduct as deleteProductService, seedDatabase, uploadProductImage } from './services/productService';

const Dashboard: React.FC = () => {
  const [activeView, setActiveView] = useState('inventory');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Sync to local storage
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('dashboard_products', JSON.stringify(products));
    }
  }, [products]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Smartphones',
    stock: 0,
    price: 0,
    imageUrl: 'https://images.unsplash.com/photo-1598327773297-f5bee9eb00a4?auto=format&fit=crop&q=80&w=200', // Default placeholder
    description: ''
  });

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setImageFile(null);
    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category,
      stock: product.totalStock,
      price: product.price || 0,
      imageUrl: product.imageUrl,
      description: product.description
    });
    setShowAddProductModal(true);
  };

  const handleAddClick = () => {
    setEditingProduct(null);
    setImageFile(null);
    setFormData({
      name: '',
      sku: '',
      category: 'Smartphones',
      stock: 0,
      price: 0,
      imageUrl: 'https://images.unsplash.com/photo-1598327773297-f5bee9eb00a4?auto=format&fit=crop&q=80&w=200',
      description: ''
    });
    setShowAddProductModal(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    // Determine status based on stock
    let status = StockStatus.IN_STOCK;
    if (formData.stock === 0) status = StockStatus.OUT_OF_STOCK;
    else if (formData.stock < 10) status = StockStatus.LOW_STOCK;

    try {
      let imageUrl = formData.imageUrl;
      if (imageFile) {
        imageUrl = await uploadProductImage(imageFile);
      }

      const productData = {
        name: formData.name,
        sku: formData.sku,
        category: formData.category,
        totalStock: formData.stock,
        price: formData.price,
        imageUrl: imageUrl,
        description: formData.description,
        status: status,
        locations: ['Central'] // Default or from form if added
      };

      const tempId = editingProduct ? editingProduct.id : `temp-${Date.now()}`;

      // Optimistic update
      setProducts(prev => {
        if (editingProduct) {
          return prev.map(p => p.id === tempId ? { ...productData, id: tempId } : p);
        }
        return [{ ...productData, id: tempId }, ...prev];
      });

      setShowAddProductModal(false);
      setIsUploading(false);

      if (editingProduct) {
        // Update existing in Firebase
        try {
          await updateProduct(editingProduct.id, productData);
        } catch (fbError) {
          console.warn("Firebase update failed, falling back to local update", fbError);
        }
      } else {
        // Create new
        try {
          const newProduct = await createProduct(productData);
          // Update temp ID with real ID in state silently
          setProducts(prev => prev.map(p => p.id === tempId ? newProduct : p));
        } catch (fbError) {
          console.warn("Firebase create failed, falling back to local create", fbError);
        }
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product completely. Check console.");
      setIsUploading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        try {
          await deleteProductService(id);
        } catch (fbError) {
          console.warn("Firebase delete failed, falling back to local delete", fbError);
        }
        setProducts(prev => prev.filter(p => p.id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product.");
      }
    }
  };

  const handleSeedData = async () => {
    if (!window.confirm("Add 20 demo products (Technology)?")) return;
    setIsLoadingProducts(true);
    try {
      const newProducts = await seedDatabase();
      setProducts(prev => [...newProducts, ...prev]);
      alert("✅ Demo data added successfully!");
    } catch (error) {
      console.error(error);
      alert("Error adding demo data");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const fetchAiInsight = useCallback(async () => {
    setIsLoadingInsight(true);
    const insight = await getInventoryInsights(products);
    setAiInsight(insight);
    setIsLoadingInsight(false);
  }, [products]);

  useEffect(() => {
    fetchAiInsight();
  }, [fetchAiInsight]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetchedProducts = await fetchProducts();
        if (fetchedProducts.length > 0) {
          setProducts(fetchedProducts);
        } else {
          setProducts(INITIAL_PRODUCTS); // Fallback or seed initial data
        }
      } catch (error) {
        console.error("Failed to load products from Firebase", error);
        // Fallback to localStorage for offline dev or until configured
        const saved = localStorage.getItem('dashboard_products');
        if (saved) setProducts(JSON.parse(saved));
        else setProducts(INITIAL_PRODUCTS);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    loadProducts();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      fetchAiInsight();
    }, 1500);
  };

  const handleResetFilters = () => {
    setSelectedCategory('All Categories');
    setSelectedLocation('All Locations');
    setSelectedStatus('All Status');
    setSearchTerm('');
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || p.category === selectedCategory;
    const matchesLocation = selectedLocation === 'All Locations' || p.locations.includes(selectedLocation);
    const matchesStatus = selectedStatus === 'All Status' || p.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesLocation && matchesStatus;
  });

  const lowStockCount = products.filter(p => p.status === StockStatus.LOW_STOCK).length;
  const outOfStockCount = products.filter(p => p.status === StockStatus.OUT_OF_STOCK).length;
  const totalValue = products.reduce((sum, p) => sum + (p.totalStock * 1000), 0);

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const renderContent = () => {
    switch (activeView) {
      case 'inventory':
        return (
          <div className="space-y-8">
            {/* Page Title & CTA */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Tech Inventory</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">Monitor and manage stock across Central and North locations.</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSeedData}
                  disabled={isLoadingProducts}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                >
                  <span className="material-icons text-sm">cloud_download</span>
                  Demo Data
                </button>
                <button
                  onClick={handleAddClick}
                  className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg shadow-primary/20 active:scale-95"
                >
                  <span className="material-icons text-sm">add</span>
                  Add Product
                </button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard
                label="Total Products"
                value={products.length.toString()}
                icon="inventory"
                iconBg="bg-blue-100 dark:bg-blue-900/30"
                iconColor="text-primary dark:text-blue-400"
                trend="+4.2%"
                trendColor="text-green-500"
              />
              <KPICard
                label="Low Stock Alerts"
                value={lowStockCount.toString()}
                icon="warning"
                iconBg="bg-amber-100 dark:bg-amber-900/30"
                iconColor="text-amber-500 dark:text-amber-400"
                trend="Check Levels"
                trendColor="text-amber-500"
              />
              <KPICard
                label="Out of Stock"
                value={outOfStockCount.toString()}
                icon="error_outline"
                iconBg="bg-red-100 dark:bg-red-900/30"
                iconColor="text-red-500 dark:text-red-400"
                trend="Urgent"
                trendColor="text-red-500"
              />
              <KPICard
                label="Total Value"
                value={`$${(totalValue / 1000000).toFixed(1)}M`}
                icon="payments"
                iconBg="bg-blue-100 dark:bg-blue-900/30"
                iconColor="text-primary dark:text-blue-400"
              />
            </div>



            {/* Filters */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-4 shadow-sm">
              <FilterSelect
                icon="category"
                label="All Categories"
                options={['Smartphones', 'Laptops', 'Tablets']}
                value={selectedCategory}
                onChange={setSelectedCategory}
              />
              <FilterSelect
                icon="store"
                label="All Locations"
                options={['Central', 'North']}
                value={selectedLocation}
                onChange={setSelectedLocation}
              />
              <FilterSelect
                icon="bolt"
                label="All Status"
                options={[StockStatus.IN_STOCK, StockStatus.LOW_STOCK, StockStatus.OUT_OF_STOCK]}
                value={selectedStatus}
                onChange={setSelectedStatus}
              />
              <div className="flex-1"></div>
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
              >
                <span className="material-icons text-sm">refresh</span>
                Reset Filters
              </button>
            </div>

            {/* Main Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 text-[10px] uppercase tracking-wider">
                      <th className="px-6 py-4 font-bold">Product</th>
                      <th className="px-6 py-4 font-bold">SKU</th>
                      <th className="px-6 py-4 font-bold">Category</th>
                      <th className="px-6 py-4 font-bold text-center">Location</th>
                      <th className="px-6 py-4 font-bold text-center">Total Stock</th>
                      <th className="px-6 py-4 font-bold">Status</th>
                      <th className="px-6 py-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {isLoadingProducts ? (
                      <tr><td colSpan={7} className="text-center py-8 text-slate-500">Loading inventory...</td></tr>
                    ) : (
                      filteredProducts.map(product => (
                        <ProductRow
                          key={product.id}
                          product={product}
                          onEdit={() => handleEditClick(product)}
                          onDelete={() => handleDeleteProduct(product.id)}
                        />
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 bg-slate-50 dark:bg-slate-700/50 flex items-center justify-between border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-600 dark:text-slate-400">Showing <span className="font-bold">1 to {filteredProducts.length}</span> of <span className="font-bold">{products.length}</span> products</p>
                <div className="flex items-center gap-2">
                  <button className="p-2 border border-slate-200 dark:border-slate-600 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50" disabled>
                    <span className="material-icons text-sm dark:text-slate-400">chevron_left</span>
                  </button>
                  <button className="w-8 h-8 rounded bg-primary text-white text-xs font-bold">1</button>
                  <button className="w-8 h-8 rounded border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold transition-colors dark:text-slate-300">2</button>
                  <button className="w-8 h-8 rounded border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold transition-colors dark:text-slate-300">3</button>
                  <span className="text-slate-400 px-1 text-xs">...</span>
                  <button className="w-8 h-8 rounded border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold transition-colors dark:text-slate-300">10</button>
                  <button className="p-2 border border-slate-200 dark:border-slate-600 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <span className="material-icons text-sm dark:text-slate-400">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Secondary Info Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-bold text-slate-900 dark:text-white">ALMACENES</h4>
                  <button className="text-xs text-primary font-bold hover:underline">View All Alerts</button>
                </div>
                <div className="space-y-6">
                  <StockProgress label="Depósito Central" value={18} max={25} color="bg-primary" />
                  <StockProgress label="Sucursal Norte" value={6} max={25} color="bg-amber-500" />

                  <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
                    <h5 className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-3">Productos con falta de stock</h5>
                    <ul className="space-y-3">
                      <li className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">iPhone 15 Pro Max</span>
                        <span className="font-bold text-red-500">Agotado</span>
                      </li>
                      <li className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Samsung S24 Ultra</span>
                        <span className="font-bold text-amber-500">2 unidades</span>
                      </li>
                      <li className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">MacBook Air M2</span>
                        <span className="font-bold text-amber-500">5 unidades</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-sm">
                <div>
                  <h4 className="font-bold mb-2 text-slate-900 dark:text-white">Inventory Sync Status</h4>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="material-icons text-green-500 text-sm">check_circle</span>
                    <span className="text-xs text-slate-600 dark:text-slate-400">All systems operational. Last sync {isRefreshing ? 'just now' : '2m ago'}.</span>
                  </div>
                  <button
                    onClick={handleRefresh}
                    className="text-xs bg-blue-50 dark:bg-blue-900/30 px-5 py-2.5 rounded-lg font-bold hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all active:scale-95 text-primary dark:text-blue-400"
                  >
                    Force Global Refresh
                  </button>
                </div>
                <div className="hidden sm:block">
                  <span className={`material-icons text-blue-200 dark:text-blue-800/50 text-7xl ${isRefreshing ? 'animate-spin' : ''}`}>sync</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'stores':
        return <StoresView />;
      case 'sales_report':
        return <SalesReportView />;
      case 'staff':
        return <StaffView />;
      case 'settings':
        return <SettingsView darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />;
      default:
        return <div>Select a view</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hidden lg:flex flex-col shadow-sm transition-colors duration-300">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <Logo className="h-8" textSize="text-xl" />
          </div>
          <nav className="space-y-1">
            <NavItem
              icon="dashboard"
              label="Inventory"
              active={activeView === 'inventory'}
              onClick={() => setActiveView('inventory')}
            />
            <NavItem
              icon="storefront"
              label="Stores"
              active={activeView === 'stores'}
              onClick={() => setActiveView('stores')}
            />
            <NavItem
              icon="assessment"
              label="Sales Report"
              active={activeView === 'sales_report'}
              onClick={() => setActiveView('sales_report')}
            />
            <NavItem
              icon="group"
              label="Staff"
              active={activeView === 'staff'}
              onClick={() => setActiveView('staff')}
            />
            <NavItem
              icon="settings"
              label="Settings"
              active={activeView === 'settings'}
              onClick={() => setActiveView('settings')}
            />
          </nav>
        </div>

      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <span className="material-icons text-slate-400">search</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-slate-500 text-slate-900 dark:text-white"
              placeholder="Search product name, SKU, or category..."
            />
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              <span className="material-icons">{darkMode ? 'light_mode' : 'dark_mode'}</span>
            </button>
            <button
              onClick={() => {
                localStorage.setItem('dashboard_products', JSON.stringify(products));
                alert("Products saved to Local Storage!");
              }}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-bold transition-colors border border-green-200"
              title="Force save to browser storage"
            >
              <span className="material-icons text-sm">save</span>
              Save Local
            </button>
            <div className="relative cursor-pointer">
              <span className="material-icons text-slate-400 hover:text-primary transition-colors">notifications</span>
              <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-900 dark:text-white">Admin User</p>
                <p className="text-[10px] text-slate-600 dark:text-slate-400">Regional Manager</p>
              </div>
              <img
                alt="Profile"
                className="w-9 h-9 rounded-full border border-blue-200 group-hover:border-primary transition-all"
                src="https://picsum.photos/id/64/100/100"
              />
            </div>
          </div>
        </header>

        <div className="p-8 h-[calc(100vh-4rem)] overflow-y-auto">
          {renderContent()}
        </div>

      </main>

      {/* Add/Edit Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
              >
                <span className="material-icons text-slate-600 dark:text-slate-400">close</span>
              </button>
            </div>
            <form className="space-y-4" onSubmit={handleSaveProduct}>
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-900 dark:text-white">Product Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-3 focus:ring-2 ring-primary/30 focus:border-primary transition-all text-slate-900 dark:text-white"
                  placeholder="e.g., Samsung Galaxy S24"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-900 dark:text-white">SKU</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={e => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-3 focus:ring-2 ring-primary/30 focus:border-primary transition-all text-slate-900 dark:text-white"
                    placeholder="e.g., SMT-S24"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-900 dark:text-white">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-3 focus:ring-2 ring-primary/30 focus:border-primary transition-all text-slate-900 dark:text-white"
                  >
                    <option>Smartphones</option>
                    <option>Laptops</option>
                    <option>Tablets</option>
                    <option>Accessories</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-900 dark:text-white">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-3 focus:ring-2 ring-primary/30 focus:border-primary transition-all text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-900 dark:text-white">Price ($)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-3 focus:ring-2 ring-primary/30 focus:border-primary transition-all text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-900 dark:text-white">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-3 mb-3 text-slate-900 dark:text-white"
                />
                <label className="block text-xs font-semibold mb-1 text-slate-500">Or Image URL</label>
                <input
                  type="url"
                  required={!imageFile}
                  value={formData.imageUrl}
                  onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-3 focus:ring-2 ring-primary/30 focus:border-primary transition-all text-slate-900 dark:text-white"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-900 dark:text-white">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-3 focus:ring-2 ring-primary/30 focus:border-primary transition-all text-slate-900 dark:text-white"
                  rows={2}
                  placeholder="Brief product description"
                />
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-600 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isUploading ? 'Uploading...' : (editingProduct ? 'Save Changes' : 'Add Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- New View Components ---

const StoresView: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Tiendas</h1>
      <p className="text-sm text-slate-600 dark:text-slate-400">Gestión de rendimiento por sucursal</p>
    </div>

    {/* Tienda 1: Showroom */}
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
          <span className="material-icons text-primary dark:text-blue-400 text-3xl">store</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Showroom</h2>
          <p className="text-slate-600 dark:text-slate-400">E. Ayala- Asuncion</p>
        </div>
        <div className="ml-auto">
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold">ABIERTO AHORA</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mb-1 uppercase">Ventas Hoy</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">₲ 12.500.000</h3>
          <p className="text-xs text-green-600 dark:text-green-400 font-bold mt-2 flex items-center gap-1">
            <span className="material-icons text-xs">trending_up</span> +15% vs ayer
          </p>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mb-1 uppercase">Ventas Mensuales</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">₲ 342.100.000</h3>
          <p className="text-xs text-green-600 dark:text-green-400 font-bold mt-2 flex items-center gap-1">
            <span className="material-icons text-xs">trending_up</span> +8% vs mes anterior
          </p>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mb-1 uppercase">Objetivo Mensual</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">85%</h3>
          <div className="w-full bg-slate-200 dark:bg-slate-600 h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-primary h-full w-[85%]"></div>
          </div>
        </div>
      </div>
    </div>

    {/* Tienda 2: Shopping Del Sol */}
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
          <span className="material-icons text-purple-600 dark:text-purple-400 text-3xl">shopping_bag</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Shopping Del Sol</h2>
          <p className="text-slate-600 dark:text-slate-400">Av. del Chaco- Asuncion</p>
        </div>
        <div className="ml-auto">
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold">ABIERTO AHORA</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mb-1 uppercase">Ventas Hoy</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">₲ 18.200.000</h3>
          <p className="text-xs text-green-600 dark:text-green-400 font-bold mt-2 flex items-center gap-1">
            <span className="material-icons text-xs">trending_up</span> +22% vs ayer
          </p>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mb-1 uppercase">Ventas Mensuales</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">₲ 410.500.000</h3>
          <p className="text-xs text-green-600 dark:text-green-400 font-bold mt-2 flex items-center gap-1">
            <span className="material-icons text-xs">trending_up</span> +12% vs mes anterior
          </p>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mb-1 uppercase">Objetivo Mensual</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">92%</h3>
          <div className="w-full bg-slate-200 dark:bg-slate-600 h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-purple-600 h-full w-[92%]"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SalesReportView: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Reporte de Ventas</h1>
      <p className="text-sm text-slate-600 dark:text-slate-400">Transacciones recientes y detalle de productos</p>
    </div>

    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 text-[10px] uppercase tracking-wider">
            <th className="px-6 py-4 font-bold">ID Transacción</th>
            <th className="px-6 py-4 font-bold">Producto</th>
            <th className="px-6 py-4 font-bold">Vendedor</th>
            <th className="px-6 py-4 font-bold text-center">Fecha</th>
            <th className="px-6 py-4 font-bold text-right">Monto</th>
            <th className="px-6 py-4 font-bold text-center">Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {[
            { id: '#TRX-9981', product: 'iPhone 15 Pro Max', seller: 'Carlos', date: 'Hoy, 10:42', amount: '₲ 13.500.000', status: 'Completado' },
            { id: '#TRX-9982', product: 'MacBook Pro 14"', seller: 'Marcos', date: 'Hoy, 11:15', amount: '₲ 18.400.000', status: 'Completado' },
            { id: '#TRX-9983', product: 'iPad Air 5', seller: 'Ivan', date: 'Ayer, 16:30', amount: '₲ 7.200.000', status: 'Pendiente' },
            { id: '#TRX-9984', product: 'Samsung S24 Ultra', seller: 'Daniel', date: 'Ayer, 14:20', amount: '₲ 11.500.000', status: 'Completado' },
            { id: '#TRX-9985', product: 'AirPods Pro 2', seller: 'Oliver', date: 'Ayer, 10:05', amount: '₲ 2.100.000', status: 'Completado' },
            { id: '#TRX-9986', product: 'Sony WH-1000XM5', seller: 'Carlos', date: 'Ayer, 09:15', amount: '₲ 2.800.000', status: 'Completado' },
            { id: '#TRX-9987', product: 'Galaxy Watch 6', seller: 'Marcos', date: '2 Feb, 18:40', amount: '₲ 2.400.000', status: 'Devuelto' },
            { id: '#TRX-9988', product: 'PlayStation 5', seller: 'Ivan', date: '2 Feb, 15:20', amount: '₲ 4.500.000', status: 'Completado' },
            { id: '#TRX-9989', product: 'Nintendo Switch OLED', seller: 'Oliver', date: '1 Feb, 12:10', amount: '₲ 3.200.000', status: 'Completado' },
            { id: '#TRX-9990', product: 'MacBook Air M2', seller: 'Daniel', date: '1 Feb, 10:00', amount: '₲ 11.800.000', status: 'Pendiente' },
            { id: '#TRX-9991', product: 'JBL Charge 5', seller: 'Carlos', date: '31 Ene, 19:30', amount: '₲ 1.200.000', status: 'Completado' },
            { id: '#TRX-9992', product: 'GoPro Hero 12', seller: 'Marcos', date: '31 Ene, 14:45', amount: '₲ 3.900.000', status: 'Completado' },
          ].map((sale, idx) => (
            <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <td className="px-6 py-4 font-mono text-xs font-bold text-slate-600 dark:text-slate-400">{sale.id}</td>
              <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">{sale.product}</td>
              <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-500">
                    {sale.seller.split(' ').map(n => n[0]).join('')}
                  </div>
                  {sale.seller}
                </div>
              </td>
              <td className="px-6 py-4 text-center text-sm text-slate-600 dark:text-slate-400">{sale.date}</td>
              <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white">{sale.amount}</td>
              <td className="px-6 py-4 text-center">
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${sale.status === 'Completado' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                  }`}>
                  {sale.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const StaffView: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Equipo de Ventas</h1>
      <p className="text-sm text-slate-600 dark:text-slate-400">Ranking de mejores vendedores del mes</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { name: 'Carlos', role: 'Vendedor Estrella', sales: '₲ 185M', transactions: 58, color: 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-600', rank: 1, avatar: 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png' },
        { name: 'Marcos', role: 'Vendedor Senior', sales: '₲ 142M', transactions: 45, color: 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800', rank: 2, avatar: 'https://cdn-icons-png.flaticon.com/512/4140/4140047.png' },
        { name: 'Ivan', role: 'Vendedor Senior', sales: '₲ 128M', transactions: 40, color: 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800', rank: 3, avatar: 'https://cdn-icons-png.flaticon.com/512/4140/4140051.png' },
        { name: 'Daniel', role: 'Vendedor Junior', sales: '₲ 85M', transactions: 32, color: 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800', rank: 4, avatar: 'https://cdn-icons-png.flaticon.com/512/4140/4140037.png' },
        { name: 'Oliver', role: 'Vendedor Junior', sales: '₲ 64M', transactions: 25, color: 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800', rank: 5, avatar: 'https://cdn-icons-png.flaticon.com/512/4140/4140040.png' },
      ].map((staff) => (
        <div key={staff.name} className={`relative p-6 rounded-xl border-2 ${staff.color} shadow-sm overflow-hidden flex flex-col items-center text-center transition-colors`}>
          {staff.rank === 1 && (
            <div className="absolute top-0 right-0 bg-yellow-400 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-sm">
              👑 TOP SELLER
            </div>
          )}
          <div className="w-24 h-24 rounded-full p-1 border-2 border-primary/20 mb-4">
            <img src={staff.avatar} alt={staff.name} className="w-full h-full rounded-full object-cover" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{staff.name}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{staff.role}</p>

          <div className="w-full grid grid-cols-2 gap-2 mt-auto">
            <div className="bg-slate-50 dark:bg-slate-700/50 p-2 rounded-lg border border-slate-100 dark:border-slate-600">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Ventas Totales</p>
              <p className="font-bold text-primary dark:text-blue-400">{staff.sales}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/50 p-2 rounded-lg border border-slate-100 dark:border-slate-600">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Transacciones</p>
              <p className="font-bold text-slate-700 dark:text-slate-300">{staff.transactions}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SettingsView: React.FC<{ darkMode: boolean, toggleDarkMode: () => void }> = ({ darkMode, toggleDarkMode }) => {
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (event.target.files && event.target.files[0]) {
      fileReader.readAsText(event.target.files[0], "UTF-8");
      fileReader.onload = e => {
        if (e.target?.result) {
          try {
            const parsed = JSON.parse(e.target.result as string);
            localStorage.setItem('dashboard_products', JSON.stringify(parsed));
            window.location.reload();
          } catch (error) {
            console.error("Error importing JSON", error);
            alert("Invalid JSON file");
          }
        }
      };
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">Manage your preferences and application settings</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700 shadow-sm">
        <div className="p-6 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Dark Mode</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Toggle between light and dark themes</p>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${darkMode ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-600'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        <div className="p-6 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Data Management</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Backup and restore your inventory data</p>
          </div>
          <div className="flex gap-3">
            <label className="bg-white border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-2 px-4 rounded-lg cursor-pointer transition-colors shadow-sm text-sm flex items-center gap-2">
              <span className="material-icons text-sm">upload_file</span>
              Import JSON
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
            <button
              onClick={() => {
                const products = JSON.parse(localStorage.getItem('dashboard_products') || '[]');
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
                const downloadAnchorNode = document.createElement('a');
                downloadAnchorNode.setAttribute("href", dataStr);
                downloadAnchorNode.setAttribute("download", "techstore_inventory.json");
                document.body.appendChild(downloadAnchorNode);
                downloadAnchorNode.click();
                downloadAnchorNode.remove();
              }}
              className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-sm flex items-center gap-2 text-sm"
            >
              <span className="material-icons text-sm">download</span>
              Export JSON
            </button>
          </div>
        </div>

        <div className="p-6 flex items-center justify-between opacity-50 cursor-not-allowed">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Receive alerts for low stock and sales</p>
          </div>
          <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 dark:bg-slate-600">
            <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition" />
          </div>
        </div>
      </div>
    </div>
  );
};




// Helper Components
const NavItem: React.FC<{ icon: string, label: string, active?: boolean, onClick?: () => void }> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer text-left ${active ? 'bg-blue-50 dark:bg-blue-900/30 text-primary dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
  >
    <span className="material-icons text-xl">{icon}</span>
    {label}
  </button>
);

const FilterSelect: React.FC<{ icon: string, label: string, options: string[], value: string, onChange: (value: string) => void }> = ({ icon, label, options, value, onChange }) => (
  <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 bg-white dark:bg-slate-800 focus-within:ring-2 ring-primary/20 transition-all">
    <span className="material-icons text-xs text-slate-400">{icon}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-transparent border-none text-sm focus:ring-0 p-0 pr-8 text-slate-700 dark:text-slate-300 dark:bg-slate-800"
    >
      <option>{label}</option>
      {options.map(opt => <option key={opt}>{opt}</option>)}
    </select>
  </div>
);

const ProductRow: React.FC<{ product: Product, onEdit: () => void, onDelete: () => void }> = ({ product, onEdit, onDelete }) => {
  const statusColors = {
    [StockStatus.IN_STOCK]: 'bg-green-100 text-green-700',
    [StockStatus.LOW_STOCK]: 'bg-amber-100 text-amber-700',
    [StockStatus.OUT_OF_STOCK]: 'bg-red-100 text-red-700',
  };

  const statusDot = {
    [StockStatus.IN_STOCK]: 'bg-green-500',
    [StockStatus.LOW_STOCK]: 'bg-amber-500',
    [StockStatus.OUT_OF_STOCK]: 'bg-red-500',
  };

  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-700 overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-600">
            <img alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={product.imageUrl} />
          </div>
          <div>
            <p className="font-bold text-sm text-slate-900 dark:text-white">{product.name}</p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">{product.description}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 font-mono text-[10px] font-bold text-slate-600 dark:text-slate-400">{product.sku}</td>
      <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">{product.category}</td>
      <td className="px-6 py-4 text-center">
        <div className="flex justify-center gap-1.5">
          {product.locations.map(loc => (
            <span key={loc} className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${loc === 'Central' ? 'bg-orange-100 text-primary dark:bg-orange-900/40 dark:text-orange-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'}`}>
              {loc}
            </span>
          ))}
        </div>
      </td>
      <td className="px-6 py-4 text-center font-bold text-sm text-slate-900 dark:text-white">{product.totalStock}</td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${statusColors[product.status]}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusDot[product.status]}`}></span>
          {product.status}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} className="p-1.5 hover:bg-orange-50 rounded-md text-slate-600 hover:text-primary transition-colors"><span className="material-icons text-sm">edit</span></button>
          <button className="p-1.5 hover:bg-orange-50 rounded-md text-slate-600 hover:text-primary transition-colors"><span className="material-icons text-sm">content_copy</span></button>
          <button onClick={onDelete} className="p-1.5 hover:bg-red-50 rounded-md text-slate-600 hover:text-red-500 transition-colors"><span className="material-icons text-sm">delete</span></button>
        </div>
      </td>
    </tr>
  );
};

const StockProgress: React.FC<{ label: string, value: number, max: number, color: string }> = ({ label, value, max, color }) => (
  <div>
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-3">
        <div className={`w-2.5 h-2.5 rounded-full ${color}`}></div>
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      </div>
      <span className="text-sm font-bold text-slate-900 dark:text-white">{value} Items</span>
    </div>
    <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
      <div
        className={`${color} h-full rounded-full transition-all duration-1000 ease-out`}
        style={{ width: `${(value / max) * 100}%` }}
      ></div>
    </div>
  </div>
);



export default Dashboard;
