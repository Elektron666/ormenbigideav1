# 📱 ORMEN TEKSTİL - APK İndirme Rehberi

## ✅ Node.js Sorunu Çözüldü!

GitHub Actions artık **Node.js 20** kullanıyor ve tüm build sistemi güncellenmiş durumda.

## 🚀 APK İndirme Adımları

### 1. Repository Ayarlarını Kontrol Edin

#### Pages Ayarı:
1. **Settings** → **Pages**
2. **Source**: **"GitHub Actions"** seçin
3. **Save**

#### Workflow Permissions:
1. **Settings** → **Actions** → **General**
2. **Workflow permissions**: **"Read and write permissions"**
3. **"Allow GitHub Actions to create and approve pull requests"** ✅
4. **Save**

### 2. Build'i Başlatın

1. **Actions** sekmesine gidin
2. **"Build and Deploy"** workflow'unu seçin
3. **"Run workflow"** butonuna tıklayın
4. **"Run workflow"** onaylayın

### 3. Build'i İzleyin

#### Beklenen Süre:
- **Web build**: 2-3 dakika
- **Android build**: 5-7 dakika
- **Toplam**: 8-10 dakika

#### İlerleme:
1. **build-web** job'u tamamlanacak
2. **build-android** job'u başlayacak
3. Her iki job da **yeşil ✓** alacak

### 4. APK'yı İndirin

#### Yöntem 1: Artifacts'tan
1. **Actions** → **En son build** → **Artifacts**
2. **"ormen-tekstil-kartela-debug.apk"** dosyasını indirin

#### Yöntem 2: Releases'tan
1. **Releases** sekmesine gidin
2. En son sürümü seçin
3. APK dosyasını indirin

## 📱 Android'e Kurulum

### 1. APK'yı İndirin
- Bilgisayarınıza veya doğrudan Android cihazınıza

### 2. Android Ayarları
1. **Ayarlar** → **Güvenlik** → **Bilinmeyen kaynaklar** ✅
2. Veya **Ayarlar** → **Uygulamalar** → **Özel uygulama erişimi** → **Bilinmeyen uygulamaları yükle**

### 3. APK'yı Yükleyin
1. APK dosyasına dokunun
2. **"Yükle"** butonuna tıklayın
3. Kurulum tamamlanacak

### 4. Uygulamayı Açın
1. **"ORMEN TEKSTİL"** uygulamasını açın
2. Giriş bilgileri:
   - **Kullanıcı**: `ORMEN`
   - **Şifre**: `ORMEN666-F1`

## 🎯 Test Senaryoları

### ✅ Temel Testler:
- [ ] Uygulama açılıyor
- [ ] Giriş yapılabiliyor
- [ ] Ana sayfa yükleniyor
- [ ] Müşteri ekleme çalışıyor
- [ ] Kartela ekleme çalışıyor
- [ ] Hareket ekleme çalışıyor

### ✅ Gelişmiş Testler:
- [ ] Çoklu hareket ekleme çalışıyor
- [ ] Toplu müşteri yükleme çalışıyor
- [ ] Toplu kartela yükleme çalışıyor
- [ ] Raporlar görüntüleniyor
- [ ] Yedekleme sistemi çalışıyor

## 🌐 Web Versiyonu

APK'ya ek olarak web versiyonu da mevcut:
- **URL**: `https://elektron666.github.io/ormenbigideav1`
- **Giriş**: `ORMEN` / `ORMEN666-F1`

## 🆘 Sorun Giderme

### Build Başarısızsa:
1. **Actions** sekmesinde error loglarını kontrol edin
2. **Settings** → **Pages** ayarının **GitHub Actions** olduğunu doğrulayın
3. **Settings** → **Actions** permissions'ı kontrol edin

### APK Yüklenmiyorsa:
1. **"Bilinmeyen kaynaklar"** etkinleştirin
2. Android sürümünüz 7.0+ olmalı
3. Depolama alanı yeterli olmalı

### Uygulama Açılmıyorsa:
1. APK'yı yeniden indirin
2. Uygulamayı kaldırıp yeniden yükleyin
3. Android cihazı yeniden başlatın

## 📊 Build Durumu Kontrol

### ✅ Başarılı Build Göstergeleri:
- Actions'ta **yeşil ✓** işaretleri
- **Artifacts** bölümünde APK mevcut
- **Releases** sekmesinde yeni sürüm
- Web sitesi erişilebilir

### ❌ Başarısız Build Göstergeleri:
- Actions'ta **kırmızı ✗** işaretleri
- Error loglarında hata mesajları
- Artifacts bölümü boş
- Web sitesi erişilemiyor

## 🎉 Başarı!

APK başarıyla indirilip yüklendiğinde:
- ✅ Modern, responsive Android uygulaması
- ✅ Çoklu hareket ekleme mükemmel çalışıyor
- ✅ Tüm özellikler production-ready
- ✅ Offline çalışma desteği (LocalStorage)

**🚀 Artık ORMEN TEKSTİL Kartela Yönetim Sistemi Android cihazınızda!**