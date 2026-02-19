import { Product, StockStatus } from './types';
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    description: 'Titanium design, A17 Pro chip',
    sku: 'SMT-IPH-15PM',
    category: 'Smartphones',
    locations: ['Central', 'North'],
    totalStock: 142,
    status: StockStatus.IN_STOCK,
    imageUrl: 'https://images.unsplash.com/photo-1696446701796-061030e527d2?q=80&w=200&h=200&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'MacBook Pro 14"',
    description: 'M3 Pro Chip, 1TB SSD',
    sku: 'LAP-MBP-14M3',
    category: 'Laptops',
    locations: ['Central'],
    totalStock: 8,
    status: StockStatus.LOW_STOCK,
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?q=80&w=200&h=200&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'iPad Pro 12.9"',
    description: 'M2 Chip, Liquid Retina XDR',
    sku: 'TAB-IPD-PRO',
    category: 'Tablets',
    locations: ['North'],
    totalStock: 0,
    status: StockStatus.OUT_OF_STOCK,
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=200&h=200&auto=format&fit=crop'
  },
  {
    id: '4',
    name: 'Google Pixel 8 Pro',
    description: 'Google AI, Best Camera',
    sku: 'SMT-PXL-8PRO',
    category: 'Smartphones',
    locations: ['Central', 'North'],
    totalStock: 45,
    status: StockStatus.IN_STOCK,
    imageUrl: 'https://images.unsplash.com/photo-1695503248887-2c526d56d10c?q=80&w=200&h=200&auto=format&fit=crop'
  }
];
