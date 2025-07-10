import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { useAppState } from '../../hooks/useAppState';

interface ProductFormProps {
  product?: Product;
  onSave: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const { products } = useAppState();
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: '',
    description: '',
    price: '',
    unit: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Otomatik kod oluşturma fonksiyonu
  const generateNextCode = () => {
    const existingCodes = products.map(p => p.code);
    let maxCodeNumber = 0;
    
    // Mevcut ORM kodlarından en yüksek numarayı bul
    existingCodes.forEach(code => {
      if (code.startsWith('ORM-')) {
        const num = parseInt(code.replace('ORM-', ''));
        if (!isNaN(num) && num > maxCodeNumber) {
          maxCodeNumber = num;
        }
      }
    });
    
    // Bir sonraki numarayı oluştur
    const nextNumber = maxCodeNumber + 1;
    return `ORM-${nextNumber.toString().padStart(4, '0')}`;
  };

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        code: product.code || '',
        category: product.category || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        unit: product.unit || '',
      });
    } else {
      // Yeni ürün ekleme durumunda otomatik kod oluştur
      setFormData(prev => ({
        ...prev,
        code: generateNextCode()
      }));
    }
  }, [product, products]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Kartela adı gereklidir';
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Kartela kodu gereklidir';
    }

    if (formData.price && isNaN(Number(formData.price))) {
      newErrors.price = 'Geçerli bir fiyat giriniz';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        name: formData.name,
        code: formData.code,
        category: formData.category || undefined,
        description: formData.description || undefined,
        price: formData.price ? Number(formData.price) : undefined,
        unit: formData.unit || undefined,
      });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kartela Adı *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Kartela adı"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kartela Kodu * {!product && <span className="text-xs text-blue-600">(Otomatik oluşturuldu)</span>}
          </label>
          <input
            type="text"
            value={formData.code}
            onChange={(e) => handleChange('code', e.target.value)}
            disabled={!product} // Yeni ürün eklerken kod değiştirilemez
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.code ? 'border-red-500' : !product ? 'border-blue-300 bg-blue-50' : 'border-gray-300'
            }`}
            placeholder="ORM-0001"
          />
          {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
          {!product && (
            <p className="text-xs text-blue-600 mt-1">
              Kod otomatik olarak sıralamaya göre oluşturulmuştur
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kategori
          </label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Kategori"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Birim
          </label>
          <input
            type="text"
            value={formData.unit}
            onChange={(e) => handleChange('unit', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="adet, kg, m2"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fiyat
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.price ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0.00"
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Açıklama
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Kartela açıklaması"
        />
      </div>

      <div className="flex space-x-4 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {product ? 'Güncelle' : 'Kaydet'}
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