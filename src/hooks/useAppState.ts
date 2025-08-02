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

  // KUSURSUZ MÜŞTERİ İŞLEMLERİ
  const addCustomer = useCallback((customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setCustomers(prevCustomers => {
      const updatedCustomers = [...prevCustomers, newCustomer];
      return updatedCustomers;
    });
    
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
    
    setProducts(prevProducts => {
      const updatedProducts = [...prevProducts, newProduct];
      return updatedProducts;
    });
    
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
    
    setMovements(prevMovements => {
      const updatedMovements = [...prevMovements, newMovement];
      return updatedMovements;
    });
    
    return newMovement;
  }, [setMovements, currentUser]);

  const getCustomerProducts = useCallback((customerId: string) => {
    const customerMovements = movements.filter(m => m.customerId === customerId);
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
        product: products.find(p => p.id === productId)!,
        quantity,
        lastMovementDate: Math.max(
          ...customerMovements
            .filter(m => m.productId === productId)
            .map(m => m.createdAt.getTime())
        ),
      }))
      .filter(item => item.product);
  }, [movements, products]);

  // KUSURSUZ TOPLU İŞLEMLER
  const bulkImportCustomers = useCallback((customersData: Array<{ name: string }>) => {
    setIsLoading(true);
    try {
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
    } catch (error) {
      setError('Toplu müşteri yükleme hatası');
    } finally {
      setIsLoading(false);
    }
  }, [setCustomers]);

  const bulkImportProducts = useCallback((productsData: Array<{ name: string; code: string; category?: string }>) => {
    setIsLoading(true);
    try {
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
    } catch (error) {
      setError('Toplu ürün yükleme hatası');
    } finally {
      setIsLoading(false);
    }
  }, [setProducts]);

  const exportData = useCallback(() => {
    return {
      customers,
      products,
      movements,
      exportDate: new Date().toISOString(),
      version: '1.0',
    };
  }, [customers, products, movements]);

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
    customers,
    products,
    movements,
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