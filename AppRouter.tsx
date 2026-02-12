import React, { useState } from 'react';
import Dashboard from './Dashboard';
import Ecommerce from './Ecommerce';

const App: React.FC = () => {
    const [currentView, setCurrentView] = useState<'dashboard' | 'ecommerce'>('ecommerce');

    return (
        <div className="min-h-screen">
            {/* View Switcher */}
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] glass-effect border border-primary/20 rounded-full p-1 flex gap-1">
                <button
                    onClick={() => setCurrentView('ecommerce')}
                    className={`px-6 py-2 rounded-full font-semibold text-sm transition-all ${currentView === 'ecommerce'
                            ? 'bg-primary text-white shadow-lg shadow-primary/30'
                            : 'text-slate-400 hover:text-white'
                        }`}
                >
                    🛒 Tienda
                </button>
                <button
                    onClick={() => setCurrentView('dashboard')}
                    className={`px-6 py-2 rounded-full font-semibold text-sm transition-all ${currentView === 'dashboard'
                            ? 'bg-primary text-white shadow-lg shadow-primary/30'
                            : 'text-slate-400 hover:text-white'
                        }`}
                >
                    📊 Dashboard
                </button>
            </div>

            {/* Render Current View */}
            {currentView === 'ecommerce' ? <Ecommerce /> : <Dashboard />}
        </div>
    );
};

export default App;
