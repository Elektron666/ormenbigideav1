# 🚀 GitHub'a Proje Yükleme Rehberi

WebContainer ortamında git komutları çalışmadığı için projenizi GitHub'a yüklemek için aşağıdaki adımları takip edin:

## 📁 Yöntem 1: GitHub Web Arayüzü (Önerilen)

### 1. GitHub'da Yeni Repository Oluşturun
1. [GitHub.com](https://github.com)'a gidin
2. **"New repository"** butonuna tıklayın
3. Repository adını girin: `ormen-tekstil-kartela-sistemi`
4. **Public** olarak ayarlayın
5. **"Create repository"** butonuna tıklayın

### 2. Dosyaları Yükleyin
1. Yeni oluşturulan repository sayfasında **"uploading an existing file"** linkine tıklayın
2. Bolt.new'dan tüm proje dosyalarını indirin:
   - Proje klasörünü ZIP olarak indirin
   - ZIP'i açın ve tüm dosyaları seçin
3. Dosyaları GitHub'a sürükleyip bırakın
4. Commit mesajı yazın: `🚀 ORMEN TEKSTİL Kartela Sistemi - İlk yükleme`
5. **"Commit changes"** butonuna tıklayın

## 📁 Yöntem 2: GitHub Desktop (Alternatif)

### 1. GitHub Desktop İndirin
- [GitHub Desktop](https://desktop.github.com/) uygulamasını indirin ve kurun

### 2. Repository Klonlayın
1. GitHub'da oluşturduğunuz repository'yi GitHub Desktop ile klonlayın
2. Bolt.new'dan indirdiğiniz dosyaları klonlanan klasöre kopyalayın
3. GitHub Desktop'ta değişiklikleri commit edin
4. **"Push origin"** butonuna tıklayın

## 🤖 GitHub Actions Otomatik Çalışacak

Dosyalar yüklendikten sonra:

1. **Actions** sekmesine gidin
2. **"Build Android APK"** workflow'unu göreceksiniz
3. Otomatik olarak çalışmaya başlayacak
4. Build tamamlandığında **Artifacts** bölümünden APK'yı indirebilirsiniz

## 📱 APK İndirme

### Build Tamamlandığında:
1. **Actions** → **En son build** → **Artifacts**
2. `ormen-tekstil-kartela-debug.apk` dosyasını indirin
3. Android cihazınıza yükleyin

### Release Olarak:
- `main` branch'ine push yapıldığında otomatik release oluşturulacak
- **Releases** sekmesinden APK'yı indirebilirsiniz

## 🔧 Geliştirme Devam Etmek İçin

Gelecekte değişiklik yapmak için:

1. **GitHub web editörünü** kullanın (dosyaya tıklayıp ✏️ edit butonuna basın)
2. **GitHub Desktop** ile local olarak çalışın
3. **VS Code** ile GitHub Codespaces kullanın

## ⚡ Hızlı Başlangıç

```bash
# Eğer local'de git varsa:
git clone https://github.com/KULLANICI_ADI/ormen-tekstil-kartela-sistemi.git
cd ormen-tekstil-kartela-sistemi
npm install
npm run dev
```

## 🎯 Sonuç

- ✅ Proje GitHub'a yüklenecek
- ✅ GitHub Actions otomatik çalışacak  
- ✅ APK otomatik build edilecek
- ✅ Release otomatik oluşturulacak
- ✅ Çoklu hareket ekleme sorunu çözülmüş durumda

**Not:** WebContainer'da git olmadığı için manuel yükleme yapmanız gerekiyor, ancak GitHub'a yüklendikten sonra tüm otomasyonlar çalışacak!