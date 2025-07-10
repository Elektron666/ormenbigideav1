import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Customer, Product, Movement, AppState, User } from '../types';
import { generateId } from '../utils/helpers';

export function useAppState() {
  const [customers, setCustomers] = useLocalStorage<Customer[]>('kartela_customers', []);
  const [products, setProducts] = useLocalStorage<Product[]>('kartela_products', []);
  const [movements, setMovements] = useLocalStorage<Movement[]>('kartela_movements', []);
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('kartela_current_user', null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // MÜŞTERİ İŞLEMLERİ - GERÇEK ÇÖZÜM
  const addCustomer = useCallback((customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    console.log('🔥 addCustomer çağrıldı:', customerData.name);
    
    const newCustomer: Customer = {
      ...customerData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    console.log('✅ Yeni müşteri oluşturuldu:', newCustomer.name, newCustomer.id);
    
    // SENKRON GÜNCELLEME - GERÇEK ÇÖZÜM
    setCustomers(prevCustomers => {
      const updatedCustomers = [...prevCustomers, newCustomer];
      console.log('📊 Güncellenmiş müşteri sayısı:', updatedCustomers.length);
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
    // Also remove related movements
    setMovements(prev => prev.filter(movement => movement.customerId !== id));
  }, [setCustomers, setMovements]);

  // ÜRÜN İŞLEMLERİ - GERÇEK ÇÖZÜM
  const addProduct = useCallback((productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    console.log('🔥 addProduct çağrıldı:', productData.name, productData.code);
    
    const newProduct: Product = {
      ...productData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    console.log('✅ Yeni ürün oluşturuldu:', newProduct.name, newProduct.id);
    
    // SENKRON GÜNCELLEME - GERÇEK ÇÖZÜM
    setProducts(prevProducts => {
      const updatedProducts = [...prevProducts, newProduct];
      console.log('📊 Güncellenmiş ürün sayısı:', updatedProducts.length);
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
    // Also remove related movements
    setMovements(prev => prev.filter(movement => movement.productId !== id));
  }, [setProducts, setMovements]);

  // HAREKET İŞLEMLERİ - GERÇEK ÇÖZÜM
  const addMovement = useCallback((movementData: Omit<Movement, 'id' | 'createdAt'>) => {
    console.log('🔥 addMovement çağrıldı:', movementData);
    
    const newMovement: Movement = {
      ...movementData,
      id: generateId(),
      createdAt: new Date(),
      createdBy: movementData.createdBy || currentUser?.id || 'system',
    };
    
    console.log('✅ Yeni hareket oluşturuldu:', newMovement.id);
    
    // SENKRON GÜNCELLEME
    setMovements(prevMovements => {
      const updatedMovements = [...prevMovements, newMovement];
      console.log('📊 Güncellenmiş hareket sayısı:', updatedMovements.length);
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
      console.log(`✅ ${newCustomers.length} müşteri başarıyla eklendi!`);
    } catch (error) {
      setError('Toplu müşteri yükleme hatası');
      console.error('❌ Toplu müşteri yükleme hatası:', error);
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
      console.log(`✅ ${newProducts.length} ürün başarıyla eklendi!`);
    } catch (error) {
      setError('Toplu ürün yükleme hatası');
      console.error('❌ Toplu ürün yükleme hatası:', error);
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
      if (data.customers) setCustomers(data.customers);
      if (data.products) setProducts(data.products);
      if (data.movements) setMovements(data.movements);
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