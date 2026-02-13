import React, { createContext, useContext, useState, useEffect } from 'react';

interface FavoritesContextType {
    favorites: string[];
    addToFavorites: (productId: string) => void;
    removeFromFavorites: (productId: string) => void;
    isFavorite: (productId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        // Cargar favoritos desde localStorage
        const storedUser = localStorage.getItem('electrostore_user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            const favKey = `electrostore_favorites_${user.id}`;
            const storedFavorites = localStorage.getItem(favKey);
            if (storedFavorites) {
                setFavorites(JSON.parse(storedFavorites));
            }
        }
    }, []);

    const addToFavorites = (productId: string) => {
        const storedUser = localStorage.getItem('electrostore_user');
        if (!storedUser) return;

        const user = JSON.parse(storedUser);
        const newFavorites = [...favorites, productId];
        setFavorites(newFavorites);

        const favKey = `electrostore_favorites_${user.id}`;
        localStorage.setItem(favKey, JSON.stringify(newFavorites));
    };

    const removeFromFavorites = (productId: string) => {
        const storedUser = localStorage.getItem('electrostore_user');
        if (!storedUser) return;

        const user = JSON.parse(storedUser);
        const newFavorites = favorites.filter(id => id !== productId);
        setFavorites(newFavorites);

        const favKey = `electrostore_favorites_${user.id}`;
        localStorage.setItem(favKey, JSON.stringify(newFavorites));
    };

    const isFavorite = (productId: string) => {
        return favorites.includes(productId);
    };

    return (
        <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};
