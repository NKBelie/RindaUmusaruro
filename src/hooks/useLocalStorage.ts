import { useState } from "react";
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      return JSON.parse(localStorage.getItem(key) || "null") ?? initial;
    } catch {
      return initial;
    }
  });
  const save = (next: T | ((old: T) => T)) =>
    setValue((old) => {
      const v = typeof next === "function" ? (next as (o: T) => T)(old) : next;
      try {
        localStorage.setItem(key, JSON.stringify(v));
      } catch {
        window.alert(
          "Storage is full. Try a smaller image or export your records.",
        );
      }
      return v;
    });
  return [value, save] as const;
}
