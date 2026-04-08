import { useState, useRef } from "react";

// ── PIXEL CHARACTER ───────────────────────────────────────────────────────────
function Pixel({ size = 40 }) {
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 38 46" fill="none">
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

// Mini pixel for nav item hover
function MiniPixel({ bodyColor, accentColor }) {
  return (
    <svg width="12" height="14" viewBox="0 0 38 46" fill="none">
      <rect x="11" y="17" width="16" height="16" rx="3" fill={bodyColor} />
      <rect x="15" y="17" width="8" height="3.5" rx="1.5" fill={accentColor} />
      <rect x="10" y="3" width="18" height="14" rx="5" fill="#f4b97f" />
      <rect x="10" y="3" width="18" height="5.5" rx="5" fill="#111" />
      <rect x="13" y="10" width="3.5" height="3.5" rx="1.2" fill="#111" />
      <rect x="21" y="10" width="3.5" height="3.5" rx="1.2" fill="#111" />
      <rect x="13.8" y="10.6" width="1.2" height="1.2" rx=".6" fill="white" />
      <rect x="21.8" y="10.6" width="1.2" height="1.2" rx=".6" fill="white" />
    </svg>
  );
}

// ── NAV CONFIG ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  {
    key: "dashboard",
    label: "Dashboard",
    sub: "overview · stats",
    badge: "Home",
    badgeBg: "rgba(200,255,87,0.1)",
    badgeColor: "#c8ff57",
    badgeBc: "rgba(200,255,87,0.2)",
    iconBg: "rgba(200,255,87,0.08)",
    iconBc: "rgba(200,255,87,0.15)",
    pixelBody: "#1e2e1e",
    pixelAccent: "#c8ff57",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect
          x="1"
          y="1"
          width="6"
          height="6"
          rx="1.5"
          stroke="#c8ff57"
          strokeWidth="1.3"
        />
        <rect
          x="9"
          y="1"
          width="6"
          height="6"
          rx="1.5"
          stroke="#c8ff57"
          strokeWidth="1.3"
        />
        <rect
          x="1"
          y="9"
          width="6"
          height="6"
          rx="1.5"
          stroke="#c8ff57"
          strokeWidth="1.3"
        />
        <rect
          x="9"
          y="9"
          width="6"
          height="6"
          rx="1.5"
          stroke="#c8ff57"
          strokeWidth="1.3"
        />
      </svg>
    ),
  },
  {
    key: "projects",
    label: "Projects",
    sub: "6 active · 2 pending",
    badge: "6",
    badgeBg: "rgba(108,106,245,0.1)",
    badgeColor: "#a8a6ff",
    badgeBc: "rgba(108,106,245,0.2)",
    iconBg: "rgba(108,106,245,0.1)",
    iconBc: "rgba(108,106,245,0.2)",
    pixelBody: "#2d1a3d",
    pixelAccent: "#7c3aed",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect
          x="1"
          y="1"
          width="14"
          height="4"
          rx="1.5"
          stroke="#a8a6ff"
          strokeWidth="1.3"
        />
        <rect
          x="1"
          y="7"
          width="8"
          height="4"
          rx="1.5"
          stroke="#a8a6ff"
          strokeWidth="1.3"
        />
        <rect
          x="1"
          y="13"
          width="5"
          height="2"
          rx="1"
          fill="#a8a6ff"
          opacity=".4"
        />
      </svg>
    ),
  },
  {
    key: "clients",
    label: "Clients",
    sub: "9 active · 2 new",
    badge: "9",
    badgeBg: "rgba(34,211,238,0.08)",
    badgeColor: "#22d3ee",
    badgeBc: "rgba(34,211,238,0.18)",
    iconBg: "rgba(34,211,238,0.08)",
    iconBc: "rgba(34,211,238,0.15)",
    pixelBody: "#0c2030",
    pixelAccent: "#22d3ee",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="6" cy="5" r="2.5" stroke="#22d3ee" strokeWidth="1.3" />
        <circle
          cx="11"
          cy="5"
          r="2.5"
          stroke="#22d3ee"
          strokeWidth="1.3"
          opacity=".5"
        />
        <path
          d="M1 14c0-2.8 2.2-5 5-5s5 2.2 5 5"
          stroke="#22d3ee"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <path
          d="M11 9c1.8.4 3 2 3 4"
          stroke="#22d3ee"
          strokeWidth="1.3"
          strokeLinecap="round"
          opacity=".5"
        />
      </svg>
    ),
  },
  {
    key: "analytics",
    label: "Analytics",
    sub: "+18% this month",
    badge: "↑18%",
    badgeBg: "rgba(91,203,138,0.08)",
    badgeColor: "#5bcb8a",
    badgeBc: "rgba(91,203,138,0.15)",
    iconBg: "rgba(251,146,60,0.08)",
    iconBc: "rgba(251,146,60,0.15)",
    pixelBody: "#1a0e00",
    pixelAccent: "#fb923c",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M2 12L5 8L8 10L12 5L15 3"
          stroke="#fb923c"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="15" cy="3" r="1.5" fill="#fb923c" opacity=".5" />
      </svg>
    ),
  },
  {
    key: "profile",
    label: "Profile",
    sub: "public · available",
    iconBg: "rgba(244,114,182,0.08)",
    iconBc: "rgba(244,114,182,0.15)",
    pixelBody: "#2d0a18",
    pixelAccent: "#f472b6",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="5.5" r="2.5" stroke="#f472b6" strokeWidth="1.3" />
        <path
          d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6"
          stroke="#f472b6"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    key: "settings",
    label: "Settings",
    sub: "prefs · integrations",
    iconBg: "rgba(255,255,255,0.05)",
    iconBc: "rgba(255,255,255,0.1)",
    pixelBody: "#222",
    pixelAccent: "#555",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M6.3 1.5 5.9 3a5.2 5.2 0 00-1.4.8L3.1 3.3 1.5 6.1l1.1 1a5.3 5.3 0 000 1.8l-1.1 1 1.6 2.8 1.4-.5a5.2 5.2 0 001.4.8l.4 1.5h3.2l.4-1.5a5.2 5.2 0 001.4-.8l1.4.5L14.5 9.9l-1.1-1a5.3 5.3 0 000-1.8l1.1-1L13 3.3l-1.4.5A5.2 5.2 0 009.7 3L9.3 1.5z"
          stroke="#666"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <circle cx="8" cy="8" r="2" stroke="#666" strokeWidth="1.2" />
      </svg>
    ),
  },
];

// ── HAMBURGER BUTTON (named export) ──────────────────────────────────────────
export function HamburgerButton({ open, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: 40,
        height: 40,
        borderRadius: 12,
        border: `1px solid ${open ? "rgba(200,255,87,0.3)" : "rgba(255,255,255,0.13)"}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        cursor: "pointer",
        transition: "all .15s",
        background: open ? "rgba(200,255,87,0.08)" : "#161619",
      }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 18,
            height: 1.5,
            borderRadius: 99,
            background: open ? "#c8ff57" : "#888",
            transition: "all .3s cubic-bezier(.16,1,.3,1)",
            transform: open
              ? i === 0
                ? "rotate(45deg) translate(4.5px, 4.5px)"
                : i === 1
                  ? "scaleX(0)"
                  : "rotate(-45deg) translate(4.5px, -4.5px)"
              : "none",
            opacity: open && i === 1 ? 0 : 1,
          }}
        />
      ))}
    </div>
  );
}

// ── NAV ITEM ──────────────────────────────────────────────────────────────────
function NavItem({ item, active, onClick }) {
  const [hov, setHov] = useState(false);
  const isLit = active || hov;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "13px 14px",
        borderRadius: 14,
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        marginBottom: 4,
        background: active
          ? "rgba(200,255,87,0.08)"
          : hov
            ? "rgba(255,255,255,0.03)"
            : "transparent",
        border: `1px solid ${active ? "rgba(200,255,87,0.2)" : hov ? "rgba(255,255,255,0.07)" : "transparent"}`,
        transition: "all .2s",
      }}
    >
      {/* active bar */}
      {active && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 2.5,
            background: "#c8ff57",
            borderRadius: "0 2px 2px 0",
          }}
        />
      )}
      {/* shimmer on active */}
      {active && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "linear-gradient(90deg,transparent,rgba(200,255,87,0.05),transparent)",
            animation: "ms-shimmer 2.5s ease infinite",
          }}
        />
      )}

      {/* icon box */}
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: item.iconBg,
          border: `1px solid ${item.iconBc}`,
          transform: isLit ? "scale(1.1) rotate(-4deg)" : "none",
          transition: "transform .2s",
        }}
      >
        {item.icon}
      </div>

      {/* text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "-.2px",
            color: active ? "#c8ff57" : "#c0c0c0",
            transition: "color .15s",
          }}
        >
          {item.label}
        </div>
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 9,
            color: active ? "#555" : "#2a2a2a",
            marginTop: 1,
            transition: "color .15s",
          }}
        >
          {item.sub}
        </div>
      </div>

      {/* badge */}
      {item.badge && (
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 9,
            fontWeight: 500,
            padding: "2px 8px",
            borderRadius: 99,
            background: item.badgeBg,
            color: item.badgeColor,
            border: `1px solid ${item.badgeBc}`,
          }}
        >
          {item.badge}
        </span>
      )}

      {/* mini pixel on hover */}
      <div
        style={{
          position: "absolute",
          right: 10,
          bottom: 2,
          opacity: isLit ? 1 : 0,
          transform: isLit
            ? "translateY(0) scale(1)"
            : "translateY(6px) scale(.7)",
          transition: "all .2s cubic-bezier(.34,1.56,.64,1)",
        }}
      >
        <MiniPixel bodyColor={item.pixelBody} accentColor={item.pixelAccent} />
      </div>
    </div>
  );
}

// ── MAIN COMPONENT (default export) ──────────────────────────────────────────
export default function MobileSidebar({
  open,
  onOpenChange,
  activeRoute = "projects",
  onNavigate = () => {},
  onNewTask = () => {},
  onCommandPalette = () => {},
  onLogout = () => {},
  userName = "",
  userInitials = "",
  userRole = "Freelancer",
}) {
  const [active, setActive] = useState(activeRoute);
  const stars = useRef(
    Array.from({ length: 20 }, () => ({
      size: Math.random() * 1.5 + 0.8,
      top: Math.random() * 85,
      left: Math.random() * 100,
      dur: 1.5 + Math.random() * 2,
      delay: Math.random() * 3,
    })),
  );

  const handleNavigate = (key) => {
    setActive(key);
    onNavigate(key);
    setTimeout(() => onOpenChange(false), 280);
  };

  const mono = { fontFamily: "'DM Mono', monospace" };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@600;700;800&display=swap');

        @keyframes ms-float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes ms-shimmer { 0%{transform:translateX(-100%)} 60%{transform:translateX(100%)} 100%{transform:translateX(100%)} }
        @keyframes ms-rdot    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.7)} }
        @keyframes ms-dring   { 0%{transform:scale(.5);opacity:.9} 100%{transform:scale(2.5);opacity:0} }
        @keyframes ms-twinkle { 0%{opacity:.1;transform:scale(.8)} 100%{opacity:.8;transform:scale(1.3)} }
        @keyframes ms-bpop    { from{opacity:0;transform:scale(.5)} to{opacity:1;transform:scale(1)} }

        .ms-sidebar {
          position: fixed; top: 0; left: 0; bottom: 0;
          width: 310px; background: #0d0d10;
          border-right: 1px solid rgba(255,255,255,0.08);
          z-index: 1000;
          transform: translateX(-100%);
          transition: transform .45s cubic-bezier(.16,1,.3,1);
          display: flex; flex-direction: column; overflow: hidden;
        }
        .ms-sidebar.open { transform: translateX(0); }

        .ms-overlay {
          position: fixed; inset: 0; z-index: 999;
          background: transparent; backdrop-filter: blur(0px);
          pointer-events: none;
          transition: background .35s, backdrop-filter .35s;
        }
        .ms-overlay.open {
          background: rgba(0,0,0,0.65);
          backdrop-filter: blur(8px);
          pointer-events: all;
        }

        .ms-world {
          height: 160px; position: relative; overflow: hidden;
          background: linear-gradient(180deg,#0a140a 0%,#0d0d10 100%);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          flex-shrink: 0;
        }
        .ms-world-grid {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(200,255,87,0.04) 1px,transparent 1px), linear-gradient(90deg,rgba(200,255,87,0.04) 1px,transparent 1px);
          background-size: 28px 28px;
        }
        .ms-world-glow {
          position: absolute; top: -30px; left: 60px;
          width: 220px; height: 160px;
          background: radial-gradient(ellipse,rgba(200,255,87,0.1) 0%,transparent 65%);
          pointer-events: none;
        }

        .ms-pixel-wrap {
          position: absolute; bottom: 10px; right: 16px;
          animation: ms-float 2s ease-in-out infinite;
          transition: opacity .3s, transform .3s;
        }

        .ms-role-dot { animation: ms-rdot 1.6s ease-in-out infinite; }
        .ms-role-ring {
          position: absolute; inset: -3px; border-radius: 50%;
          border: 1px solid rgba(200,255,87,.5);
          animation: ms-dring 1.6s ease-in-out infinite;
        }
        .ms-cmd-btn {
          padding: 11px; border-radius: 12px; flex: 1;
          background: transparent; border: 1px solid rgba(255,255,255,0.13);
          font-family: 'DM Mono', monospace; font-size: 9px; color: #444;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;
          letter-spacing: .04em; transition: all .15s;
        }
        .ms-cmd-btn:hover { border-color: rgba(200,255,87,0.2); color: #c8ff57; }
        .ms-logout-btn {
          padding: 11px; border-radius: 12px; flex: 1;
          background: transparent; border: 1px solid rgba(255,87,87,.2);
          font-family: 'DM Mono', monospace; font-size: 9px; color: #ff5757;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;
          letter-spacing: .04em; transition: all .15s;
        }
        .ms-logout-btn:hover { background: rgba(255,87,87,.08); border-color: rgba(255,87,87,.4); }
        .ms-scroll { flex: 1; overflow-y: auto; scrollbar-width: none; padding: 12px 14px; }
        .ms-scroll::-webkit-scrollbar { display: none; }
        .ms-sec-lbl {
          font-family: 'DM Mono', monospace; font-size: 8px; font-weight: 500;
          color: #2a2a2a; letter-spacing: .14em; text-transform: uppercase;
          padding: 8px 8px 4px;
        }
      `}</style>

      {/* OVERLAY */}
      <div
        className={`ms-overlay${open ? " open" : ""}`}
        onClick={() => onOpenChange(false)}
      />

      {/* SIDEBAR PANEL */}
      <div className={`ms-sidebar${open ? " open" : ""}`}>
        {/* ── WORLD STAGE ── */}
        <div className="ms-world">
          <div className="ms-world-grid" />
          <div className="ms-world-glow" />

          {/* Stars */}
          {stars.current.map((s, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                borderRadius: "50%",
                background: "#fff",
                width: s.size,
                height: s.size,
                top: `${s.top}%`,
                left: `${s.left}%`,
                animation: `ms-twinkle ${s.dur}s ease-in-out infinite alternate`,
                animationDelay: `${s.delay}s`,
              }}
            />
          ))}

          {/* Pixel + bubble */}
          {open && (
            <>
              <div
                style={{
                  position: "absolute",
                  bottom: 68,
                  right: 52,
                  background: "#c8ff57",
                  borderRadius: 8,
                  padding: "4px 9px",
                  ...mono,
                  fontSize: 8,
                  fontWeight: 500,
                  color: "#0a0a0c",
                  whiteSpace: "nowrap",
                  animation:
                    "ms-bpop .3s cubic-bezier(.34,1.56,.64,1) both .2s",
                }}
              >
                let&apos;s navigate! 🗺️
                <div
                  style={{
                    position: "absolute",
                    bottom: -4,
                    right: 10,
                    width: 0,
                    height: 0,
                    borderLeft: "4px solid transparent",
                    borderRight: "4px solid transparent",
                    borderTop: "4px solid #c8ff57",
                  }}
                />
              </div>
              <div className="ms-pixel-wrap">
                <Pixel size={40} />
              </div>
            </>
          )}

          {/* User info */}
          <div
            style={{
              position: "absolute",
              bottom: 14,
              left: 20,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                position: "relative",
                width: 52,
                height: 52,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 2,
                  borderRadius: "50%",
                  background: "#0d0d10",
                }}
              />
              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#9b5de5,#f72585)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  fontWeight: 800,
                  color: "#fff",
                  border: "2.5px solid #0d0d10",
                }}
              >
                {userInitials}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  letterSpacing: "-.3px",
                  color: "#f0f0f0",
                  marginBottom: 4,
                }}
              >
                {userName}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div
                  style={{
                    position: "relative",
                    width: 6,
                    height: 6,
                    flexShrink: 0,
                  }}
                >
                  <div
                    className="ms-role-dot"
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#c8ff57",
                    }}
                  />
                  <div className="ms-role-ring" />
                </div>
                <div
                  style={{
                    ...mono,
                    fontSize: 9,
                    color: "#555",
                    letterSpacing: ".08em",
                    textTransform: "uppercase",
                  }}
                >
                  {userRole} · Online
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── NAV ITEMS ── */}
        <div className="ms-scroll">
          <div className="ms-sec-lbl">Navigate</div>
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.key}
              item={item}
              active={active === item.key}
              onClick={() => handleNavigate(item.key)}
            />
          ))}
        </div>

        {/* ── BOTTOM ACTIONS ── */}
        <div
          style={{
            padding: "12px 14px 32px",
            borderTop: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="ms-cmd-btn"
              onClick={() => {
                onCommandPalette();
                onOpenChange(false);
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect
                  x="2"
                  y="2"
                  width="3"
                  height="3"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="1"
                />
                <rect
                  x="7"
                  y="2"
                  width="3"
                  height="3"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="1"
                />
                <rect
                  x="2"
                  y="7"
                  width="3"
                  height="3"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="1"
                />
                <rect
                  x="7"
                  y="7"
                  width="3"
                  height="3"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </svg>
              ⌘K Palette
            </button>
            <button
              className="ms-logout-btn"
              onClick={() => {
                onLogout();
                onOpenChange(false);
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M8 2h2a1 1 0 011 1v6a1 1 0 01-1 1H8M5 9l3-3-3-3M8 6H1"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Log Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
