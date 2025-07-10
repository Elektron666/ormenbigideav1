import React from 'react';
import { Users, Package, TrendingUp, Calendar, Scissors, Clock } from 'lucide-react';
import { Customer, Product, Movement } from '../../types';
import { formatDate } from '../../utils/helpers';

interface DashboardProps {
  customers: Customer[];
  products: Product[];
  movements: Movement[];
}

export function Dashboard({ customers, products, movements }: DashboardProps) {
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const recentMovements = movements
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const stats = [
    {
      title: 'Toplam Müşteri',
      value: customers.length,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Toplam Kartela',
      value: products.length,
      icon: Package,
      color: 'bg-green-500',
    },
    {
      title: 'Toplam Hareket',
      value: movements.length,
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
    {
      title: 'Bu Ay',
      value: movements.filter(m => {
        const date = new Date(m.createdAt);
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      }).length,
      icon: Calendar,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* ORMEN TEKSTİL Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                <Scissors className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">ORMEN TEKSTİL</h1>
                <p className="text-white/80 text-lg">Kartela Yönetim Sistemi</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center space-x-2 text-white/90 mb-2">
                <Clock className="w-5 h-5" />
                <span className="text-lg font-semibold">
                  {currentTime.toLocaleTimeString('tr-TR')}
                </span>
              </div>
              <p className="text-white/70">
                {currentTime.toLocaleDateString('tr-TR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900">Sistem Özeti</h2>
        <p className="text-gray-600 mt-1">Güncel istatistikler ve son hareketler</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className={`${stat.color} rounded-lg p-3`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Movements */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Son Hareketler</h3>
        </div>
        <div className="p-6">
          {recentMovements.length > 0 ? (
            <div className="space-y-4">
              {recentMovements.map((movement) => {
                const customer = customers.find(c => c.id === movement.customerId);
                const product = products.find(p => p.id === movement.productId);
                
                return (
                  <div key={movement.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          movement.type === 'given' ? 'bg-green-500' :
                          movement.type === 'taken' ? 'bg-blue-500' : 'bg-orange-500'
                        }`} />
                        <div>
                          <p className="font-medium text-gray-900">
                            {customer?.name || 'Bilinmeyen Müşteri'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {product?.name || 'Bilinmeyen Kartela'} - {movement.quantity} adet
                          </p>
                        </div>
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
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Henüz hareket kaydı bulunmuyor</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <h4 className="font-semibold mb-2">Hızlı Müşteri Ekleme</h4>
          <p className="text-blue-100 text-sm mb-4">Yeni müşteri ekleyerek sistemi genişletin</p>
          <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
            Müşteri Ekle
          </button>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <h4 className="font-semibold mb-2">Kartela Yönetimi</h4>
          <p className="text-green-100 text-sm mb-4">Yeni kartela ekleyin veya mevcut olanları düzenleyin</p>
          <button className="bg-white text-green-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors">
            Kartela Ekle
          </button>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <h4 className="font-semibold mb-2">Hareket Kaydı</h4>
          <p className="text-purple-100 text-sm mb-4">Kartela verme/alma işlemlerini kaydedin</p>
          <button className="bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors">
            Hareket Ekle
          </button>
        </div>
      </div>
    </div>
  );
}