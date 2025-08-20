import React from 'react';
import { Settings, Database, Shield, Info } from 'lucide-react';
import { UpdateManager } from './UpdateManager';

const SettingsPage: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <Settings className="mr-3 text-blue-600" />
          Ayarlar
        </h1>
        <p className="text-gray-600">
          Sistem ayarlarını yönetin ve uygulamayı özelleştirin
        </p>
      </div>

      <div className="grid gap-6">
        {/* Sistem Bilgileri */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Info className="mr-2 text-blue-600" />
            Sistem Bilgileri
          </h2>
          <UpdateManager />
        </div>

        {/* Veri Yönetimi */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Database className="mr-2 text-green-600" />
            Veri Yönetimi
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">Yerel Depolama</h3>
              <p className="text-sm text-gray-600 mb-3">
                Tüm verileriniz tarayıcınızda güvenle saklanır
              </p>
              <div className="text-xs text-gray-500">
                Konum: localStorage (Tarayıcı)
              </div>
            </div>
          </div>
        </div>

        {/* Güvenlik */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Shield className="mr-2 text-red-600" />
            Güvenlik
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-medium text-green-800 mb-2">✅ Güvenli Depolama</h3>
              <p className="text-sm text-green-700">
                Verileriniz sadece sizin cihazınızda saklanır, hiçbir sunucuya gönderilmez
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-medium text-blue-800 mb-2">🔒 Gizlilik</h3>
              <p className="text-sm text-blue-700">
                Kişisel bilgileriniz tamamen özel kalır
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { SettingsPage };