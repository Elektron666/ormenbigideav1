import React, { useState } from 'react';
import { Customer, Product, Movement } from '../../types';

interface MovementFormProps {
  customers: Customer[];
  products: Product[];
  onSave: (movementData: Omit<Movement, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  preselectedCustomer?: string;
  preselectedProduct?: string;
}

export function MovementForm({ 
  customers, 
  products, 
  onSave, 
  onCancel, 
  preselectedCustomer,
  preselectedProduct 
}: MovementFormProps) {
  const [formData, setFormData] = useState({
    customerId: preselectedCustomer || '',
    productId: preselectedProduct || '',
    type: 'given' as Movement['type'],
    quantity: '1',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerId) {
      newErrors.customerId = 'Müşteri seçimi gereklidir';
    }

    if (!formData.productId) {
      newErrors.productId = 'Kartela seçimi gereklidir';
    }

    if (!formData.quantity || Number(formData.quantity) <= 0) {
      newErrors.quantity = 'Geçerli bir miktar giriniz';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        customerId: formData.customerId,
        productId: formData.productId,
        type: formData.type,
        quantity: Number(formData.quantity),
        notes: formData.notes || undefined,
        createdBy: 'system',
      });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const selectedCustomer = customers.find(c => c.id === formData.customerId);
  const selectedProduct = products.find(p => p.id === formData.productId);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Müşteri *
          </label>
          <select
            value={formData.customerId}
            onChange={(e) => handleChange('customerId', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.customerId ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Müşteri seçiniz</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.name} {customer.company && `(${customer.company})`}
              </option>
            ))}
          </select>
          {errors.customerId && <p className="text-red-500 text-sm mt-1">{errors.customerId}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kartela *
          </label>
          <select
            value={formData.productId}
            onChange={(e) => handleChange('productId', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.productId ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Kartela seçiniz</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name} ({product.code})
              </option>
            ))}
          </select>
          {errors.productId && <p className="text-red-500 text-sm mt-1">{errors.productId}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            İşlem Türü *
          </label>
          <select
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="given">Verildi</option>
            <option value="taken">Alındı</option>
            <option value="returned">İade Edildi</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Miktar *
          </label>
          <input
            type="number"
            min="1"
            value={formData.quantity}
            onChange={(e) => handleChange('quantity', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.quantity ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="1"
          />
          {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
        </div>
      </div>

      {selectedCustomer && selectedProduct && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">İşlem Özeti</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>Müşteri:</strong> {selectedCustomer.name}</p>
            <p><strong>Kartela:</strong> {selectedProduct.name} ({selectedProduct.code})</p>
            <p><strong>İşlem:</strong> {formData.quantity} adet {
              formData.type === 'given' ? 'verilecek' : 
              formData.type === 'taken' ? 'alınacak' : 'iade edilecek'
            }</p>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notlar
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ek notlar"
        />
      </div>

      <div className="flex space-x-4 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Kaydet
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-800 py-2.5 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          İptal
        </button>
      </div>
    </form>
  );
}