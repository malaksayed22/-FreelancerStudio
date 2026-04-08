// src/hooks/useCounter.js
import { useState, useEffect, useRef } from "react";

export default function useCounter(target, duration = 1400, delay = 500) {
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    let intervalId = null;
    const timeoutId = setTimeout(() => {
      startedRef.current = true;
      const step = target / (duration / 16);
      let current = 0;
      intervalId = setInterval(() => {
        current = Math.min(current + step, target);
        setValue(Math.round(current));
        if (current >= target) clearInterval(intervalId);
      }, 16);
    }, delay);
    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [target, duration, delay]);

  return value;
}
