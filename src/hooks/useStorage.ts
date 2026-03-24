import { useState, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) return JSON.parse(item);
      const init = typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue;
      return init;
    } catch {
      const init = typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue;
      return init;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      setStoredValue((prev) => {
        const next = typeof value === 'function' ? (value as (val: T) => T)(prev) : value;
        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch {}
        return next;
      });
    },
    [key]
  );

  return [storedValue, setValue] as const;
}
