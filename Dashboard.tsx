import React, { useState, useEffect, useCallback } from 'react';
import KPICard from './components/KPICard';
import { Product, StockStatus } from './types';
import { INITIAL_PRODUCTS } from './constants';
import { getInventoryInsights } from './services/geminiService';

const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedStatus, setSelectedStatus] = useState('All Status');

  const fetchAiInsight = useCallback(async () => {
    setIsLoadingInsight(true);
    const insight = await getInventoryInsights(products);
    setAiInsight(insight);
    setIsLoadingInsight(false);
  }, [products]);

  useEffect(() => {
    fetchAiInsight();
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

  return (
    <div className="flex min-h-screen bg-background-light">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white hidden lg:flex flex-col shadow-sm">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="material-icons text-white">bolt</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Electro<span className="text-primary">Store</span></span>
          </div>
          <nav className="space-y-1">
            <NavItem icon="dashboard" label="Inventory" active />
            <NavItem icon="storefront" label="Stores" />
            <NavItem icon="assessment" label="Sales Report" />
            <NavItem icon="group" label="Staff" />
            <NavItem icon="settings" label="Settings" />
          </nav>
        </div>
        <div className="mt-auto p-6">
          <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Current Plan</p>
            <p className="text-sm font-bold text-slate-900 mb-1">Enterprise Plus</p>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-3">
              <div className="bg-primary h-full w-[85%]"></div>
            </div>
            <p className="text-[10px] text-slate-600 mt-2">85% Storage Used</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <span className="material-icons text-slate-400">search</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-slate-500 text-slate-900"
              placeholder="Search product name, SKU, or category..."
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer">
              <span className="material-icons text-slate-400 hover:text-primary transition-colors">notifications</span>
              <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-900">Admin User</p>
                <p className="text-[10px] text-slate-600">Regional Manager</p>
              </div>
              <img
                alt="Profile"
                className="w-9 h-9 rounded-full border border-orange-200 group-hover:border-primary transition-all"
                src="https://picsum.photos/id/64/100/100"
              />
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8 overflow-y-auto">
          {/* Page Title & CTA */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Appliance Inventory</h1>
              <p className="text-sm text-slate-600">Monitor and manage stock across Central and North locations.</p>
            </div>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg shadow-primary/20 active:scale-95"
            >
              <span className="material-icons text-sm">add</span>
              Add Product
            </button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard
              label="Total Products"
              value={products.length.toString()}
              icon="inventory"
              iconBg="bg-orange-100"
              iconColor="text-primary"
              trend="+4.2%"
              trendColor="text-green-500"
            />
            <KPICard
              label="Low Stock Alerts"
              value={lowStockCount.toString()}
              icon="warning"
              iconBg="bg-amber-100"
              iconColor="text-amber-500"
              trend="Check Levels"
              trendColor="text-amber-500"
            />
            <KPICard
              label="Out of Stock"
              value={outOfStockCount.toString()}
              icon="error_outline"
              iconBg="bg-red-100"
              iconColor="text-red-500"
              trend="Urgent"
              trendColor="text-red-500"
            />
            <KPICard
              label="Total Value"
              value={`$${(totalValue / 1000000).toFixed(1)}M`}
              icon="payments"
              iconBg="bg-orange-100"
              iconColor="text-primary"
            />
          </div>

          {/* AI Insights Bar */}
          <div className="bg-gradient-to-r from-orange-50 to-transparent p-4 rounded-xl border border-orange-200">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-icons text-primary text-sm">auto_awesome</span>
              <span className="text-xs font-bold text-primary uppercase tracking-widest">Gemini Smart Insights</span>
            </div>
            {isLoadingInsight ? (
              <div className="flex items-center gap-2 text-sm text-slate-600 animate-pulse">
                <span className="material-icons text-sm animate-spin">refresh</span>
                Analyzing inventory patterns...
              </div>
            ) : (
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {aiInsight || 'Error connecting to AI advisor. Please try again later.'}
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center gap-4 shadow-sm">
            <FilterSelect
              icon="category"
              label="All Categories"
              options={['Refrigerators', 'Washing Machines', 'Ovens']}
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
              className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-primary transition-colors"
            >
              <span className="material-icons text-sm">refresh</span>
              Reset Filters
            </button>
          </div>

          {/* Main Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 text-[10px] uppercase tracking-wider">
                    <th className="px-6 py-4 font-bold">Product</th>
                    <th className="px-6 py-4 font-bold">SKU</th>
                    <th className="px-6 py-4 font-bold">Category</th>
                    <th className="px-6 py-4 font-bold text-center">Location</th>
                    <th className="px-6 py-4 font-bold text-center">Total Stock</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredProducts.map(product => (
                    <ProductRow key={product.id} product={product} />
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 bg-slate-50 flex items-center justify-between border-t border-slate-200">
              <p className="text-xs text-slate-600">Showing <span className="font-bold">1 to {filteredProducts.length}</span> of <span className="font-bold">{products.length}</span> products</p>
              <div className="flex items-center gap-2">
                <button className="p-2 border border-slate-200 rounded hover:bg-slate-100 transition-colors disabled:opacity-50" disabled>
                  <span className="material-icons text-sm">chevron_left</span>
                </button>
                <button className="w-8 h-8 rounded bg-primary text-white text-xs font-bold">1</button>
                <button className="w-8 h-8 rounded border border-slate-200 hover:bg-slate-100 text-xs font-bold transition-colors">2</button>
                <button className="w-8 h-8 rounded border border-slate-200 hover:bg-slate-100 text-xs font-bold transition-colors">3</button>
                <span className="text-slate-400 px-1 text-xs">...</span>
                <button className="w-8 h-8 rounded border border-slate-200 hover:bg-slate-100 text-xs font-bold transition-colors">10</button>
                <button className="p-2 border border-slate-200 rounded hover:bg-slate-100 transition-colors">
                  <span className="material-icons text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Secondary Info Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold text-slate-900">Low Stock Distribution</h4>
                <button className="text-xs text-primary font-bold hover:underline">View All Alerts</button>
              </div>
              <div className="space-y-6">
                <StockProgress label="Central Warehouse" value={18} max={25} color="bg-primary" />
                <StockProgress label="North Store" value={6} max={25} color="bg-amber-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
              <div>
                <h4 className="font-bold mb-2 text-slate-900">Inventory Sync Status</h4>
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-icons text-green-500 text-sm">check_circle</span>
                  <span className="text-xs text-slate-600">All systems operational. Last sync {isRefreshing ? 'just now' : '2m ago'}.</span>
                </div>
                <button
                  onClick={handleRefresh}
                  className="text-xs bg-orange-50 px-5 py-2.5 rounded-lg font-bold hover:bg-orange-100 transition-all active:scale-95 text-primary"
                >
                  Force Global Refresh
                </button>
              </div>
              <div className="hidden sm:block">
                <span className={`material-icons text-orange-200 text-7xl ${isRefreshing ? 'animate-spin' : ''}`}>sync</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Add New Product</h2>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
              >
                <span className="material-icons text-slate-600">close</span>
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-900">Product Name</label>
                <input
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 ring-primary/30 focus:border-primary transition-all"
                  placeholder="e.g., Samsung Refrigerator"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-900">SKU</label>
                <input
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 ring-primary/30 focus:border-primary transition-all"
                  placeholder="e.g., REF-001"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-900">Category</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 ring-primary/30 focus:border-primary transition-all">
                  <option>Refrigerators</option>
                  <option>Washing Machines</option>
                  <option>Ovens</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-900">Initial Stock</label>
                <input
                  type="number"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 ring-primary/30 focus:border-primary transition-all"
                  placeholder="0"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition-all shadow-lg shadow-primary/30 active:scale-95"
              >
                Add Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Components
const NavItem: React.FC<{ icon: string, label: string, active?: boolean }> = ({ icon, label, active }) => (
  <a className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer ${active ? 'bg-orange-50 text-primary' : 'text-slate-600 hover:bg-slate-50'}`}>
    <span className="material-icons text-xl">{icon}</span>
    {label}
  </a>
);

const FilterSelect: React.FC<{ icon: string, label: string, options: string[], value: string, onChange: (value: string) => void }> = ({ icon, label, options, value, onChange }) => (
  <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-white focus-within:ring-2 ring-primary/20 transition-all">
    <span className="material-icons text-xs text-slate-400">{icon}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-transparent border-none text-sm focus:ring-0 p-0 pr-8 text-slate-700"
    >
      <option>{label}</option>
      {options.map(opt => <option key={opt}>{opt}</option>)}
    </select>
  </div>
);

const ProductRow: React.FC<{ product: Product }> = ({ product }) => {
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
    <tr className="hover:bg-slate-50 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
            <img alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={product.imageUrl} />
          </div>
          <div>
            <p className="font-bold text-sm text-slate-900">{product.name}</p>
            <p className="text-[11px] text-slate-600 leading-tight">{product.description}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 font-mono text-[10px] font-bold text-slate-600">{product.sku}</td>
      <td className="px-6 py-4 text-sm text-slate-700">{product.category}</td>
      <td className="px-6 py-4 text-center">
        <div className="flex justify-center gap-1.5">
          {product.locations.map(loc => (
            <span key={loc} className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${loc === 'Central' ? 'bg-orange-100 text-primary' : 'bg-slate-100 text-slate-600'}`}>
              {loc}
            </span>
          ))}
        </div>
      </td>
      <td className="px-6 py-4 text-center font-bold text-sm text-slate-900">{product.totalStock}</td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${statusColors[product.status]}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusDot[product.status]}`}></span>
          {product.status}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1.5 hover:bg-orange-50 rounded-md text-slate-600 hover:text-primary transition-colors"><span className="material-icons text-sm">edit</span></button>
          <button className="p-1.5 hover:bg-orange-50 rounded-md text-slate-600 hover:text-primary transition-colors"><span className="material-icons text-sm">content_copy</span></button>
          <button className="p-1.5 hover:bg-red-50 rounded-md text-slate-600 hover:text-red-500 transition-colors"><span className="material-icons text-sm">delete</span></button>
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
        <span className="text-sm font-medium text-slate-700">{label}</span>
      </div>
      <span className="text-sm font-bold text-slate-900">{value} Items</span>
    </div>
    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
      <div
        className={`${color} h-full rounded-full transition-all duration-1000 ease-out`}
        style={{ width: `${(value / max) * 100}%` }}
      ></div>
    </div>
  </div>
);

export default Dashboard;
