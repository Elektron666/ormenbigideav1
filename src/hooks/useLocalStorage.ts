import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
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
      return parsed;
    } catch (_error) {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    setStoredValue(prev => {
      const valueToStore = value instanceof Function ? value(prev) : value;
      
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (_error) {
          // Silent error handling for production
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
        } catch (_error) {
          // Silent error handling for production
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
    
    return undefined;
  }, [key]);

  return [storedValue, setValue] as const;
}