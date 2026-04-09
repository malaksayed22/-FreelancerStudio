import { useState, useEffect, useRef, useCallback } from "react";

/* ─── shared style objects ─── */
const mono = { fontFamily: "'DM Mono', monospace" };
const card = {
  background: "#161619",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: 16,
};

/* ─── DATA ─── */
const METRICS = [
  {
    key: "clients",
    label: "Clients",
    val: "9",
    color: "#c8ff57",
    sub: "↑ +3 this month",
    subColor: "#5bcb8a",
  },
  {
    key: "projects",
    label: "Projects",
    val: "6",
    color: "#f472b6",
    sub: "↑ +1 this week",
    subColor: "#5bcb8a",
  },
  {
    key: "tasks",
    label: "Tasks",
    val: "9",
    color: "#22d3ee",
    sub: "↓ 3 completed",
    subColor: "#ff5757",
  },
  {
    key: "revenue",
    label: "Revenue",
    val: "$35.2k",
    color: "#fb923c",
    sub: "↑ +18% vs last",
    subColor: "#5bcb8a",
  },
];

const ACTIVITY = [
  { color: "#c8ff57", text: "Added client Menna", time: "24 min ago" },
  { color: "#f472b6", text: "Created project Freelancer", time: "44 min ago" },
  { color: "#fb923c", text: "Revenue milestone hit", time: "2 hrs ago" },
];

const KANBAN = {
  todo: [
    {
      tag: "Design",
      tagBg: "rgba(108,106,245,0.12)",
      tagColor: "#a8a6ff",
      tagBc: "rgba(108,106,245,0.2)",
      title: "Redesign landing page hero section",
      date: "Apr 12",
      pct: 20,
      fillColor: "#6c6af5",
    },
    {
      tag: "Dev",
      tagBg: "rgba(56,189,248,0.1)",
      tagColor: "#7dd3fc",
      tagBc: "rgba(56,189,248,0.2)",
      title: "Set up Stripe payment flow",
      date: "Apr 15",
      pct: 5,
      fillColor: "#444",
    },
    {
      tag: "Copy",
      tagBg: "rgba(244,114,182,0.1)",
      tagColor: "#f9a8d4",
      tagBc: "rgba(244,114,182,0.2)",
      title: "Write case study for VELORA",
      date: "Apr 20",
      pct: 0,
      fillColor: "#444",
    },
  ],
  progress: [
    {
      tag: "React",
      tagBg: "rgba(91,203,138,0.1)",
      tagColor: "#86efac",
      tagBc: "rgba(91,203,138,0.2)",
      title: "Build portfolio dashboard UI",
      date: "Apr 9",
      pct: 55,
      fillColor: "#fb923c",
    },
    {
      tag: "Motion",
      tagBg: "rgba(251,191,36,0.1)",
      tagColor: "#fcd34d",
      tagBc: "rgba(251,191,36,0.2)",
      title: "Animate scroll interactions",
      date: "Apr 11",
      pct: 40,
      fillColor: "#fb923c",
    },
    {
      tag: "CSS",
      tagBg: "rgba(56,189,248,0.1)",
      tagColor: "#7dd3fc",
      tagBc: "rgba(56,189,248,0.2)",
      title: "Mobile responsive fixes",
      date: "Apr 10",
      pct: 70,
      fillColor: "#c8ff57",
    },
  ],
  done: [
    {
      tag: "Email",
      tagBg: "rgba(244,114,182,0.1)",
      tagColor: "#f9a8d4",
      tagBc: "rgba(244,114,182,0.2)",
      title: "Client onboarding email sequence",
      date: "Mar 28",
    },
    {
      tag: "Brand",
      tagBg: "rgba(108,106,245,0.1)",
      tagColor: "#a8a6ff",
      tagBc: "rgba(108,106,245,0.2)",
      title: "Brand identity kit for Nexora",
      date: "Apr 1",
    },
  ],
};

const CLIENTS = [
  {
    initials: "NX",
    name: "Nexora Labs",
    type: "SaaS / Product",
    bg: "rgba(200,255,87,0.1)",
    color: "#c8ff57",
    bc: "rgba(200,255,87,0.2)",
    status: "active",
  },
  {
    initials: "VL",
    name: "VELORA Fashion",
    type: "E-commerce",
    bg: "rgba(244,114,182,0.1)",
    color: "#f472b6",
    bc: "rgba(244,114,182,0.2)",
    status: "active",
  },
  {
    initials: "AV",
    name: "Avante Studio",
    type: "Creative Agency",
    bg: "rgba(34,211,238,0.1)",
    color: "#22d3ee",
    bc: "rgba(34,211,238,0.2)",
    status: "idle",
  },
  {
    initials: "PM",
    name: "PulseMedia",
    type: "Media / Content",
    bg: "rgba(167,139,250,0.1)",
    color: "#a78bfa",
    bc: "rgba(167,139,250,0.2)",
    status: "active",
  },
  {
    initials: "RX",
    name: "Rexon Finance",
    type: "Fintech",
    bg: "rgba(251,146,60,0.1)",
    color: "#fb923c",
    bc: "rgba(251,146,60,0.2)",
    status: "inactive",
  },
];

const MONTHS = [
  { month: "April 2026", sub: "6 projects · ongoing", val: "$35,200" },
  { month: "March 2026", sub: "8 projects", val: "$29,800" },
  { month: "February 2026", sub: "6 projects", val: "$24,100" },
  { month: "January 2026", sub: "5 projects", val: "$19,500" },
];

/* ─── Pixel SVG character ─── */
function Pixel({ size = 52 }) {
  return (
    <svg width={size} height={size * 1.19} viewBox="0 0 38 46" fill="none">
      <path
        d="M22 16 Q28 20 26 26 Q23 29 21 25"
        fill="none"
        stroke="rgba(200,255,87,0.4)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
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
}

/* ─── Heatmap ─── */
function Heatmap() {
  const COLS = 26,
    ROWS = 5;
  const COLORS = [
    "rgba(255,255,255,0.04)",
    "rgba(200,255,87,0.15)",
    "rgba(200,255,87,0.35)",
    "rgba(200,255,87,0.6)",
    "#c8ff57",
  ];
  const BORDERS = [
    "rgba(255,255,255,0.06)",
    "rgba(200,255,87,0.2)",
    "rgba(200,255,87,0.4)",
    "rgba(200,255,87,0.65)",
    "#c8ff57",
  ];
  const cells = useRef(
    Array.from({ length: COLS * ROWS }, (_, i) => {
      // Simple seeded pseudo-random
      const s = Math.sin(i * 9301 + 49297) * 233280;
      return Math.floor((s - Math.floor(s)) * 5);
    }),
  );
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${COLS},1fr)`,
        gap: 2,
        width: "100%",
      }}
    >
      {cells.current.map((lvl, i) => (
        <div
          key={i}
          style={{
            aspectRatio: "1",
            borderRadius: 2,
            background: COLORS[lvl],
            border: `1px solid ${BORDERS[lvl]}`,
            boxShadow: lvl === 4 ? "0 0 4px rgba(200,255,87,.5)" : undefined,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Toast ─── */
function Toast({ msg, visible }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 110,
        left: "50%",
        transform: visible
          ? "translateX(-50%) translateY(0)"
          : "translateX(-50%) translateY(-18px)",
        opacity: visible ? 1 : 0,
        transition:
          "transform 0.4s cubic-bezier(.34,1.56,.64,1), opacity 0.4s cubic-bezier(.34,1.56,.64,1)",
        background: "#0f0f12",
        border: "1px solid rgba(200,255,87,.2)",
        borderRadius: 12,
        padding: "10px 18px",
        color: "#c8ff57",
        fontSize: 10,
        pointerEvents: "none",
        whiteSpace: "nowrap",
        zIndex: 300,
        ...mono,
      }}
    >
      {msg}
    </div>
  );
}

/* ─── KanbanCard ─── */
function KCard({ card: c, done, onToast }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={() =>
        onToast(done ? `Completed: ${c.title}` : `Viewing: ${c.title}`)
      }
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "#0f0f12",
        border: `1px solid ${hov ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.07)"}`,
        borderRadius: 12,
        padding: "10px 12px",
        marginBottom: 8,
        cursor: "pointer",
        transform: hov ? "translateY(-1px)" : "translateY(0)",
        transition: "border-color .15s, transform .15s",
      }}
    >
      {/* Tag */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          background: c.tagBg,
          border: `1px solid ${c.tagBc}`,
          borderRadius: 4,
          padding: "2px 7px",
          color: c.tagColor,
          fontSize: 9,
          ...mono,
          marginBottom: 7,
        }}
      >
        {c.tag}
      </div>
      {/* Title */}
      <div
        style={{
          color: done ? "rgba(208,208,208,0.5)" : "#d0d0d0",
          fontSize: 12,
          lineHeight: 1.4,
          textDecoration: done ? "line-through" : "none",
          marginBottom: 8,
        }}
      >
        {c.title}
      </div>
      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ ...mono, fontSize: 9, color: "#555" }}>{c.date}</span>
        {done ? (
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "rgba(91,203,138,0.15)",
              border: "1px solid rgba(91,203,138,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="8" height="8" viewBox="0 0 8 8">
              <polyline
                points="1.5,4 3,5.5 6.5,2"
                stroke="#5bcb8a"
                strokeWidth="1.2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        ) : (
          <div
            style={{
              width: 44,
              height: 2,
              background: "rgba(255,255,255,0.07)",
              borderRadius: 99,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${c.pct}%`,
                height: "100%",
                background: c.fillColor,
                borderRadius: 99,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Revenue SVG chart ─── */
function RevenueChart() {
  const pts = [
    [0, 60],
    [40, 52],
    [80, 45],
    [120, 38],
    [160, 30],
    [200, 22],
    [240, 18],
    [280, 25],
    [320, 15],
    [340, 10],
  ];
  const W = 340,
    H = 70;
  const poly = pts.map((p) => p.join(",")).join(" ");
  const area =
    `M${pts[0][0]},${pts[0][1]} ` +
    pts
      .slice(1)
      .map((p) => `L${p[0]},${p[1]}`)
      .join(" ") +
    ` L${pts[pts.length - 1][0]},${H} L0,${H} Z`;
  return (
    <svg
      width="100%"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id="mg-rev" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c8ff57" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#c8ff57" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#mg-rev)" />
      <polyline
        points={poly}
        fill="none"
        stroke="#c8ff57"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ─── Mobile Tour ─── */
const MOBILE_TOUR_STEPS = [
  {
    id: "welcome",
    targetId: null,
    title: "Hey there! I'm Pixel",
    text: "I'll show you around FreelancerStudio on mobile. Same powerful dashboard – now in your pocket!",
  },
  {
    id: "metrics",
    targetId: "ma-metrics",
    title: "Your Studio Stats",
    text: "4 live cards tracking Clients, Projects, Tasks & Revenue. They update in real-time as you work.",
  },
  {
    id: "activity",
    targetId: "ma-activity",
    title: "Recent Activity",
    text: "New clients, project milestones, revenue updates – everything important, right here.",
  },
  {
    id: "streak",
    targetId: "ma-streak",
    title: "Activity Streak",
    text: "Your freelancing heatmap. Like GitHub but for your business. Keep the streak alive!",
  },
  {
    id: "nav",
    targetId: "ma-nav",
    title: "Navigate Fast",
    text: "Tasks, Clients, Revenue – your whole studio in 4 taps. Always one thumb away.",
  },
  {
    id: "done",
    targetId: null,
    title: "You're all set!",
    text: "Same power as the desktop, right in your pocket.\nAdd clients and start tracking.",
  },
];

function PhoneSpotlight({ rect }) {
  const pad = 10;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 498,
      }}
    >
      {/* top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: Math.max(0, rect.top - pad),
          background: "rgba(0,0,0,0.76)",
        }}
      />
      {/* bottom */}
      <div
        style={{
          position: "absolute",
          top: rect.top + rect.height + pad,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.76)",
        }}
      />
      {/* left */}
      <div
        style={{
          position: "absolute",
          top: rect.top - pad,
          left: 0,
          width: Math.max(0, rect.left - pad),
          height: rect.height + pad * 2,
          background: "rgba(0,0,0,0.76)",
        }}
      />
      {/* right */}
      <div
        style={{
          position: "absolute",
          top: rect.top - pad,
          left: rect.left + rect.width + pad,
          right: 0,
          height: rect.height + pad * 2,
          background: "rgba(0,0,0,0.76)",
        }}
      />
      {/* lime highlight border */}
      <div
        style={{
          position: "absolute",
          top: rect.top - pad,
          left: rect.left - pad,
          width: rect.width + pad * 2,
          height: rect.height + pad * 2,
          border: "2px solid #c8ff57",
          borderRadius: 14,
          boxShadow:
            "0 0 0 4px rgba(200,255,87,0.15), 0 0 30px rgba(200,255,87,0.2)",
          animation: "mt-pulse 1.8s ease-in-out infinite",
        }}
      />
    </div>
  );
}

function MobileTour({ onComplete }) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [spotlight, setSpotlight] = useState(null);
  const current = MOBILE_TOUR_STEPS[step];
  const isCenter = !current.targetId;

  useEffect(() => {
    const bodyEl = document.getElementById("ma-body-scroll");
    if (bodyEl) bodyEl.scrollTop = 0;
    setTimeout(() => setVisible(true), 120);
  }, []);

  const doMeasure = useCallback((stepIdx) => {
    const s = MOBILE_TOUR_STEPS[stepIdx];
    if (!s.targetId) {
      setSpotlight(null);
      return;
    }
    const phoneEl = document.getElementById("ma-phone");
    const targetEl = document.getElementById(s.targetId);
    if (!phoneEl || !targetEl) {
      setSpotlight(null);
      return;
    }

    // Scroll target into view within the phone's scrollable body
    const bodyEl = document.getElementById("ma-body-scroll");
    if (bodyEl && bodyEl.contains(targetEl)) {
      const bodyRect = bodyEl.getBoundingClientRect();
      const tRect = targetEl.getBoundingClientRect();
      const absOffset = tRect.top - bodyRect.top + bodyEl.scrollTop;
      bodyEl.scrollTop = Math.max(0, absOffset - 40);
    }

    // Measure after scroll settles
    setTimeout(() => {
      const phoneRect = phoneEl.getBoundingClientRect();
      const tRect = targetEl.getBoundingClientRect();
      setSpotlight({
        top: Math.round(tRect.top - phoneRect.top),
        left: Math.round(tRect.left - phoneRect.left),
        width: Math.round(tRect.width),
        height: Math.round(tRect.height),
      });
    }, 80);
  }, []);

  useEffect(() => {
    doMeasure(step);
  }, [step, doMeasure]);

  const next = () => {
    setSpotlight(null);
    if (step < MOBILE_TOUR_STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      setExiting(true);
      setTimeout(onComplete, 300);
    }
  };

  const skip = () => {
    setExiting(true);
    setTimeout(onComplete, 300);
  };

  if (!visible) return null;

  const PHONE_H = 844;

  // Position the step bubble above or below the spotlight
  const cardTop = (() => {
    if (!spotlight) return PHONE_H / 2 - 100;
    const spotMid = spotlight.top + spotlight.height / 2;
    if (spotMid > PHONE_H * 0.5) {
      // spotlight in lower half → card above it
      return Math.max(90, spotlight.top - 188);
    } else {
      // spotlight in upper half → card below it
      return Math.min(PHONE_H - 200, spotlight.top + spotlight.height + 14);
    }
  })();

  return (
    <>
      <style>{`
        @keyframes mt-pop {
          0% { opacity:0; transform:scale(0.85) translateY(10px); }
          100% { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes mt-pulse {
          0%,100% { box-shadow:0 0 0 4px rgba(200,255,87,0.15), 0 0 30px rgba(200,255,87,0.2); }
          50% { box-shadow:0 0 0 8px rgba(200,255,87,0.06), 0 0 50px rgba(200,255,87,0.35); }
        }
        @keyframes mt-idle {
          0%,100% { transform:translateY(0); }
          50% { transform:translateY(-5px); }
        }
        @keyframes mt-fadein { from{opacity:0} to{opacity:1} }
      `}</style>

      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 500,
          opacity: exiting ? 0 : 1,
          transition: "opacity 0.3s ease",
          animation: "mt-fadein 0.2s ease both",
          pointerEvents: "all",
        }}
      >
        {/* Dark backdrop for welcome/done */}
        {isCenter && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.88)",
              backdropFilter: "blur(4px)",
            }}
          />
        )}

        {/* Spotlight for non-center steps */}
        {!isCenter && spotlight && <PhoneSpotlight rect={spotlight} />}

        {/* ── Welcome / Done centered card ── */}
        {isCenter && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 316,
              background: "#0f0f12",
              border: "1.5px solid rgba(200,255,87,0.4)",
              borderRadius: 20,
              padding: "28px 22px 22px",
              textAlign: "center",
              zIndex: 502,
              animation: "mt-pop 0.4s cubic-bezier(.34,1.56,.64,1) both",
              fontFamily: "'Syne', sans-serif",
              boxShadow:
                "0 0 60px rgba(200,255,87,0.12), 0 30px 60px rgba(0,0,0,0.7)",
            }}
          >
            {/* Glow halo */}
            <div
              style={{
                position: "absolute",
                top: 20,
                left: "50%",
                transform: "translateX(-50%)",
                width: 160,
                height: 120,
                background:
                  "radial-gradient(circle, rgba(200,255,87,0.1) 0%, transparent 60%)",
                pointerEvents: "none",
              }}
            />
            {/* Pixel character */}
            <div
              style={{
                display: "inline-block",
                marginBottom: 16,
                animation: "mt-idle 2s ease-in-out infinite",
                filter: "drop-shadow(0 4px 14px rgba(200,255,87,0.35))",
                position: "relative",
                zIndex: 2,
              }}
            >
              <div style={{ transform: "scale(1.3)" }}>
                <Pixel size={46} />
              </div>
            </div>
            <div
              style={{
                fontSize: 19,
                fontWeight: 800,
                color: "#f0f0f0",
                letterSpacing: "-0.5px",
                lineHeight: 1.2,
                marginBottom: 10,
                position: "relative",
                zIndex: 2,
              }}
            >
              {step === 0 ? (
                <>
                  Welcome to{" "}
                  <span style={{ color: "#c8ff57" }}>FreelancerStudio</span>
                </>
              ) : (
                <>
                  You&apos;re all set!{" "}
                  <span style={{ color: "#c8ff57" }}>DONE</span>
                </>
              )}
            </div>
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                color: "#555",
                lineHeight: 1.75,
                marginBottom: 22,
                whiteSpace: "pre-line",
                position: "relative",
                zIndex: 2,
              }}
            >
              {step === 0
                ? "Your dashboard, now in your pocket.\nSame data. Same power. Always in sync.\nLet me show you around!"
                : "Same power as the desktop.\nRight in your pocket, always.\nAdd clients and start tracking."}
            </div>
            <div
              style={{
                display: "flex",
                gap: 8,
                justifyContent: "center",
                position: "relative",
                zIndex: 2,
              }}
            >
              {step === 0 ? (
                <>
                  <button
                    onClick={next}
                    style={{
                      padding: "10px 22px",
                      borderRadius: 99,
                      background: "#c8ff57",
                      border: "none",
                      fontFamily: "'Syne', sans-serif",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#0a0a0c",
                      cursor: "pointer",
                    }}
                  >
                    Let&apos;s go! →
                  </button>
                  <button
                    onClick={skip}
                    style={{
                      padding: "10px 16px",
                      borderRadius: 99,
                      background: "transparent",
                      border: "1px solid rgba(255,255,255,0.1)",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 10,
                      color: "#444",
                      cursor: "pointer",
                    }}
                  >
                    Skip tour
                  </button>
                </>
              ) : (
                <button
                  onClick={skip}
                  style={{
                    padding: "10px 24px",
                    borderRadius: 99,
                    background: "#c8ff57",
                    border: "none",
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#0a0a0c",
                    cursor: "pointer",
                  }}
                >
                  Start Building →
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Step bubble for non-center steps ── */}
        {!isCenter && spotlight && (
          <div
            key={step}
            style={{
              position: "absolute",
              top: cardTop,
              left: 12,
              right: 12,
              background: "#0f0f12",
              border: "1.5px solid #c8ff57",
              borderRadius: 14,
              padding: "12px 14px 10px",
              zIndex: 502,
              animation: "mt-pop 0.35s cubic-bezier(.34,1.56,.64,1) both",
              fontFamily: "'Syne', sans-serif",
              boxShadow:
                "0 0 24px rgba(200,255,87,0.12), 0 12px 30px rgba(0,0,0,0.65)",
              pointerEvents: "all",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                marginBottom: 10,
              }}
            >
              {/* Small Pixel */}
              <div
                style={{
                  flexShrink: 0,
                  animation: "mt-idle 2s ease-in-out infinite",
                  marginTop: 2,
                  filter: "drop-shadow(0 2px 8px rgba(200,255,87,0.3))",
                }}
              >
                <Pixel size={30} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 8.5,
                    color: "#c8ff57",
                    marginBottom: 3,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  step {step} of {MOBILE_TOUR_STEPS.length - 2} · pixel says
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: "#f0f0f0",
                    letterSpacing: "-0.3px",
                    lineHeight: 1.2,
                    marginBottom: 5,
                  }}
                >
                  {current.title}
                </div>
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 9.5,
                    color: "#666",
                    lineHeight: 1.65,
                  }}
                >
                  {current.text}
                </div>
              </div>
            </div>

            {/* Actions row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: 9,
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {/* Progress dots */}
              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                {MOBILE_TOUR_STEPS.slice(1, -1).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: i === step - 1 ? 14 : 5,
                      height: 5,
                      borderRadius: 99,
                      background:
                        i === step - 1 ? "#c8ff57" : "rgba(255,255,255,0.1)",
                      transition: "width 0.2s, background 0.2s",
                    }}
                  />
                ))}
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <button
                  onClick={skip}
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 8.5,
                    color: "#444",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px 0",
                  }}
                >
                  skip
                </button>
                <button
                  onClick={next}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "6px 13px",
                    borderRadius: 99,
                    background: "#c8ff57",
                    border: "none",
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#0a0a0c",
                    cursor: "pointer",
                  }}
                >
                  {step === MOBILE_TOUR_STEPS.length - 2 ? "Finish" : "Next →"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ─── Main App ─── */
export default function MobileApp() {
  const [tab, setTab] = useState(0);
  const [toast, setToast] = useState({ msg: "", visible: false });
  const toastTimer = useRef(null);
  const [tourDone, setTourDone] = useState(() =>
    Boolean(localStorage.getItem("ma_tour_done")),
  );

  // Keep tab=0 (HomeTab) while tour is running so spotlit elements are visible
  useEffect(() => {
    if (!tourDone) setTab(0);
  }, [tourDone]);

  const showToast = (msg) => {
    clearTimeout(toastTimer.current);
    setToast({ msg, visible: true });
    toastTimer.current = setTimeout(
      () => setToast((t) => ({ ...t, visible: false })),
      2000,
    );
  };

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const TICKER_TEXT =
    "TRACKR · FREELANCER STUDIO · DASHBOARD · 9 CLIENTS · $35.2K REVENUE · 6 ACTIVE PROJECTS · 8 DAY STREAK 🔥 · APRIL 2026 · ";
  const tickerContent = TICKER_TEXT.repeat(4);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #050507; display: flex; justify-content: center; align-items: center; min-height: 100vh; font-family: 'Syne', sans-serif; }

        @keyframes ma-tick { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .ma-ticker-inner { display: inline-flex; animation: ma-tick 16s linear infinite; white-space: nowrap; }

        @keyframes ma-shimmer { 0%{transform:translateX(-100%)} 60%{transform:translateX(100%)} 100%{transform:translateX(100%)} }
        .ma-live-pill { position:relative; overflow:hidden; }
        .ma-live-pill::after { content:''; position:absolute; inset:0; background:linear-gradient(90deg,transparent,rgba(200,255,87,0.08),transparent); transform:translateX(-100%); animation:ma-shimmer 2.5s ease infinite; }

        @keyframes ma-dp { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(.8)} }
        .ma-live-dot { animation: ma-dp 1.6s ease-in-out infinite; }

        @keyframes ma-dr { 0%{transform:scale(.5);opacity:.9} 100%{transform:scale(2.2);opacity:0} }
        .ma-live-ring { position:absolute; inset:-3px; border-radius:50%; border:1px solid rgba(200,255,87,.5); animation:ma-dr 1.6s ease-in-out infinite; }


        @keyframes ma-slide { from{opacity:0;transform:translateX(16px)} to{opacity:1;transform:translateX(0)} }
        .ma-section { animation: ma-slide .25s cubic-bezier(.16,1,.3,1) both; }

        @keyframes ma-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        .ma-pixel-float { animation: ma-float 3s ease-in-out infinite; }

        @keyframes ma-pulse-ring { 0%{transform:scale(.5);opacity:.9} 100%{transform:scale(2.2);opacity:0} }
        .ma-c-ring { position:absolute; inset:-3px; border-radius:50%; border:1px solid; animation:ma-pulse-ring 1.6s ease-in-out infinite; }

        .ma-metric-card { transition: transform .15s, border-color .15s; cursor: pointer; }
        .ma-metric-card:hover { transform: scale(1.02); }

        .ma-c-row:hover, .ma-rev-row:hover { border-color: rgba(255,255,255,0.12) !important; }

        .ma-fab {
          position: absolute; bottom: 90px; right: 20px;
          width: 52px; height: 52px; border-radius: 50%;
          background: #c8ff57; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 24px rgba(200,255,87,.3);
          transition: transform .15s, box-shadow .15s; z-index: 150;
        }
        .ma-fab:active { transform: scale(.93); box-shadow: 0 4px 12px rgba(200,255,87,.2); }

        .ma-nav-item { display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 4px 10px; cursor: pointer; transition: transform .1s; border: none; background: transparent; }
        .ma-nav-item:active { transform: scale(.9); }

        .ma-body::-webkit-scrollbar { display: none; }
        .ma-body { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Page background */}
      <div
        style={{
          background: "#050507",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px 0",
        }}
      >
        {/* Ambient glow blobs behind phone (matches PC app atmosphere) */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "10%",
              left: "50%",
              transform: "translateX(-50%)",
              width: 600,
              height: 400,
              background:
                "radial-gradient(ellipse, rgba(0,245,255,0.06) 0%, transparent 70%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "10%",
              left: "50%",
              transform: "translateX(-50%)",
              width: 500,
              height: 350,
              background:
                "radial-gradient(ellipse, rgba(155,92,255,0.07) 0%, transparent 70%)",
            }}
          />
        </div>

        {/* Phone frame */}
        <div
          id="ma-phone"
          style={{
            width: 390,
            height: 844,
            background: "#0a0a0c",
            borderRadius: 52,
            overflow: "hidden",
            position: "relative",
            boxShadow:
              "0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.08), inset 0 0 0 1px rgba(255,255,255,0.04)",
            display: "flex",
            flexDirection: "column",
            fontFamily: "'Syne', sans-serif",
          }}
        >
          {/* Notch */}
          <div
            style={{
              position: "absolute",
              top: 12,
              left: "50%",
              transform: "translateX(-50%)",
              width: 120,
              height: 34,
              background: "#0a0a0c",
              borderRadius: 99,
              zIndex: 200,
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          />

          {/* Status Bar */}
          <div
            style={{
              height: 44,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              padding: "0 28px 6px",
              flexShrink: 0,
              zIndex: 10,
            }}
          >
            <span
              style={{
                ...mono,
                fontSize: 11,
                color: "#d0d0d0",
                fontWeight: 500,
              }}
            >
              9:41
            </span>
            <span
              style={{
                ...mono,
                fontSize: 10,
                color: "#d0d0d0",
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 6,
                padding: "2px 8px",
              }}
            >
              87%
            </span>
          </div>

          {/* Ticker */}
          <div
            style={{
              height: 22,
              background: "#c8ff57",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <div className="ma-ticker-inner">
              <span
                style={{
                  ...mono,
                  fontSize: 9,
                  fontWeight: 500,
                  color: "#0a0a0c",
                  textTransform: "uppercase",
                  paddingRight: 0,
                }}
              >
                {tickerContent}
              </span>
              <span
                style={{
                  ...mono,
                  fontSize: 9,
                  fontWeight: 500,
                  color: "#0a0a0c",
                  textTransform: "uppercase",
                }}
              >
                {tickerContent}
              </span>
            </div>
          </div>

          {/* Topbar */}
          <div
            id="ma-topbar"
            style={{
              height: 56,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 20px",
              background: "rgba(22,22,25,0.8)",
              backdropFilter: "blur(10px)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              flexShrink: 0,
              zIndex: 10,
            }}
          >
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: "#d0d0d0",
                  letterSpacing: "-0.3px",
                }}
              >
                Freelancer<span style={{ color: "#c8ff57" }}>Studio</span>
              </span>
              {/* Live pill */}
              <div
                className="ma-live-pill"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  background: "rgba(200,255,87,0.08)",
                  border: "1px solid rgba(200,255,87,0.2)",
                  borderRadius: 99,
                  padding: "3px 8px",
                }}
              >
                <div style={{ position: "relative", width: 6, height: 6 }}>
                  <div
                    className="ma-live-dot"
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#c8ff57",
                      position: "relative",
                      zIndex: 1,
                    }}
                  />
                  <div
                    className="ma-live-ring"
                    style={{ borderColor: "rgba(200,255,87,.5)" }}
                  />
                </div>
                <span
                  style={{
                    ...mono,
                    fontSize: 9,
                    color: "#c8ff57",
                    fontWeight: 500,
                  }}
                >
                  LIVE
                </span>
              </div>
            </div>
            {/* Avatar */}
            <div style={{ position: "relative", width: 34, height: 34 }}>
              <div
                style={{
                  position: "absolute",
                  inset: 2,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#1e2e1e,#0f1a0f)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#c8ff57",
                }}
              >
                M
              </div>
            </div>
          </div>

          {/* Scrollable body */}
          <div
            id="ma-body-scroll"
            className="ma-body"
            style={{
              flex: 1,
              overflowY: "auto",
              overflowX: "hidden",
              height: "calc(844px - 44px - 22px - 56px - 82px)",
              position: "relative",
            }}
          >
            {/* Toast inside scrollable parent so it overlays content */}
            <Toast msg={toast.msg} visible={toast.visible} />

            {/* Tab content */}
            <div
              key={tab}
              className="ma-section"
              style={{ padding: "16px 16px 16px" }}
            >
              {tab === 0 && <HomeTab onToast={showToast} />}
              {tab === 1 && <TasksTab onToast={showToast} />}
              {tab === 2 && <ClientsTab onToast={showToast} />}
              {tab === 3 && <RevenueTab onToast={showToast} />}
            </div>
          </div>

          {/* FAB */}
          <button
            id="ma-fab"
            className="ma-fab"
            onClick={() => showToast("Opening quick create...")}
          >
            <svg width="20" height="20" viewBox="0 0 20 20">
              <line
                x1="10"
                y1="3"
                x2="10"
                y2="17"
                stroke="#0a0a0c"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <line
                x1="3"
                y1="10"
                x2="17"
                y2="10"
                stroke="#0a0a0c"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {/* Bottom Nav */}
          <div
            id="ma-nav"
            style={{
              height: 82,
              background: "rgba(10,10,12,0.95)",
              backdropFilter: "blur(12px)",
              borderTop: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-around",
              paddingBottom: 24,
              paddingTop: 8,
              flexShrink: 0,
              zIndex: 100,
            }}
          >
            {[
              {
                label: "Home",
                icon: (active) => (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M3 9.5L10 3l7 6.5V17a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"
                      stroke={active ? "#c8ff57" : "#2a2a2a"}
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7 18v-5h6v5"
                      stroke={active ? "#c8ff57" : "#2a2a2a"}
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                ),
              },
              {
                label: "Tasks",
                icon: (active) => (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <rect
                      x="3"
                      y="3"
                      width="14"
                      height="14"
                      rx="3"
                      stroke={active ? "#c8ff57" : "#2a2a2a"}
                      strokeWidth="1.5"
                    />
                    <line
                      x1="7"
                      y1="7.5"
                      x2="13"
                      y2="7.5"
                      stroke={active ? "#c8ff57" : "#2a2a2a"}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <line
                      x1="7"
                      y1="10.5"
                      x2="13"
                      y2="10.5"
                      stroke={active ? "#c8ff57" : "#2a2a2a"}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <line
                      x1="7"
                      y1="13.5"
                      x2="10"
                      y2="13.5"
                      stroke={active ? "#c8ff57" : "#2a2a2a"}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                ),
              },
              {
                label: "Clients",
                icon: (active) => (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle
                      cx="7.5"
                      cy="7"
                      r="2.5"
                      stroke={active ? "#c8ff57" : "#2a2a2a"}
                      strokeWidth="1.5"
                    />
                    <path
                      d="M3 17c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4"
                      stroke={active ? "#c8ff57" : "#2a2a2a"}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="14"
                      cy="7"
                      r="2"
                      stroke={active ? "#c8ff57" : "#2a2a2a"}
                      strokeWidth="1.5"
                    />
                    <path
                      d="M17 17c0-2-1.5-3.5-3-3.5"
                      stroke={active ? "#c8ff57" : "#2a2a2a"}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                ),
              },
              {
                label: "Revenue",
                icon: (active) => (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <polyline
                      points="3,15 7,10 10,12 14,7 17,5"
                      stroke={active ? "#c8ff57" : "#2a2a2a"}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <polyline
                      points="14,5 17,5 17,8"
                      stroke={active ? "#c8ff57" : "#2a2a2a"}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ),
              },
            ].map((n, i) => (
              <button
                key={i}
                className="ma-nav-item"
                onClick={() => {
                  setTab(i);
                  showToast(`Navigating to ${n.label}`);
                }}
                style={{
                  color: tab === i ? "#c8ff57" : "#2a2a2a",
                  transition: "color .15s",
                }}
              >
                {n.icon(tab === i)}
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 600,
                    ...mono,
                    color: tab === i ? "#c8ff57" : "#2a2a2a",
                  }}
                >
                  {n.label}
                </span>
              </button>
            ))}
          </div>

          {/* Mobile onboarding tour */}
          {!tourDone && (
            <MobileTour
              onComplete={() => {
                localStorage.setItem("ma_tour_done", "1");
                setTourDone(true);
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}

/* ─── HOME TAB ─── */
function HomeTab({ onToast }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Metrics 2×2 grid */}
      <div
        id="ma-metrics"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
      >
        {METRICS.map((m) => (
          <div
            key={m.key}
            className="ma-metric-card"
            onClick={() => onToast(`${m.label}: ${m.val}`)}
            style={{
              ...card,
              padding: "14px 14px 12px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Corner splash */}
            <div
              style={{
                position: "absolute",
                top: -10,
                right: -10,
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: m.color,
                opacity: 0.15,
                filter: "blur(8px)",
              }}
            />
            <div
              style={{
                fontSize: 9,
                color: "#555",
                ...mono,
                marginBottom: 6,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {m.label}
            </div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: m.color,
                letterSpacing: "-0.5px",
                lineHeight: 1,
              }}
            >
              {m.val}
            </div>
            <div
              style={{ fontSize: 9, color: m.subColor, marginTop: 6, ...mono }}
            >
              {m.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div id="ma-activity" style={{ ...card, padding: "14px 14px 12px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 700, color: "#d0d0d0" }}>
            Recent Activity
          </span>
          <button
            onClick={() => onToast("Viewing all activity...")}
            style={{
              ...mono,
              fontSize: 9,
              color: "#c8ff57",
              background: "rgba(200,255,87,0.07)",
              border: "1px solid rgba(200,255,87,0.15)",
              borderRadius: 6,
              padding: "3px 8px",
              cursor: "pointer",
            }}
          >
            See All
          </button>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            maxHeight: 120,
            overflowY: "auto",
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {ACTIVITY.map((a, i) => (
            <div
              key={i}
              onClick={() => onToast(a.text)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: 10,
                padding: "8px 10px",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: a.color,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  flex: 1,
                  fontSize: 11,
                  color: "#d0d0d0",
                  lineHeight: 1.3,
                }}
              >
                {a.text}
              </span>
              <span
                style={{ ...mono, fontSize: 9, color: "#444", flexShrink: 0 }}
              >
                {a.time}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Streak */}
      <div id="ma-streak" style={{ ...card, padding: "14px" }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#d0d0d0",
            marginBottom: 12,
          }}
        >
          Activity Streak
        </div>
        {/* Stats row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          {[
            { val: "8", label: "Day Streak 🔥" },
            { val: "255", label: "Active Days" },
            { val: "52", label: "Weeks" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#c8ff57" }}>
                {s.val}
              </div>
              <div
                style={{ ...mono, fontSize: 9, color: "#555", marginTop: 2 }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
        <Heatmap />
      </div>

      {/* Pixel says */}
      <div
        style={{
          ...card,
          padding: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Radial glow behind pixel */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            width: 100,
            height: 100,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(200,255,87,0.08) 0%,transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ flex: 1 }}>
          <div
            style={{ ...mono, fontSize: 9, color: "#c8ff57", marginBottom: 6 }}
          >
            // pixel says
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#d0d0d0",
              lineHeight: 1.3,
              marginBottom: 4,
            }}
          >
            You're on a roll!
            <br />
            Keep it up 🔥
          </div>
          <div style={{ ...mono, fontSize: 9, color: "#555" }}>
            8 day streak · top 12%
          </div>
        </div>
        <div
          className="ma-pixel-float"
          style={{ flexShrink: 0, marginLeft: 8 }}
        >
          <Pixel size={52} />
        </div>
      </div>
    </div>
  );
}

/* ─── TASKS TAB ─── */
function TasksTab({ onToast }) {
  const cols = [
    { key: "todo", label: "To Do", dot: "#a78bfa", items: KANBAN.todo },
    {
      key: "progress",
      label: "In Progress",
      dot: "#fb923c",
      items: KANBAN.progress,
    },
    { key: "done", label: "Done", dot: "#5bcb8a", items: KANBAN.done },
  ];
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 800, color: "#d0d0d0" }}>
          Task Board
        </span>
        <button
          onClick={() => onToast("Creating new task...")}
          style={{
            ...mono,
            fontSize: 10,
            color: "#c8ff57",
            background: "rgba(200,255,87,0.08)",
            border: "1px solid rgba(200,255,87,0.2)",
            borderRadius: 8,
            padding: "5px 12px",
            cursor: "pointer",
          }}
        >
          + New
        </button>
      </div>
      {/* Vertical stacked kanban — no horizontal scroll */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {cols.map((col) => (
          <div key={col.key} style={{ width: "100%" }}>
            {/* Column header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 10,
                padding: "8px 12px",
                background: "rgba(255,255,255,0.03)",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: col.dot,
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#d0d0d0",
                  flex: 1,
                }}
              >
                {col.label}
              </span>
              <span
                style={{
                  ...mono,
                  fontSize: 9,
                  color: "#555",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 99,
                  padding: "2px 7px",
                }}
              >
                {col.items.length}
              </span>
            </div>
            {/* Cards — scrollable, first card visible */}
            <div
              style={{
                maxHeight: 102,
                overflowY: "auto",
                scrollbarWidth: "none",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {col.items.map((c, i) => (
                <KCard
                  key={i}
                  card={c}
                  done={col.key === "done"}
                  onToast={onToast}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── CLIENTS TAB ─── */
function ClientsTab({ onToast }) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 800, color: "#d0d0d0" }}>
          Clients
        </span>
        <button
          onClick={() => onToast("Adding new client...")}
          style={{
            ...mono,
            fontSize: 10,
            color: "#c8ff57",
            background: "rgba(200,255,87,0.08)",
            border: "1px solid rgba(200,255,87,0.2)",
            borderRadius: 8,
            padding: "5px 12px",
            cursor: "pointer",
          }}
        >
          + New
        </button>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          maxHeight: 146,
          overflowY: "auto",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {CLIENTS.map((c, i) => (
          <div
            key={i}
            className="ma-c-row"
            onClick={() => onToast(`Viewing ${c.name}`)}
            style={{
              ...card,
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 14px",
              cursor: "pointer",
              transition: "border-color .15s",
            }}
          >
            {/* Initials avatar */}
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 11,
                background: c.bg,
                border: `1px solid ${c.bc}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 800,
                color: c.color,
                fontFamily: "'Syne', sans-serif",
                flexShrink: 0,
              }}
            >
              {c.initials}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#d0d0d0",
                  marginBottom: 2,
                }}
              >
                {c.name}
              </div>
              <div style={{ ...mono, fontSize: 9, color: "#555" }}>
                {c.type}
              </div>
            </div>

            {/* Status dot */}
            <div
              style={{
                position: "relative",
                width: 10,
                height: 10,
                flexShrink: 0,
              }}
            >
              {c.status === "active" ? (
                <>
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "#c8ff57",
                      position: "relative",
                      zIndex: 1,
                    }}
                  />
                  <div
                    className="ma-c-ring"
                    style={{ borderColor: "rgba(200,255,87,.5)" }}
                  />
                </>
              ) : c.status === "idle" ? (
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#fb923c",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── REVENUE TAB ─── */
function RevenueTab({ onToast }) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 800, color: "#d0d0d0" }}>
          Revenue
        </span>
        <button
          onClick={() => onToast("Viewing April 2026 data...")}
          style={{
            ...mono,
            fontSize: 10,
            color: "#fb923c",
            background: "rgba(251,146,60,0.08)",
            border: "1px solid rgba(251,146,60,0.2)",
            borderRadius: 8,
            padding: "5px 12px",
            cursor: "pointer",
          }}
        >
          Apr 2026
        </button>
      </div>

      {/* Hero card */}
      <div
        style={{
          ...card,
          padding: "18px 16px 0",
          marginBottom: 14,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Orange radial glow bottom-right */}
        <div
          style={{
            position: "absolute",
            bottom: -20,
            right: -20,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(251,146,60,0.14) 0%,transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ ...mono, fontSize: 9, color: "#555", marginBottom: 6 }}>
          // April 2026
        </div>
        <div
          style={{
            fontSize: 34,
            fontWeight: 800,
            color: "#fb923c",
            letterSpacing: "-1px",
            lineHeight: 1,
            marginBottom: 8,
          }}
        >
          $35,200
        </div>
        {/* Lime pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            background: "rgba(200,255,87,0.08)",
            border: "1px solid rgba(200,255,87,0.2)",
            borderRadius: 99,
            padding: "4px 10px",
            ...mono,
            fontSize: 9,
            color: "#c8ff57",
            marginBottom: 14,
          }}
        >
          ↑ +18% vs last month
        </div>
        {/* SVG chart */}
        <div style={{ marginLeft: -16, marginRight: -16 }}>
          <RevenueChart />
        </div>
      </div>

      {/* Monthly breakdown */}
      <div style={{ ...card, padding: "14px" }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#d0d0d0",
            marginBottom: 12,
          }}
        >
          Monthly Breakdown
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {MONTHS.map((m, i) => (
            <div
              key={i}
              className="ma-rev-row"
              onClick={() => onToast(`${m.month}: ${m.val}`)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: 10,
                padding: "10px 12px",
                cursor: "pointer",
                transition: "border-color .15s",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#d0d0d0",
                    marginBottom: 2,
                  }}
                >
                  {m.month}
                </div>
                <div style={{ ...mono, fontSize: 9, color: "#555" }}>
                  {m.sub}
                </div>
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: "#fb923c",
                  ...mono,
                }}
              >
                {m.val}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
