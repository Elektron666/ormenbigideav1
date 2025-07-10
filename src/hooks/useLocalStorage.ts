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

  // GERÇEK ÇÖZÜM: setValue fonksiyonunu useCallback ile optimize et
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      console.log(`🔄 localStorage güncelleniyor [${key}]...`);
      
      // Yeni değeri hesapla
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      console.log(`💾 Kaydedilecek değer [${key}]:`, valueToStore);
      
      // State'i güncelle
      setStoredValue(valueToStore);
      
      // localStorage'a kaydet
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        console.log(`✅ localStorage'a kaydedildi [${key}]`);
        
        // Doğrulama: Gerçekten kaydedildi mi?
        const verification = window.localStorage.getItem(key);
        const verificationParsed = verification ? JSON.parse(verification) : null;
        console.log(`🔍 Doğrulama [${key}]:`, verificationParsed);
      }
    } catch (error) {
      console.error(`❌ localStorage yazma hatası [${key}]:`, error);
    }
  }, [key, storedValue]);

  // GERÇEK ÇÖZÜM: localStorage değişikliklerini dinle
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue);
          console.log(`🔄 localStorage değişikliği algılandı [${key}]:`, newValue);
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