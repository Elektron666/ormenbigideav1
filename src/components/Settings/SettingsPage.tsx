import React, { useState } from 'react';
import { Settings, User, Bell, Shield, Database, Info, Save, RotateCcw, RefreshCw } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { UpdateManager } from './UpdateManager';

interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: 'tr' | 'en';
  notifications: boolean;
  autoSave: boolean;
  pageSize: number;
  dateFormat: 'dd/MM/yyyy' | 'MM/dd/yyyy' | 'yyyy-MM-dd';
  currency: 'TRY' | 'USD' | 'EUR';
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
}

const defaultSettings: AppSettings = {
  theme: 'light',
  language: 'tr',
  notifications: true,
  autoSave: true,
  pageSize: 20,
  dateFormat: 'dd/MM/yyyy',
  currency: 'TRY',
  companyName: 'ORMEN TEKSTİL',
  companyAddress: '',
  companyPhone: '',
  companyEmail: '',
};

export function SettingsPage() {
  const [settings, setSettings] = useLocalStorage<AppSettings>('ormen_settings', defaultSettings);
  const [tempSettings, setTempSettings] = useState<AppSettings>(settings);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'settings' | 'updates'>('settings');

  const handleSave = () => {
    setSettings(tempSettings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleReset = () => {
    if (window.confirm('Tüm ayarları varsayılan değerlere sıfırlamak istediğinizden emin misiniz?')) {
      setTempSettings(defaultSettings);
      setSettings(defaultSettings);
    }
  };

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setTempSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-gray-500 to-slate-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Settings className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Sistem Ayarları</h2>
        <p className="text-gray-600">Uygulamanızı kişiselleştirin</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
            activeTab === 'settings'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Genel Ayarlar</span>
        </button>
        <button
          onClick={() => setActiveTab('updates')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
            activeTab === 'updates'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>Güncelleme</span>
        </button>
      </div>

      {activeTab === 'updates' ? (
        <UpdateManager />
      ) : (
        <>
      {/* Save Status */}
      {isSaved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Save className="w-5 h-5 text-green-600" />
            <p className="text-green-800 font-medium">Ayarlar başarıyla kaydedildi!</p>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {/* Genel Ayarlar */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <User className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Genel Ayarlar</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tema</label>
              <select
                value={tempSettings.theme}
                onChange={(e) => updateSetting('theme', e.target.value as AppSettings['theme'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="light">Açık Tema</option>
                <option value="dark">Koyu Tema</option>
                <option value="auto">Otomatik</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dil</label>
              <select
                value={tempSettings.language}
                onChange={(e) => updateSetting('language', e.target.value as AppSettings['language'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="tr">Türkçe</option>
                <option value="en">English</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sayfa Boyutu</label>
              <select
                value={tempSettings.pageSize}
                onChange={(e) => updateSetting('pageSize', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={10}>10 kayıt</option>
                <option value={20}>20 kayıt</option>
                <option value={50}>50 kayıt</option>
                <option value={100}>100 kayıt</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Para Birimi</label>
              <select
                value={tempSettings.currency}
                onChange={(e) => updateSetting('currency', e.target.value as AppSettings['currency'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="TRY">Türk Lirası (₺)</option>
                <option value="USD">Amerikan Doları ($)</option>
                <option value="EUR">Euro (€)</option>
              </select>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Bildirimler</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={tempSettings.notifications}
                  onChange={(e) => updateSetting('notifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Otomatik Kaydetme</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={tempSettings.autoSave}
                  onChange={(e) => updateSetting('autoSave', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Şirket Bilgileri */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Şirket Bilgileri</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Şirket Adı</label>
              <input
                type="text"
                value={tempSettings.companyName}
                onChange={(e) => updateSetting('companyName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ORMEN TEKSTİL"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
              <input
                type="tel"
                value={tempSettings.companyPhone}
                onChange={(e) => updateSetting('companyPhone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0555 123 45 67"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
              <input
                type="email"
                value={tempSettings.companyEmail}
                onChange={(e) => updateSetting('companyEmail', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="info@ormentekstil.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tarih Formatı</label>
              <select
                value={tempSettings.dateFormat}
                onChange={(e) => updateSetting('dateFormat', e.target.value as AppSettings['dateFormat'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="dd/MM/yyyy">31/12/2024</option>
                <option value="MM/dd/yyyy">12/31/2024</option>
                <option value="yyyy-MM-dd">2024-12-31</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Adres</label>
            <textarea
              value={tempSettings.companyAddress}
              onChange={(e) => updateSetting('companyAddress', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Şirket adresi..."
            />
          </div>
        </div>

        {/* Sistem Bilgileri */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Info className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Sistem Bilgileri</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-600">Versiyon</p>
              <p className="font-semibold text-gray-900">v1.2.0</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-600">Son Güncelleme</p>
              <p className="font-semibold text-gray-900">2025-01-27</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-600">Geliştirici</p>
              <p className="font-semibold text-gray-900">ORMEN TEKSTİL</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={handleSave}
          className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 font-medium flex items-center justify-center space-x-2 shadow-lg"
        >
          <Save className="w-4 h-4" />
          <span>Ayarları Kaydet</span>
        </button>
        
        <button
          onClick={handleReset}
          className="flex-1 bg-gradient-to-r from-gray-500 to-slate-500 text-white py-3 px-6 rounded-lg hover:from-gray-600 hover:to-slate-600 transition-all duration-200 font-medium flex items-center justify-center space-x-2 shadow-lg"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Varsayılana Sıfırla</span>
        </button>
      </div>
        </>
      )}
    </div>
  );
}