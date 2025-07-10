import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, Package, Tag } from 'lucide-react';
import { Product } from '../../types';
import { SearchFilter } from '../Common/SearchFilter';
import { formatDate, formatCurrency, filterAndSort } from '../../utils/helpers';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export function ProductList({ products, onEdit, onDelete, onAdd }: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<keyof Product>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const sortOptions = [
    { value: 'name', label: 'İsim' },
    { value: 'code', label: 'Kod' },
    { value: 'category', label: 'Kategori' },
    { value: 'price', label: 'Fiyat' },
    { value: 'createdAt', label: 'Oluşturma Tarihi' },
  ];

  const filteredProducts = useMemo(() => {
    return filterAndSort(
      products,
      searchTerm,
      ['name', 'code', 'category', 'description'],
      sortBy,
      sortOrder
    );
  }, [products, searchTerm, sortBy, sortOrder]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Kartelalar</h2>
          <p className="text-gray-600 mt-1">Toplam {products.length} kartela</p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Kartela</span>
        </button>
      </div>

      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={(field) => setSortBy(field as keyof Product)}
        onSortOrderToggle={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
        sortOptions={sortOptions}
        placeholder="Kartela ara..."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">{product.name}</h3>
                <div className="flex items-center text-gray-600 mt-1">
                  <Tag className="w-4 h-4 mr-1" />
                  <span className="text-sm">{product.code}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {product.category && (
                <div className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {product.category}
                </div>
              )}
              {product.description && (
                <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
              )}
              {product.price && (
                <div className="text-lg font-semibold text-green-600">
                  {formatCurrency(product.price)}
                  {product.unit && <span className="text-sm text-gray-500 ml-1">/ {product.unit}</span>}
                </div>
              )}
            </div>

            <div className="text-xs text-gray-500 mb-4">
              Oluşturulma: {formatDate(product.createdAt)}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(product)}
                className="flex-1 flex items-center justify-center space-x-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span className="text-sm">Düzenle</span>
              </button>
              <button
                onClick={() => onDelete(product.id)}
                className="flex items-center justify-center bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Package className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Kartela bulunamadı</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Arama kriterlerinize uygun kartela bulunamadı.' : 'Henüz hiç kartela eklenmemiş.'}
          </p>
          {!searchTerm && (
            <button
              onClick={onAdd}
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>İlk Kartelayı Ekle</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}