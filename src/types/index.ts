export interface Customer {
  id: string;
  name: string;
  company?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  category?: string;
  description?: string;
  price?: number;
  unit?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Movement {
  id: string;
  customerId: string;
  productId: string;
  type: 'given' | 'taken' | 'returned';
  quantity: number;
  notes?: string;
  createdAt: Date;
  createdBy: string;
}

export interface CustomerProduct {
  customerId: string;
  productId: string;
  currentQuantity: number;
  lastMovementDate: Date;
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

export interface AppState {
  customers: Customer[];
  products: Product[];
  movements: Movement[];
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface FilterOptions {
  searchTerm: string;
  category?: string;
  sortBy: 'name' | 'date' | 'company';
  sortOrder: 'asc' | 'desc';
}

export interface BulkImportResult {
  success: number;
  errors: Array<{ row: number; error: string }>;
  total: number;
}