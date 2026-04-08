import { useCallback, useState } from "react";

export default function useLocalStorage(key, defaultValue) {
  const [value, setValueState] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return defaultValue;
      return JSON.parse(raw);
    } catch {
      return defaultValue;
    }
  });

  const setValue = useCallback(
    (nextValue) => {
      setValueState((prev) => {
        const resolved =
          typeof nextValue === "function" ? nextValue(prev) : nextValue;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // Ignore write failures (quota/private mode) while keeping app responsive.
        }
        return resolved;
      });
    },
    [key],
  );

  return [value, setValue];
}
