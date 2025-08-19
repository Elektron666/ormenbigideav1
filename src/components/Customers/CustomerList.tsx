import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, Eye, Phone, Mail, Building, Users, Scissors } from 'lucide-react';
import { Customer } from '../../types';
import { SearchFilter } from '../Common/SearchFilter';
import { formatDate, filterAndSort } from '../../utils/helpers';
import { tabletDebounce } from '../../utils/performance';

interface CustomerListProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
  onView: (customer: Customer) => void;
  onAdd: () => void;
  onBulkAdd: () => void;
}

export function CustomerList({ customers, onEdit, onDelete, onView, onAdd, onBulkAdd }: CustomerListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<keyof Customer>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [displayCount, setDisplayCount] = useState(10); // Tablet için daha az

  const sortOptions = [
    { value: 'name', label: 'İsim' },
    { value: 'company', label: 'Şirket' },
    { value: 'createdAt', label: 'Oluşturma Tarihi' },
    { value: 'updatedAt', label: 'Güncelleme Tarihi' },
  ];

  // Debounced search for better performance
  const debouncedSetSearchTerm = useMemo(
    () => tabletDebounce(setSearchTerm, 500),
    []
  );

  const filteredCustomers = useMemo(() => {
    const filtered = filterAndSort(
      customers,
      searchTerm,
      ['name', 'company', 'phone', 'email'],
      sortBy,
      sortOrder
    ).slice(0, displayCount); // Limit display for performance
    
    // Add numbering for display
    return filtered.map((customer, index) => ({
      ...customer,
      displayIndex: index + 1
    }));
  }, [customers, searchTerm, sortBy, sortOrder, displayCount]);

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 10); // Tablet için daha az yükleme
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Müşteriler</h2>
              <p className="text-gray-600">Toplam {customers.length} müşteri kayıtlı</p>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onBulkAdd}
            className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2.5 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Users className="w-4 h-4" />
            <span>Toplu Yükle</span>
          </button>
          <button
            onClick={onAdd}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2.5 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Müşteri</span>
          </button>
        </div>
      </div>

      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={debouncedSetSearchTerm}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={(field) => setSortBy(field as keyof Customer)}
        onSortOrderToggle={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
        sortOptions={sortOptions}
        placeholder="Müşteri ara..."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCustomers.map((customer, index) => (
          <div
            key={customer.id}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-300 transform hover:scale-[1.02]"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mr-3 border border-blue-200">
                <span className="text-sm font-bold text-blue-700">{customer.displayIndex}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg">{customer.name}</h3>
                {customer.company && (
                  <div className="flex items-center text-gray-600 mt-1">
                    <Building className="w-4 h-4 mr-1" />
                    <span className="text-sm">{customer.company}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {customer.phone && (
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <span className="text-sm">{customer.phone}</span>
                </div>
              )}
              {customer.email && (
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="text-sm">{customer.email}</span>
                </div>
              )}
            </div>

            <div className="text-xs text-gray-500 mb-4">
              Oluşturulma: {formatDate(customer.createdAt)}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => onView(customer)}
                className="flex-1 flex items-center justify-center space-x-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-3 py-2.5 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all duration-200 font-medium"
              >
                <Eye className="w-4 h-4" />
                <span className="text-sm">Görüntüle</span>
              </button>
              <button
                onClick={() => onEdit(customer)}
                className="flex items-center justify-center bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-3 py-2.5 rounded-lg hover:from-blue-200 hover:to-indigo-200 transition-all duration-200"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(customer.id)}
                className="flex items-center justify-center bg-gradient-to-r from-red-100 to-pink-100 text-red-700 px-3 py-2.5 rounded-lg hover:from-red-200 hover:to-pink-200 transition-all duration-200"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {customers.length > displayCount && (
        <div className="text-center">
          <button
            onClick={handleLoadMore}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Daha Fazla Yükle ({customers.length - displayCount} kaldı)
          </button>
        </div>
      )}

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Users className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Müşteri bulunamadı</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Arama kriterlerinize uygun müşteri bulunamadı.' : 'Henüz hiç müşteri eklenmemiş.'}
          </p>
          {!searchTerm && (
            <button
              onClick={onAdd}
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>İlk Müşteriyi Ekle</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}