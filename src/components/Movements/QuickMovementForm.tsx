import React, { useState, useMemo } from 'react';
import { Search, Check, X } from 'lucide-react';
import { Customer, Product, Movement } from '../../types';

interface QuickMovementFormProps {
  customers: Customer[];
  products: Product[];
  onSave: (movementData: Omit<Movement, 'id' | 'createdAt' | 'createdBy'>) => void;
  onCancel: () => void;
}

export function QuickMovementForm({ customers, products, onSave, onCancel }: QuickMovementFormProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [movementType, setMovementType] = useState<Movement['type']>('given');
  const [searchTerm, setSearchTerm] = useState('');
  const [notes, setNotes] = useState('');

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const sortedProducts = useMemo(() => {
    return filteredProducts.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
  }, [filteredProducts]);

  const handleProductToggle = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id)));
    }
  };

  const handleSubmit = () => {
    if (!selectedCustomer || selectedProducts.size === 0) return;

    selectedProducts.forEach(productId => {
      onSave({
        customerId: selectedCustomer.id,
        productId,
        type: movementType,
        quantity: 1,
        notes: notes || undefined,
      });
    });
  };

  const isAllSelected = filteredProducts.length > 0 && selectedProducts.size === filteredProducts.length;
  const isSomeSelected = selectedProducts.size > 0 && selectedProducts.size < filteredProducts.length;

  return (
    <div className="space-y-6">
      {/* Customer Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Müşteri Seçimi *
        </label>
        <select
          value={selectedCustomer?.id || ''}
          onChange={(e) => {
            const customer = customers.find(c => c.id === e.target.value);
            setSelectedCustomer(customer || null);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Müşteri seçiniz</option>
          {customers
            .sort((a, b) => a.name.localeCompare(b.name, 'tr'))
            .map((customer, index) => (
            <option key={customer.id} value={customer.id}>
              {index + 1}. {customer.name} {customer.company && `(${customer.company})`}
            </option>
          ))}
        </select>
      </div>

      {/* Movement Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          İşlem Türü *
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setMovementType('given')}
            className={`px-4 py-2 rounded-lg border transition-colors ${
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
            className={`px-4 py-2 rounded-lg border transition-colors ${
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
            className={`px-4 py-2 rounded-lg border transition-colors ${
              movementType === 'returned'
                ? 'bg-orange-100 border-orange-300 text-orange-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            İade
          </button>
        </div>
      </div>

      {/* Product Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kartela Arama
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Kartela ara..."
          />
        </div>
      </div>

      {/* Select All Button */}
      {filteredProducts.length > 0 && (
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleSelectAll}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
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
          <span className="text-sm text-gray-600">
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
                    isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleProductToggle(product.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                      isSelected
                        ? 'bg-blue-600 border-blue-600'
                        : 'border-gray-300'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 font-medium">
                          {index + 1}.
                        </span>
                        <span className="font-medium text-gray-900">
                          {product.name}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{product.code}</p>
                      {product.category && (
                        <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full mt-1">
                          {product.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            {searchTerm ? 'Arama kriterlerine uygun kartela bulunamadı' : 'Henüz kartela eklenmemiş'}
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
          placeholder="Ek notlar (opsiyonel)"
        />
      </div>

      {/* Summary */}
      {selectedCustomer && selectedProducts.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">İşlem Özeti</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>Müşteri:</strong> {selectedCustomer.name}</p>
            <p><strong>Seçilen Kartela:</strong> {selectedProducts.size} adet</p>
            <p><strong>İşlem:</strong> {
              movementType === 'given' ? 'Verilecek' :
              movementType === 'taken' ? 'Alınacak' : 'İade edilecek'
            }</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-4 pt-4">
        <button
          onClick={handleSubmit}
          disabled={!selectedCustomer || selectedProducts.size === 0}
          className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Kaydet ({selectedProducts.size} kartela)
        </button>
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-800 py-2.5 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          İptal
        </button>
      </div>
    </div>
  );
}