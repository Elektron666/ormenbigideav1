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
  let filtered = items;

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = items.filter(item =>
      searchFields.some(field => {
        const value = item[field];
        return value && String(value).toLowerCase().includes(term);
      })
    );
  }

  return filtered.sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    
    if (aVal === bVal) return 0;
    
    // Türkçe karakterleri doğru sırala
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      const comparison = aVal.localeCompare(bVal, 'tr-TR', { 
        sensitivity: 'accent',
        numeric: true
      });
      return sortOrder === 'asc' ? comparison : -comparison;
    } else if (aVal instanceof Date && bVal instanceof Date) {
      const comparison = aVal.getTime() - bVal.getTime();
      return sortOrder === 'asc' ? comparison : -comparison;
    } else if (typeof aVal === 'number' && typeof bVal === 'number') {
      const comparison = aVal - bVal;
      return sortOrder === 'asc' ? comparison : -comparison;
    } else {
      const comparison = String(aVal).localeCompare(String(bVal), 'tr-TR');
      return sortOrder === 'asc' ? comparison : -comparison;
    }
  });
}