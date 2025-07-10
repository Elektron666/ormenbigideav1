import React, { useState } from 'react';
import { Upload, Download, Package, Check, X, AlertCircle, Scissors } from 'lucide-react';

interface BulkProductUploadProps {
  onUpload: (products: Array<{ name: string; code: string; category?: string }>) => void;
  onClose: () => void;
  existingProducts: Array<{ code: string }>;
}

export function BulkProductUpload({ onUpload, onClose, existingProducts }: BulkProductUploadProps) {
  const [textInput, setTextInput] = useState('');
  const [previewData, setPreviewData] = useState<Array<{ name: string; code: string; category?: string; valid: boolean; error?: string }>>([]);
  const [showPreview, setShowPreview] = useState(false);

  const getNextCode = (index: number) => {
    const existingCodes = existingProducts.map(p => p.code);
    let maxCodeNumber = 0;
    
    // Mevcut ORM kodlarından en yüksek numarayı bul
    existingCodes.forEach(code => {
      if (code.startsWith('ORM-')) {
        const num = parseInt(code.replace('ORM-', ''));
        if (!isNaN(num) && num > maxCodeNumber) {
          maxCodeNumber = num;
        }
      }
    });
    
    // Index'i ekleyerek sıralı kodlar oluştur (1'den başlayarak)
    const finalNumber = maxCodeNumber + index + 1;
    return `ORM-${finalNumber.toString().padStart(4, '0')}`;
  };

  const handleTextChange = (value: string) => {
    setTextInput(value);
    
    if (value.trim()) {
      const lines = value.split('\n').filter(line => line.trim());
      const preview = lines.map((line, index) => {
        const parts = line.trim().split('|').map(part => part.trim());
        const name = parts[0];
        const category = parts[1] || undefined;
        
        if (!name) {
          return {
            name: '',
            code: '',
            category,
            valid: false,
            error: 'Ürün adı boş olamaz'
          };
        }
        
        const code = getNextCode(index);
        
        return {
          name,
          code,
          category,
          valid: true
        };
      });
      
      setPreviewData(preview);
      setShowPreview(true);
    } else {
      setShowPreview(false);
      setPreviewData([]);
    }
  };

  const handleUpload = () => {
    const validProducts = previewData.filter(item => item.valid);
    if (validProducts.length > 0) {
      onUpload(validProducts.map(product => ({
        name: product.name,
        code: product.code,
        category: product.category
      })));
    }
  };

  const downloadTemplate = () => {
    const template = `Pamuk Kartela Premium|Pamuk
Polyester Mix Standart|Polyester
Viskon Özel Seri|Viskon
Karışım Ekonomik|Karışım
Özel Tasarım Kartela|Özel`;
    
    const blob = new Blob([template], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'kartela_sablonu.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const validCount = previewData.filter(item => item.valid).length;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Scissors className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Toplu Kartela Yükleme</h3>
        <p className="text-gray-600">Her satıra bir kartela adı yazarak toplu yükleme yapabilirsiniz</p>
        <p className="text-sm text-blue-600 mt-1">Otomatik ORM-0001, ORM-0002... kodları oluşturulacak</p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={downloadTemplate}
          className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span className="text-sm">Örnek Şablon İndir</span>
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">📝 Format Bilgisi</h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p><strong>Basit format:</strong> Her satıra sadece kartela adı</p>
          <p><strong>Kategori ile:</strong> Kartela Adı | Kategori</p>
          <p><strong>Örnek:</strong></p>
          <div className="bg-white/50 rounded p-2 mt-2 font-mono text-xs">
            Pamuk Kartela Premium | Pamuk<br/>
            Polyester Mix Standart | Polyester<br/>
            Basit Kartela Adı
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kartela Listesi
        </label>
        <textarea
          value={textInput}
          onChange={(e) => handleTextChange(e.target.value)}
          rows={10}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder={`Pamuk Kartela Premium | Pamuk
Polyester Mix Standart | Polyester
Viskon Özel Seri | Viskon
Karışım Ekonomik | Karışım
Özel Tasarım Kartela | Özel`}
        />
        <p className="text-xs text-gray-500 mt-1">
          İpucu: Kategori eklemek için "|" işareti kullanın (Kartela Adı | Kategori)
        </p>
      </div>

      {showPreview && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Önizleme</h4>
            <span className="text-sm text-gray-600">
              {validCount} geçerli kartela
            </span>
          </div>
          
          <div className="max-h-40 overflow-y-auto space-y-1">
            {previewData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                {item.valid ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <X className="w-4 h-4 text-red-500" />
                )}
                <span className="text-gray-600 w-8">{index + 1}.</span>
                <div className="flex-1">
                  <span className={item.valid ? 'text-gray-900 font-medium' : 'text-red-600'}>
                    {item.name || 'Boş satır'}
                  </span>
                  {item.valid && (
                    <div className="text-xs text-gray-500 mt-1">
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded mr-2">
                        {item.code}
                      </span>
                      {item.category && (
                        <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded">
                          {item.category}
                        </span>
                      )}
                    </div>
                  )}
                  {item.error && (
                    <div className="text-xs text-red-600 mt-1">{item.error}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {previewData.length > 0 && validCount === 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <p className="text-red-700 text-sm">Geçerli kartela bulunamadı</p>
          </div>
        </div>
      )}

      <div className="flex space-x-4">
        <button
          onClick={handleUpload}
          disabled={validCount === 0}
          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2.5 px-4 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg"
        >
          <Upload className="w-4 h-4" />
          <span>Yükle ({validCount} kartela)</span>
        </button>
        <button
          onClick={onClose}
          className="flex-1 bg-gray-200 text-gray-800 py-2.5 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          İptal
        </button>
      </div>
    </div>
  );
}