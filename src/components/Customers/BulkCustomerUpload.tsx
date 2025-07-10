import React, { useState } from 'react';
import { Upload, Download, Users, Check, X, AlertCircle } from 'lucide-react';

interface BulkCustomerUploadProps {
  onUpload: (customers: Array<{ name: string }>) => void;
  onClose: () => void;
}

export function BulkCustomerUpload({ onUpload, onClose }: BulkCustomerUploadProps) {
  const [textInput, setTextInput] = useState('');
  const [previewData, setPreviewData] = useState<Array<{ name: string; valid: boolean }>>([]);
  const [showPreview, setShowPreview] = useState(false);

  const handleTextChange = (value: string) => {
    setTextInput(value);
    
    if (value.trim()) {
      const lines = value.split('\n').filter(line => line.trim());
      const preview = lines.map(line => ({
        name: line.trim(),
        valid: line.trim().length > 0
      }));
      setPreviewData(preview);
      setShowPreview(true);
    } else {
      setShowPreview(false);
      setPreviewData([]);
    }
  };

  const handleUpload = () => {
    const validCustomers = previewData.filter(item => item.valid);
    if (validCustomers.length > 0) {
      onUpload(validCustomers.map(item => ({ name: item.name })));
    }
  };

  const downloadTemplate = () => {
    const template = `Ahmet Yılmaz
Mehmet Demir
Fatma Kaya
Ali Özkan
Ayşe Şahin`;
    
    const blob = new Blob([template], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'musteri_sablonu.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const validCount = previewData.filter(item => item.valid).length;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Toplu Müşteri Yükleme</h3>
        <p className="text-gray-600">Her satıra bir müşteri adı yazarak toplu yükleme yapabilirsiniz</p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={downloadTemplate}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span className="text-sm">Örnek Şablon İndir</span>
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Müşteri Listesi (Her satıra bir isim)
        </label>
        <textarea
          value={textInput}
          onChange={(e) => handleTextChange(e.target.value)}
          rows={10}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={`Ahmet Yılmaz
Mehmet Demir
Fatma Kaya
Ali Özkan
Ayşe Şahin`}
        />
      </div>

      {showPreview && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Önizleme</h4>
            <span className="text-sm text-gray-600">
              {validCount} geçerli müşteri
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
                <span className="text-gray-600">{index + 1}.</span>
                <span className={item.valid ? 'text-gray-900' : 'text-red-600'}>
                  {item.name || 'Boş satır'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {previewData.length > 0 && validCount === 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <p className="text-red-700 text-sm">Geçerli müşteri bulunamadı</p>
          </div>
        </div>
      )}

      <div className="flex space-x-4">
        <button
          onClick={handleUpload}
          disabled={validCount === 0}
          className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <Upload className="w-4 h-4" />
          <span>Yükle ({validCount} müşteri)</span>
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