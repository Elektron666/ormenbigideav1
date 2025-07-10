import React, { useState } from 'react';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { Dashboard } from './components/Dashboard/Dashboard';
import { CustomerList } from './components/Customers/CustomerList';
import { CustomerForm } from './components/Customers/CustomerForm';
import { ProductList } from './components/Products/ProductList';
import { ProductForm } from './components/Products/ProductForm';
import { MovementForm } from './components/Movements/MovementForm';
import { Modal } from './components/Common/Modal';
import { useAppState } from './hooks/useAppState';
import { Customer, Product } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'customer' | 'product' | 'movement' | null;
    data?: any;
  }>({ isOpen: false, type: null });

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
    const customerProducts = getCustomerProducts(customer.id);
    console.log('Customer products:', customerProducts);
    // TODO: Implement customer detail view
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Ana Sayfa';
      case 'customers': return 'Müşteriler';
      case 'products': return 'Kartelalar';
      case 'movements': return 'Hareketler';
      case 'reports': return 'Raporlar';
      case 'import-export': return 'Veri Yönetimi';
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
          />
        );
      
      case 'products':
        return (
          <ProductList
            products={products}
            onEdit={(product) => setModalState({ isOpen: true, type: 'product', data: product })}
            onDelete={handleProductDelete}
            onAdd={() => setModalState({ isOpen: true, type: 'product' })}
          />
        );
      
      case 'movements':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Hareketler</h2>
              <button
                onClick={() => setModalState({ isOpen: true, type: 'movement' })}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Yeni Hareket
              </button>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-gray-600">Hareket listesi yakında eklenecek...</p>
            </div>
          </div>
        );
      
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
        return 'Yeni Hareket';
      default:
        return '';
    }
  };

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
        size={modalState.type === 'movement' ? 'lg' : 'md'}
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
      </Modal>
    </div>
  );
}

export default App;