import React, { useState } from 'react';
import { LoginForm } from './components/Auth/LoginForm';
import { CustomerDetail } from './components/Customers/CustomerDetail';
import { BulkCustomerUpload } from './components/Customers/BulkCustomerUpload';
import { BulkProductUpload } from './components/Products/BulkProductUpload';
import { StockManagement } from './components/Stock/StockManagement';
import { MotivationPage } from './components/Motivation/MotivationPage';
import { NotesPage } from './components/Notes/NotesPage';
import { BackupManager } from './components/Backup/BackupManager';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { Dashboard } from './components/Dashboard/Dashboard';
import { CustomerList } from './components/Customers/CustomerList';
import { CustomerForm } from './components/Customers/CustomerForm';
import { ProductList } from './components/Products/ProductList';
import { ProductForm } from './components/Products/ProductForm';
import { MovementForm } from './components/Movements/MovementForm';
import { NewMovementForm } from './components/Movements/NewMovementForm';
import { MovementsList } from './components/Movements/MovementsList';
import { Modal } from './components/Common/Modal';
import { useAppState } from './hooks/useAppState';
import { Customer, Product } from './types';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'customer' | 'product' | 'movement' | 'new-movement' | 'bulk-customer' | 'bulk-product' | null;
    data?: any;
  }>({ isOpen: false, type: null });
  const [customerDetailState, setCustomerDetailState] = useState<{
    isOpen: boolean;
    customer: Customer | null;
  }>({ isOpen: false, customer: null });

  const {
    customers,
    products,
    movements,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addProduct,
    updateProduct,
    deleteProduct,
    addMovement,
    getCustomerProducts,
  } = useAppState();

  const handleLogin = (username: string, password: string): boolean => {
    if (username === 'ORMEN' && password === 'ORMEN666-F1') {
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const handleCustomerSave = (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (modalState.data) {
      updateCustomer(modalState.data.id, customerData);
    } else {
      addCustomer(customerData);
    }
    setModalState({ isOpen: false, type: null });
  };

  const handleProductSave = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (modalState.data) {
      updateProduct(modalState.data.id, productData);
    } else {
      addProduct(productData);
    }
    setModalState({ isOpen: false, type: null });
  };

  const handleMovementSave = (movementData: any) => {
    addMovement(movementData);
    setModalState({ isOpen: false, type: null });
  };

  const handleNewMovementSave = (movementData: any) => {
    console.log('🔥 YENİ HAREKET KAYDI - GERÇEK ÇÖZÜM:', movementData);
    
    // EĞER ARRAY İSE HER BİRİNİ TEK TEK EKLE
    if (Array.isArray(movementData)) {
      console.log('📊 Çoklu hareket kaydı:', movementData.length);
      for (let i = 0; i < movementData.length; i++) {
        const movement = movementData[i];
        console.log(`💾 Hareket ${i + 1} kaydediliyor:`, movement);
        const result = addMovement(movement);
        console.log(`✅ Hareket ${i + 1} kaydedildi:`, result);
      }
    } else {
      // TEK HAREKET
      const result = addMovement(movementData);
      console.log('✅ Tek hareket kaydedildi:', result);
    }
    
    setModalState({ isOpen: false, type: null });
  };

  // TOPLU MÜŞTERİ YÜKLEME - GERÇEK ÇÖZÜM
  const handleBulkCustomerUpload = (customersData: Array<{ name: string }>) => {
    console.log('🔥 TOPLU MÜŞTERİ YÜKLEME BAŞLIYOR - Sayı:', customersData.length);
    
    // BATCH İŞLEM - TÜM MÜŞTERİLERİ TEK SEFERDE EKLE
    const newCustomers = customersData.map(customerData => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: customerData.name.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    
    // MEVCUT MÜŞTERİLERLE BİRLEŞTİR
    const updatedCustomers = [...customers, ...newCustomers];
    
    // TEK SEFERDE GÜNCELLE
    if (typeof setCustomers === 'function') {
      setCustomers(updatedCustomers);
      console.log(`✅ ${customersData.length} müşteri toplu olarak eklendi!`);
    } else {
      console.error('❌ setCustomers fonksiyonu bulunamadı!');
    }
    
    setModalState({ isOpen: false, type: null });
  };

  // TOPLU KARTELA YÜKLEME - GERÇEK ÇÖZÜM
  const handleBulkProductUpload = (productsData: Array<{ name: string; code: string; category?: string }>) => {
    console.log('🔥 TOPLU KARTELA YÜKLEME BAŞLIYOR - Sayı:', productsData.length);
    
    // BATCH İŞLEM - TÜM KARTELALAR TEK SEFERDE EKLE
    const newProducts = productsData.map(productData => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: productData.name.trim(),
      code: productData.code.trim(),
      category: productData.category?.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    
    // MEVCUT KARTELALARLA BİRLEŞTİR
    const updatedProducts = [...products, ...newProducts];
    
    // TEK SEFERDE GÜNCELLE
    if (typeof setProducts === 'function') {
      setProducts(updatedProducts);
      console.log(`✅ ${productsData.length} kartela toplu olarak eklendi!`);
    } else {
      console.error('❌ setProducts fonksiyonu bulunamadı!');
    }
    
    setModalState({ isOpen: false, type: null });
  };

  const handleNewMovementSave = (movementData: any) => {
    console.log('🔥 YENİ HAREKET KAYDI BAŞLIYOR');
    
    // EĞER ARRAY İSE (ÇOKLU HAREKET)
    if (Array.isArray(movementData)) {
      console.log('📊 Çoklu hareket kaydı:', movementData.length);
      
      // BATCH İŞLEM - TÜM HAREKETLERİ TEK SEFERDE EKLE
      const newMovements = movementData.map(movement => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        customerId: movement.customerId,
        productId: movement.productId,
        type: movement.type,
        quantity: movement.quantity,
        notes: movement.notes,
        createdAt: new Date(),
        createdBy: 'system',
      }));
      
      // MEVCUT HAREKETLERLE BİRLEŞTİR
      const updatedMovements = [...movements, ...newMovements];
      
      // TEK SEFERDE GÜNCELLE
      if (typeof setMovements === 'function') {
        setMovements(updatedMovements);
        console.log(`✅ ${movementData.length} hareket toplu olarak eklendi!`);
      } else {
        console.error('❌ setMovements fonksiyonu bulunamadı!');
      }
    } else {
      // TEK HAREKET
      const newMovement = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        customerId: movementData.customerId,
        productId: movementData.productId,
        type: movementData.type,
        quantity: movementData.quantity,
        notes: movementData.notes,
        createdAt: new Date(),
        createdBy: 'system',
      };
      
      const updatedMovements = [...movements, newMovement];
      
      if (typeof setMovements === 'function') {
        setMovements(updatedMovements);
        console.log('✅ Tek hareket eklendi!');
      } else {
        console.error('❌ setMovements fonksiyonu bulunamadı!');
      }
    }
    
    setModalState({ isOpen: false, type: null });
  };
        name: productData.name.trim(),
        code: productData.code.trim(),
        category: productData.category?.trim()
      });
      console.log(`✅ Kartela ${i + 1} eklendi:`, result);
    }
    
    console.log(`🎉 TOPLAM ${productsData.length} kartela başarıyla eklendi!`);
    setModalState({ isOpen: false, type: null });
  };

  const handleCustomerDelete = (id: string) => {
    if (window.confirm('Bu müşteriyi silmek istediğinizden emin misiniz?')) {
      deleteCustomer(id);
    }
  };

  const handleProductDelete = (id: string) => {
    if (window.confirm('Bu kartelayı silmek istediğinizden emin misiniz?')) {
      deleteProduct(id);
    }
  };

  const handleCustomerView = (customer: Customer) => {
    setCustomerDetailState({ isOpen: true, customer });
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Ana Sayfa';
      case 'customers': return 'Müşteriler';
      case 'products': return 'Kartelalar';
      case 'movements': return 'Hareketler';
      case 'reports': return 'Raporlar';
      case 'stock': return 'Kartela Stok';
      case 'motivation': return 'Motivasyon';
      case 'notes': return 'Notlarım';
      case 'backup': return 'Yedek Al/Yükle';
      case 'settings': return 'Ayarlar';
      default: return 'Kartela Yönetimi';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard customers={customers} products={products} movements={movements} />;
      
      case 'customers':
        return (
          <CustomerList
            customers={customers}
            onEdit={(customer) => setModalState({ isOpen: true, type: 'customer', data: customer })}
            onDelete={handleCustomerDelete}
            onView={handleCustomerView}
            onAdd={() => setModalState({ isOpen: true, type: 'customer' })}
            onBulkAdd={() => setModalState({ isOpen: true, type: 'bulk-customer' })}
          />
        );
      
      case 'products':
        return (
          <ProductList
            products={products}
            onEdit={(product) => setModalState({ isOpen: true, type: 'product', data: product })}
            onDelete={handleProductDelete}
            onAdd={() => setModalState({ isOpen: true, type: 'product' })}
            onBulkAdd={() => setModalState({ isOpen: true, type: 'bulk-product' })}
          />
        );
      
      case 'movements':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Hareketler</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setModalState({ isOpen: true, type: 'new-movement' })}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Yeni Hareket
                </button>
              </div>
            </div>
            <MovementsList
              movements={movements}
              customers={customers}
              products={products}
            />
          </div>
        );
      
      case 'stock':
        return <StockManagement />;
      
      case 'motivation':
        return <MotivationPage />;
      
      case 'notes':
        return <NotesPage />;
      
      case 'backup':
        return <BackupManager />;
      
      default:
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{getPageTitle()}</h2>
            <p className="text-gray-600">Bu sayfa yakında eklenecek...</p>
          </div>
        );
    }
  };

  const getModalTitle = () => {
    if (!modalState.type) return '';
    
    switch (modalState.type) {
      case 'customer':
        return modalState.data ? 'Müşteri Düzenle' : 'Yeni Müşteri';
      case 'product':
        return modalState.data ? 'Kartela Düzenle' : 'Yeni Kartela';
      case 'movement':
        return 'Tekli Hareket';
      case 'new-movement':
        return 'Yeni Hareket';
      case 'bulk-customer':
        return 'Toplu Müşteri Yükleme';
      case 'bulk-product':
        return 'Toplu Kartela Yükleme';
      default:
        return '';
    }
  };

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <div className="lg:ml-64">
        <Header
          onMenuToggle={() => setSidebarOpen(true)}
          title={getPageTitle()}
        />
        
        <main className="p-6">
          {renderContent()}
        </main>
      </div>

      <Modal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, type: null })}
        title={getModalTitle()}
        size={modalState.type === 'movement' || modalState.type === 'new-movement' ? 'lg' : 'md'}
      >
        {modalState.type === 'customer' && (
          <CustomerForm
            customer={modalState.data}
            onSave={handleCustomerSave}
            onCancel={() => setModalState({ isOpen: false, type: null })}
          />
        )}
        {modalState.type === 'product' && (
          <ProductForm
            product={modalState.data}
            onSave={handleProductSave}
            onCancel={() => setModalState({ isOpen: false, type: null })}
          />
        )}
        {modalState.type === 'movement' && (
          <MovementForm
            customers={customers}
            products={products}
            onSave={handleMovementSave}
            onCancel={() => setModalState({ isOpen: false, type: null })}
          />
        )}
        {modalState.type === 'new-movement' && (
          <NewMovementForm
            customers={customers}
            products={products}
            onSave={handleNewMovementSave}
            onCancel={() => setModalState({ isOpen: false, type: null })}
          />
        )}
        {modalState.type === 'bulk-customer' && (
          <BulkCustomerUpload
            onUpload={handleBulkCustomerUpload}
            onClose={() => setModalState({ isOpen: false, type: null })}
          />
        )}
        {modalState.type === 'bulk-product' && (
          <BulkProductUpload
            onUpload={handleBulkProductUpload}
            onClose={() => setModalState({ isOpen: false, type: null })}
            existingProducts={products}
          />
        )}
      </Modal>

      {customerDetailState.isOpen && customerDetailState.customer && (
        <CustomerDetail
          customer={customerDetailState.customer}
          customerProducts={getCustomerProducts(customerDetailState.customer.id)}
          movements={movements}
          products={products}
          onClose={() => setCustomerDetailState({ isOpen: false, customer: null })}
        />
      )}
    </div>
  );
}

export default App;