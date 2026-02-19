
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    type DocumentData
} from 'firebase/firestore';
import { db, storage } from '../firebase/config';
import { Product, StockStatus } from '../types';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const COLLECTION_NAME = 'products';

// Helper to convert Firestore doc to Product
const docToProduct = (doc: DocumentData): Product => {
    const data = doc.data();
    return {
        id: doc.id,
        name: data.name,
        sku: data.sku,
        category: data.category,
        totalStock: data.totalStock,
        price: data.price,
        imageUrl: data.imageUrl,
        description: data.description,
        locations: data.locations || ['Central'],
        status: data.status as StockStatus,
        // Add any other fields if necessary
    } as Product;
};

export const fetchProducts = async (): Promise<Product[]> => {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(docToProduct);
};

export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), product);
    return { ...product, id: docRef.id };
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<void> => {
    const docRef = doc(db, COLLECTION_NAME, id);
    // Remove id from updates to avoid overwriting it in the doc data (though Firestore handles this fine usually, it's cleaner)
    const { id: _, ...data } = updates as any;
    await updateDoc(docRef, data);
};

export const deleteProduct = async (id: string): Promise<void> => {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
};

export const uploadProductImage = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
};

export const seedDatabase = async (): Promise<Product[]> => {
    try {
        const response = await fetch('https://dummyjson.com/products/category/smartphones');
        const data = await response.json();
        const laptopsResponse = await fetch('https://dummyjson.com/products/category/laptops');
        const laptopsData = await laptopsResponse.json();

        const products = [...data.products, ...laptopsData.products].slice(0, 20); // Limit to 20 items

        const mappedProducts = products.map((p: any) => ({
            name: p.title,
            sku: `IMP-${p.id}-${Math.floor(Math.random() * 1000)}`,
            category: p.category === 'smartphones' ? 'Smartphones' : 'Laptops',
            totalStock: p.stock,
            price: p.price * 1000, // Convert to pseudo-local currency scaling
            imageUrl: p.thumbnail,
            description: p.description,
            status: p.stock < 5 ? StockStatus.LOW_STOCK : StockStatus.IN_STOCK,
            locations: ['Central']
        }));

        const addedProducts = [];
        for (const p of mappedProducts) {
            const newP = await createProduct(p);
            addedProducts.push(newP);
        }
        return addedProducts;
    } catch (error) {
        console.error("Error seeding database:", error);
        throw error;
    }
};
