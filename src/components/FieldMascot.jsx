// src/components/FieldMascot.jsx
// Pixel mascot that sits at the TOP-RIGHT corner of the currently active
// input field. No arrows. A styled dark card (like an onboarding tooltip)
// appears beside the character with a title + hint line.
//
// Usage (per field row):
//   <FieldMascot active={step === N} title="FIELD NAME" hint="helpful hint text" />
//
// Each field row must have  position: relative  so the mascot can be
// absolutely positioned to its top-right corner.

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

//  Pixel character
function PixelGuy({ walking }) {
  const legLRef = useRef(null);
  const legRRef = useRef(null);

  useEffect(() => {
    if (!walking) {
      if (legLRef.current) legLRef.current.style.transform = "translateY(0)";
      if (legRRef.current) legRRef.current.style.transform = "translateY(0)";
      return;
    }
    let tog = false;
    const iv = setInterval(() => {
      tog = !tog;
      if (legLRef.current)
        legLRef.current.style.transform = tog
          ? "translateY(4px)"
          : "translateY(0)";
      if (legRRef.current)
        legRRef.current.style.transform = tog
          ? "translateY(0)"
          : "translateY(4px)";
    }, 200);
    return () => clearInterval(iv);
  }, [walking]);

  return (
    <motion.div
      animate={walking ? { y: 0 } : { y: [0, -3, 0] }}
      transition={
        walking
          ? { duration: 0 }
          : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
      }
    >
      <div
        style={{
          width: 32,
          height: 44,
          position: "relative",
          imageRendering: "pixelated",
          flexShrink: 0,
        }}
      >
        {/* hair */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 4,
            width: 24,
            height: 5,
            background: "#FF6B00",
            borderRadius: "2px 2px 0 0",
          }}
        />
        {/* head */}
        <div
          style={{
            position: "absolute",
            top: 4,
            left: 4,
            width: 24,
            height: 18,
            background: "#FFD580",
            border: "2px solid #0A0A0F",
            borderRadius: 2,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 5,
              left: 5,
              width: 3,
              height: 3,
              background: "#0A0A0F",
              borderRadius: 1,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              width: 3,
              height: 3,
              background: "#0A0A0F",
              borderRadius: 1,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 3,
              left: 7,
              width: 10,
              height: 2,
              background: "#0A0A0F",
              borderRadius: "0 0 2px 2px",
            }}
          />
        </div>
        {/* left arm */}
        <div
          style={{
            position: "absolute",
            top: 22,
            left: 0,
            width: 6,
            height: 12,
            background: "#9B5CFF",
            border: "2px solid #0A0A0F",
            borderRadius: 2,
          }}
        />
        {/* right arm */}
        <motion.div
          style={{
            position: "absolute",
            top: 22,
            right: 0,
            width: 6,
            height: 12,
            background: "#9B5CFF",
            border: "2px solid #0A0A0F",
            borderRadius: 2,
            originY: 0,
          }}
          animate={walking ? { rotate: [14, -14, 14] } : { rotate: [0, 28, 0] }}
          transition={{
            duration: walking ? 0.8 : 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* body */}
        <div
          style={{
            position: "absolute",
            top: 21,
            left: 3,
            width: 26,
            height: 14,
            background: "#9B5CFF",
            border: "2px solid #0A0A0F",
            borderRadius: 2,
          }}
        />
        {/* legs */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 3,
            width: 26,
            display: "flex",
            gap: 4,
          }}
        >
          <div
            ref={legLRef}
            style={{
              width: 9,
              height: 12,
              background: "#1C1C28",
              border: "2px solid #0A0A0F",
              borderRadius: 2,
              transition: "transform .2s ease",
            }}
          />
          <div
            ref={legRRef}
            style={{
              width: 9,
              height: 12,
              background: "#1C1C28",
              border: "2px solid #0A0A0F",
              borderRadius: 2,
              transition: "transform .2s ease",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

//  Tooltip card
// Styled like the onboarding card in the reference image:
// dark bg, neon-lime border, bold label, hint line, right-pointing tail.
function TooltipCard({ title, hint }) {
  return (
    <div
      style={{
        position: "relative",
        background: "rgba(10,12,10,0.95)",
        border: "1px solid rgba(202,255,0,0.45)",
        borderRadius: 8,
        padding: "8px 12px",
        boxShadow: "0 0 0 1px rgba(202,255,0,0.08), 0 8px 32px rgba(0,0,0,0.6)",
        minWidth: 130,
        maxWidth: 180,
        pointerEvents: "none",
      }}
    >
      {/* label tag */}
      <div
        style={{
          display: "inline-block",
          background: "#CAFF00",
          color: "#0A0A0F",
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 6,
          padding: "2px 6px",
          borderRadius: 3,
          marginBottom: 6,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        pixel says
      </div>
      {/* title */}
      <div
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 8,
          color: "#CAFF00",
          lineHeight: 1.6,
          marginBottom: 4,
          textShadow: "0 0 8px rgba(202,255,0,0.35)",
        }}
      >
        {title}
      </div>
      {/* hint */}
      <div
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 9,
          color: "rgba(255,255,255,0.55)",
          lineHeight: 1.5,
        }}
      >
        {hint}
      </div>
      {/* tail pointing LEFT — toward the character sitting to the LEFT of the card */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: -6,
          transform: "translateY(-50%)",
          width: 0,
          height: 0,
          borderTop: "5px solid transparent",
          borderBottom: "5px solid transparent",
          borderRight: "6px solid rgba(202,255,0,0.45)",
        }}
      />
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
// Desktop: character sits at top-right of the input, card floats to the right.
// Mobile (≤520 px): character + card render ABOVE the input so they're never
// clipped by the viewport edge.
export default function FieldMascot({ active, title, hint }) {
  const [walking, setWalking] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 520);
  const prevActive = useRef(active);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 520px)");
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (active && !prevActive.current) {
      setWalking(true);
      const t = setTimeout(() => setWalking(false), 560);
      return () => clearTimeout(t);
    }
    prevActive.current = active;
  }, [active]);

  if (isMobile) {
    // ── Mobile layout: full-width banner above the input ──────────────────────
    return (
      <AnimatePresence>
        {active && (
          <motion.div
            key="mobile-mascot"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(10,12,10,0.95)",
              border: "1px solid rgba(202,255,0,0.45)",
              borderRadius: 10,
              padding: "8px 12px",
              marginBottom: 6,
              pointerEvents: "none",
              boxShadow:
                "0 0 0 1px rgba(202,255,0,0.06), 0 6px 24px rgba(0,0,0,0.55)",
            }}
          >
            <PixelGuy walking={walking} />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "inline-block",
                  background: "#CAFF00",
                  color: "#0A0A0F",
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 6,
                  padding: "2px 6px",
                  borderRadius: 3,
                  marginBottom: 4,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                pixel says
              </div>
              <div
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 7,
                  color: "#CAFF00",
                  lineHeight: 1.6,
                  marginBottom: 2,
                }}
              >
                {title}
              </div>
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 9,
                  color: "rgba(255,255,255,0.5)",
                  lineHeight: 1.4,
                }}
              >
                {hint}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // ── Desktop layout: character at top-right, card to the right ─────────────
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: 0,
        height: 0,
        pointerEvents: "none",
        zIndex: 30,
        overflow: "visible",
      }}
    >
      {/* Character — 32×44px — feet at input's top-right corner */}
      <AnimatePresence>
        {active && (
          <motion.div
            key="char"
            style={{ position: "absolute", bottom: 0, right: 0 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <PixelGuy walking={walking} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card — to the RIGHT of the character (outside form frame), slides in from right */}
      <AnimatePresence>
        {active && (
          <motion.div
            key="card"
            style={{ position: "absolute", bottom: 4, left: 8 }}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <TooltipCard title={title} hint={hint} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
