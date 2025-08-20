import React, { useState } from 'react';
import { Download, Upload, Database, AlertCircle, CheckCircle, Copy, FileText } from 'lucide-react';
import { useAppState } from '../../hooks/useAppState';

export function BackupManager() {
  const { customers, products, movements, exportData, importData } = useAppState();
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importMessage, setImportMessage] = useState('');
  const [backupData, setBackupData] = useState('');
  const [showBackupData, setShowBackupData] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [restoreData, setRestoreData] = useState('');
  const [showRestoreForm, setShowRestoreForm] = useState(false);

  const stats = {
    customers: customers.length,
    products: products.length,
    movements: movements.length,
    totalRecords: customers.length + products.length + movements.length
  };

  // Yedek hazırla ve göster
  const handleCreateBackup = () => {
    try {
      const data = exportData();
      const jsonData = JSON.stringify(data, null, 2);
      setBackupData(jsonData);
      setShowBackupData(true);
      setImportStatus('idle');
    } catch (error) {
      setImportStatus('error');
      setImportMessage('Yedek hazırlama hatası');
    }
  };

  // Panoya kopyala
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

  // Dosyadan yedek yükle
  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        const success = importData(data);
        
        if (success) {
          setImportStatus('success');
          setImportMessage('Yedek başarıyla yüklendi!');
        } else {
          setImportStatus('error');
          setImportMessage('Yedek yükleme sırasında hata oluştu.');
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

  // Manuel yedek yükle
  const handleManualRestore = () => {
    if (!restoreData.trim()) {
      setImportStatus('error');
      setImportMessage('Lütfen yedek verisini yapıştırın.');
      return;
    }

    try {
      // Önce veriyi temizle ve düzelt
      let cleanedData = restoreData.trim();
      
      // Eğer veri JSON değilse, basit format olarak kabul et
      let data;
      try {
        data = JSON.parse(cleanedData);
      } catch (parseError) {
        // JSON değilse, basit format olarak dene
        setImportStatus('error');
        setImportMessage('Geçersiz JSON formatı. Lütfen doğru yedek verisini yapıştırın.');
        return;
      }
      
      // Yardımcı tip kontrol fonksiyonları
      const isMovement = (item: any) =>
        item && typeof item === 'object' && 'customerId' in item && 'productId' in item && 'type' in item;
      const isProduct = (item: any) =>
        item && typeof item === 'object' && 'name' in item && 'code' in item;
      const isCustomer = (item: any) =>
        item && typeof item === 'object' && 'name' in item && !('code' in item);

      // Veri yapısını kontrol et ve gerekirse dönüştür
      if (!data || (typeof data !== 'object' && !Array.isArray(data))) {
        setImportStatus('error');
        setImportMessage('Geçersiz yedek formatı. Veri objesi bulunamadı.');
        return;
      }

      if (Array.isArray(data)) {
        const firstItem = data[0];
        if (isMovement(firstItem)) {
          data = { movements: data };
        } else if (isProduct(firstItem)) {
          data = { products: data };
        } else if (isCustomer(firstItem)) {
          data = { customers: data };
        } else {
          setImportStatus('error');
          setImportMessage('Geçersiz yedek formatı. Tanımlanamayan veri türü.');
          return;
        }
      } else if (!data.customers && !data.products && !data.movements) {
        if (isMovement(data)) {
          data = { movements: [data] };
        } else if (isProduct(data)) {
          data = { products: [data] };
        } else if (isCustomer(data)) {
          data = { customers: [data] };
        } else {
          setImportStatus('error');
          setImportMessage('Geçersiz yedek formatı. Müşteri, kartela veya hareket verisi bulunamadı.');
          return;
        }
      }

      const success = importData(data);
      
      if (success) {
        setImportStatus('success');
        const loadedItems = [];
        if (data.customers?.length) loadedItems.push(`${data.customers.length} müşteri`);
        if (data.products?.length) loadedItems.push(`${data.products.length} kartela`);
        if (data.movements?.length) loadedItems.push(`${data.movements.length} hareket`);
        
        setImportMessage(`Yedek başarıyla yüklendi! (${loadedItems.join(', ')})`);
        setRestoreData('');
        setShowRestoreForm(false);
      } else {
        setImportStatus('error');
        setImportMessage('Yedek yükleme sırasında hata oluştu.');
      }
    } catch (error) {
      setImportStatus('error');
      setImportMessage(`Yedek yükleme hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    }
  };

  // Dosya indirme
  const handleDownloadBackup = () => {
    try {
      const data = exportData();
      const jsonData = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ormen-tekstil-yedek-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      setImportStatus('error');
      setImportMessage('Dosya indirme hatası');
    }
  };

  const handleCancel = () => {
    setShowRestoreForm(false);
    setRestoreData('');
    setImportStatus('idle');
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Database className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Yedekleme Merkezi</h2>
        <p className="text-gray-600">Verilerinizi yedekleyin ve geri yükleyin</p>
      </div>

      {/* Mevcut Veri Durumu */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Mevcut Veri Durumu</h3>
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

      {/* Durum Mesajları */}
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

      {/* Ana İşlemler */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Yedek Alma */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">📥 Yedek Alma</h3>
              <p className="text-sm text-gray-600">Verilerinizi yedekleyin</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={handleCreateBackup}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <Copy className="w-4 h-4" />
              <span>Manuel Yedek Hazırla</span>
            </button>
            
            <button
              onClick={handleDownloadBackup}
              className="w-full bg-blue-100 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors font-medium flex items-center justify-center space-x-2 text-sm"
            >
              <Download className="w-4 h-4" />
              <span>Dosya Olarak İndir</span>
            </button>
          </div>
        </div>

        {/* Yedek Yükleme */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">📤 Yedek Yükleme</h3>
              <p className="text-sm text-gray-600">Yedeği geri yükleyin</p>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setShowRestoreForm(true)}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <Copy className="w-4 h-4" />
              <span>Manuel Yedek Yükle</span>
            </button>
            
            <label className="w-full bg-green-100 text-green-700 py-2 px-4 rounded-lg hover:bg-green-200 transition-colors font-medium flex items-center justify-center space-x-2 cursor-pointer text-sm">
              <Upload className="w-4 h-4" />
              <span>Dosyadan Yükle</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Manuel Yedek Gösterme */}
      {showBackupData && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">📋 Manuel Yedek</h3>
            <button
              onClick={() => setShowBackupData(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
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

            <details className="bg-gray-50 rounded-lg">
              <summary className="p-3 cursor-pointer font-medium text-gray-900">
                🔍 Yedek Verisini Görüntüle
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

      {/* Manuel Yedek Yükleme */}
      {showRestoreForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">📤 Manuel Yedek Yükleme</h3>
            <button
              onClick={handleCancel}
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
              Bu işlem mevcut tüm verileri değiştirecektir.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yedek Verisini Yapıştırın (JSON Format)
              </label>
              <textarea
                value={restoreData}
                onChange={(e) => setRestoreData(e.target.value)}
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                placeholder={`{
  "customers": [...],
  "products": [...],
  "movements": [...],
  "exportDate": "2024-01-01T00:00:00.000Z",
  "version": "1.0"
}`}
              />
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="font-medium text-blue-900 mb-2">💡 Yedek Format Bilgisi</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• Yedek verisi JSON formatında olmalıdır</p>
                <p>• "Manuel Yedek Hazırla" butonuyla oluşturulan veriyi kullanın</p>
                <p>• Veri { } süslü parantezlerle başlayıp bitmelidir</p>
                <p>• En az customers, products veya movements verisi bulunmalıdır</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleManualRestore}
                disabled={!restoreData.trim()}
                className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Yedeği Yükle</span>
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}