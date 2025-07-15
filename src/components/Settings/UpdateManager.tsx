import React, { useState, useEffect } from 'react';
import { Download, RefreshCw, CheckCircle, AlertCircle, Globe, Smartphone, ExternalLink } from 'lucide-react';

interface GitHubRelease {
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  assets: Array<{
    name: string;
    browser_download_url: string;
    size: number;
  }>;
  html_url: string;
}

export function UpdateManager() {
  const [currentVersion] = useState('v1.2.0');
  const [latestRelease, setLatestRelease] = useState<GitHubRelease | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  const checkForUpdates = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // GitHub API'den son release'i al
      const response = await fetch('https://api.github.com/repos/YOUR_USERNAME/ormen-tekstil-kartela-sistemi/releases/latest');
      
      if (!response.ok) {
        throw new Error('GitHub API\'ye erişim hatası');
      }
      
      const release: GitHubRelease = await response.json();
      setLatestRelease(release);
      
      // Versiyon karşılaştırması
      const isNewer = compareVersions(release.tag_name, currentVersion);
      setUpdateAvailable(isNewer);
      
    } catch (err) {
      setError('Güncelleme kontrolü başarısız. İnternet bağlantınızı kontrol edin.');
      console.error('Update check failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const compareVersions = (latest: string, current: string): boolean => {
    // v1.2.0 formatını 1.2.0 yapmak için v'yi kaldır
    const cleanLatest = latest.replace('v', '');
    const cleanCurrent = current.replace('v', '');
    
    const latestParts = cleanLatest.split('.').map(Number);
    const currentParts = cleanCurrent.split('.').map(Number);
    
    for (let i = 0; i < Math.max(latestParts.length, currentParts.length); i++) {
      const latestPart = latestParts[i] || 0;
      const currentPart = currentParts[i] || 0;
      
      if (latestPart > currentPart) return true;
      if (latestPart < currentPart) return false;
    }
    
    return false;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  useEffect(() => {
    // Sayfa yüklendiğinde otomatik kontrol et
    checkForUpdates();
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <RefreshCw className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Sistem Güncelleme</h2>
        <p className="text-gray-600">GitHub üzerinden otomatik güncelleme</p>
      </div>

      {/* Mevcut Versiyon */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Mevcut Versiyon</h3>
            <p className="text-2xl font-bold text-blue-600 mt-1">{currentVersion}</p>
            <p className="text-sm text-gray-600 mt-1">ORMEN TEKSTİL - Kartela Sistemi</p>
          </div>
          <div className="text-right">
            <button
              onClick={checkForUpdates}
              disabled={isLoading}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Kontrol Ediliyor...' : 'Güncelleme Kontrol Et'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hata Mesajı */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Güncelleme Durumu */}
      {latestRelease && !isLoading && (
        <div className={`rounded-xl border p-6 ${
          updateAvailable 
            ? 'bg-green-50 border-green-200' 
            : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-center space-x-3 mb-4">
            {updateAvailable ? (
              <>
                <Download className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="text-lg font-semibold text-green-900">🎉 Yeni Güncelleme Mevcut!</h3>
                  <p className="text-green-700">Versiyon {latestRelease.tag_name} indirilebilir</p>
                </div>
              </>
            ) : (
              <>
                <CheckCircle className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">✅ Sistem Güncel</h3>
                  <p className="text-blue-700">En son versiyon kullanılıyor</p>
                </div>
              </>
            )}
          </div>

          {/* Release Bilgileri */}
          <div className="bg-white rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900">{latestRelease.name}</h4>
              <span className="text-sm text-gray-500">
                {formatDate(latestRelease.published_at)}
              </span>
            </div>
            
            {/* Release Notes */}
            <div className="text-sm text-gray-700 mb-4 whitespace-pre-line bg-gray-50 p-3 rounded">
              {latestRelease.body || 'Güncelleme notları mevcut değil.'}
            </div>

            {/* İndirme Linkleri */}
            {latestRelease.assets.length > 0 && (
              <div className="space-y-2">
                <h5 className="font-medium text-gray-900 mb-2">📱 İndirme Seçenekleri:</h5>
                {latestRelease.assets.map((asset, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {asset.name.includes('.apk') ? (
                        <Smartphone className="w-5 h-5 text-green-600" />
                      ) : (
                        <Globe className="w-5 h-5 text-blue-600" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{asset.name}</p>
                        <p className="text-sm text-gray-600">{formatFileSize(asset.size)}</p>
                      </div>
                    </div>
                    <a
                      href={asset.browser_download_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>İndir</span>
                    </a>
                  </div>
                ))}
              </div>
            )}

            {/* GitHub Sayfası */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <a
                href={latestRelease.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>GitHub'da Görüntüle</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Güncelleme Talimatları */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📖 Güncelleme Talimatları</h3>
        
        <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-700">
          <div>
            <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
              <Smartphone className="w-4 h-4 text-green-600" />
              <span>Android APK:</span>
            </h4>
            <ol className="space-y-1 list-decimal list-inside">
              <li>APK dosyasını indir</li>
              <li>Eski uygulamayı kaldır (isteğe bağlı)</li>
              <li>APK'yı yükle</li>
              <li>Yedek verilerini geri yükle</li>
            </ol>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <span>Web Uygulaması:</span>
            </h4>
            <ol className="space-y-1 list-decimal list-inside">
              <li>Tarayıcı önbelleğini temizle</li>
              <li>Sayfayı yenile (F5)</li>
              <li>Yeni versiyon otomatik yüklenecek</li>
              <li>Veriler korunur</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Otomatik Güncelleme Bilgisi */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center space-x-2 mb-2">
          <RefreshCw className="w-5 h-5 text-blue-600" />
          <h4 className="font-medium text-blue-900">🔄 Otomatik Kontrol</h4>
        </div>
        <p className="text-blue-800 text-sm">
          Sistem her açılışta otomatik olarak güncellemeleri kontrol eder. 
          Manuel kontrol için yukarıdaki butonu kullanabilirsiniz.
        </p>
      </div>
    </div>
  );
}