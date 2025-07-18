import React, { useState } from 'react';
import { LoginForm } from './components/Auth/LoginForm';
import { CustomerDetail } from './components/Customers/CustomerDetail';
import { BulkCustomerUpload } from './components/Customers/BulkCustomerUpload';
import { BulkProductUpload } from './components/Products/BulkProductUpload';
import { SettingsPage } from './components/Settings/SettingsPage';
import { ReportsPage } from './components/Reports/ReportsPage';
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
import { MissingProductsPage } from './components/MissingProducts/MissingProductsPage';
import { Modal } from './components/Common/Modal';
import { useAppState } from './hooks/useAppState';
import { Customer, Product, Movement } from './types';

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
    setMovements,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addProduct,
    updateProduct,
    deleteProduct,
    addMovement,
    getCustomerProducts,
    bulkImportCustomers,
    bulkImportProducts,
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
    if (modalState.data) {
      // Güncelleme işlemi
      setMovements(prev => prev.map(m => 
        m.id === modalState.data.id 
          ? { ...m, ...movementData, updatedAt: new Date() }
          : m
      ));
    } else {
      // Yeni hareket ekleme
      addMovement(movementData);
    }
    setModalState({ isOpen: false, type: null });
  };

  const handleNewMovementSave = (movementData: any) => {
    addMovement(movementData);
  };

  const handleBulkCustomerUpload = (customersData: Array<{ name: string }>) => {
    bulkImportCustomers(customersData);
    setModalState({ isOpen: false, type: null });
  };

  const handleBulkProductUpload = (productsData: Array<{ name: string; code: string; category?: string }>) => {
    bulkImportProducts(productsData);
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
      case 'missing': return 'Eksik Kartelalar';
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
        return <Dashboard 
          customers={customers} 
          products={products} 
          movements={movements} 
          onNavigate={setActiveTab}
        />;
      
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
              onEdit={(movement) => setModalState({ isOpen: true, type: 'movement', data: movement })}
              onDelete={(id) => {
                if (window.confirm('Bu hareketi silmek istediğinizden emin misiniz?')) {
                  setMovements(prev => prev.filter(m => m.id !== id));
                }
              }}
            />
          </div>
        );
      
      case 'stock':
        return <StockManagement />;
      
      case 'missing':
        return <MissingProductsPage customers={customers} products={products} movements={movements} />;
      
      case 'motivation':
        return <MotivationPage />;
      
      case 'notes':
        return <NotesPage />;
      
      case 'backup':
        return <BackupManager />;
      
      case 'reports':
        return <ReportsPage customers={customers} products={products} movements={movements} />;
      
      case 'settings':
        return <SettingsPage />;
      
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
        return modalState.data ? 'Hareket Düzenle' : 'Tekli Hareket';
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
      
      <div className="2xl:ml-64">
        <Header
          onMenuToggle={() => setSidebarOpen(true)}
          title={getPageTitle()}
        />
        
        <main className="p-4 md:p-6 min-h-screen">
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
            movement={modalState.data}
            onSave={handleMovementSave}
            onCancel={() => setModalState({ isOpen: false, type: null })}
          />
        )}
        {modalState.type === 'new-movement' && (
          <NewMovementForm
            customers={customers}
            products={products}
            movements={movements}
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