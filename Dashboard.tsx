
import React, { useState, useEffect, useCallback } from 'react';
import KPICard from './components/KPICard';
import { Product, StockStatus } from './types';
import { INITIAL_PRODUCTS } from './constants';
import { getInventoryInsights } from './services/geminiService';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);

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

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 dark:border-primary/10 bg-white dark:bg-background-dark hidden lg:flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="material-icons text-white">inventory_2</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">AppliSync</span>
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
          <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Current Plan</p>
            <p className="text-sm font-bold mb-1">Enterprise Plus</p>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-3">
              <div className="bg-primary h-full w-[85%]"></div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">85% Storage Used</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-background-light dark:bg-background-dark">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-200 dark:border-primary/10 bg-white/50 dark:bg-background-dark/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <span className="material-icons text-slate-400">search</span>
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-slate-500 text-slate-100" 
              placeholder="Search product name, SKU, or category..." 
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer">
              <span className="material-icons text-slate-400 hover:text-primary transition-colors">notifications</span>
              <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background-dark"></div>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-primary/10"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold">Admin User</p>
                <p className="text-[10px] text-slate-400">Regional Manager</p>
              </div>
              <img 
                alt="Profile" 
                className="w-9 h-9 rounded-full border border-primary/20 group-hover:border-primary/50 transition-all" 
                src="https://picsum.photos/id/64/100/100" 
              />
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8 overflow-y-auto">
          {/* Page Title & CTA */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Appliance Inventory</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Monitor and manage stock across Central and North locations.</p>
            </div>
            <button className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg shadow-primary/20 active:scale-95">
              <span className="material-icons text-sm">add</span>
              Add Product
            </button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard 
              label="Total Products" 
              value="1,482" 
              icon="inventory" 
              iconBg="bg-primary/10" 
              iconColor="text-primary" 
              trend="+4.2%" 
              trendColor="text-green-500" 
            />
            <KPICard 
              label="Low Stock Alerts" 
              value="24" 
              icon="warning" 
              iconBg="bg-amber-500/10" 
              iconColor="text-amber-500" 
              trend="Check Levels" 
              trendColor="text-amber-500" 
            />
            <KPICard 
              label="Out of Stock" 
              value="12" 
              icon="error_outline" 
              iconBg="bg-red-500/10" 
              iconColor="text-red-500" 
              trend="Urgent" 
              trendColor="text-red-500" 
            />
            <KPICard 
              label="Total Value" 
              value="$2.4M" 
              icon="payments" 
              iconBg="bg-primary/10" 
              iconColor="text-primary" 
            />
          </div>

          {/* AI Insights Bar */}
          <div className="bg-gradient-to-r from-primary/10 to-transparent p-4 rounded-xl border border-primary/20">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-icons text-primary text-sm">auto_awesome</span>
              <span className="text-xs font-bold text-primary uppercase tracking-widest">Gemini Smart Insights</span>
            </div>
            {isLoadingInsight ? (
              <div className="flex items-center gap-2 text-sm text-slate-400 animate-pulse">
                <span className="material-icons text-sm animate-spin">refresh</span>
                Analyzing inventory patterns...
              </div>
            ) : (
              <div className="text-sm text-slate-400 leading-relaxed whitespace-pre-line">
                {aiInsight}
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-primary/5 p-4 rounded-xl border border-slate-200 dark:border-primary/10 flex flex-wrap items-center gap-4">
            <FilterSelect icon="category" label="All Categories" options={['Refrigerators', 'Washing Machines', 'Ovens']} />
            <FilterSelect icon="store" label="All Locations" options={['Central Warehouse', 'North Store']} />
            <FilterSelect icon="bolt" label="All Status" options={['In Stock', 'Low Stock', 'Out of Stock']} />
            <div className="flex-1"></div>
            <button 
              onClick={handleRefresh}
              className={`flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary transition-colors ${isRefreshing ? 'animate-spin' : ''}`}
            >
              <span className="material-icons text-sm">refresh</span>
              Reset Filters
            </button>
          </div>

          {/* Main Table */}
          <div className="bg-white dark:bg-primary/5 rounded-xl border border-slate-200 dark:border-primary/10 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-primary/10 text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">
                    <th className="px-6 py-4 font-bold">Product</th>
                    <th className="px-6 py-4 font-bold">SKU</th>
                    <th className="px-6 py-4 font-bold">Category</th>
                    <th className="px-6 py-4 font-bold text-center">Location</th>
                    <th className="px-6 py-4 font-bold text-center">Total Stock</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-primary/10">
                  {filteredProducts.map(product => (
                    <ProductRow key={product.id} product={product} />
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 bg-slate-50 dark:bg-primary/5 flex items-center justify-between border-t border-slate-200 dark:border-primary/10">
              <p className="text-xs text-slate-500">Showing <span className="font-bold">1 to {filteredProducts.length}</span> of <span className="font-bold">1,482</span> products</p>
              <div className="flex items-center gap-2">
                <button className="p-2 border border-slate-200 dark:border-primary/20 rounded hover:bg-slate-100 dark:hover:bg-primary/10 transition-colors disabled:opacity-50" disabled>
                  <span className="material-icons text-sm">chevron_left</span>
                </button>
                <button className="w-8 h-8 rounded bg-primary text-white text-xs font-bold">1</button>
                <button className="w-8 h-8 rounded border border-slate-200 dark:border-primary/20 hover:bg-slate-100 dark:hover:bg-primary/10 text-xs font-bold transition-colors">2</button>
                <button className="w-8 h-8 rounded border border-slate-200 dark:border-primary/20 hover:bg-slate-100 dark:hover:bg-primary/10 text-xs font-bold transition-colors">3</button>
                <span className="text-slate-400 px-1 text-xs">...</span>
                <button className="w-8 h-8 rounded border border-slate-200 dark:border-primary/20 hover:bg-slate-100 dark:hover:bg-primary/10 text-xs font-bold transition-colors">148</button>
                <button className="p-2 border border-slate-200 dark:border-primary/20 rounded hover:bg-slate-100 dark:hover:bg-primary/10 transition-colors">
                  <span className="material-icons text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Secondary Info Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
            <div className="bg-white dark:bg-primary/5 p-6 rounded-xl border border-slate-200 dark:border-primary/10">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold">Low Stock Distribution</h4>
                <button className="text-xs text-primary font-bold hover:underline">View All Alerts</button>
              </div>
              <div className="space-y-6">
                <StockProgress label="Central Warehouse" value={18} max={25} color="bg-primary" />
                <StockProgress label="North Store" value={6} max={25} color="bg-amber-500" />
              </div>
            </div>
            
            <div className="bg-white dark:bg-primary/5 p-6 rounded-xl border border-slate-200 dark:border-primary/10 flex items-center justify-between">
              <div>
                <h4 className="font-bold mb-2">Inventory Sync Status</h4>
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-icons text-green-500 text-sm">check_circle</span>
                  <span className="text-xs text-slate-400">All systems operational. Last sync {isRefreshing ? 'just now' : '2m ago'}.</span>
                </div>
                <button 
                  onClick={handleRefresh}
                  className="text-xs bg-slate-100 dark:bg-primary/10 px-5 py-2.5 rounded-lg font-bold hover:bg-primary/20 transition-all active:scale-95"
                >
                  Force Global Refresh
                </button>
              </div>
              <div className="hidden sm:block">
                <span className={`material-icons text-primary/20 text-7xl ${isRefreshing ? 'animate-spin' : ''}`}>sync</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Helper Components
const NavItem: React.FC<{ icon: string, label: string, active?: boolean }> = ({ icon, label, active }) => (
  <a className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer ${active ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-primary/5 dark:text-slate-400'}`}>
    <span className="material-icons text-xl">{icon}</span>
    {label}
  </a>
);

const FilterSelect: React.FC<{ icon: string, label: string, options: string[] }> = ({ icon, label, options }) => (
  <div className="flex items-center gap-2 border border-slate-200 dark:border-primary/20 rounded-lg px-3 py-2 bg-white dark:bg-background-dark focus-within:ring-2 ring-primary/20 transition-all">
    <span className="material-icons text-xs text-slate-400">{icon}</span>
    <select className="bg-transparent border-none text-sm focus:ring-0 p-0 pr-8 text-slate-600 dark:text-slate-300">
      <option>{label}</option>
      {options.map(opt => <option key={opt}>{opt}</option>)}
    </select>
  </div>
);

const ProductRow: React.FC<{ product: Product }> = ({ product }) => {
  const statusColors = {
    [StockStatus.IN_STOCK]: 'bg-green-500/10 text-green-500',
    [StockStatus.LOW_STOCK]: 'bg-amber-500/10 text-amber-500',
    [StockStatus.OUT_OF_STOCK]: 'bg-red-500/10 text-red-500',
  };

  const statusDot = {
    [StockStatus.IN_STOCK]: 'bg-green-500',
    [StockStatus.LOW_STOCK]: 'bg-amber-500',
    [StockStatus.OUT_OF_STOCK]: 'bg-red-500',
  };

  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-primary/10 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-primary/20 overflow-hidden flex-shrink-0 border border-slate-200 dark:border-primary/10">
            <img alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={product.imageUrl} />
          </div>
          <div>
            <p className="font-bold text-sm text-slate-900 dark:text-slate-100">{product.name}</p>
            <p className="text-[11px] text-slate-400 leading-tight">{product.description}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 font-mono text-[10px] font-bold text-slate-400">{product.sku}</td>
      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{product.category}</td>
      <td className="px-6 py-4 text-center">
        <div className="flex justify-center gap-1.5">
          {product.locations.map(loc => (
            <span key={loc} className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${loc === 'Central' ? 'bg-primary/10 text-primary' : 'bg-slate-100 dark:bg-white/5 text-slate-400'}`}>
              {loc}
            </span>
          ))}
        </div>
      </td>
      <td className="px-6 py-4 text-center font-bold text-sm">{product.totalStock}</td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${statusColors[product.status]}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusDot[product.status]}`}></span>
          {product.status}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1.5 hover:bg-primary/20 rounded-md text-slate-400 hover:text-primary transition-colors"><span className="material-icons text-sm">edit</span></button>
          <button className="p-1.5 hover:bg-primary/20 rounded-md text-slate-400 hover:text-primary transition-colors"><span className="material-icons text-sm">content_copy</span></button>
          <button className="p-1.5 hover:bg-red-500/20 rounded-md text-slate-400 hover:text-red-500 transition-colors"><span className="material-icons text-sm">delete</span></button>
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
    <div className="w-full bg-slate-100 dark:bg-white/5 h-2.5 rounded-full overflow-hidden">
      <div 
        className={`${color} h-full rounded-full transition-all duration-1000 ease-out`} 
        style={{ width: `${(value / max) * 100}%` }}
      ></div>
    </div>
  </div>
);

export default App;
