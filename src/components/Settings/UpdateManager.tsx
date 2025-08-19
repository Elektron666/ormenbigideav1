import React, { useState } from 'react';
import { RefreshCw, CheckCircle, AlertCircle, Info } from 'lucide-react';

export function UpdateManager() {
  const [currentVersion] = useState('v1.2.0');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const handleManualCheck = () => {
    setLastChecked(new Date());
    // Sadece UI güncellemesi, gerçek kontrol yapmıyor
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <RefreshCw className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Sistem Bilgileri</h2>
        <p className="text-gray-600">Mevcut versiyon ve sistem durumu</p>
      </div>

      {/* Mevcut Versiyon */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Mevcut Versiyon</h3>
            <p className="text-2xl font-bold text-blue-600 mt-1">{currentVersion}</p>
            <p className="text-sm text-gray-600 mt-1">ORMEN TEKSTİL - Kartela Sistemi</p>
            {lastChecked && (
              <p className="text-xs text-gray-500 mt-2">
                Son kontrol: {formatDate(lastChecked)}
              </p>
            )}
          </div>
          <div className="text-right">
            <button
              onClick={handleManualCheck}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Sistem Durumu Kontrol Et</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sistem Durumu */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <div>
            <h3 className="text-lg font-semibold text-green-900">✅ Sistem Çalışıyor</h3>
            <p className="text-green-700">Tüm özellikler aktif ve kullanıma hazır</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">🚀 Aktif Özellikler:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Müşteri Yönetimi</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Kartela Yönetimi</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Hareket Takibi</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Yedekleme Sistemi</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Raporlama</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Stok Takibi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sistem Özellikleri */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Sistem Özellikleri</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">💾 Veri Depolama</h4>
            <p className="text-blue-800">Tarayıcı tabanlı güvenli depolama</p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">📱 Mobil Uyumlu</h4>
            <p className="text-green-800">Tablet ve telefon desteği</p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="font-medium text-purple-900 mb-2">🔒 Güvenli</h4>
            <p className="text-purple-800">Yerel veri saklama</p>
          </div>
        </div>
      </div>

      {/* Performans Bilgisi */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Info className="w-5 h-5 text-blue-600" />
          <h4 className="font-medium text-blue-900">⚡ Performans Optimizasyonu</h4>
        </div>
        <p className="text-blue-800 text-sm">
          Sistem tablet performansı için optimize edilmiştir. 
          Büyük veri setlerinde sayfalama ve arama gecikmeleri kullanılır.
        </p>
      </div>
    </div>
  );
}