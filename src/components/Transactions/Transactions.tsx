import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2, ArrowRightLeft, Calendar, User, Package } from 'lucide-react';
import { Customer, Product, Movement } from '../../types';

interface Transaction {
  id: string;
  customerId: string;
  productId: string;
  type: 'given' | 'taken' | 'returned';
  quantity: number;
  notes?: string;
  createdAt: Date;
}

interface TransactionWithDetails extends Transaction {
  customer: Customer;
  product: Product;
}

interface TransactionsProps {
  customers: Customer[];
  products: Product[];
  movements: Movement[];
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  onUpdateTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export function Transactions({ 
  customers, 
  products, 
  movements, 
  onAddTransaction, 
  onUpdateTransaction, 
  onDeleteTransaction 
}: TransactionsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [productFilter, setProductFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState({
    customerId: '',
    productId: '',
    type: 'given' as 'given' | 'taken' | 'returned',
    quantity: 1,
    notes: '',
  });

  // Convert movements to transactions with details
  const transactionsWithDetails: TransactionWithDetails[] = useMemo(() => {
    return movements.map(movement => {
      const customer = customers.find(c => c.id === movement.customerId);
      const product = products.find(p => p.id === movement.productId);
      
      if (!customer || !product) return null;
      
      return {
        id: movement.id,
        customerId: movement.customerId,
        productId: movement.productId,
        type: movement.type,
        quantity: movement.quantity,
        notes: movement.notes,
        createdAt: movement.createdAt,
        customer,
        product,
      };
    }).filter(Boolean) as TransactionWithDetails[];
  }, [movements, customers, products]);

  const filteredTransactions = useMemo(() => {
    return transactionsWithDetails.filter(transaction => {
      const matchesSearch = !searchTerm || 
        transaction.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (transaction.notes && transaction.notes.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = !typeFilter || transaction.type === typeFilter;
      const matchesCustomer = !customerFilter || transaction.customerId === customerFilter;
      const matchesProduct = !productFilter || transaction.productId === productFilter;
      
      let matchesDate = true;
      if (dateFilter) {
        const transactionDate = new Date(transaction.createdAt).toISOString().split('T')[0];
        matchesDate = transactionDate === dateFilter;
      }
      
      return matchesSearch && matchesType && matchesCustomer && matchesProduct && matchesDate;
    });
  }, [transactionsWithDetails, searchTerm, typeFilter, customerFilter, productFilter, dateFilter]);

  const resetForm = () => {
    setFormData({
      customerId: '',
      productId: '',
      type: 'given',
      quantity: 1,
      notes: '',
    });
  };

  const handleAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleEdit = (transaction: TransactionWithDetails) => {
    setSelectedTransaction(transaction);
    setFormData({
      customerId: transaction.customerId,
      productId: transaction.productId,
      type: transaction.type,
      quantity: transaction.quantity,
      notes: transaction.notes || '',
    });
    setShowEditModal(true);
  };

  const handleView = (transaction: TransactionWithDetails) => {
    setSelectedTransaction(transaction);
    setShowViewModal(true);
  };

  const handleDelete = (transaction: TransactionWithDetails) => {
    if (window.confirm(`${transaction.customer.name} - ${transaction.product.name} hareketini silmek istediğinizden emin misiniz?`)) {
      onDeleteTransaction(transaction.id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedTransaction) {
      onUpdateTransaction({
        ...selectedTransaction,
        customerId: formData.customerId,
        productId: formData.productId,
        type: formData.type,
        quantity: formData.quantity,
        notes: formData.notes.trim() || undefined,
      });
      setShowEditModal(false);
    } else {
      onAddTransaction({
        customerId: formData.customerId,
        productId: formData.productId,
        type: formData.type,
        quantity: formData.quantity,
        notes: formData.notes.trim() || undefined,
      });
      setShowAddModal(false);
    }
    
    resetForm();
    setSelectedTransaction(null);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'given': return 'Verildi';
      case 'taken': return 'Alındı';
      case 'returned': return 'İade';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'given': return 'bg-red-100 text-red-800';
      case 'taken': return 'bg-blue-100 text-blue-800';
      case 'returned': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hareketler</h1>
          <p className="text-gray-600">Toplam {transactionsWithDetails.length} hareket</p>
        </div>
        
        <button
          onClick={handleAdd}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Hareket</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Hareket ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">Tüm Türler</option>
            <option value="given">Verildi</option>
            <option value="taken">Alındı</option>
            <option value="returned">İade</option>
          </select>
          
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={customerFilter}
            onChange={(e) => setCustomerFilter(e.target.value)}
          >
            <option value="">Tüm Müşteriler</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
          
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
          >
            <option value="">Tüm Kartelalar</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} ({product.code})
              </option>
            ))}
          </select>
          
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Müşteri
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kartela
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tür
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Miktar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mr-3 shadow-md">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {transaction.customer.name}
                        </div>
                        {transaction.customer.company && (
                          <div className="text-sm text-gray-500">
                            {transaction.customer.company}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center mr-3 shadow-md">
                        <Package className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {transaction.product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {transaction.product.code}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(transaction.type)}`}>
                      {getTypeLabel(transaction.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDateTime(transaction.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleView(transaction)}
                        className="text-blue-600 hover:text-blue-700 p-1 rounded"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(transaction)}
                        className="text-gray-600 hover:text-gray-700 p-1 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(transaction)}
                        className="text-red-600 hover:text-red-700 p-1 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowRightLeft className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || typeFilter || customerFilter || productFilter || dateFilter 
                ? 'Hareket bulunamadı' 
                : 'Henüz hareket yok'
              }
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || typeFilter || customerFilter || productFilter || dateFilter
                ? 'Arama kriterlerinizi değiştirip tekrar deneyin'
                : 'İlk hareketinizi ekleyerek başlayın'
              }
            </p>
            {!searchTerm && !typeFilter && !customerFilter && !productFilter && !dateFilter && (
              <button
                onClick={handleAdd}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>İlk Hareketi Ekle</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {showEditModal ? 'Hareket Düzenle' : 'Yeni Hareket'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Müşteri *
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  required
                >
                  <option value="">Müşteri seçin</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kartela *
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  required
                >
                  <option value="">Kartela seçin</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} ({product.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hareket Türü *
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'given' | 'taken' | 'returned' })}
                  required
                >
                  <option value="given">Verildi</option>
                  <option value="taken">Alındı</option>
                  <option value="returned">İade</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Miktar *
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notlar
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Hareket ile ilgili notlar..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    resetForm();
                    setSelectedTransaction(null);
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 py-2.5 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {showEditModal ? 'Güncelle' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hareket Detayları</h3>
            {(() => {
              const transactionWithDetails = transactionsWithDetails.find(t => t.id === selectedTransaction.id);
              if (!transactionWithDetails) return null;

              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Müşteri
                      </label>
                      <p className="text-gray-900">{transactionWithDetails.customer.name}</p>
                      {transactionWithDetails.customer.company && (
                        <p className="text-sm text-gray-500">{transactionWithDetails.customer.company}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kartela
                      </label>
                      <p className="text-gray-900">{transactionWithDetails.product.name}</p>
                      <p className="text-sm text-gray-500">{transactionWithDetails.product.code}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hareket Türü
                      </label>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(transactionWithDetails.type)}`}>
                        {getTypeLabel(transactionWithDetails.type)}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Miktar
                      </label>
                      <p className="text-gray-900">{transactionWithDetails.quantity}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tarih
                      </label>
                      <p className="text-gray-900">{formatDateTime(transactionWithDetails.createdAt)}</p>
                    </div>
                    {transactionWithDetails.notes && (
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Notlar
                        </label>
                        <p className="text-gray-900">{transactionWithDetails.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
            <div className="flex justify-end pt-4">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedTransaction(null);
                }}
                className="bg-gray-200 text-gray-800 py-2.5 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}