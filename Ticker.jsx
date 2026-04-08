// src/components/Ticker.jsx
import { useEffect, useRef } from "react";
import { useApp } from "./src/context/AppContext";

export default function Ticker() {
  const { tickerItems } = useApp();
  const trackRef = useRef(null);
  const frameRef = useRef(0);
  const startedAtRef = useRef(0);
  const halfWidthRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const DURATION_MS = 22000;

    const measure = () => {
      halfWidthRef.current = track.scrollWidth / 2;
    };

    const tick = (ts) => {
      if (!startedAtRef.current) startedAtRef.current = ts;
      const elapsed = (ts - startedAtRef.current) % DURATION_MS;
      const progress = elapsed / DURATION_MS;
      const x = -halfWidthRef.current * progress;
      track.style.transform = `translate3d(${x}px, 0, 0)`;
      frameRef.current = requestAnimationFrame(tick);
    };

    measure();
    frameRef.current = requestAnimationFrame(tick);
    window.addEventListener("resize", measure);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", measure);
      startedAtRef.current = 0;
    };
  }, []);

  const doubled = [...tickerItems, ...tickerItems];

  return (
    <div className="overflow-hidden bg-lime text-bg font-mono text-[11px] font-bold py-[7px] whitespace-nowrap select-none">
      <div ref={trackRef} className="ticker-track inline-flex">
        {doubled.map((item, i) => (
          <span key={i} className="px-7">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
