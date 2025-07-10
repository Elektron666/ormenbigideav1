import React, { useState, useMemo } from 'react';
import { BarChart3, Users, Package, TrendingUp, Calendar, Download, FileText, PieChart } from 'lucide-react';
import { Customer, Product, Movement } from '../../types';
import { formatDate, formatCurrency } from '../../utils/helpers';

interface ReportsPageProps {
  customers: Customer[];
  products: Product[];
  movements: Movement[];
}

export function ReportsPage({ customers, products, movements }: ReportsPageProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year' | 'all'>('month');
  const [selectedReport, setSelectedReport] = useState<'overview' | 'customers' | 'products' | 'movements'>('overview');

  // Filter movements by selected period
  const filteredMovements = useMemo(() => {
    const now = new Date();
    const startDate = new Date();

    switch (selectedPeriod) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'all':
        return movements;
    }

    return movements.filter(movement => new Date(movement.createdAt) >= startDate);
  }, [movements, selectedPeriod]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalMovements = filteredMovements.length;
    const givenMovements = filteredMovements.filter(m => m.type === 'given').length;
    const takenMovements = filteredMovements.filter(m => m.type === 'taken').length;
    const returnedMovements = filteredMovements.filter(m => m.type === 'returned').length;

    const totalQuantityGiven = filteredMovements
      .filter(m => m.type === 'given')
      .reduce((sum, m) => sum + m.quantity, 0);

    const totalQuantityTaken = filteredMovements
      .filter(m => m.type === 'taken')
      .reduce((sum, m) => sum + m.quantity, 0);

    const activeCustomers = new Set(filteredMovements.map(m => m.customerId)).size;
    const activeProducts = new Set(filteredMovements.map(m => m.productId)).size;

    return {
      totalMovements,
      givenMovements,
      takenMovements,
      returnedMovements,
      totalQuantityGiven,
      totalQuantityTaken,
      activeCustomers,
      activeProducts,
    };
  }, [filteredMovements]);

  // Top customers by movement count
  const topCustomers = useMemo(() => {
    const customerMovements = new Map<string, number>();
    filteredMovements.forEach(movement => {
      const current = customerMovements.get(movement.customerId) || 0;
      customerMovements.set(movement.customerId, current + 1);
    });

    return Array.from(customerMovements.entries())
      .map(([customerId, count]) => ({
        customer: customers.find(c => c.id === customerId),
        movementCount: count,
      }))
      .filter(item => item.customer)
      .sort((a, b) => b.movementCount - a.movementCount)
      .slice(0, 5);
  }, [filteredMovements, customers]);

  // Top products by movement count
  const topProducts = useMemo(() => {
    const productMovements = new Map<string, number>();
    filteredMovements.forEach(movement => {
      const current = productMovements.get(movement.productId) || 0;
      productMovements.set(movement.productId, current + movement.quantity);
    });

    return Array.from(productMovements.entries())
      .map(([productId, quantity]) => ({
        product: products.find(p => p.id === productId),
        totalQuantity: quantity,
      }))
      .filter(item => item.product)
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 5);
  }, [filteredMovements, products]);

  const exportReport = () => {
    const reportData = {
      period: selectedPeriod,
      generatedAt: new Date().toISOString(),
      stats,
      topCustomers: topCustomers.map(item => ({
        customerName: item.customer?.name,
        movementCount: item.movementCount,
      })),
      topProducts: topProducts.map(item => ({
        productName: item.product?.name,
        productCode: item.product?.code,
        totalQuantity: item.totalQuantity,
      })),
      movements: filteredMovements.map(movement => ({
        date: formatDate(movement.createdAt),
        customer: customers.find(c => c.id === movement.customerId)?.name,
        product: products.find(p => p.id === movement.productId)?.name,
        type: movement.type,
        quantity: movement.quantity,
        notes: movement.notes,
      })),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ormen-tekstil-rapor-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Raporlar</h2>
              <p className="text-gray-600">Detaylı analiz ve istatistikler</p>
            </div>
          </div>
        </div>
        <button
          onClick={exportReport}
          className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2.5 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Download className="w-4 h-4" />
          <span>Rapor İndir</span>
        </button>
      </div>

      {/* Period and Report Type Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dönem</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="week">Son 7 Gün</option>
              <option value="month">Son 30 Gün</option>
              <option value="year">Son 1 Yıl</option>
              <option value="all">Tüm Zamanlar</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rapor Türü</label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="overview">Genel Bakış</option>
              <option value="customers">Müşteri Analizi</option>
              <option value="products">Kartela Analizi</option>
              <option value="movements">Hareket Analizi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Toplam Hareket</p>
              <p className="text-2xl font-bold">{stats.totalMovements}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Verilen Kartela</p>
              <p className="text-2xl font-bold">{stats.totalQuantityGiven}</p>
            </div>
            <Package className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Alınan Kartela</p>
              <p className="text-2xl font-bold">{stats.totalQuantityTaken}</p>
            </div>
            <Package className="w-8 h-8 text-orange-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Aktif Müşteri</p>
              <p className="text-2xl font-bold">{stats.activeCustomers}</p>
            </div>
            <Users className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Movement Type Distribution */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hareket Türü Dağılımı</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 font-medium">Verildi</p>
                <p className="text-2xl font-bold text-green-800">{stats.givenMovements}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 font-medium">Alındı</p>
                <p className="text-2xl font-bold text-blue-800">{stats.takenMovements}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 font-medium">İade</p>
                <p className="text-2xl font-bold text-orange-800">{stats.returnedMovements}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Customers */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">En Aktif Müşteriler</h3>
          </div>
          <div className="space-y-3">
            {topCustomers.map((item, index) => (
              <div key={item.customer?.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.customer?.name}</p>
                    {item.customer?.company && (
                      <p className="text-sm text-gray-600">{item.customer.company}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{item.movementCount}</p>
                  <p className="text-xs text-gray-500">hareket</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Package className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">En Çok Kullanılan Kartelalar</h3>
          </div>
          <div className="space-y-3">
            {topProducts.map((item, index) => (
              <div key={item.product?.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-green-600">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.product?.name}</p>
                    <p className="text-sm text-gray-600">{item.product?.code}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{item.totalQuantity}</p>
                  <p className="text-xs text-gray-500">adet</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Movements */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Son Hareketler</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Müşteri</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kartela</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tür</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Miktar</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMovements.slice(0, 10).map((movement) => {
                const customer = customers.find(c => c.id === movement.customerId);
                const product = products.find(p => p.id === movement.productId);
                
                return (
                  <tr key={movement.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {formatDate(movement.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {customer?.name || 'Bilinmeyen'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {product?.name || 'Bilinmeyen'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        movement.type === 'given' ? 'bg-green-100 text-green-800' :
                        movement.type === 'taken' ? 'bg-blue-100 text-blue-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {movement.type === 'given' ? 'Verildi' :
                         movement.type === 'taken' ? 'Alındı' : 'İade'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {movement.quantity} adet
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}