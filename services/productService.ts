
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    type DocumentData
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Product, StockStatus } from '../types';

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
