import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, register } = useAuth();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                const success = await login(email, password);
                if (success) {
                    onClose();
                    setEmail('');
                    setPassword('');
                } else {
                    setError('Email o contraseña incorrectos');
                }
            } else {
                if (!name.trim()) {
                    setError('Por favor ingresa tu nombre');
                    setLoading(false);
                    return;
                }
                const success = await register(name, email, password);
                if (success) {
                    onClose();
                    setName('');
                    setEmail('');
                    setPassword('');
                } else {
                    setError('Este email ya está registrado');
                }
            }
        } catch (err) {
            setError('Ocurrió un error. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setName('');
        setEmail('');
        setPassword('');
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white border border-primary/20 rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl shadow-primary/10 animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">
                        {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center transition-colors"
                    >
                        <span className="material-icons text-slate-400">close</span>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-semibold mb-2">Nombre Completo</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-white/5 border border-primary/20 rounded-lg px-4 py-3 focus:ring-2 ring-primary/30 focus:border-primary/40 transition-all"
                                placeholder="Juan Pérez"
                                required={!isLogin}
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-primary/20 rounded-lg px-4 py-3 focus:ring-2 ring-primary/30 focus:border-primary/40 transition-all"
                            placeholder="tu@email.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-primary/20 rounded-lg px-4 py-3 focus:ring-2 ring-primary/30 focus:border-primary/40 transition-all"
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg transition-all shadow-lg shadow-primary/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <span className="material-icons text-sm animate-spin">refresh</span>
                                Procesando...
                            </>
                        ) : (
                            <>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</>
                        )}
                    </button>
                </form>

                {/* Toggle Mode */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-slate-400">
                        {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                        <button
                            onClick={toggleMode}
                            className="ml-2 text-primary font-semibold hover:underline"
                        >
                            {isLogin ? 'Regístrate' : 'Inicia Sesión'}
                        </button>
                    </p>
                </div>

                {/* Demo Info */}
                <div className="mt-6 bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <p className="text-xs text-slate-400 text-center">
                        💡 <span className="font-semibold">Tip:</span> Crea una cuenta para guardar tus favoritos
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;

