// src/components/RevenueCard.jsx
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import useCounter from "./useCounter";

const SPARKLINE =
  "M0,40 L20,35 L40,28 L60,32 L80,20 L100,15 L120,22 L140,10 L160,5 L180,8 L200,2";

export default function RevenueCard({ amount = 9200 }) {
  const count = useCounter(amount, 1600, 600);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, type: "spring", stiffness: 180, damping: 22 }}
      className="bg-surface rounded-[22px] border border-white/[0.07] p-[26px] overflow-hidden relative"
    >
      <h2 className="font-syne font-bold text-[17px] text-[#F0F0F8]">
        Revenue
      </h2>

      <div className="font-syne font-extrabold text-lime mt-[10px] mb-[3px] flex items-baseline gap-[3px]">
        <span style={{ fontSize: "20px" }}>$</span>
        <span style={{ fontSize: "38px" }}>{count.toLocaleString()}</span>
      </div>

      <div className="font-mono text-[11px] text-muted">
        {new Date().toLocaleString("en-US", { month: "long", year: "numeric" })}
      </div>

      {/* Sparkline SVG */}
      <div className="mt-[14px]" style={{ height: "48px" }}>
        <svg
          viewBox="0 0 200 50"
          preserveAspectRatio="none"
          width="100%"
          height="100%"
        >
          <defs>
            <linearGradient id="spark-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#CAFF00" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#CAFF00" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={SPARKLINE}
            fill="none"
            stroke="#CAFF00"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 420,
              strokeDashoffset: drawn ? 0 : 420,
              transition: "stroke-dashoffset 2s ease",
            }}
          />
          <path
            d={`${SPARKLINE} L200,50 L0,50 Z`}
            fill="url(#spark-grad)"
            style={{
              opacity: drawn ? 1 : 0,
              transition: "opacity 2.5s ease",
            }}
          />
        </svg>
      </div>
    </motion.section>
  );
}
