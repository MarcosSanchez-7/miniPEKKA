
import { Product, StockStatus } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'CoolStream Pro X',
    description: 'Smart French Door Fridge',
    sku: 'REF-CS-4022',
    category: 'Kitchen',
    locations: ['Central', 'North'],
    totalStock: 142,
    status: StockStatus.IN_STOCK,
    imageUrl: 'https://images.unsplash.com/photo-1571175432291-030467773204?q=80&w=200&h=200&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'EcoWash Turbo 9',
    description: 'Front Load Washing Machine',
    sku: 'WAS-EW-900',
    category: 'Laundry',
    locations: ['Central'],
    totalStock: 8,
    status: StockStatus.LOW_STOCK,
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=200&h=200&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'ChefMaster 2000',
    description: 'Electric Convection Oven',
    sku: 'OVE-CM-2K',
    category: 'Kitchen',
    locations: ['North'],
    totalStock: 0,
    status: StockStatus.OUT_OF_STOCK,
    imageUrl: 'https://images.unsplash.com/photo-1584269603986-b0f7303509e1?q=80&w=200&h=200&auto=format&fit=crop'
  },
  {
    id: '4',
    name: 'SilentPro Dishwash',
    description: 'Built-in Dishwasher',
    sku: 'DSH-SP-77',
    category: 'Kitchen',
    locations: ['Central', 'North'],
    totalStock: 45,
    status: StockStatus.IN_STOCK,
    imageUrl: 'https://images.unsplash.com/photo-1584622781564-1d9876a13d00?q=80&w=200&h=200&auto=format&fit=crop'
  }
];
