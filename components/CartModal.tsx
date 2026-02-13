import React from 'react';
import { useCart } from '../contexts/CartContext';

interface CartModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
    const { cart, removeFromCart, updateQuantity, getCartTotal, getCartCount, clearCart } = useCart();

    if (!isOpen) return null;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center sm:justify-end bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-t-2xl sm:rounded-l-2xl sm:rounded-r-none w-full sm:w-[450px] h-[90vh] sm:h-full shadow-2xl flex flex-col animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <span className="material-icons text-primary">shopping_cart</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Mi Carrito</h2>
                            <p className="text-xs text-slate-600">{getCartCount()} {getCartCount() === 1 ? 'producto' : 'productos'}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
                    >
                        <span className="material-icons text-slate-600">close</span>
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <span className="material-icons text-slate-400 text-5xl">shopping_cart</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Tu carrito está vacío</h3>
                            <p className="text-sm text-slate-600 mb-6">Agrega productos para comenzar tu compra</p>
                            <button
                                onClick={onClose}
                                className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-all"
                            >
                                Explorar Productos
                            </button>
                        </div>
                    ) : (
                        <>
                            {cart.map((item) => (
                                <div key={item.id} className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-primary/30 transition-all">
                                    <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-slate-200">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-sm text-slate-900 mb-1 line-clamp-2">{item.name}</h4>
                                        <p className="text-xs text-slate-600 mb-2">{item.category}</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold text-primary">{formatPrice(item.price)}</span>
                                            {item.originalPrice && (
                                                <span className="text-xs text-slate-500 line-through">{formatPrice(item.originalPrice)}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end justify-between">
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors group"
                                        >
                                            <span className="material-icons text-sm text-slate-400 group-hover:text-red-500">delete</span>
                                        </button>
                                        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 transition-colors"
                                            >
                                                <span className="material-icons text-sm text-slate-600">remove</span>
                                            </button>
                                            <span className="text-sm font-bold text-slate-900 w-8 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 transition-colors"
                                            >
                                                <span className="material-icons text-sm text-slate-600">add</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {cart.length > 0 && (
                                <button
                                    onClick={clearCart}
                                    className="w-full text-sm text-red-500 hover:text-red-600 font-semibold py-2 transition-colors"
                                >
                                    Vaciar Carrito
                                </button>
                            )}
                        </>
                    )}
                </div>

                {/* Footer - Total & Checkout */}
                {cart.length > 0 && (
                    <div className="border-t border-slate-200 p-6 space-y-4 bg-slate-50">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-600">Subtotal</span>
                                <span className="font-semibold text-slate-900">{formatPrice(getCartTotal())}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-600">Envío</span>
                                <span className="font-semibold text-green-600">GRATIS</span>
                            </div>
                            <div className="h-px bg-slate-200 my-2"></div>
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-slate-900">Total</span>
                                <span className="text-2xl font-bold text-primary">{formatPrice(getCartTotal())}</span>
                            </div>
                        </div>
                        <button className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/30 active:scale-95 flex items-center justify-center gap-2">
                            <span className="material-icons">shopping_bag</span>
                            Finalizar Compra
                        </button>
                        <p className="text-xs text-center text-slate-600">
                            🔒 Pago seguro • Envío gratis en compras mayores a $50,000
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartModal;
