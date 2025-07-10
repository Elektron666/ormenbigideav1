# 🧵 ORMEN TEKSTİL - Kartela Yönetim Sistemi V1

Modern, kullanıcı dostu kartela takip ve yönetim sistemi. React + TypeScript ile geliştirilmiştir.

## 🚀 Özellikler

### 👥 Müşteri Yönetimi
- Müşteri ekleme, düzenleme, silme
- Toplu müşteri yükleme
- Detaylı müşteri profilleri
- Müşteri bazlı kartela takibi

### 🧵 Kartela Yönetimi
- Kartela ekleme, düzenleme, silme
- Toplu kartela yükleme
- Otomatik kod oluşturma (ORM-0001, ORM-0002...)
- Kategori bazlı organizasyon

### 📊 Hareket Takibi
- Kartela verme/alma/iade işlemleri
- Çoklu hareket ekleme (SORUN ÇÖZÜLDİ!)
- Detaylı hareket geçmişi
- Müşteri bazlı hareket raporları

### 📈 Raporlama
- Detaylı analiz ve istatistikler
- Dönemsel raporlar
- En aktif müşteriler
- En çok kullanılan kartelalar
- JSON export

### 💪 Motivasyon Merkezi
- Seneca ve Marcus Aurelius sözleri
- Günlük motivasyon ipuçları
- Olumlamalar sistemi

### 📝 Notlar Sistemi
- Kategorili not alma
- Motivasyon, iş, kişisel, hedefler
- Arama ve filtreleme

### 📦 Stok Yönetimi
- Bağımsız stok takip sistemi
- Düşük stok uyarıları
- Konum bazlı organizasyon

### 💾 Yedekleme
- Tüm verileri JSON olarak export
- Yedek dosyalarını import
- LocalStorage tabanlı veri saklama

## 🌐 Web Uygulaması

### 📱 PWA Desteği
- Progressive Web App olarak çalışır
- Mobil cihazlarda ana ekrana eklenebilir
- Offline çalışma desteği
- Native app benzeri deneyim

## 🔐 Giriş Bilgileri

```
Kullanıcı Adı: ORMEN
Şifre: ORMEN666-F1
```

## 🛠️ Teknoloji Stack

### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Lucide React** - Modern iconlar
- **Vite** - Hızlı build tool

## 🚀 Kurulum ve Çalıştırma

### Geliştirme Ortamı
```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production build
npm run build
```

## 🎯 Önemli Çözümler

### ✅ Çoklu Hareket Ekleme Sorunu
- useLocalStorage functional update düzeltildi
- Sequential processing ile race condition çözüldü
- Better UX ile loading states eklendi

## 🌐 Deployment

### Web Deployment:
```bash
npm run build
# dist/ klasörü web sunucusuna yüklenebilir
```

## 📞 Destek

Herhangi bir sorun yaşarsanız:
1. GitHub Issues'ta ticket açın
2. Detaylı hata açıklaması yazın
3. Ekran görüntüsü ekleyin

## 📄 Lisans

Bu proje MIT lisansı altında yayınlanmıştır.

---

**🧵 ORMEN TEKSTİL - Modern Kartela Yönetimi**