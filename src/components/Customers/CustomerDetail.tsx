import React from 'react';
import { X, Phone, Mail, Building, Calendar, Package, ArrowLeft } from 'lucide-react';
import { Customer, Product, Movement } from '../../types';
import { formatDate } from '../../utils/helpers';

interface CustomerDetailProps {
  customer: Customer;
  customerProducts: Array<{
    product: Product;
    quantity: number;
    lastMovementDate: number;
  }>;
  movements: Movement[];
  products: Product[];
  onClose: () => void;
}

export function CustomerDetail({ 
  customer, 
  customerProducts, 
  movements, 
  products, 
  onClose 
}: CustomerDetailProps) {
  const customerMovements = movements
    .filter(m => m.customerId === customer.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-50">
      <div className="min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
                  <p className="text-gray-600">Müşteri Detayları</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Müşteri Bilgileri</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Şirket</p>
                    <p className="font-medium text-gray-900">{customer.company || 'Belirtilmemiş'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Telefon</p>
                    <p className="font-medium text-gray-900">{customer.phone || 'Belirtilmemiş'}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">E-posta</p>
                    <p className="font-medium text-gray-900">{customer.email || 'Belirtilmemiş'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Kayıt Tarihi</p>
                    <p className="font-medium text-gray-900">{formatDate(customer.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {customer.address && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Adres</p>
                <p className="text-gray-900">{customer.address}</p>
              </div>
            )}
            
            {customer.notes && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Notlar</p>
                <p className="text-gray-900">{customer.notes}</p>
              </div>
            )}
          </div>

          {/* Current Products */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Package className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Mevcut Kartelalar</h2>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {customerProducts.length} adet
              </span>
            </div>
            
            {customerProducts.length > 0 ? (
              <div className="grid gap-3">
                {customerProducts
                  .sort((a, b) => a.product.name.localeCompare(b.product.name, 'tr'))
                  .map((item, index) => (
                  <div key={item.product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.product.name}</p>
                        <p className="text-sm text-gray-600">{item.product.code}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{item.quantity} adet</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(new Date(item.lastMovementDate))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">Bu müşteride henüz kartela bulunmuyor</p>
              </div>
            )}
          </div>

          {/* Movement History */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Hareket Geçmişi</h2>
            
            {customerMovements.length > 0 ? (
              <div className="space-y-3">
                {customerMovements.map((movement, index) => {
                  const product = products.find(p => p.id === movement.productId);
                  return (
                    <div key={movement.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          movement.type === 'given' ? 'bg-green-500' :
                          movement.type === 'taken' ? 'bg-blue-500' : 'bg-orange-500'
                        }`} />
                        <div>
                          <p className="font-medium text-gray-900">
                            {product?.name || 'Bilinmeyen Kartela'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {product?.code} - {movement.quantity} adet
                          </p>
                          {movement.notes && (
                            <p className="text-xs text-gray-500 mt-1">{movement.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${
                          movement.type === 'given' ? 'text-green-600' :
                          movement.type === 'taken' ? 'text-blue-600' : 'text-orange-600'
                        }`}>
                          {movement.type === 'given' ? 'Verildi' :
                           movement.type === 'taken' ? 'Alındı' : 'İade'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(movement.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">Henüz hareket kaydı bulunmuyor</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}