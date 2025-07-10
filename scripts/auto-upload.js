const fs = require('fs');
const path = require('path');

// GitHub API kullanarak otomatik yükleme scripti
class GitHubAutoUploader {
  constructor(token, owner, repo) {
    this.token = token;
    this.owner = owner;
    this.repo = repo;
    this.apiBase = 'https://api.github.com';
  }

  async createRepository() {
    const response = await fetch(`${this.apiBase}/user/repos`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: this.repo,
        description: '🧵 ORMEN TEKSTİL - Kartela Yönetim Sistemi V1',
        private: false,
        auto_init: true,
      }),
    });
    
    return response.json();
  }

  async uploadFile(filePath, content) {
    const encodedContent = Buffer.from(content).toString('base64');
    
    const response = await fetch(`${this.apiBase}/repos/${this.owner}/${this.repo}/contents/${filePath}`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `📁 Add ${filePath}`,
        content: encodedContent,
      }),
    });
    
    return response.json();
  }

  async uploadAllFiles() {
    const files = this.getAllFiles('./');
    
    for (const file of files) {
      if (this.shouldSkipFile(file)) continue;
      
      try {
        const content = fs.readFileSync(file, 'utf8');
        const relativePath = path.relative('./', file).replace(/\\/g, '/');
        
        console.log(`📤 Yükleniyor: ${relativePath}`);
        await this.uploadFile(relativePath, content);
        console.log(`✅ Yüklendi: ${relativePath}`);
        
        // Rate limiting için bekleme
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`❌ Hata: ${file}`, error.message);
      }
    }
  }

  getAllFiles(dir) {
    let files = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !this.shouldSkipDirectory(item)) {
        files = files.concat(this.getAllFiles(fullPath));
      } else if (stat.isFile()) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  shouldSkipDirectory(dir) {
    const skipDirs = ['node_modules', '.git', 'dist', 'build', '.next'];
    return skipDirs.includes(dir);
  }

  shouldSkipFile(file) {
    const skipExtensions = ['.log', '.tmp', '.cache'];
    const skipFiles = ['package-lock.json', '.DS_Store'];
    
    return skipExtensions.some(ext => file.endsWith(ext)) ||
           skipFiles.some(name => file.includes(name));
  }
}

// Kullanım
async function main() {
  const token = process.env.GITHUB_TOKEN || 'YOUR_GITHUB_TOKEN_HERE';
  const owner = process.env.GITHUB_OWNER || 'YOUR_USERNAME_HERE';
  const repo = 'ormen-tekstil-kartela-sistemi';
  
  const uploader = new GitHubAutoUploader(token, owner, repo);
  
  try {
    console.log('🚀 Repository oluşturuluyor...');
    await uploader.createRepository();
    console.log('✅ Repository oluşturuldu!');
    
    console.log('📁 Dosyalar yükleniyor...');
    await uploader.uploadAllFiles();
    console.log('🎉 Tüm dosyalar yüklendi!');
    
    console.log(`🔗 Repository: https://github.com/${owner}/${repo}`);
  } catch (error) {
    console.error('❌ Hata:', error.message);
  }
}

if (require.main === module) {
  main();
}

module.exports = GitHubAutoUploader;