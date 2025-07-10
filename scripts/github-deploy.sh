#!/bin/bash

# 🚀 ORMEN TEKSTİL - Otomatik GitHub Deployment Script

echo "🧵 ORMEN TEKSTİL - GitHub Otomatik Yükleme Başlıyor..."

# Gerekli değişkenleri kontrol et
if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ GITHUB_TOKEN environment variable gerekli!"
    echo "💡 GitHub Personal Access Token oluşturun:"
    echo "   1. GitHub.com → Settings → Developer settings → Personal access tokens"
    echo "   2. 'Generate new token' → repo permissions seçin"
    echo "   3. export GITHUB_TOKEN='your_token_here'"
    exit 1
fi

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ GITHUB_USERNAME environment variable gerekli!"
    echo "💡 export GITHUB_USERNAME='your_username_here'"
    exit 1
fi

REPO_NAME="ormen-tekstil-kartela-sistemi"
API_BASE="https://api.github.com"

echo "👤 GitHub Kullanıcısı: $GITHUB_USERNAME"
echo "📦 Repository: $REPO_NAME"

# Repository oluştur
echo "🏗️ Repository oluşturuluyor..."
curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "'$REPO_NAME'",
    "description": "🧵 ORMEN TEKSTİL - Kartela Yönetim Sistemi V1 - React + TypeScript + Capacitor Android",
    "private": false,
    "auto_init": true
  }' \
  "$API_BASE/user/repos"

echo "✅ Repository oluşturuldu!"

# Dosyaları yükle
echo "📁 Dosyalar yükleniyor..."

# Ana dosyalar
upload_file() {
    local file_path="$1"
    local github_path="$2"
    
    if [ -f "$file_path" ]; then
        echo "📤 Yükleniyor: $github_path"
        
        # Base64 encode
        content=$(base64 -w 0 "$file_path")
        
        curl -X PUT \
          -H "Authorization: token $GITHUB_TOKEN" \
          -H "Content-Type: application/json" \
          -d '{
            "message": "📁 Add '$github_path'",
            "content": "'$content'"
          }' \
          "$API_BASE/repos/$GITHUB_USERNAME/$REPO_NAME/contents/$github_path"
        
        echo "✅ Yüklendi: $github_path"
        sleep 1  # Rate limiting
    else
        echo "⚠️ Dosya bulunamadı: $file_path"
    fi
}

# Tüm dosyaları yükle
echo "🔄 Dosya yükleme işlemi başlıyor..."

# Konfigürasyon dosyaları
upload_file "package.json" "package.json"
upload_file "vite.config.ts" "vite.config.ts"
upload_file "tsconfig.json" "tsconfig.json"
upload_file "tailwind.config.js" "tailwind.config.js"
upload_file "capacitor.config.ts" "capacitor.config.ts"

# Ana uygulama dosyaları
upload_file "index.html" "index.html"
upload_file "src/main.tsx" "src/main.tsx"
upload_file "src/App.tsx" "src/App.tsx"
upload_file "src/index.css" "src/index.css"

# GitHub Actions
upload_file ".github/workflows/android-build.yml" ".github/workflows/android-build.yml"

# README
upload_file "README.md" "README.md"

echo "🎉 Otomatik yükleme tamamlandı!"
echo "🔗 Repository: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo "⚡ GitHub Actions otomatik çalışacak ve APK build edilecek!"