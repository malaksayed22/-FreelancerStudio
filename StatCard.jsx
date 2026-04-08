// src/components/StatCard.jsx
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Skeleton from "./src/components/Skeleton";

export default function StatCard({ stat, index }) {
  const rootRef = useRef(null);
  const rafRef = useRef(0);
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoaded(true), 400);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!rootRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;

    const duration = 1100 + index * 120;
    const startAt = performance.now();

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const tick = (now) => {
      const progress = Math.min(1, (now - startAt) / duration);
      const eased = easeOutCubic(progress);
      setCount(Math.round((stat.value || 0) * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [visible, stat.value, index]);

  return (
    <motion.div
      ref={rootRef}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.1 + index * 0.1,
        type: "spring",
        stiffness: 200,
        damping: 20,
      }}
      whileHover={{
        y: -6,
        rotate: -0.8,
        borderColor: "rgba(255,255,255,0.18)",
      }}
      className="bg-surface rounded-[20px] border border-white/[0.07] p-[18px] md:p-[22px] relative overflow-hidden card-hover"
      style={{
        cursor: "none",
        borderColor: "rgba(255,255,255,0.07)",
      }}
    >
      {/* Background glow blob */}
      <div
        className="absolute top-[-45px] right-[-45px] w-[110px] h-[110px] rounded-full opacity-10 transition-all duration-500 group-hover:opacity-25"
        style={{ background: stat.accent }}
      />

      {!isLoaded ? (
        <div className="space-y-3">
          <Skeleton width="42%" height={12} borderRadius={999} />
          <Skeleton width="72%" height={42} borderRadius={10} />
          <Skeleton width="55%" height={12} borderRadius={8} />
          <Skeleton width="38%" height={10} borderRadius={8} />
        </div>
      ) : (
        <>
          <div className="flex items-center gap-[6px] font-mono text-[10px] uppercase tracking-[2px] text-muted mb-[14px]">
            <div
              className="w-[6px] h-[6px] rounded-full"
              style={{ background: stat.accent }}
            />
            {stat.label}
          </div>

          <div
            className="font-syne font-extrabold leading-none mb-[6px]"
            style={{
              fontSize: stat.value >= 1000 ? "34px" : "46px",
              color: stat.accent,
            }}
          >
            {stat.suffix}
            {Number(count).toLocaleString()}
          </div>

          <div className="text-[13px] text-muted">
            {stat.label === "Revenue"
              ? "This month"
              : `Total ${stat.label.toLowerCase()}`}
          </div>
          <div className="font-mono text-[11px] text-lime mt-[7px]">
            {stat.delta}
          </div>
        </>
      )}
    </motion.div>
  );
}
