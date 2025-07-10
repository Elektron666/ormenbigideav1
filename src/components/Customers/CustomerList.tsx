import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, Eye, Phone, Mail, Building } from 'lucide-react';
import { Customer } from '../../types';
import { SearchFilter } from '../Common/SearchFilter';
import { formatDate, filterAndSort } from '../../utils/helpers';

interface CustomerListProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
  onView: (customer: Customer) => void;
  onAdd: () => void;
}

export function CustomerList({ customers, onEdit, onDelete, onView, onAdd }: CustomerListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<keyof Customer>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const sortOptions = [
    { value: 'name', label: 'İsim' },
    { value: 'company', label: 'Şirket' },
    { value: 'createdAt', label: 'Oluşturma Tarihi' },
    { value: 'updatedAt', label: 'Güncelleme Tarihi' },
  ];

  const filteredCustomers = useMemo(() => {
    return filterAndSort(
      customers,
      searchTerm,
      ['name', 'company', 'phone', 'email'],
      sortBy,
      sortOrder
    );
  }, [customers, searchTerm, sortBy, sortOrder]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Müşteriler</h2>
          <p className="text-gray-600 mt-1">Toplam {customers.length} müşteri</p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Müşteri</span>
        </button>
      </div>

      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={(field) => setSortBy(field as keyof Customer)}
        onSortOrderToggle={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
        sortOptions={sortOptions}
        placeholder="Müşteri ara..."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">{customer.name}</h3>
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
                className="flex-1 flex items-center justify-center space-x-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span className="text-sm">Görüntüle</span>
              </button>
              <button
                onClick={() => onEdit(customer)}
                className="flex items-center justify-center bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(customer.id)}
                className="flex items-center justify-center bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

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