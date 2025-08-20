import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Customer, Product, Movement, User } from '../types';
import { generateId } from '../utils/helpers';

export function useAppState() {
  const [customers, setCustomers] = useLocalStorage<Customer[]>('kartela_customers', []);
  const [products, setProducts] = useLocalStorage<Product[]>('kartela_products', []);
  const [movements, setMovements] = useLocalStorage<Movement[]>('kartela_movements', []);
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('kartela_current_user', null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Performance optimization: Memoize expensive calculations
  const memoizedCustomers = useMemo(() => customers, [customers]);
  const memoizedProducts = useMemo(() => products, [products]);
  const memoizedMovements = useMemo(() => movements, [movements]);

  // KUSURSUZ MÜŞTERİ İŞLEMLERİ
  const addCustomer = useCallback((customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setCustomers(prevCustomers => [...prevCustomers, newCustomer]);
    
    return newCustomer;
  }, [setCustomers]);

  const updateCustomer = useCallback((id: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === id 
        ? { ...customer, ...updates, updatedAt: new Date() }
        : customer
    ));
  }, [setCustomers]);

  const deleteCustomer = useCallback((id: string) => {
    setCustomers(prev => prev.filter(customer => customer.id !== id));
    setMovements(prev => prev.filter(movement => movement.customerId !== id));
  }, [setCustomers, setMovements]);

  // KUSURSUZ ÜRÜN İŞLEMLERİ
  const addProduct = useCallback((productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setProducts(prevProducts => [...prevProducts, newProduct]);
    
    return newProduct;
  }, [setProducts]);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === id 
        ? { ...product, ...updates, updatedAt: new Date() }
        : product
    ));
  }, [setProducts]);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
    setMovements(prev => prev.filter(movement => movement.productId !== id));
  }, [setProducts, setMovements]);

  // KUSURSUZ HAREKET İŞLEMLERİ
  const addMovement = useCallback((movementData: Omit<Movement, 'id' | 'createdAt'>) => {
    const newMovement: Movement = {
      ...movementData,
      id: generateId(),
      createdAt: new Date(),
      createdBy: movementData.createdBy || currentUser?.id || 'system',
    };
    
    setMovements(prevMovements => [...prevMovements, newMovement]);
    
    return newMovement;
  }, [setMovements, currentUser]);

  const getCustomerProducts = useCallback((customerId: string) => {
    const customerMovements = memoizedMovements.filter(m => m.customerId === customerId);
    const productQuantities = new Map<string, number>();

    customerMovements.forEach(movement => {
      const current = productQuantities.get(movement.productId) || 0;
      if (movement.type === 'given') {
        productQuantities.set(movement.productId, current + movement.quantity);
      } else if (movement.type === 'taken' || movement.type === 'returned') {
        productQuantities.set(movement.productId, current - movement.quantity);
      }
    });

    return Array.from(productQuantities.entries())
      .filter(([_, quantity]) => quantity > 0)
      .map(([productId, quantity]) => ({
        product: memoizedProducts.find(p => p.id === productId)!,
        quantity,
        lastMovementDate: Math.max(
          ...customerMovements
            .filter(m => m.productId === productId)
            .map(m => m.createdAt.getTime())
        ),
      }))
      .filter(item => item.product);
  }, [memoizedMovements, memoizedProducts]);

  // KUSURSUZ TOPLU İŞLEMLER
  const bulkImportCustomers = useCallback((customersData: Array<{ name: string }>) => {
    const newCustomers: Customer[] = customersData.map(data => ({
      name: data.name,
      company: undefined,
      phone: undefined,
      email: undefined,
      address: undefined,
      notes: undefined,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    
    setCustomers(prev => [...prev, ...newCustomers]);
  }, [setCustomers]);

  const bulkImportProducts = useCallback((productsData: Array<{ name: string; code: string; category?: string }>) => {
    const newProducts: Product[] = productsData.map(data => ({
      name: data.name,
      code: data.code,
      category: data.category,
      description: undefined,
      price: undefined,
      unit: undefined,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    
    setProducts(prev => [...prev, ...newProducts]);
  }, [setProducts]);

  const exportData = useCallback(() => {
    return {
      customers: memoizedCustomers,
      products: memoizedProducts,
      movements: memoizedMovements,
      exportDate: new Date().toISOString(),
      version: '1.0',
    };
  }, [memoizedCustomers, memoizedProducts, memoizedMovements]);

  const importData = useCallback((data: any) => {
    try {
      if (data.customers) {
        setCustomers(data.customers.map((customer: any) => ({
          ...customer,
          createdAt: new Date(customer.createdAt),
          updatedAt: new Date(customer.updatedAt),
        })));
      }

      if (data.products) {
        setProducts(data.products.map((product: any) => ({
          ...product,
          createdAt: new Date(product.createdAt),
          updatedAt: new Date(product.updatedAt),
        })));
      }

      if (data.movements) {
        setMovements(data.movements.map((movement: any) => ({
          ...movement,
          createdAt: new Date(movement.createdAt),
        })));
      }

      return true;
    } catch (error) {
      setError('Veri içe aktarma hatası');
      return false;
    }
  }, [setCustomers, setProducts, setMovements]);

  const clearError = useCallback(() => setError(null), []);

  return {
    // State
    customers: memoizedCustomers,
    products: memoizedProducts,
    movements: memoizedMovements,
    setMovements,
    currentUser,
    isLoading,
    error,
    
    // Customer operations
    addCustomer,
    updateCustomer,
    deleteCustomer,
    
    // Product operations
    addProduct,
    updateProduct,
    deleteProduct,
    
    // Movement operations
    addMovement,
    getCustomerProducts,
    
    // Bulk operations
    bulkImportCustomers,
    bulkImportProducts,
    
    // Data management
    exportData,
    importData,
    
    // User management
    setCurrentUser,
    
    // Error handling
    clearError,
  };
}