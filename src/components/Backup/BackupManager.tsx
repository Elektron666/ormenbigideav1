import React, { useState } from 'react';
import { Download, Upload, Database, AlertCircle, CheckCircle, FileText } from 'lucide-react';
import { useAppState } from '../../hooks/useAppState';

export function BackupManager() {
  const { customers, products, movements, exportData, importData } = useAppState();
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importMessage, setImportMessage] = useState('');

  const handleExportData = () => {
    const data = exportData();
    
    try {
      const jsonData = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Tablet/Mobile için gelişmiş yedekleme
      const fileName = `ormen-tekstil-yedek-${new Date().toISOString().split('T')[0]}.json`;
      
      // Modern tarayıcılar için File System Access API
      if ('showSaveFilePicker' in window) {
        handleModernSave(jsonData, fileName);
      } 
      // Huawei tablet için özel çözüm
      else if (/Android/i.test(navigator.userAgent)) {
        handleTabletSave(jsonData, fileName);
      }
      // Fallback - normal indirme
      else {
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Yedek alma sırasında hata oluştu: ' + error);
    }
  };

  // Modern tarayıcılar için dosya kaydetme
  const handleModernSave = async (data: string, fileName: string) => {
    try {
      const fileHandle = await (window as any).showSaveFilePicker({
        suggestedName: fileName,
        types: [{
          description: 'JSON files',
          accept: { 'application/json': ['.json'] }
        }]
      });
      
      const writable = await fileHandle.createWritable();
      await writable.write(data);
      await writable.close();
      
      alert('✅ Yedek başarıyla kaydedildi!');
    } catch (error) {
      // Kullanıcı iptal etti veya hata oluştu
      handleTabletSave(data, fileName);
    }
  };

  // Tablet için özel kaydetme
  const handleTabletSave = (data: string, fileName: string) => {
    // Clipboard API ile panoya kopyala
    if (navigator.clipboard) {
      navigator.clipboard.writeText(data).then(() => {
        showTabletInstructions(fileName);
      }).catch(() => {
        showManualCopy(data, fileName);
      });
    } else {
      showManualCopy(data, fileName);
    }
  };

  // Tablet için talimatlar göster
  const showTabletInstructions = (fileName: string) => {
    const instructions = `
✅ YEDEK PANOYA KOPYALANDI!

📱 HUAWEI TABLET İÇİN ADIMLAR:

1️⃣ Dosya Yöneticisi'ni aç
2️⃣ "İndirilenler" veya "Belgeler" klasörüne git
3️⃣ Yeni dosya oluştur: "${fileName}"
4️⃣ Dosyayı aç ve YAPIŞTIR (Ctrl+V)
5️⃣ Kaydet ve kapat

💾 Dosya boyutu: ~30MB
🔒 Güvenli konum: /storage/emulated/0/Documents/

✨ Alternatif: WhatsApp'ta kendine gönder!
`;
    
    alert(instructions);
  };

  // Manuel kopyalama için popup
  const showManualCopy = (data: string, fileName: string) => {
    const newWindow = window.open('', '_blank', 'width=800,height=600');
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>ORMEN TEKSTİL Yedek</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
            .container { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center; }
            textarea { width: 100%; height: 300px; border: 2px solid #ddd; border-radius: 8px; padding: 10px; font-family: monospace; font-size: 12px; }
            .buttons { margin-top: 15px; text-align: center; }
            button { background: #4CAF50; color: white; border: none; padding: 12px 24px; border-radius: 6px; margin: 5px; cursor: pointer; font-size: 16px; }
            button:hover { background: #45a049; }
            .copy-btn { background: #2196F3; }
            .copy-btn:hover { background: #1976D2; }
            .instructions { background: #e3f2fd; border-left: 4px solid #2196F3; padding: 15px; margin: 15px 0; border-radius: 4px; }
            .step { margin: 8px 0; padding: 5px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🧵 ORMEN TEKSTİL Yedek Dosyası</h2>
              <p>Dosya: ${fileName}</p>
            </div>
            
            <div class="instructions">
              <h3>📱 HUAWEI TABLET İÇİN ADIMLAR:</h3>
              <div class="step">1️⃣ Aşağıdaki "Panoya Kopyala" butonuna tıkla</div>
              <div class="step">2️⃣ Dosya Yöneticisi → Belgeler klasörüne git</div>
              <div class="step">3️⃣ Yeni dosya oluştur: "${fileName}"</div>
              <div class="step">4️⃣ Dosyayı aç ve yapıştır (Ctrl+V)</div>
              <div class="step">5️⃣ Kaydet ve bu pencereyi kapat</div>
            </div>
            
            <textarea id="backupData" readonly>${data}</textarea>
            
            <div class="buttons">
              <button class="copy-btn" onclick="copyToClipboard()">📋 Panoya Kopyala</button>
              <button onclick="selectAll()">🔍 Tümünü Seç</button>
              <button onclick="window.close()">❌ Kapat</button>
            </div>
          </div>
          
          <script>
            function copyToClipboard() {
              const textarea = document.getElementById('backupData');
              textarea.select();
              document.execCommand('copy');
              alert('✅ Yedek panoya kopyalandı!\\n\\nŞimdi Dosya Yöneticisi\\'nde yeni dosya oluşturup yapıştırabilirsin.');
            }
            
            function selectAll() {
              document.getElementById('backupData').select();
            }
          </script>
        </body>
        </html>
      `);
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
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Yedekleme Merkezi</h2>
        <p className="text-gray-600">Verilerinizi güvenle yedekleyin ve geri yükleyin</p>
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

      {/* Backup Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Export */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Yedek Al</h3>
              <p className="text-sm text-gray-600">Tüm verilerinizi bilgisayarınıza indirin</p>
            </div>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Tüm müşteri bilgileri</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Kartela veritabanı</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Hareket geçmişi</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Sistem ayarları</span>
            </div>
          </div>

          <button
            onClick={handleExportData}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Yedek Dosyası İndir</span>
          </button>
        </div>

        {/* Import */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Yedek Yükle</h3>
              <p className="text-sm text-gray-600">Önceki yedeğinizi sisteme geri yükleyin</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Dikkat!</p>
                <p>Yedek yükleme mevcut tüm verileri değiştirecektir.</p>
              </div>
            </div>
          </div>

          <label className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2 cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Yedek Dosyası Seç</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <FileText className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Yedekleme Talimatları</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-700">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Yedek Alma:</h4>
            <ul className="space-y-1 list-disc list-inside">
              <li>Düzenli olarak (haftada bir) yedek alın</li>
              <li>Önemli değişikliklerden önce yedek alın</li>
              <li>Yedek dosyalarını güvenli bir yerde saklayın</li>
              <li>Dosya adında tarih bulunur, karışıklığı önler</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Yedek Yükleme:</h4>
            <ul className="space-y-1 list-disc list-inside">
              <li>Sadece ORMEN TEKSTİL yedek dosyalarını kullanın</li>
              <li>Yükleme öncesi mevcut verileri yedekleyin</li>
              <li>İşlem geri alınamaz, dikkatli olun</li>
              <li>Yükleme sonrası verileri kontrol edin</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}