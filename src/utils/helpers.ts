export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function formatDate(date: Date | string | number): string {
  const d = new Date(date);
  return d.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  }).format(amount);
}

export function downloadFile(data: any, filename: string, type: string = 'application/json') {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function parseCSV(csvText: string): string[][] {
  const lines = csvText.split('\n');
  const result: string[][] = [];
  
  for (const line of lines) {
    if (line.trim()) {
      const fields = line.split(',').map(field => field.trim().replace(/^"|"$/g, ''));
      result.push(fields);
    }
  }
  
  return result;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function filterAndSort<T>(
  items: T[],
  searchTerm: string,
  searchFields: (keyof T)[],
  sortBy: keyof T,
  sortOrder: 'asc' | 'desc' = 'asc'
): T[] {
  // Create a shallow copy to avoid mutating the original array when sorting
  let filtered = [...items];

  if (searchTerm) {
    // Türkçe karakterleri normalize et
    const normalizeText = (text: string) => {
      return text
        .toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/İ/g, 'i')
        .replace(/Ğ/g, 'g')
        .replace(/Ü/g, 'u')
        .replace(/Ş/g, 's')
        .replace(/Ö/g, 'o')
        .replace(/Ç/g, 'c');
    };
    
    const normalizedSearchTerm = normalizeText(searchTerm);
    
    filtered = items.filter(item =>
      searchFields.some(field => {
        const value = item[field];
        if (!value) return false;
        const normalizedValue = normalizeText(String(value));
        return normalizedValue.includes(normalizedSearchTerm);
      })
    );
  }

  return filtered.sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    
    // Handle undefined/null values safely
    if (aVal === undefined && bVal === undefined) return 0;
    if (aVal === undefined || aVal === null) return sortOrder === 'asc' ? 1 : -1;
    if (bVal === undefined || bVal === null) return sortOrder === 'asc' ? -1 : 1;
    if (aVal === bVal) return 0;
    
    // TÜRKÇE KARAKTER SORUNU ÇÖZÜLDİ - GERÇEK ÇÖZÜM!
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      const comparison = aVal.localeCompare(bVal, 'tr-TR', { 
        sensitivity: 'base',  // Büyük/küçük harf duyarsız
        numeric: true,        // Sayısal sıralama
        ignorePunctuation: true
      });
      return sortOrder === 'asc' ? comparison : -comparison;
    } else if (aVal instanceof Date && bVal instanceof Date) {
      const comparison = aVal.getTime() - bVal.getTime();
      return sortOrder === 'asc' ? comparison : -comparison;
    } else if (typeof aVal === 'number' && typeof bVal === 'number') {
      const comparison = aVal - bVal;
      return sortOrder === 'asc' ? comparison : -comparison;
    } else {
      // Diğer türler için string'e çevir ve Türkçe sırala
      const comparison = String(aVal).localeCompare(String(bVal), 'tr-TR', { sensitivity: 'base' });
      return sortOrder === 'asc' ? comparison : -comparison;
    }
  });
}