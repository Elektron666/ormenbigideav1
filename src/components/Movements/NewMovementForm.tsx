import React, { useState, useMemo } from 'react';
import { Search, ArrowLeft, Eye, Check, X, Package, User } from 'lucide-react';
import { Customer, Product, Movement } from '../../types';

interface NewMovementFormProps {
  customers: Customer[];
  products: Product[];
  movements: Movement[];
  onSave: (movementData: Omit<Movement, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export function NewMovementForm({ customers, products, movements, onSave, onCancel }: NewMovementFormProps) {
  const [step, setStep] = useState<'customer' | 'products' | 'preview'>('customer');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [movementType, setMovementType] = useState<Movement['type']>('given');
  const [customerSearch, setCustomerSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredCustomers = useMemo(() => {
    if (!customerSearch) return customers;
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      (customer.company && customer.company.toLowerCase().includes(customerSearch.toLowerCase()))
    );
  }, [customers, customerSearch]);

  const filteredProducts = useMemo(() => {
    if (!productSearch) return products;
    return products.filter(product =>
      product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      product.code.toLowerCase().includes(productSearch.toLowerCase())
    );
  }, [products, productSearch]);

  const sortedCustomers = useMemo(() => {
    return filteredCustomers.sort((a, b) => a.name.localeCompare(b.name, 'tr-TR', { sensitivity: 'base' }));
  }, [filteredCustomers]);

  const sortedProducts = useMemo(() => {
    return filteredProducts.sort((a, b) => a.name.localeCompare(b.name, 'tr-TR', { sensitivity: 'base' }));
  }, [filteredProducts]);

  // Seçili müşterinin mevcut kartelaları
  const customerCurrentProducts = useMemo(() => {
    if (!selectedCustomer) return [];
    
    const customerMovements = movements.filter(m => m.customerId === selectedCustomer.id);
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
      }))
      .filter(item => item.product)
      .sort((a, b) => a.product.name.localeCompare(b.product.name, 'tr-TR'));
  }, [selectedCustomer, movements, products]);

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setStep('products');
  };

  const handleProductToggle = (productId: string) => {
    setSelectedProducts(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(productId)) {
        newSelected.delete(productId);
      } else {
        newSelected.add(productId);
      }
      return newSelected;
    });
  };

  const handleSelectAll = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id)));
    }
  };

  const handleNext = () => {
    if (step === 'products' && selectedProducts.size > 0) {
      setStep('preview');
    }
  };

  const handleBack = () => {
    if (step === 'products') {
      setStep('customer');
      setSelectedCustomer(null);
    } else if (step === 'preview') {
      setStep('products');
    }
  };

  const handleSubmit = () => {
    if (!selectedCustomer || selectedProducts.size === 0) {
      return;
    }

    setIsSubmitting(true);

    const selectedProductIds = Array.from(selectedProducts);

    const saveMovementsSequentially = async () => {
      for (let i = 0; i < selectedProductIds.length; i++) {
        const productId = selectedProductIds[i];
        
        const movementData = {
          customerId: selectedCustomer.id,
          productId,
          type: movementType,
          quantity: 1,
          notes: notes || undefined,
          createdBy: 'system',
        };
        
        onSave(movementData);
        
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      setIsSubmitting(false);
      
      setTimeout(() => {
        onCancel();
      }, 500);
    };
    
    saveMovementsSequentially();
  };

  const getSelectedProductsList = () => {
    return Array.from(selectedProducts).map(id => products.find(p => p.id === id)).filter(Boolean) as Product[];
  };

  const isAllSelected = filteredProducts.length > 0 && selectedProducts.size === filteredProducts.length;
  const isSomeSelected = selectedProducts.size > 0 && selectedProducts.size < filteredProducts.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {step !== 'customer' && (
            <button
              onClick={handleBack}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {step === 'customer' && 'Müşteri Seçin'}
              {step === 'products' && 'Kartela Seçin'}
              {step === 'preview' && 'Önizleme'}
            </h3>
            {selectedCustomer && (
              <p className="text-sm text-gray-600">{selectedCustomer.name}</p>
            )}
          </div>
        </div>
        
        {step === 'products' && (
          <div className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            <span className="font-medium text-blue-800">Seçilen: {selectedProducts.size} kartela</span>
          </div>
        )}
      </div>

      {/* Customer Selection */}
      {step === 'customer' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="Müşteri ara..."
            />
          </div>

          <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
            {sortedCustomers.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {sortedCustomers.map((customer, index) => (
                  <div
                    key={customer.id}
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleCustomerSelect(customer)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{customer.name}</h4>
                        {customer.company && (
                          <p className="text-sm text-gray-600">{customer.company}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                {customerSearch ? 'Arama kriterlerine uygun müşteri bulunamadı' : 'Müşteri bulunamadı'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Product Selection */}
      {step === 'products' && (
        <div className="space-y-4">
          {/* Movement Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hareket Türü
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMovementType('given')}
                className={`px-4 py-3 rounded-lg border transition-colors font-medium ${
                  movementType === 'given'
                    ? 'bg-green-100 border-green-300 text-green-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Verildi
              </button>
              <button
                type="button"
                onClick={() => setMovementType('taken')}
                className={`px-4 py-3 rounded-lg border transition-colors font-medium ${
                  movementType === 'taken'
                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Alındı
              </button>
              <button
                type="button"
                onClick={() => setMovementType('returned')}
                className={`px-4 py-3 rounded-lg border transition-colors font-medium ${
                  movementType === 'returned'
                    ? 'bg-orange-100 border-orange-300 text-orange-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                İade
              </button>
            </div>
          </div>

          {/* Müşterinin Mevcut Kartelaları */}
          {selectedCustomer && customerCurrentProducts.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <User className="w-5 h-5 text-blue-600" />
                <h4 className="font-medium text-blue-900">
                  {selectedCustomer.name} - Mevcut Kartelalar
                </h4>
                <span className="bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {customerCurrentProducts.length} çeşit
                </span>
              </div>
              
              <div className="max-h-32 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {customerCurrentProducts.map((item, index) => (
                    <div key={item.product.id} className="flex items-center justify-between bg-white rounded p-2 border border-blue-200">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-900">{item.product.name}</p>
                          <p className="text-xs text-blue-700">{item.product.code}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-blue-800">{item.quantity} adet</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Product Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="Kartela ara..."
            />
          </div>

          {/* Select All Button */}
          {filteredProducts.length > 0 && (
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <button
                type="button"
                onClick={handleSelectAll}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors font-medium ${
                  isAllSelected
                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                    : isSomeSelected
                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                  isAllSelected
                    ? 'bg-blue-600 border-blue-600'
                    : isSomeSelected
                    ? 'bg-blue-600 border-blue-600'
                    : 'border-gray-300'
                }`}>
                  {(isAllSelected || isSomeSelected) && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
                <span>
                  {isAllSelected ? 'Tümünü Kaldır' : 'Tümünü Seç'}
                </span>
              </button>
              <span className="text-sm font-medium text-gray-700 bg-white px-3 py-1 rounded-full border">
                {selectedProducts.size} / {filteredProducts.length} seçili
              </span>
            </div>
          )}

          {/* Product List */}
          <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
            {sortedProducts.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {sortedProducts.map((product, index) => {
                  const isSelected = selectedProducts.has(product.id);
                  return (
                    <div
                      key={product.id}
                      className={`p-3 cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleProductToggle(product.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-blue-600 border-blue-600'
                            : 'border-gray-300 hover:border-blue-400'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500 font-medium min-w-[2rem]">
                              {index + 1}.
                            </span>
                            <span className={`font-medium ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                              {product.name}
                            </span>
                          </div>
                          <p className={`text-sm ${isSelected ? 'text-blue-700' : 'text-gray-600'}`}>
                            {product.code}
                          </p>
                          {product.category && (
                            <span className={`inline-block text-xs px-2 py-1 rounded-full mt-1 ${
                              isSelected 
                                ? 'bg-blue-200 text-blue-800' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {product.category}
                            </span>
                          )}
                        </div>
                        {isSelected && (
                          <div className="text-blue-600 font-medium text-sm">
                            ✓ Seçildi
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                {productSearch ? 'Arama kriterlerine uygun kartela bulunamadı' : 'Kartela bulunamadı'}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notlar
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Hareket ile ilgili notlar..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleBack}
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Geri
            </button>
            <button
              onClick={handleNext}
              disabled={selectedProducts.size === 0}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>Önizleme ({selectedProducts.size})</span>
            </button>
          </div>
        </div>
      )}

      {/* Preview */}
      {step === 'preview' && selectedCustomer && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-semibold text-blue-900 mb-4">İşlem Özeti</h4>
            <div className="space-y-2 text-blue-800">
              <p><strong>Müşteri:</strong> {selectedCustomer.name}</p>
              <p><strong>Hareket Türü:</strong> {
                movementType === 'given' ? 'Verildi' :
                movementType === 'taken' ? 'Alındı' : 'İade Edildi'
              }</p>
              <p><strong>Seçilen Kartela Sayısı:</strong> {selectedProducts.size} adet</p>
              {notes && <p><strong>Notlar:</strong> {notes}</p>}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Seçilen Kartelalar:</h4>
            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
              <div className="divide-y divide-gray-200">
                {getSelectedProductsList().map((product, index) => (
                  <div key={product.id} className="p-3 flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-green-600">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.code}</p>
                      {product.category && (
                        <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full mt-1">
                          {product.category}
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500 font-medium">1 adet</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleBack}
              disabled={isSubmitting}
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Geri
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Kaydediliyor...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Kaydet ({selectedProducts.size} hareket)</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Cancel Button */}
      {step === 'customer' && (
        <div className="flex justify-end">
          <button
            onClick={onCancel}
            className="bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            İptal
          </button>
        </div>
      )}
    </div>
  );
}