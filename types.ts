
export enum StockStatus {
  IN_STOCK = 'In Stock',
  LOW_STOCK = 'Low Stock',
  OUT_OF_STOCK = 'Out of Stock'
}

export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  category: string;
  locations: string[];
  totalStock: number;
  status: StockStatus;
  imageUrl: string;
}

export interface KPIStats {
  totalProducts: number;
  lowStockAlerts: number;
  outOfStock: number;
  totalValue: string;
}
