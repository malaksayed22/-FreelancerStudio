// src/components/PixelScene.jsx
// Reusable animated pixel city scene  used in Login, Signup, and Settings pages.
// Props: speechText (string)

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const BUILDINGS = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  width: 16 + Math.floor((i * 17 + 7) % 26),
  height: 30 + Math.floor((i * 13 + 5) % 62),
}));

function generateWindows(w, h) {
  const wins = [];
  const rows = Math.floor(h / 12);
  const cols = Math.floor(w / 10);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if ((r * 7 + c * 11 + 3) % 10 > 3) {
        wins.push({
          id: `${r}-${c}`,
          left: c * 10 + 3,
          top: r * 12 + 4,
          delay: ((r * 3 + c * 5) % 40) * 0.1,
          duration: 2 + ((r + c * 3) % 5) * 0.6,
        });
      }
    }
  }
  return wins;
}

const BUILDING_DATA = BUILDINGS.map((b) => ({
  ...b,
  windows: generateWindows(b.width, b.height),
}));

const STARS = Array.from({ length: 55 }, (_, i) => ({
  id: i,
  left: ((i * 17.3 + (i % 7) * 11.1) % 98) + 1,
  top: ((i * 13.7 + (i % 5) * 9.3) % 68) + 1,
  size: 1 + (i % 3 === 0 ? 1 : 0),
  delay: (i * 0.19) % 3,
  duration: 1.5 + (i % 5) * 0.4,
}));

export default function PixelScene({
  speechText = "welcome!",
  showMascot = true,
}) {
  const legLRef = useRef(null);
  const legRRef = useRef(null);

  useEffect(() => {
    let toggle = true;
    const interval = setInterval(() => {
      if (legLRef.current && legRRef.current) {
        legLRef.current.style.transform = toggle
          ? "translateY(3px)"
          : "translateY(0)";
        legRRef.current.style.transform = toggle
          ? "translateY(0)"
          : "translateY(3px)";
        toggle = !toggle;
      }
    }, 280);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "#060D06",
        overflow: "hidden",
      }}
    >
      {/* STARS */}
      {STARS.map((star) => (
        <motion.div
          key={star.id}
          style={{
            position: "absolute",
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: star.size,
            height: star.size,
            borderRadius: "50%",
            background: "#fff",
          }}
          animate={{ opacity: [0.1, 0.95, 0.1] }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* NEON SIGN */}
      <motion.div
        style={{
          position: "absolute",
          top: 28,
          left: 32,
          zIndex: 5,
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 11,
          color: "#CAFF00",
          textShadow:
            "0 0 10px rgba(202,255,0,0.8), 0 0 30px rgba(202,255,0,0.4)",
          lineHeight: 2,
        }}
        animate={{ opacity: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0.25, 1, 0.6, 1] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "linear",
          times: [
            0, 0.82, 0.84, 0.86, 0.9, 0.92, 0.94, 0.96, 0.97, 0.975, 0.98, 0.99,
            1,
          ],
        }}
      >
        FREELANCER
        <br />
        STUDIO
      </motion.div>

      {/* SKYLINE */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "flex-end",
          gap: 2,
          padding: "0 8px",
          zIndex: 2,
        }}
      >
        {BUILDING_DATA.map((b) => (
          <div
            key={b.id}
            style={{
              width: b.width,
              height: b.height,
              background: "#0D1A0D",
              border: "2px solid #1A3A1A",
              position: "relative",
              flexShrink: 0,
            }}
          >
            {b.windows.map((w) => (
              <motion.div
                key={w.id}
                style={{
                  position: "absolute",
                  left: w.left,
                  top: w.top,
                  width: 5,
                  height: 5,
                  background: "#CAFF00",
                }}
                animate={{ opacity: [1, 0.08, 1] }}
                transition={{
                  duration: w.duration,
                  delay: w.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* GROUND */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 60,
          background: "#0D1A0D",
          borderTop: "2px solid #1A3A1A",
          zIndex: 3,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background:
              "repeating-linear-gradient(90deg, #CAFF00 0, #CAFF00 10px, transparent 10px, transparent 20px)",
          }}
        />
      </div>

      {/* WALKING MASCOT + BUBBLE */}
      {showMascot && (
        <motion.div
          style={{ position: "absolute", bottom: 62, zIndex: 10 }}
          animate={{
            left: [
              "-60px",
              "calc(50% - 20px)",
              "calc(50% - 20px)",
              "calc(100% + 60px)",
            ],
          }}
          transition={{
            duration: 12,
            times: [0, 0.42, 0.58, 1],
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Speech Bubble — positioned to the RIGHT of the character, outside its bounds */}
          <div
            style={{
              position: "absolute",
              bottom: 16,
              left: 42,
              background: "#CAFF00",
              color: "#0A0A0F",
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 6,
              padding: "6px 10px",
              borderRadius: 3,
              whiteSpace: "nowrap",
            }}
          >
            {speechText}
            {/* Left-pointing tail */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: -5,
                transform: "translateY(-50%)",
                width: 0,
                height: 0,
                borderTop: "5px solid transparent",
                borderBottom: "5px solid transparent",
                borderRight: "5px solid #CAFF00",
              }}
            />
          </div>

          {/* Pixel Character */}
          <div
            style={{
              width: 32,
              height: 44,
              position: "relative",
              imageRendering: "pixelated",
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
                  left: 8,
                  width: 8,
                  height: 2,
                  background: "#0A0A0F",
                  borderRadius: "0 0 2px 2px",
                }}
              />
            </div>
            {/* arms */}
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
              animate={{ rotate: [10, -10, 10] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
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
                  transition: "transform .28s",
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
                  transition: "transform .28s",
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
