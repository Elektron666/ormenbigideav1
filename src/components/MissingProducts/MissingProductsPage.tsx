import React, { useState, useMemo } from 'react';
import { Search, User, Package, AlertTriangle, CheckCircle, Eye, ArrowRight } from 'lucide-react';
import { Customer, Product, Movement } from '../../types';

interface MissingProductsPageProps {
  customers: Customer[];
  products: Product[];
  movements: Movement[];
}

export function MissingProductsPage({ customers, products, movements }: MissingProductsPageProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerSearch, setCustomerSearch] = useState('');

  // Müşteri arama - Türkçe karakter desteği
  const filteredCustomers = useMemo(() => {
    if (!customerSearch) return customers;
    
    const normalizeText = (text: string) => {
      return text
        .toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/İ/g, 'i')
        .replace(/Ğ/g, 'g')
        .replace(/Ü/g, 'u')
        .replace(/Ş/g, 's')
        .replace(/Ö/g, 'o')
        .replace(/Ç/g, 'c');
    };
    
    const normalizedSearchTerm = normalizeText(customerSearch);
    
    return customers.filter(customer =>
      normalizeText(customer.name).includes(normalizedSearchTerm) ||
      (customer.company && normalizeText(customer.company).includes(normalizedSearchTerm))
    );
  }, [customers, customerSearch]);

  // Seçili müşteri için kartela durumu hesaplama
  const customerProductStatus = useMemo(() => {
    if (!selectedCustomer) return { given: [], missing: [] };

    // Bu müşteriye verilen kartelalar
    const customerMovements = movements.filter(m => 
      m.customerId === selectedCustomer.id && m.type === 'given'
    );

    const givenProductIds = new Set(customerMovements.map(m => m.productId));
    
    // Verilen kartelalar
    const givenProducts = products.filter(p => givenProductIds.has(p.id)).map(product => {
      const productMovements = customerMovements.filter(m => m.productId === product.id);
      const totalQuantity = productMovements.reduce((sum, m) => sum + m.quantity, 0);
      const lastMovement = productMovements.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];
      
      return {
        product,
        quantity: totalQuantity,
        lastMovementDate: lastMovement.createdAt
      };
    });

    // Verilmeyen kartelalar
    const missingProducts = products.filter(p => !givenProductIds.has(p.id));

    return {
      given: givenProducts.sort((a, b) => a.product.name.localeCompare(b.product.name, 'tr-TR')),
      missing: missingProducts.sort((a, b) => a.name.localeCompare(b.name, 'tr-TR'))
    };
  }, [selectedCustomer, products, movements]);

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  const handleBackToList = () => {
    setSelectedCustomer(null);
    setCustomerSearch('');
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {!selectedCustomer ? (
        // Müşteri Seçim Ekranı
        <>
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Eksik Kartelalar</h2>
                <p className="text-gray-600">Müşteri seçerek eksik kartelaları görüntüleyin</p>
              </div>
            </div>
          </div>

          {/* Müşteri Arama */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                placeholder="Müşteri ara... (EMİN MOBİLYA, AHMET, vb.)"
              />
            </div>

            {/* Müşteri Listesi */}
            <div className="max-h-96 overflow-y-auto">
              {filteredCustomers.length > 0 ? (
                <div className="grid gap-3">
                  {filteredCustomers.map((customer, index) => (
                    <div
                      key={customer.id}
                      onClick={() => handleCustomerSelect(customer)}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 cursor-pointer transition-all duration-200 transform hover:scale-[1.02]"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-orange-600">{index + 1}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                          {customer.company && (
                            <p className="text-sm text-gray-600">{customer.company}</p>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">
                    {customerSearch ? 'Arama kriterlerine uygun müşteri bulunamadı' : 'Müşteri bulunamadı'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        // Müşteri Detay Ekranı
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToList}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowRight className="w-5 h-5 text-gray-600 transform rotate-180" />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedCustomer.name}</h2>
                <p className="text-gray-600">Kartela Durumu</p>
              </div>
            </div>
          </div>

          {/* İstatistikler */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Verilen Kartelalar</p>
                  <p className="text-2xl font-bold">{customerProductStatus.given.length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">Eksik Kartelalar</p>
                  <p className="text-2xl font-bold">{customerProductStatus.missing.length}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Toplam Kartela</p>
                  <p className="text-2xl font-bold">{products.length}</p>
                </div>
                <Package className="w-8 h-8 text-blue-200" />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Verilen Kartelalar */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Verilen Kartelalar</h3>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  {customerProductStatus.given.length} adet
                </span>
              </div>

              <div className="max-h-96 overflow-y-auto space-y-2">
                {customerProductStatus.given.length > 0 ? (
                  customerProductStatus.given.map((item, index) => (
                    <div key={item.product.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-green-600">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{item.product.name}</p>
                          <p className="text-sm text-gray-600">{item.product.code}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-700">{item.quantity} adet</p>
                        <p className="text-xs text-green-600">
                          {formatDate(item.lastMovementDate)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">Henüz kartela verilmemiş</p>
                  </div>
                )}
              </div>
            </div>

            {/* Eksik Kartelalar */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="text-lg font-semibold text-gray-900">Eksik Kartelalar</h3>
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                  {customerProductStatus.missing.length} adet
                </span>
              </div>

              <div className="max-h-96 overflow-y-auto space-y-2">
                {customerProductStatus.missing.length > 0 ? (
                  customerProductStatus.missing.map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-red-600">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-600">{product.code}</p>
                          {product.category && (
                            <span className="inline-block bg-red-200 text-red-800 text-xs px-2 py-1 rounded-full mt-1">
                              {product.category}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-red-600 font-medium text-sm">
                        Verilmedi
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">Tüm kartelalar verilmiş! 🎉</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}