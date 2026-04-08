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
          animation: "ptpulse 1.8s ease-in-out infinite",
        }}
      />
    </div>
  );
};

const STEPS = [
  {
    id: "welcome",
    targetId: null,
    title: "Hey, it's Pixel!",
    text: "Welcome to your Profile. This is your freelancer identity — how clients see you. Let me walk you through each section. Takes 30 seconds!",
    expression: "happy",
    charAnchor: "center",
  },
  {
    id: "hero",
    targetId: "ptour-hero",
    title: "Your Identity Card",
    text: "Upload a photo, add your name, role, location and a short bio. Hit <strong>Edit Profile</strong> to start personalizing it right now.",
    expression: "pointing",
    charAnchor: "bottom-right",
  },
  {
    id: "stats",
    targetId: "ptour-stats",
    title: "Your Studio Numbers",
    text: "Four key metrics: Projects built, Platforms, Day Streak, and Active Clients. Update them as you hit milestones — they show your momentum.",
    expression: "pointing",
    charAnchor: "bottom-right",
  },
  {
    id: "skills",
    targetId: "ptour-skills",
    title: "Skills & Expertise",
    text: "Your tech stack lives here. Add skills, drag to reorder, and each one gets a progress bar. Put your strongest skills first.",
    expression: "wink",
    charAnchor: "top-right",
  },
  {
    id: "contact",
    targetId: "ptour-contact",
    title: "Contact & Availability",
    text: "Link your GitHub, LinkedIn, and email so clients can find you instantly. The green dot signals you're open for business.",
    expression: "happy",
    charAnchor: "top-left",
  },
  {
    id: "projects",
    targetId: "ptour-projects",
    title: "Recent Projects",
    text: "Your featured work is showcased here. Head to the Projects page to add new ones — your best work auto-appears.",
    expression: "pointing",
    charAnchor: "top-right",
  },
  {
    id: "done",
    targetId: null,
    title: "Profile is yours now!",
    text: "Click <strong>Edit Profile</strong> to fill it in. The more complete it is, the more trust you build with clients. Let's make it shine!",
    expression: "happy",
    charAnchor: "center",
  },
];

export default function ProfileOnboardingTour({ onComplete }) {
  const [step, setStep] = useState(0);
  const [charPos, setCharPos] = useState({
    x: window.innerWidth / 2 - 19,
    y: window.innerHeight / 2,
  });
  const [targetRect, setTargetRect] = useState(null);
  const [isMoving, setIsMoving] = useState(false);
  const [visible, setVisible] = useState(false);

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
    const bubbleOffset = 200;
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
        pos = {
          x: window.innerWidth / 2 - 19,
          y: window.innerHeight / 2 + 40,
        };
        break;
    }

    return {
      x: clamp(pos.x, 12, window.innerWidth - charW - 12),
      y: clamp(pos.y, 12, window.innerHeight - charH - 12),
    };
  };

  const goToStep = (nextStep) => {
    const s = STEPS[nextStep];

    setIsMoving(true);
    setTargetRect(null);

    const rect = measureTarget(s.targetId);
    const newPos = calcCharPos(rect, s.charAnchor);

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
    setCharPos({ x: window.innerWidth / 2 - 19, y: -60 });
    setTimeout(() => setVisible(true), 50);
    setTimeout(() => {
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
    return () => window.removeEventListener("resize", handleResize);
  }, [currentStep.targetId, currentStep.charAnchor, isMoving]);

  useEffect(() => {
    if (currentStep.charAnchor !== "center" && visible && !isMoving) {
      const rect = measureTarget(currentStep.targetId);
      if (rect) {
        const pos = calcCharPos(rect, currentStep.charAnchor);
        setCharPos(pos);
      }
    }
  }, [step, visible]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Enter" && visible && !isMoving) {
        next();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
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

  // Calculate bubble position relative to character
  const getBubbleStyle = () => {
    const bubbleW = 290;
    const charH = 46;
    const vp = { w: window.innerWidth, h: window.innerHeight };

    let left = charPos.x - bubbleW / 2 + 19;
    left = clamp(left, 12, vp.w - bubbleW - 12);

    const spaceBelow = vp.h - charPos.y - charH - 16;
    const spaceAbove = charPos.y - 16;
    const bubbleH = 180;

    let top;
    let arrowClass = "arrow-bottom";
    let arrowLeft = clamp(charPos.x + 19 - left, 20, bubbleW - 30);

    if (spaceBelow >= bubbleH) {
      top = charPos.y + charH + 14;
      arrowClass = "arrow-top";
    } else {
      top = charPos.y - bubbleH - 18;
      arrowClass = "arrow-bottom";
    }

    top = clamp(top, 12, vp.h - bubbleH - 12);

    return { left, top, arrowClass, arrowLeft };
  };

  if (!visible) return null;

  const { left: bLeft, top: bTop, arrowClass, arrowLeft } = getBubbleStyle();

  return (
    <>
      <style>{`
        @keyframes ptpulse {
          0%,100% { box-shadow: 0 0 0 4px rgba(200,255,87,0.15), 0 0 40px rgba(200,255,87,0.2); }
          50% { box-shadow: 0 0 0 8px rgba(200,255,87,0.08), 0 0 60px rgba(200,255,87,0.35); }
        }
        @keyframes pt-charRun {
          0% { transform: translateY(0px) rotate(-3deg); }
          100% { transform: translateY(-3px) rotate(3deg); }
        }
        @keyframes pt-charIdle {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes pt-bubblePop {
          0% { opacity:0; transform: scale(0.6) translateY(10px); }
          100% { opacity:1; transform: scale(1) translateY(0); }
        }
        @keyframes pt-welcomePop {
          0% { opacity:0; transform: scale(.85) translateY(30px); }
          100% { opacity:1; transform: scale(1) translateY(0); }
        }
        @keyframes pt-stepDot {
          0%,100% { transform: scale(1); }
          50% { transform: scale(1.3); }
        }
        @keyframes pt-charDrop {
          0% { opacity:0; transform: translateY(-30px); }
          100% { opacity:1; transform: translateY(0); }
        }
        @keyframes pt-fadeIn {
          from { opacity:0; } to { opacity:1; }
        }

        .pt-char-wrap {
          position: fixed;
          z-index: 99999;
          transition: left 0.55s cubic-bezier(.77,0,.18,1), top 0.55s cubic-bezier(.77,0,.18,1), opacity 0.3s ease;
          pointer-events: none;
          animation: pt-charDrop 0.5s cubic-bezier(.34,1.56,.64,1) both;
          filter: drop-shadow(0 6px 16px rgba(200,255,87,0.6));
          will-change: left, top;
        }
        .pt-char-idle { animation: pt-charIdle 2s ease-in-out infinite; }
        .pt-char-run  { animation: pt-charRun 0.3s ease-in-out infinite alternate; }

        .pt-bubble {
          position: fixed;
          z-index: 99998;
          width: 290px;
          background: #0f0f12;
          border: 1.5px solid #c8ff57;
          border-radius: 16px;
          padding: 18px 20px 16px;
          font-family: 'Syne', sans-serif;
          box-shadow: 0 0 40px rgba(200,255,87,0.2), 0 20px 60px rgba(0,0,0,0.6);
          animation: pt-bubblePop .35s cubic-bezier(.34,1.56,.64,1) both;
          pointer-events: all;
        }
        .pt-bubble::after {
          content: '';
          position: absolute;
          width: 10px; height: 10px;
          background: #0f0f12;
          left: var(--pt-arrow-left, 24px);
        }
        .pt-bubble.arrow-bottom::after {
          bottom: -6px;
          border-right: 1.5px solid #c8ff57;
          border-bottom: 1.5px solid #c8ff57;
          transform: rotate(45deg);
        }
        .pt-bubble.arrow-top::after {
          top: -6px;
          border-left: 1.5px solid #c8ff57;
          border-top: 1.5px solid #c8ff57;
          transform: rotate(45deg);
        }

        .pt-step-label {
          font-family: 'DM Mono', monospace;
          font-size: 9px; font-weight: 500;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: #c8ff57; margin-bottom: 8px;
        }
        .pt-title {
          font-size: 15px; font-weight: 800;
          color: #f0f0f0; letter-spacing: -0.3px;
          line-height: 1.2; margin-bottom: 8px;
        }
        .pt-text {
          font-family: 'DM Mono', monospace;
          font-size: 10px; color: #666;
          line-height: 1.7; letter-spacing: 0.02em;
          margin-bottom: 16px;
        }
        .pt-text strong { color: #c8ff57; font-weight: 500; }

        .pt-actions { display: flex; align-items: center; justify-content: space-between; }
        .pt-dots { display: flex; gap: 5px; align-items: center; }
        .pt-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: rgba(255,255,255,0.12);
          transition: all 0.2s;
        }
        .pt-dot.active {
          background: #c8ff57;
          width: 16px; border-radius: 99px;
          animation: pt-stepDot .6s ease-in-out;
        }

        .pt-btn-skip {
          font-family: 'DM Mono', monospace;
          font-size: 9px; color: #444;
          letter-spacing: 0.06em; text-transform: uppercase;
          background: none; border: none; cursor: pointer;
          padding: 6px 0; transition: color 0.15s;
        }
        .pt-btn-skip:hover { color: #888; }

        .pt-btn-next {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 18px; border-radius: 99px;
          background: #c8ff57; border: none;
          font-family: 'Syne', sans-serif; font-size: 11px;
          font-weight: 800; color: #0a0a0c;
          cursor: pointer; transition: transform .15s, box-shadow .15s;
          letter-spacing: -0.2px;
        }
        .pt-btn-next:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 20px rgba(200,255,87,0.4);
        }

        .pt-profile-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 10px; border-radius: 99px;
          background: rgba(200,255,87,0.1);
          border: 1px solid rgba(200,255,87,0.25);
          font-family: 'DM Mono', monospace; font-size: 9px;
          color: #c8ff57; letter-spacing: .06em; text-transform: uppercase;
          margin-bottom: 10px;
        }

        .pt-overlay-bg {
          position: fixed; inset: 0; z-index: 99996;
          animation: pt-fadeIn 0.2s ease both;
          pointer-events: none;
        }
      `}</style>

      {/* Overlay / spotlight */}
      <div className="pt-overlay-bg" />
      <Spotlight target={targetRect} />

      {/* Pixel character */}
      <div
        className={`pt-char-wrap ${isMoving ? "pt-char-run" : "pt-char-idle"}`}
        style={{ left: charPos.x, top: charPos.y }}
        aria-hidden="true"
      >
        <Character
          flipped={isMoving && charPos.x < window.innerWidth / 2}
          running={isMoving}
          expression={currentStep.expression}
        />
      </div>

      {/* Speech bubble */}
      <div
        key={step}
        className={`pt-bubble ${arrowClass}`}
        style={{
          left: bLeft,
          top: bTop,
          "--pt-arrow-left": `${arrowLeft}px`,
        }}
        role="dialog"
        aria-live="polite"
        aria-label={currentStep.title}
      >
        <div className="pt-profile-badge">
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <circle cx="4" cy="4" r="3" fill="#c8ff57" opacity="0.9" />
          </svg>
          profile tour · {step + 1}/{STEPS.length}
        </div>

        <div className="pt-step-label">
          {step === 0
            ? "welcome"
            : step === STEPS.length - 1
              ? "done!"
              : `step ${step} of ${STEPS.length - 2}`}
        </div>

        <div className="pt-title">{currentStep.title}</div>

        <div
          className="pt-text"
          dangerouslySetInnerHTML={{ __html: currentStep.text }}
        />

        <div className="pt-actions">
          <div className="pt-dots">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={"pt-dot" + (i === step ? " active" : "")}
              />
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {step < STEPS.length - 1 && (
              <button
                className="pt-btn-skip"
                onClick={skip}
                aria-label="Skip tour"
              >
                skip
              </button>
            )}
            <button
              className="pt-btn-next"
              onClick={next}
              aria-label={
                step === STEPS.length - 1 ? "Finish profile tour" : "Next step"
              }
            >
              {step === STEPS.length - 1 ? (
                <>Let's go! ✦</>
              ) : (
                <>
                  Next
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M2 5h6M5.5 2.5L8 5l-2.5 2.5"
                      stroke="#0a0a0c"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
