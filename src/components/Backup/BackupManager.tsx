import React, { useState } from 'react';
import { Download, Upload, Database, AlertCircle, CheckCircle, FileText, Copy, RefreshCw, Smartphone, Globe } from 'lucide-react';
import { useAppState } from '../../hooks/useAppState';

export function BackupManager() {
  const { customers, products, movements, exportData, importData } = useAppState();
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importMessage, setImportMessage] = useState('');
  const [backupData, setBackupData] = useState('');
  const [showManualBackup, setShowManualBackup] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showUpdateSystem, setShowUpdateSystem] = useState(false);
  const [updateData, setUpdateData] = useState('');
  const [showUpdateSystem, setShowUpdateSystem] = useState(false);
  const [updateData, setUpdateData] = useState('');

  const handleExportData = () => {
    const data = exportData();
    const jsonData = JSON.stringify(data, null, 2);
    setBackupData(jsonData);
    setShowManualBackup(true);
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(backupData);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = backupData;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        const success = importData(data);
        
        if (success) {
          setImportStatus('success');
          setImportMessage('Veriler başarıyla yüklendi!');
        } else {
          setImportStatus('error');
          setImportMessage('Veri yükleme sırasında hata oluştu.');
        }
      } catch (error) {
        setImportStatus('error');
        setImportMessage('Geçersiz dosya formatı.');
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
  };

  const handleManualImport = () => {
    if (!updateData.trim()) {
      setImportStatus('error');
      setImportMessage('Lütfen yedek verisini yapıştırın.');
      return;
    }

    try {
      const data = JSON.parse(updateData);
      const success = importData(data);
      
      if (success) {
        setImportStatus('success');
        setImportMessage('Sistem başarıyla güncellendi!');
        setUpdateData('');
        setShowUpdateSystem(false);
      } else {
        setImportStatus('error');
        setImportMessage('Güncelleme sırasında hata oluştu.');
      }
    } catch (error) {
      setImportStatus('error');
      setImportMessage('Geçersiz yedek formatı. JSON formatında olmalı.');
    }
  };

  const handleManualImport = () => {
    if (!updateData.trim()) {
      setImportStatus('error');
      setImportMessage('Lütfen yedek verisini yapıştırın.');
      return;
    }

    try {
      const data = JSON.parse(updateData);
      const success = importData(data);
      
      if (success) {
        setImportStatus('success');
        setImportMessage('Sistem başarıyla güncellendi!');
        setUpdateData('');
        setShowUpdateSystem(false);
      } else {
        setImportStatus('error');
        setImportMessage('Güncelleme sırasında hata oluştu.');
      }
    } catch (error) {
      setImportStatus('error');
      setImportMessage('Geçersiz yedek formatı. JSON formatında olmalı.');
    }
  };

  const stats = {
    customers: customers.length,
    products: products.length,
    movements: movements.length,
    totalRecords: customers.length + products.length + movements.length
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Database className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Yedekleme & Güncelleme Merkezi</h2>
        <p className="text-gray-600">Manuel yedekleme ve sistem güncelleme</p>
      </div>

      {/* Current Data Stats */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Mevcut Veri Durumu</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.customers}</div>
            <div className="text-sm text-blue-600">Müşteri</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.products}</div>
            <div className="text-sm text-green-600">Kartela</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{stats.movements}</div>
            <div className="text-sm text-purple-600">Hareket</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{stats.totalRecords}</div>
            <div className="text-sm text-orange-600">Toplam Kayıt</div>
          </div>
        </div>
      </div>

      {/* Import Status */}
      {importStatus !== 'idle' && (
        <div className={`rounded-lg p-4 ${
          importStatus === 'success' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center space-x-2">
            {importStatus === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <p className={`font-medium ${
              importStatus === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {importMessage}
            </p>
          </div>
        </div>
      )}

      {/* Main Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Manual Backup */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Copy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Manuel Yedekleme</h3>
              <p className="text-sm text-gray-600">Panoya kopyala-yapıştır yöntemi</p>
            </div>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Tablet dostu yöntem</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Panoya otomatik kopyalama</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>WhatsApp'ta paylaşabilir</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>~30MB veri boyutu</span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setShowUpdateSystem(true)}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Sistem Güncelle</span>
            </button>
            
            <label className="w-full bg-green-100 text-green-700 py-2 px-4 rounded-lg hover:bg-green-200 transition-colors font-medium flex items-center justify-center space-x-2 cursor-pointer text-sm">
              <Upload className="w-4 h-4" />
              <span>Dosyadan Güncelle</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* System Update */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Sistem Güncelleme</h3>
              <p className="text-sm text-gray-600">Yedekten sistemi güncelle</p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Yedek verisini yapıştır</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Otomatik güncelleme</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Veri doğrulama</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Güvenli güncelleme</span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setShowUpdateSystem(true)}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Sistem Güncelle</span>
            </button>
            
            <label className="w-full bg-green-100 text-green-700 py-2 px-4 rounded-lg hover:bg-green-200 transition-colors font-medium flex items-center justify-center space-x-2 cursor-pointer text-sm">
              <Upload className="w-4 h-4" />
              <span>Dosyadan Güncelle</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Manual Backup Modal */}
      {showManualBackup && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">📱 Tablet İçin Manuel Yedekleme</h3>
            <button
              onClick={() => setShowManualBackup(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-2 mb-3">
              <Smartphone className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium text-blue-900">Huawei Tablet Adımları:</h4>
            </div>
            <div className="text-sm text-blue-800 space-y-2">
              <p><strong>1️⃣</strong> Aşağıdaki "Panoya Kopyala" butonuna tıkla</p>
              <p><strong>2️⃣</strong> WhatsApp'ı aç ve kendine mesaj gönder</p>
              <p><strong>3️⃣</strong> Mesaj kutusuna yapıştır (uzun bas → Yapıştır)</p>
              <p><strong>4️⃣</strong> Mesajı gönder (yedek WhatsApp'ta saklanır)</p>
              <p><strong>5️⃣</strong> İsteğe bağlı: Dosya Yöneticisi'nde .txt dosyası oluştur</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Yedek Boyutu</p>
                <p className="text-sm text-gray-600">~{Math.round(backupData.length / 1024)} KB</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Kayıt Sayısı</p>
                <p className="text-sm text-gray-600">{stats.totalRecords} kayıt</p>
              </div>
            </div>

            <button
              onClick={handleCopyToClipboard}
              className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors ${
                copySuccess
                  ? 'bg-green-600 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {copySuccess ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>✅ Panoya Kopyalandı!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>📋 Panoya Kopyala</span>
                </>
              )}
            </button>

            {copySuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-800 text-sm text-center">
                  🎉 Artık WhatsApp'ta kendine yapıştırabilirsin!
                </p>
              </div>
            )}

            <details className="bg-gray-50 rounded-lg">
              <summary className="p-3 cursor-pointer font-medium text-gray-900">
                🔍 Yedek Verisini Görüntüle (İsteğe Bağlı)
              </summary>
              <div className="p-3 border-t border-gray-200">
                <textarea
                  value={backupData}
                  readOnly
                  rows={10}
                  className="w-full p-2 border border-gray-300 rounded text-xs font-mono bg-white"
                />
              </div>
            </details>
          </div>
        </div>
      )}

      {/* Update System Modal */}
      {showUpdateSystem && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">🔄 Sistem Güncelleme</h3>
            <button
              onClick={() => setShowUpdateSystem(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <h4 className="font-medium text-yellow-900">⚠️ Önemli Uyarı</h4>
            </div>
            <p className="text-yellow-800 text-sm">
              Bu işlem mevcut tüm verileri değiştirecektir. Devam etmeden önce mevcut verilerinizi yedeklediğinizden emin olun.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yedek Verisini Yapıştırın
              </label>
              <textarea
                value={updateData}
                onChange={(e) => setUpdateData(e.target.value)}
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                placeholder="WhatsApp'tan kopyaladığınız yedek verisini buraya yapıştırın..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleManualImport}
                disabled={!updateData.trim()}
                className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Sistemi Güncelle</span>
              </button>
              <button
                onClick={() => {
                  setShowUpdateSystem(false);
                  setUpdateData('');
                }}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update System Modal */}
      {showUpdateSystem && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">🔄 Sistem Güncelleme</h3>
            <button
              onClick={() => setShowUpdateSystem(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <h4 className="font-medium text-yellow-900">⚠️ Önemli Uyarı</h4>
            </div>
            <p className="text-yellow-800 text-sm">
              Bu işlem mevcut tüm verileri değiştirecektir. Devam etmeden önce mevcut verilerinizi yedeklediğinizden emin olun.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yedek Verisini Yapıştırın
              </label>
              <textarea
                value={updateData}
                onChange={(e) => setUpdateData(e.target.value)}
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                placeholder="WhatsApp'tan kopyaladığınız yedek verisini buraya yapıştırın..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleManualImport}
                disabled={!updateData.trim()}
                className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Sistemi Güncelle</span>
              </button>
              <button
                onClick={() => {
                  setShowUpdateSystem(false);
                  setUpdateData('');
                }}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <FileText className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">📖 Kullanım Kılavuzu</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-700">
          <div>
            <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
              <Copy className="w-4 h-4 text-blue-600" />
              <span>Manuel Yedekleme:</span>
            </h4>
            <ul className="space-y-1 list-disc list-inside">
              <li>Tablet dostu panoya kopyalama</li>
              <li>WhatsApp'ta kendine gönderme</li>
              <li>Güvenli ve kolay yöntem</li>
              <li>İnternet bağlantısı gerektirmez</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
              <RefreshCw className="w-4 h-4 text-green-600" />
              <span>Sistem Güncelleme:</span>
            </h4>
            <ul className="space-y-1 list-disc list-inside">
              <li>WhatsApp'tan yedek verisini kopyala</li>
              <li>Güncelleme alanına yapıştır</li>
              <li>Otomatik veri doğrulama</li>
              <li>Güvenli güncelleme işlemi</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}