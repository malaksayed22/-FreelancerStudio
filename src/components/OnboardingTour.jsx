import { useState, useEffect, useRef } from "react";

const Character = ({
  flipped = false,
  running = false,
  expression = "happy",
}) => (
  <svg
    width="38"
    height="46"
    viewBox="0 0 38 46"
    fill="none"
    style={{ transform: flipped ? "scaleX(-1)" : "none", display: "block" }}
  >
    {running && (
      <path
        d="M22 16 Q30 20 27 28 Q24 31 22 27"
        fill="none"
        stroke="rgba(200,255,87,0.5)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    )}
    <rect x="11" y="17" width="16" height="16" rx="3" fill="#1e2e1e" />
    <rect x="11" y="17" width="16" height="7" rx="2.5" fill="#2a3f2a" />
    <rect x="15" y="17" width="8" height="3.5" rx="1.5" fill="#c8ff57" />
    <rect x="6" y="18" width="5" height="9" rx="2.5" fill="#1e2e1e" />
    <rect x="27" y="18" width="5" height="9" rx="2.5" fill="#1e2e1e" />
    <circle cx="8.5" cy="27.5" r="2.5" fill="#f4b97f" />
    <circle cx="29.5" cy="27.5" r="2.5" fill="#f4b97f" />
    <rect x="13" y="33" width="5" height="9" rx="2.5" fill="#1a1a22" />
    <rect x="20" y="33" width="5" height="9" rx="2.5" fill="#1a1a22" />
    <rect x="11" y="40" width="7" height="4" rx="2" fill="#c8ff57" />
    <rect x="20" y="40" width="7" height="4" rx="2" fill="#c8ff57" />
    <rect x="15.5" y="14" width="7" height="4" rx="1.5" fill="#f4b97f" />
    <rect x="10" y="3" width="18" height="14" rx="5" fill="#f4b97f" />
    <rect x="10" y="3" width="18" height="5.5" rx="5" fill="#1a1a1a" />
    <rect x="10" y="5" width="5" height="5" rx="1.5" fill="#1a1a1a" />
    {expression === "happy" && (
      <>
        <rect x="13" y="10" width="3.5" height="3.5" rx="1.2" fill="#1a1a1a" />
        <rect x="21" y="10" width="3.5" height="3.5" rx="1.2" fill="#1a1a1a" />
        <rect x="13.8" y="10.6" width="1.2" height="1.2" rx=".6" fill="white" />
        <rect x="21.8" y="10.6" width="1.2" height="1.2" rx=".6" fill="white" />
        <path
          d="M14 15 Q19 17 24 15"
          stroke="#c07050"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
        />
      </>
    )}
    {expression === "pointing" && (
      <>
        <rect x="13" y="10" width="3.5" height="3.5" rx="1.2" fill="#1a1a1a" />
        <rect x="21" y="10" width="3.5" height="3.5" rx="1.2" fill="#1a1a1a" />
        <rect x="14.5" y="10.6" width="1.2" height="1.2" rx=".6" fill="white" />
        <rect x="22.5" y="10.6" width="1.2" height="1.2" rx=".6" fill="white" />
        <ellipse cx="19" cy="16" rx="2.5" ry="1.2" fill="#c07050" />
      </>
    )}
    {expression === "wink" && (
      <>
        <path
          d="M13 11.5 Q14.75 10 16.5 11.5"
          stroke="#1a1a1a"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <rect x="21" y="10" width="3.5" height="3.5" rx="1.2" fill="#1a1a1a" />
        <rect x="21.8" y="10.6" width="1.2" height="1.2" rx=".6" fill="white" />
        <path
          d="M14 15 Q19 17 24 15"
          stroke="#c07050"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
        />
      </>
    )}
    <rect x="8" y="8" width="3.5" height="5" rx="1.5" fill="#f4b97f" />
    <rect x="26.5" y="8" width="3.5" height="5" rx="1.5" fill="#f4b97f" />
    <path
      d="M9 8 Q19 1 29 8"
      stroke="rgba(200,255,87,0.7)"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
    <circle cx="9" cy="9" r="2" fill="#c8ff57" />
    <circle cx="29" cy="9" r="2" fill="#c8ff57" />
  </svg>
);

const Spotlight = ({ target }) => {
  if (!target) return null;
  const pad = 12;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99997,
        pointerEvents: "none",
        background: "rgba(0,0,0,0)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: target.top - pad,
          background: "rgba(0,0,0,0.72)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: target.top + target.height + pad,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.72)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: target.top - pad,
          left: 0,
          width: target.left - pad,
          height: target.height + pad * 2,
          background: "rgba(0,0,0,0.72)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: target.top - pad,
          left: target.left + target.width + pad,
          right: 0,
          height: target.height + pad * 2,
          background: "rgba(0,0,0,0.72)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: target.top - pad,
          left: target.left - pad,
          width: target.width + pad * 2,
          height: target.height + pad * 2,
          border: "2px solid #c8ff57",
          borderRadius: 16,
          boxShadow:
            "0 0 0 4px rgba(200,255,87,0.15), 0 0 40px rgba(200,255,87,0.2)",
          animation: "tpulse 1.8s ease-in-out infinite",
        }}
      />
    </div>
  );
};

const STEPS = [
  {
    id: "welcome",
    targetId: null,
    title: "Hey there! I'm Pixel",
    text: "I'll show you around FreelancerStudio in 30 seconds. Your dashboard is empty right now - let's fix that! Follow me!",
    expression: "happy",
    charAnchor: "center",
  },
  {
    id: "stats",
    targetId: "tour-stats",
    title: "Your Studio Stats",
    text: "These 4 cards track everything: Clients, Projects, Tasks, and Revenue. They update in real time as you work.",
    expression: "pointing",
    charAnchor: "bottom-right",
  },
  {
    id: "taskboard",
    targetId: "tour-taskboard",
    title: "Task Board",
    text: "Drag tasks between To Do -> In Progress -> Done. Every card has a progress bar and a due date. Nothing slips through.",
    expression: "pointing",
    charAnchor: "top-right",
  },
  {
    id: "clients",
    targetId: "tour-clients",
    title: "Your Clients",
    text: "Every client you add appears here. Click one to see all their projects, invoices, and history in one place.",
    expression: "wink",
    charAnchor: "top-left",
  },
  {
    id: "activity",
    targetId: "tour-activity",
    title: "Weekly Activity",
    text: "This is your streak tracker - like GitHub but for freelancing. Green means productive day. Keep the streak alive!",
    expression: "happy",
    charAnchor: "top-right",
  },
  {
    id: "navbar",
    targetId: "tour-navbar",
    title: "Live and Command Bar",
    text: "Use Cmd+K (or the menu) to jump anywhere instantly. The Live dot means your dashboard is syncing in real time. Always up to date.",
    expression: "wink",
    charAnchor: "top-left",
  },
  {
    id: "done",
    targetId: null,
    title: "You're all set!",
    text: "Studio is ready. Add your first client, create a project, and start tracking. Let's build something great!",
    expression: "happy",
    charAnchor: "center",
  },
];

export default function OnboardingTour({ onComplete }) {
  const [step, setStep] = useState(0);
  const [charPos, setCharPos] = useState({
    x: window.innerWidth / 2 - 19,
    y: window.innerHeight / 2,
  });
  const [targetRect, setTargetRect] = useState(null);
  const [isMoving, setIsMoving] = useState(false);
  const [visible, setVisible] = useState(false);
  const charRef = useRef(null);

  const currentStep = STEPS[step];

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const measureTarget = (id) => {
    if (!id) return null;
    const el = document.getElementById(id);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { top: r.top, left: r.left, width: r.width, height: r.height };
  };

  const calcCharPos = (rect, anchor) => {
    if (!rect) {
      return { x: window.innerWidth / 2 - 19, y: window.innerHeight / 2 + 40 };
    }
    const pad = 30;
    const charW = 38;
    const charH = 46;
    const bubbleOffset = 200; // Space needed for bubble
    let pos;
    switch (anchor) {
      case "bottom-left":
        pos = { x: rect.left + pad, y: rect.top + rect.height + bubbleOffset };
        break;
      case "bottom-right":
        pos = {
          x: rect.left + rect.width - charW - pad,
          y: rect.top + rect.height + bubbleOffset,
        };
        break;
      case "top-right":
        pos = {
          x: rect.left + rect.width - charW - pad,
          y: rect.top - charH - bubbleOffset,
        };
        break;
      case "top-left":
        pos = { x: rect.left + pad, y: rect.top - charH - bubbleOffset };
        break;
      default:
        pos = { x: window.innerWidth / 2 - 19, y: window.innerHeight / 2 + 40 };
        break;
    }

    // Ensure character stays within viewport bounds.
    // safeTop: keep char below sticky header+ticker (ticker~22 + header~56 + buffer~14 = 92)
    const safeTop = 92;
    return {
      x: clamp(pos.x, 12, window.innerWidth - charW - 12),
      y: clamp(pos.y, safeTop, window.innerHeight - charH - 12),
    };
  };

  const goToStep = (nextStep) => {
    const s = STEPS[nextStep];

    setIsMoving(true);
    setTargetRect(null);

    // Immediate measurement and positioning
    const rect = measureTarget(s.targetId);
    const newPos = calcCharPos(rect, s.charAnchor);

    // Scroll to target element if it exists
    if (s.targetId) {
      const targetEl = document.getElementById(s.targetId);
      if (targetEl) {
        targetEl.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      }
    }

    setTimeout(() => {
      const updatedRect = measureTarget(s.targetId);
      const updatedPos = calcCharPos(updatedRect, s.charAnchor);
      setCharPos(updatedPos);
    }, 200);

    setTimeout(() => {
      setIsMoving(false);
      setTargetRect(measureTarget(s.targetId));
      setStep(nextStep);
    }, 600);
  };

  useEffect(() => {
    // Start character at center, off-screen top
    setCharPos({ x: window.innerWidth / 2 - 19, y: -60 });
    setTimeout(() => setVisible(true), 50);
    setTimeout(() => {
      // Drop character into center view
      setCharPos({
        x: window.innerWidth / 2 - 19,
        y: window.innerHeight / 2 + 40,
      });
    }, 150);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (visible) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [visible]);

  useEffect(() => {
    const handleResize = () => {
      if (!currentStep.targetId || isMoving) return;
      const rect = measureTarget(currentStep.targetId);
      setTargetRect(rect);
      setCharPos(calcCharPos(rect, currentStep.charAnchor));
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [currentStep.targetId, currentStep.charAnchor, isMoving]);

  // Ensure character is positioned when step changes to non-center
  useEffect(() => {
    if (currentStep.charAnchor !== "center" && visible && !isMoving) {
      const rect = measureTarget(currentStep.targetId);
      if (rect) {
        const pos = calcCharPos(rect, currentStep.charAnchor);
        setCharPos(pos);
      }
    }
  }, [step, visible]);

  // Add keyboard support for Enter key
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Enter" && visible && !isMoving) {
        next();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [visible, isMoving, step]);

  const next = () => {
    if (step < STEPS.length - 1) {
      goToStep(step + 1);
    } else {
      setVisible(false);
      setTimeout(() => onComplete?.(), 400);
    }
  };

  const skip = () => {
    setVisible(false);
    setTimeout(() => onComplete?.(), 300);
  };

  if (!visible) return null;

  return (
    <>
      <style>{`

        @keyframes tpulse {
          0%,100% { box-shadow: 0 0 0 4px rgba(200,255,87,0.15), 0 0 40px rgba(200,255,87,0.2); }
          50% { box-shadow: 0 0 0 8px rgba(200,255,87,0.08), 0 0 60px rgba(200,255,87,0.35); }
        }
        @keyframes charRun {
          0% { transform: translateY(0px) rotate(-3deg); }
          100% { transform: translateY(-3px) rotate(3deg); }
        }
        @keyframes charIdle {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes bubblePop {
          0% { opacity:0; transform: scale(0.6) translateY(10px); }
          100% { opacity:1; transform: scale(1) translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity:0; } to { opacity:1; }
        }
        @keyframes welcomePop {
          0% { opacity:0; transform: scale(.85) translateY(30px); }
          100% { opacity:1; transform: scale(1) translateY(0); }
        }
        @keyframes stepDot {
          0%,100% { transform: scale(1); }
          50% { transform: scale(1.3); }
        }
        @keyframes charDrop {
          0% { opacity:0; transform: translateY(-30px); }
          100% { opacity:1; transform: translateY(0); }
        }

        .ot-char-wrap {
          position: fixed;
          z-index: 99999;
          transition: left 0.55s cubic-bezier(.77,0,.18,1), top 0.55s cubic-bezier(.77,0,.18,1), opacity 0.3s ease;
          pointer-events: none;
          animation: charDrop 0.5s cubic-bezier(.34,1.56,.64,1) both;
          filter: drop-shadow(0 6px 16px rgba(200,255,87,0.6));
          will-change: left, top;
        }
        .ot-char-idle { animation: charIdle 2s ease-in-out infinite; }
        .ot-char-run { animation: charRun 0.3s ease-in-out infinite alternate; }

        .ot-bubble {
          position: fixed;
          z-index: 99998;
          width: 290px;
          background: #0f0f12;
          border: 1.5px solid #c8ff57;
          border-radius: 16px;
          padding: 18px 20px 16px;
          font-family: 'Syne', sans-serif;
          box-shadow: 0 0 40px rgba(200,255,87,0.2), 0 20px 60px rgba(0,0,0,0.6);
          animation: bubblePop .35s cubic-bezier(.34,1.56,.64,1) both;
          pointer-events: all;
        }
        .ot-bubble::after {
          content: '';
          position: absolute;
          width: 10px;
          height: 10px;
          background: #0f0f12;
          left: var(--arrow-left, 24px);
        }
        .ot-bubble.arrow-bottom::after { 
          bottom: -6px;
          border-right: 1.5px solid #c8ff57;
          border-bottom: 1.5px solid #c8ff57;
          transform: rotate(45deg);
        }
        .ot-bubble.arrow-top::after {
          top: -6px;
          border-left: 1.5px solid #c8ff57;
          border-top: 1.5px solid #c8ff57;
          transform: rotate(45deg);
        }

        .ot-step-label {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #c8ff57;
          margin-bottom: 8px;
        }
        .ot-title {
          font-size: 15px;
          font-weight: 800;
          color: #f0f0f0;
          letter-spacing: -0.3px;
          line-height: 1.2;
          margin-bottom: 8px;
        }
        .ot-text {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: #666;
          line-height: 1.7;
          letter-spacing: 0.02em;
          margin-bottom: 16px;
        }
        .ot-text strong { color: #c8ff57; font-weight: 500; }

        .ot-actions { display: flex; align-items: center; justify-content: space-between; }
        .ot-dots { display: flex; gap: 5px; align-items: center; }
        .ot-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(255,255,255,0.12);
          transition: all 0.2s;
        }
        .ot-dot.active {
          background: #c8ff57;
          width: 16px;
          border-radius: 99px;
          animation: stepDot .6s ease-in-out;
        }

        .ot-btn-skip {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          color: #444;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px 0;
          transition: color 0.15s;
        }
        .ot-btn-skip:hover { color: #888; }

        .ot-btn-next {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 18px;
          border-radius: 99px;
          background: #c8ff57;
          border: none;
          font-family: 'Syne', sans-serif;
          font-size: 12px;
          font-weight: 700;
          color: #0a0a0c;
          cursor: pointer;
          letter-spacing: -0.1px;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .ot-btn-next:hover { transform: scale(1.04); box-shadow: 0 4px 20px rgba(200,255,87,0.4); }
        .ot-btn-next:active { transform: scale(.97); }

        .ot-welcome-backdrop {
          position: fixed;
          inset: 0;
          z-index: 99999;
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          overflow-y: auto;
          animation: fadeIn .2s ease both;
        }
        .ot-welcome-card {
          width: 460px;
          max-width: 100%;
          background: #0f0f12;
          border: 1.5px solid rgba(200,255,87,0.4);
          border-radius: 24px;
          padding: 40px 40px 36px;
          text-align: center;
          box-shadow: 0 0 80px rgba(200,255,87,0.15), 0 40px 80px rgba(0,0,0,0.7);
          animation: welcomePop .4s cubic-bezier(.34,1.56,.64,1) both;
          font-family: 'Syne', sans-serif;
          position: relative;
          overflow: visible;
          margin: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .ot-welcome-glow {
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: 200px;
          height: 150px;
          background: radial-gradient(circle, rgba(200,255,87,0.15) 0%, transparent 60%);
          pointer-events: none;
          z-index: 1;
        }
        .ot-welcome-char {
          margin: 0 auto 24px;
          animation: charIdle 2s ease-in-out infinite;
          display: inline-block;
          position: relative;
          z-index: 100;
          filter: drop-shadow(0 6px 20px rgba(200,255,87,0.4));
          transform-origin: center;
        }
        .ot-welcome-title {
          font-size: 28px;
          font-weight: 800;
          color: #f0f0f0;
          letter-spacing: -0.8px;
          line-height: 1.1;
          margin-bottom: 14px;
          position: relative;
          z-index: 2;
        }
        .ot-welcome-title span { color: #c8ff57; }
        .ot-welcome-text {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: #555;
          line-height: 1.8;
          margin-bottom: 28px;
          white-space: pre-line;
          position: relative;
          z-index: 2;
        }
        .ot-welcome-btns { display: flex; gap: 10px; justify-content: center; position: relative; z-index: 2; }
        .ot-welcome-start {
          padding: 12px 28px;
          border-radius: 99px;
          background: #c8ff57;
          border: none;
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #0a0a0c;
          cursor: pointer;
          transition: transform .15s, box-shadow .15s;
        }
        .ot-welcome-start:hover { transform: scale(1.04); box-shadow: 0 6px 24px rgba(200,255,87,0.5); }
        .ot-welcome-skip {
          padding: 12px 20px;
          border-radius: 99px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: #444;
          cursor: pointer;
          transition: border-color .15s, color .15s;
        }
        .ot-welcome-skip:hover { border-color: rgba(255,255,255,0.2); color: #888; }

        @media (max-width: 500px) {
          .ot-bubble { width: calc(100vw - 24px) !important; max-width: 290px; }
          .ot-welcome-card {
            padding: 28px 24px 24px;
            border-radius: 20px;
          }
          .ot-welcome-char {
            margin-bottom: 20px;
          }
          .ot-welcome-char > div {
            transform: scale(1.2) !important;
          }
          .ot-welcome-title {
            font-size: 22px;
            margin-bottom: 12px;
          }
          .ot-welcome-text {
            font-size: 10px;
            margin-bottom: 20px;
          }
          .ot-welcome-btns {
            flex-direction: column;
            gap: 8px;
          }
          .ot-welcome-start,
          .ot-welcome-skip {
            width: 100%;
          }
          .ot-bubble {
            width: 260px;
            padding: 14px 16px;
          }
          .ot-title {
            font-size: 14px;
          }
          .ot-text {
            font-size: 9.5px;
          }
        }

        @media (max-height: 760px) {
          .ot-welcome-card {
            padding: 28px 32px 24px;
          }
          .ot-welcome-char {
            margin-bottom: 18px;
          }
          .ot-welcome-char > div {
            transform: scale(1.2) !important;
          }
          .ot-welcome-title {
            font-size: 24px;
          }
        }
        
        @media (max-height: 600px) {
          .ot-welcome-card {
            padding: 20px 28px 18px;
          }
          .ot-welcome-char {
            margin-bottom: 14px;
          }
          .ot-welcome-char > div {
            transform: scale(1.0) !important;
          }
          .ot-welcome-title {
            font-size: 20px;
            margin-bottom: 8px;
          }
          .ot-welcome-text {
            font-size: 10px;
            margin-bottom: 16px;
          }
        }
      `}</style>

      {currentStep.charAnchor === "center" && !isMoving && (
        <div
          className="ot-welcome-backdrop"
          onTouchEnd={(e) => {
            if (e.target === e.currentTarget) next();
          }}
        >
          <div className="ot-welcome-card">
            <div className="ot-welcome-glow" />
            <div className="ot-welcome-char">
              <div style={{ transform: "scale(1.4)" }}>
                <Character expression={currentStep.expression} />
              </div>
            </div>
            <div className="ot-welcome-title">
              {step === 0 ? (
                <>
                  Welcome to <span>FreelancerStudio</span>
                </>
              ) : (
                <>
                  You&apos;re all set! <span>DONE</span>
                </>
              )}
            </div>
            <div className="ot-welcome-text">
              {step === 0
                ? "Your dashboard is empty right now - but that is about to change.\nI am Pixel, your guide. Let me show you around in 30 seconds."
                : "Studio is ready. Add your first client, create a project,\nand start tracking. Let's build something great!"}
            </div>
            <div className="ot-welcome-btns">
              {step === 0 ? (
                <>
                  <button className="ot-welcome-start" onClick={next}>
                    Let&apos;s go! -&gt;
                  </button>
                  <button className="ot-welcome-skip" onClick={skip}>
                    Skip tour
                  </button>
                </>
              ) : (
                <button className="ot-welcome-start" onClick={skip}>
                  Start Building -&gt;
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {targetRect && !isMoving && <Spotlight target={targetRect} />}

      {currentStep.charAnchor !== "center" && (
        <div
          className="ot-char-wrap"
          style={{
            left: charPos.x,
            top: charPos.y,
            opacity: visible ? 1 : 0,
            visibility: visible ? "visible" : "hidden",
          }}
          ref={charRef}
        >
          <div className={isMoving ? "ot-char-run" : "ot-char-idle"}>
            <Character
              expression={currentStep.expression}
              running={isMoving}
              flipped={isMoving && charPos.x > window.innerWidth / 2}
            />
          </div>
        </div>
      )}

      {currentStep.charAnchor !== "center" && !isMoving && targetRect && (
        <div
          className={`ot-bubble ${currentStep.charAnchor?.startsWith("bottom") ? "arrow-bottom" : "arrow-top"}`}
          style={{
            left: (() => {
              const bubbleW = Math.min(290, window.innerWidth - 24);
              const charW = 38;
              const charCenterX = charPos.x + charW / 2;
              const idealBubbleLeft = charCenterX - bubbleW / 2;
              const minLeft = 12;
              const maxLeft = window.innerWidth - bubbleW - 12;
              return Math.max(minLeft, Math.min(idealBubbleLeft, maxLeft));
            })(),
            top: (() => {
              const charH = 46;
              const spacing = 20;
              if (currentStep.charAnchor?.startsWith("bottom")) {
                // Character is below target, bubble goes ABOVE character
                return charPos.y - 180;
              } else {
                // Character is above target, bubble goes BELOW character
                return charPos.y + charH + spacing;
              }
            })(),
            transform: "none",
            "--arrow-left": (() => {
              const bubbleW = Math.min(290, window.innerWidth - 24);
              const charW = 38;
              const charCenterX = charPos.x + charW / 2;
              const idealBubbleLeft = charCenterX - bubbleW / 2;
              const minLeft = 12;
              const maxLeft = window.innerWidth - bubbleW - 12;
              const actualBubbleLeft = Math.max(
                minLeft,
                Math.min(idealBubbleLeft, maxLeft),
              );
              const arrowLeft = charCenterX - actualBubbleLeft - 5;
              return `${Math.max(20, Math.min(arrowLeft, bubbleW - 30))}px`;
            })(),
          }}
          key={step}
        >
          <div className="ot-step-label">
            step {step} of {STEPS.length - 1} - pixel says
          </div>
          <div className="ot-title">{currentStep.title}</div>
          <div
            className="ot-text"
            dangerouslySetInnerHTML={{
              __html: currentStep.text.replace(
                /\*\*(.+?)\*\*/g,
                "<strong>$1</strong>",
              ),
            }}
          />
          <div className="ot-actions">
            <div className="ot-dots">
              {STEPS.slice(1, -1).map((_, i) => (
                <div
                  key={i}
                  className={`ot-dot${i === step - 1 ? " active" : ""}`}
                />
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button className="ot-btn-skip" onClick={skip}>
                skip
              </button>
              <button className="ot-btn-next" onClick={next}>
                {step === STEPS.length - 2 ? "Finish" : "Next ->"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
