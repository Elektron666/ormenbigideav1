import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, Package, Tag, Scissors } from 'lucide-react';
import { Product } from '../../types';
import { SearchFilter } from '../Common/SearchFilter';
import { formatDate, formatCurrency, filterAndSort } from '../../utils/helpers';
import { debounce } from '../../utils/performance';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  onBulkAdd: () => void;
}

export function ProductList({ products, onEdit, onDelete, onAdd, onBulkAdd }: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<keyof Product>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [displayCount, setDisplayCount] = useState(20); // Pagination for performance

  const sortOptions = [
    { value: 'name', label: 'İsim' },
    { value: 'code', label: 'Kod' },
    { value: 'category', label: 'Kategori' },
    { value: 'price', label: 'Fiyat' },
    { value: 'createdAt', label: 'Oluşturma Tarihi' },
  ];

  // Debounced search for better performance
  const debouncedSetSearchTerm = useMemo(
    () => debounce(setSearchTerm, 300),
    []
  );

  const filteredProducts = useMemo(() => {
    const filtered = filterAndSort(
      products,
      searchTerm,
      ['name', 'code', 'category', 'description'],
      sortBy,
      sortOrder
    ).slice(0, displayCount); // Limit display for performance
    
    // Add numbering for display
    return filtered.map((product, index) => ({
      ...product,
      displayIndex: index + 1
    }));
  }, [products, searchTerm, sortBy, sortOrder, displayCount]);

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 20);
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <Scissors className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Kartelalar</h2>
              <p className="text-gray-600">Toplam {products.length} kartela kayıtlı</p>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onBulkAdd}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2.5 rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Package className="w-4 h-4" />
            <span>Toplu Yükle</span>
          </button>
          <button
            onClick={onAdd}
            className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2.5 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Kartela</span>
          </button>
        </div>
      </div>

      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={debouncedSetSearchTerm}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={(field) => setSortBy(field as keyof Product)}
        onSortOrderToggle={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
        sortOptions={sortOptions}
        placeholder="Kartela ara..."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product, index) => (
          <div
            key={product.id}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-green-300 transform hover:scale-[1.02]"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mr-3 border border-green-200">
                <span className="text-sm font-bold text-green-700">{product.displayIndex}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg">{product.name}</h3>
                <div className="flex items-center text-gray-600 mt-1">
                  <Tag className="w-4 h-4 mr-1" />
                  <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-blue-700">
                    {product.code}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {product.category && (
                <div className="inline-block bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-xs px-3 py-1 rounded-full border border-blue-200 font-medium">
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
                className="flex-1 flex items-center justify-center space-x-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-3 py-2.5 rounded-lg hover:from-green-200 hover:to-emerald-200 transition-all duration-200 font-medium"
              >
                <Edit className="w-4 h-4" />
                <span className="text-sm">Düzenle</span>
              </button>
              <button
                onClick={() => onDelete(product.id)}
                className="flex items-center justify-center bg-gradient-to-r from-red-100 to-pink-100 text-red-700 px-3 py-2.5 rounded-lg hover:from-red-200 hover:to-pink-200 transition-all duration-200"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {products.length > displayCount && (
        <div className="text-center">
          <button
            onClick={handleLoadMore}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Daha Fazla Yükle ({products.length - displayCount} kaldı)
          </button>
        </div>
      )}

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