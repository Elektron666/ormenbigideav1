import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // GERÇEK ÇÖZÜM: Lazy initialization ile localStorage'dan oku
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === 'undefined') return initialValue;
      
      const item = window.localStorage.getItem(key);
      if (item === null) {
        // İlk kez çalışıyorsa initialValue'yu localStorage'a kaydet
        window.localStorage.setItem(key, JSON.stringify(initialValue));
        return initialValue;
      }
      
      const parsed = JSON.parse(item);
      console.log(`📖 localStorage'dan okundu [${key}]:`, parsed);
      return parsed;
    } catch (error) {
      console.error(`❌ localStorage okuma hatası [${key}]:`, error);
      return initialValue;
    }
  });

  // KUSURSUZ ÇÖZÜM: React'ın functional update desteğini tam olarak sağla
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    console.log(`🔄 setValue çağrıldı [${key}]`);
    
    // GERÇEK ÇÖZÜM: setStoredValue'ı functional şekilde çağır
    setStoredValue(prev => {
      console.log(`📝 Functional update çalışıyor [${key}] - Önceki değer:`, prev);
      
      // Yeni değeri hesapla - EN GÜNCEL state'i kullan
      const valueToStore = value instanceof Function ? value(prev) : value;
      console.log(`✅ Yeni değer hesaplandı [${key}]:`, valueToStore);
      
      // localStorage'a kaydet
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          console.log(`💾 localStorage güncellendi [${key}]`);
        } catch (error) {
          console.error(`❌ localStorage yazma hatası [${key}]:`, error);
        }
      }
      
      return valueToStore;
    });
  }, [key]);

  // GERÇEK ÇÖZÜM: localStorage değişikliklerini dinle
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue);
          setStoredValue(newValue);
        } catch (error) {
          console.error(`❌ Storage event parse hatası [${key}]:`, error);
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [key]);

  return [storedValue, setValue] as const;
}