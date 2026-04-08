import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const MiniChar = ({ color1, color2 }) => (
  <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
    <rect x="4" y="7" width="6" height="7" rx="1.5" fill={color1} />
    <rect
      x="4"
      y="7"
      width="6"
      height="3"
      rx="1.5"
      fill={color2}
      opacity=".7"
    />
    <rect x="2.5" y="8" width="2" height="4" rx="1" fill={color1} />
    <rect x="9.5" y="8" width="2" height="4" rx="1" fill={color1} />
    <rect x="5" y="14" width="1.8" height="1.5" rx=".8" fill="#c8ff57" />
    <rect x="7" y="14" width="1.8" height="1.5" rx=".8" fill="#c8ff57" />
    <rect x="4.5" y="6" width="3" height="1.5" rx=".7" fill="#f4b97f" />
    <rect x="3.5" y="1" width="7" height="6" rx="2" fill="#f4b97f" />
    <rect x="3.5" y="1" width="7" height="2.5" rx="2" fill="#111" />
    <rect x="5.5" y="4" width="1.3" height="1.3" rx=".5" fill="#111" />
    <rect x="7.5" y="4" width="1.3" height="1.3" rx=".5" fill="#111" />
    <rect x="5.8" y="4.3" width=".6" height=".6" rx=".3" fill="white" />
    <rect x="7.8" y="4.3" width=".6" height=".6" rx=".3" fill="white" />
  </svg>
);

const GuideChar = () => (
  <svg width="24" height="30" viewBox="0 0 24 30" fill="none">
    <path
      d="M14 11 Q18 14 16 20 Q14 22 13 19"
      fill="none"
      stroke="rgba(200,255,87,0.5)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <rect x="8" y="11" width="8" height="10" rx="2" fill="#1e2e1e" />
    <rect x="8" y="11" width="8" height="5" rx="1.5" fill="#2a3f2a" />
    <rect x="10" y="11" width="4" height="2.5" rx="1" fill="#c8ff57" />
    <rect x="5" y="12" width="3" height="6" rx="1.5" fill="#1e2e1e" />
    <rect x="16" y="12" width="3" height="6" rx="1.5" fill="#1e2e1e" />
    <circle cx="6.5" cy="18.5" r="1.5" fill="#f4b97f" />
    <circle cx="17.5" cy="18.5" r="1.5" fill="#f4b97f" />
    <rect x="9" y="21" width="3" height="6" rx="1.5" fill="#1a1a22" />
    <rect x="12" y="21" width="3" height="6" rx="1.5" fill="#1a1a22" />
    <rect x="8" y="26" width="4" height="2.5" rx="1.2" fill="#c8ff57" />
    <rect x="12" y="26" width="4" height="2.5" rx="1.2" fill="#c8ff57" />
    <rect x="10" y="9" width="4" height="3" rx="1" fill="#f4b97f" />
    <rect x="7" y="2" width="10" height="10" rx="3" fill="#f4b97f" />
    <rect x="7" y="2" width="10" height="3.5" rx="3" fill="#1a1a1a" />
    <rect x="7" y="3" width="3" height="3" rx="1" fill="#1a1a1a" />
    <rect x="9" y="6.5" width="2.2" height="2.2" rx=".9" fill="#1a1a1a" />
    <rect x="13" y="6.5" width="2.2" height="2.2" rx=".9" fill="#1a1a1a" />
    <rect x="9.5" y="6.8" width=".9" height=".9" rx=".4" fill="white" />
    <rect x="13.5" y="6.8" width=".9" height=".9" rx=".4" fill="white" />
    <path
      d="M10 10 Q12 11.5 14 10"
      stroke="#c07050"
      strokeWidth=".9"
      strokeLinecap="round"
      fill="none"
    />
    <rect x="6" y="5.5" width="2" height="3" rx="1" fill="#f4b97f" />
    <rect x="16" y="5.5" width="2" height="3" rx="1" fill="#f4b97f" />
    <path
      d="M7 5.5 Q12 1 17 5.5"
      stroke="rgba(200,255,87,0.7)"
      strokeWidth="1.3"
      fill="none"
      strokeLinecap="round"
    />
    <circle cx="7" cy="6" r="1.3" fill="#c8ff57" />
    <circle cx="17" cy="6" r="1.3" fill="#c8ff57" />
  </svg>
);

const BLDS = [
  { w: 28, h: 55 },
  { w: 20, h: 38 },
  { w: 35, h: 70 },
  { w: 22, h: 45 },
  { w: 18, h: 30 },
  { w: 30, h: 60 },
  { w: 25, h: 42 },
  { w: 16, h: 25 },
  { w: 32, h: 65 },
  { w: 20, h: 35 },
];

function Building({ w, h, wins }) {
  return (
    <div
      style={{
        width: w,
        height: h,
        background: "#1a1a24",
        borderRadius: "3px 3px 0 0",
        border: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "none",
        position: "relative",
        flexShrink: 0,
      }}
    >
      {wins.map((wn, i) => (
        <div
          key={`${wn.top}-${wn.left}-${i}`}
          style={{
            position: "absolute",
            width: 4,
            height: 5,
            borderRadius: 1,
            top: wn.top,
            left: wn.left,
            background: wn.on
              ? "rgba(200,255,87,0.6)"
              : "rgba(255,255,255,0.05)",
          }}
        />
      ))}
    </div>
  );
}

export default function CommandPalette({
  isOpen,
  onClose,
  onNewTask,
  onNewProject,
  onNewClient,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState(0);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  const commands = useMemo(
    () => [
      {
        id: "dashboard",
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="2" width="7" height="7" rx="1.5" fill="#4a9eff" />
            <rect
              x="11"
              y="2"
              width="7"
              height="3"
              rx="1.5"
              fill="#4a9eff"
              opacity="0.5"
            />
            <rect
              x="11"
              y="7"
              width="7"
              height="2"
              rx="1"
              fill="#4a9eff"
              opacity="0.3"
            />
            <rect
              x="2"
              y="11"
              width="16"
              height="2"
              rx="1"
              fill="#4a9eff"
              opacity="0.4"
            />
            <rect
              x="2"
              y="15"
              width="10"
              height="2"
              rx="1"
              fill="#4a9eff"
              opacity="0.3"
            />
          </svg>
        ),
        title: "Dashboard",
        sub: "overview · stats · activity",
        kbd: "D",
        c1: "#2a2a3d",
        c2: "#6c6af5",
        iconBg: "#1e2a3a",
        iconBorder: "rgba(74,158,255,0.2)",
        run: () => navigate("/"),
      },
      {
        id: "projects",
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M3 5C3 3.9 3.9 3 5 3H9L11 5H17C18.1 5 19 5.9 19 7V15C19 16.1 18.1 17 17 17H5C3.9 17 3 16.1 3 15V5Z"
              fill="#e8a048"
              opacity="0.9"
            />
            <path
              d="M3 8H19"
              stroke="#e8a048"
              strokeWidth="1.2"
              opacity="0.4"
            />
          </svg>
        ),
        title: "Projects",
        sub: "all boards · kanban",
        kbd: "P",
        c1: "#1e2e1e",
        c2: "#c8ff57",
        iconBg: "#241e1a",
        iconBorder: "rgba(232,160,72,0.2)",
        run: () => navigate("/projects"),
      },
      {
        id: "new-task",
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle
              cx="10"
              cy="10"
              r="8"
              stroke="#4ade80"
              strokeWidth="1.5"
              opacity="0.5"
            />
            <path
              d="M10 6V14M6 10H14"
              stroke="#4ade80"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ),
        title: "New Task",
        sub: "add to board · quick create",
        kbd: "N",
        c1: "#2d1a3d",
        c2: "#7c3aed",
        iconBg: "#1a2a1a",
        iconBorder: "rgba(74,222,128,0.2)",
        run: () => {
          if (location.pathname !== "/") navigate("/");
          onNewTask?.();
        },
      },
      {
        id: "analytics",
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <polyline
              points="2,16 6,10 9,13 13,6 18,2"
              stroke="#a78bfa"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.9"
            />
            <circle cx="6" cy="10" r="1.5" fill="#a78bfa" />
            <circle cx="13" cy="6" r="1.5" fill="#a78bfa" />
          </svg>
        ),
        title: "Analytics",
        sub: "revenue · trends · streak",
        kbd: "A",
        c1: "#0c2030",
        c2: "#38bdf8",
        iconBg: "#1e1a2a",
        iconBorder: "rgba(167,139,250,0.2)",
        run: () => navigate("/analytics"),
      },
      {
        id: "settings",
        icon: (
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
            <path
              d="M6.3 1.5 5.9 3a5.2 5.2 0 00-1.4.8L3.1 3.3 1.5 6.1l1.1 1a5.3 5.3 0 000 1.8l-1.1 1 1.6 2.8 1.4-.5a5.2 5.2 0 001.4.8l.4 1.5h3.2l.4-1.5a5.2 5.2 0 001.4-.8l1.4.5L14.5 9.9l-1.1-1a5.3 5.3 0 000-1.8l1.1-1L13 3.3l-1.4.5A5.2 5.2 0 009.7 3L9.3 1.5z"
              stroke="#9a9aaa"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <circle cx="8" cy="8" r="2" stroke="#9a9aaa" strokeWidth="1.2" />
          </svg>
        ),
        title: "Settings",
        sub: "prefs · integrations · team",
        kbd: "S",
        c1: "#222",
        c2: "#555",
        iconBg: "#1e1e1e",
        iconBorder: "rgba(154,154,170,0.15)",
        run: () => navigate("/settings"),
      },
      {
        id: "clients",
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle
              cx="7"
              cy="7"
              r="3.5"
              stroke="#4ade80"
              strokeWidth="1.5"
              opacity="0.85"
            />
            <circle
              cx="13"
              cy="7"
              r="3.5"
              stroke="#4ade80"
              strokeWidth="1.5"
              opacity="0.5"
            />
            <path
              d="M2 17C2 14.2 4.2 12 7 12H13C15.8 12 18 14.2 18 17"
              stroke="#4ade80"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.7"
            />
          </svg>
        ),
        title: "Clients",
        sub: "accounts · contacts",
        kbd: "C",
        c1: "#2d0a18",
        c2: "#f472b6",
        iconBg: "#1a2a20",
        iconBorder: "rgba(74,222,128,0.2)",
        run: () => navigate("/clients"),
      },
      {
        id: "new-project",
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect
              x="2"
              y="4"
              width="16"
              height="13"
              rx="2"
              stroke="#60a5fa"
              strokeWidth="1.5"
              opacity="0.7"
            />
            <path
              d="M7 4V2M13 4V2"
              stroke="#60a5fa"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.5"
            />
            <path d="M2 8H18" stroke="#60a5fa" strokeWidth="1" opacity="0.3" />
            <path
              d="M10 11V15M8 13H12"
              stroke="#60a5fa"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.85"
            />
          </svg>
        ),
        title: "New Project",
        sub: "create project workspace",
        kbd: "J",
        c1: "#2a2a3d",
        c2: "#6c6af5",
        iconBg: "#1a1e2a",
        iconBorder: "rgba(96,165,250,0.2)",
        run: () => {
          if (location.pathname !== "/projects") navigate("/projects");
          onNewProject?.();
        },
      },
      {
        id: "new-client",
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle
              cx="10"
              cy="7"
              r="4"
              stroke="#fb923c"
              strokeWidth="1.5"
              opacity="0.85"
            />
            <path
              d="M3 18C3 15 6.1 13 10 13C13.9 13 17 15 17 18"
              stroke="#fb923c"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.7"
            />
            <path
              d="M15 5L17 4M15 9L17 10"
              stroke="#fb923c"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.5"
            />
          </svg>
        ),
        title: "New Client",
        sub: "add client profile",
        kbd: "L",
        c1: "#0c2030",
        c2: "#38bdf8",
        iconBg: "#2a1e1a",
        iconBorder: "rgba(251,146,60,0.2)",
        run: () => {
          if (location.pathname !== "/clients") navigate("/clients");
          onNewClient?.();
        },
      },
    ],
    [location.pathname, navigate, onNewClient, onNewProject, onNewTask],
  );

  const filtered = useMemo(
    () =>
      query
        ? commands.filter((c) =>
            c.title.toLowerCase().includes(query.toLowerCase()),
          )
        : commands,
    [commands, query],
  );

  const stars = useMemo(
    () =>
      Array.from({ length: 28 }).map((_, i) => {
        const sz = Math.random() * 2 + 1;
        return {
          id: i,
          width: sz,
          height: sz,
          top: `${Math.random() * 80}%`,
          left: `${Math.random() * 100}%`,
          d: `${1.5 + Math.random() * 2.5}s`,
          delay: `${Math.random() * 3}s`,
        };
      }),
    [],
  );

  const buildings = useMemo(
    () =>
      BLDS.map((b) => {
        const cols = Math.floor(b.w / 8);
        const rows = Math.floor(b.h / 10);
        const wins = [];
        for (let r = 0; r < rows; r += 1) {
          for (let c = 0; c < cols; c += 1) {
            wins.push({
              top: 6 + r * 10,
              left: 4 + c * 8,
              on: Math.random() > 0.45,
            });
          }
        }
        return { ...b, wins };
      }),
    [],
  );

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
    if (!isOpen) {
      setQuery("");
      setActive(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    const handler = (e) => {
      if (!isOpen) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        if (filtered.length > 0) {
          setActive((a) => (a + 1) % filtered.length);
        }
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        if (filtered.length > 0) {
          setActive((a) => (a - 1 + filtered.length) % filtered.length);
        }
      }
      if (e.key === "Escape") {
        onClose?.();
      }
      if (e.key === "Enter") {
        const selected = filtered[active];
        if (selected) {
          selected.run();
          onClose?.();
        }
      }

      const map = {
        d: "dashboard",
        p: "projects",
        n: "new-task",
        a: "analytics",
        s: "settings",
        c: "clients",
      };
      const mappedId = map[e.key?.toLowerCase()];
      if (!e.metaKey && !e.ctrlKey && mappedId) {
        const idx = filtered.findIndex((item) => item.id === mappedId);
        if (idx !== -1) {
          setActive(idx);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, active, filtered, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <style>{`

        .cpw-backdrop {
          position: fixed; inset: 0; z-index: 9300;
          background: rgba(0,0,0,0.75); backdrop-filter: blur(6px);
          display: flex; align-items: flex-start; justify-content: center;
          padding-top: 8vh;
          animation: cpw-fade .15s ease both;
        }
        @keyframes cpw-fade { from{opacity:0} to{opacity:1} }

        .cpw-shell {
          width: 560px; max-width: calc(100vw - 24px); font-family: 'Syne', sans-serif;
          background: #0f0f12;
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 22px; overflow: hidden;
          box-shadow: 0 50px 100px rgba(0,0,0,0.7);
          animation: cpw-pop .3s cubic-bezier(.34,1.56,.64,1) both;
        }
        @keyframes cpw-pop { from{opacity:0;transform:scale(.9) translateY(-20px)} to{opacity:1;transform:scale(1) translateY(0)} }

        .cpw-stage {
          height: 140px; position: relative; overflow: hidden;
          background: linear-gradient(180deg,#13131a 0%,#0f0f14 100%);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .cpw-star {
          position: absolute; border-radius: 50%; background: #fff;
          animation: cpw-twinkle var(--d) ease-in-out infinite alternate;
        }
        @keyframes cpw-twinkle { 0%{opacity:.1;transform:scale(.8)} 100%{opacity:.7;transform:scale(1.2)} }
        .cpw-moon {
          position: absolute; top: 14px; right: 40px;
          width: 28px; height: 28px; border-radius: 50%;
          background: #e8e0b0; box-shadow: 0 0 20px rgba(232,224,176,0.4);
        }
        .cpw-buildings {
          position: absolute; bottom: 28px; left: 0; right: 0;
          display: flex; align-items: flex-end; gap: 3px; padding: 0 20px;
        }
        .cpw-ground {
          position: absolute; bottom: 0; left: 0; right: 0; height: 28px;
          background: linear-gradient(180deg,#1a1f1a 0%,#141a14 100%);
          border-top: 1px solid rgba(200,255,87,0.15);
        }
        .cpw-ground-dots {
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: repeating-linear-gradient(90deg,rgba(200,255,87,0.2) 0px,rgba(200,255,87,0.2) 4px,transparent 4px,transparent 20px);
        }
        .cpw-char-a {
          position: absolute; bottom: 28px; left: 80px;
          display: flex; flex-direction: column; align-items: center;
          animation: cpw-idle 2s ease-in-out infinite;
        }
        .cpw-char-b {
          position: absolute; bottom: 28px; right: 100px;
          display: flex; flex-direction: column; align-items: center;
          animation: cpw-idle 2.4s ease-in-out infinite .4s;
        }
        @keyframes cpw-idle { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        .cpw-bubble {
          background: #c8ff57; border-radius: 8px; padding: 4px 9px;
          font-family: 'DM Mono', monospace; font-size: 9px; font-weight: 500;
          color: #0a0a0c; white-space: nowrap; margin-bottom: 5px; position: relative;
          animation: cpw-bpop .3s cubic-bezier(.34,1.56,.64,1) both;
        }
        .cpw-bubble::after { content:''; position:absolute; bottom:-5px; left:50%; transform:translateX(-50%); border:5px solid transparent; border-top-color:#c8ff57; border-bottom:none; }
        @keyframes cpw-bpop { from{opacity:0;transform:scale(.5)} to{opacity:1;transform:scale(1)} }

        .cpw-search {
          display: flex; align-items: center; gap: 12px;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .cpw-input {
          flex: 1; background: transparent; border: none; outline: none;
          font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 500;
          color: #f0f0f0; caret-color: #c8ff57; letter-spacing: -0.2px;
        }
        .cpw-input::placeholder { color: #2a2a2a; }
        .cpw-esc { font-family:'DM Mono',monospace; font-size:9px; color:#2a2a2a; }

        .cpw-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 12px; }

        .cpw-cmd {
          background: #161619; border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 14px 14px 12px;
          cursor: pointer; position: relative; overflow: hidden;
          transition: background .18s, border-color .18s, transform .18s, box-shadow .18s;
          display: flex; flex-direction: column; gap: 8px;
        }
        .cpw-cmd:hover, .cpw-cmd.active {
          border-color: rgba(200,255,87,0.25); background: #1a1a1e;
          transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        }
        .cpw-cmd.active::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg,rgba(200,255,87,0.07) 0%,transparent 60%);
          pointer-events: none;
        }
        .cpw-cmd.active::after {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0;
          width: 2.5px; background: #c8ff57; border-radius: 0 2px 2px 0;
        }

        .cpw-cmd-char {
          position: absolute; bottom: 10px; right: 12px;
          opacity: 0; transform: translateY(6px) scale(.8);
          transition: all .2s cubic-bezier(.34,1.56,.64,1);
        }
        .cpw-cmd:hover .cpw-cmd-char, .cpw-cmd.active .cpw-cmd-char {
          opacity: 1; transform: translateY(0) scale(1);
        }

        .cpw-cmd-top { display: flex; align-items: flex-start; justify-content: space-between; }
        .cpw-icon-box {
          width: 36px; height: 36px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 17px; border: 1px solid; flex-shrink: 0;
          transition: transform .2s;
        }
        .cpw-cmd:hover .cpw-icon-box { transform: scale(1.12) rotate(-4deg); }
        .cpw-kbd {
          font-family: 'DM Mono', monospace; font-size: 9px;
          padding: 2px 7px; border-radius: 5px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          color: #444; transition: all .15s;
        }
        .cpw-cmd:hover .cpw-kbd, .cpw-cmd.active .cpw-kbd {
          background: rgba(200,255,87,0.1); border-color: rgba(200,255,87,0.3); color: #c8ff57;
        }
        .cpw-cmd-title { font-size: 13px; font-weight: 700; color: #c0c0c0; letter-spacing: -.2px; transition: color .15s; }
        .cpw-cmd:hover .cpw-cmd-title, .cpw-cmd.active .cpw-cmd-title { color: #f0f0f0; }
        .cpw-cmd-sub { font-family: 'DM Mono', monospace; font-size: 9px; color: #444; }

        .cpw-footer {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 20px;
          border-top: 1px solid rgba(255,255,255,0.05);
          background: rgba(0,0,0,0.3);
        }
        .cpw-fkeys { display: flex; gap: 12px; }
        .cpw-fk { display: flex; align-items: center; gap: 4px; }
        .cpw-fkey { font-family:'DM Mono',monospace; font-size:9px; padding:2px 6px; border-radius:4px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:#444; }
        .cpw-flbl { font-family:'DM Mono',monospace; font-size:9px; color:#2d2d2d; }
        .cpw-brand { font-family:'DM Mono',monospace; font-size:9px; color:#222; }
        .cpw-brand span { color:#2e2e2e; }

        .cpw-empty { padding: 32px; text-align: center; font-family:'DM Mono',monospace; font-size:11px; color:#333; }
      `}</style>

      <div className="cpw-backdrop" onClick={onClose}>
        <div className="cpw-shell" onClick={(e) => e.stopPropagation()}>
          <div className="cpw-stage">
            {stars.map((s) => (
              <div
                key={s.id}
                className="cpw-star"
                style={{
                  width: s.width,
                  height: s.height,
                  top: s.top,
                  left: s.left,
                  "--d": s.d,
                  animationDelay: s.delay,
                }}
              />
            ))}
            <div className="cpw-moon" />
            <div className="cpw-buildings">
              {buildings.map((b, i) => (
                <Building
                  key={`${b.w}-${b.h}-${i}`}
                  w={b.w}
                  h={b.h}
                  wins={b.wins}
                />
              ))}
            </div>
            <div className="cpw-ground">
              <div className="cpw-ground-dots" />
            </div>

            <div className="cpw-char-a">
              <div className="cpw-bubble">pick a command!</div>
              <GuideChar />
            </div>

            <div className="cpw-char-b">
              <div className="cpw-bubble">↑↓ to navigate</div>
              <svg width="20" height="26" viewBox="0 0 20 26" fill="none">
                <rect x="6" y="10" width="8" height="9" rx="2" fill="#2d1a3d" />
                <rect
                  x="6"
                  y="10"
                  width="8"
                  height="4"
                  rx="1.5"
                  fill="#3d2255"
                />
                <rect
                  x="8.5"
                  y="10"
                  width="3"
                  height="2"
                  rx="1"
                  fill="#a78bfa"
                />
                <rect
                  x="3"
                  y="11"
                  width="3"
                  height="5"
                  rx="1.5"
                  fill="#2d1a3d"
                />
                <rect
                  x="14"
                  y="11"
                  width="3"
                  height="5"
                  rx="1.5"
                  fill="#2d1a3d"
                />
                <circle cx="4.5" cy="16.5" r="1.4" fill="#f4b97f" />
                <circle cx="15.5" cy="16.5" r="1.4" fill="#f4b97f" />
                <rect
                  x="7"
                  y="19"
                  width="2.5"
                  height="5"
                  rx="1.2"
                  fill="#1a0e26"
                />
                <rect
                  x="10"
                  y="19"
                  width="2.5"
                  height="5"
                  rx="1.2"
                  fill="#1a0e26"
                />
                <rect
                  x="6"
                  y="23"
                  width="3.5"
                  height="2"
                  rx="1"
                  fill="#7c3aed"
                />
                <rect
                  x="10"
                  y="23"
                  width="3.5"
                  height="2"
                  rx="1"
                  fill="#7c3aed"
                />
                <rect
                  x="8.5"
                  y="8.5"
                  width="3"
                  height="2.5"
                  rx="1"
                  fill="#f4b97f"
                />
                <rect
                  x="5.5"
                  y="2"
                  width="9"
                  height="8"
                  rx="3"
                  fill="#f4b97f"
                />
                <rect x="5.5" y="2" width="9" height="3" rx="3" fill="#111" />
                <rect
                  x="8"
                  y="5.5"
                  width="1.8"
                  height="1.8"
                  rx=".7"
                  fill="#111"
                />
                <rect
                  x="11"
                  y="5.5"
                  width="1.8"
                  height="1.8"
                  rx=".7"
                  fill="#111"
                />
                <rect
                  x="8.4"
                  y="5.8"
                  width=".7"
                  height=".7"
                  rx=".35"
                  fill="white"
                />
                <rect
                  x="11.4"
                  y="5.8"
                  width=".7"
                  height=".7"
                  rx=".35"
                  fill="white"
                />
              </svg>
            </div>
          </div>

          <div className="cpw-search">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              style={{ color: "rgba(200,255,87,0.6)", flexShrink: 0 }}
            >
              <circle
                cx="7.5"
                cy="7.5"
                r="5"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path
                d="M11.5 11.5L15.5 15.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            <input
              ref={inputRef}
              className="cpw-input"
              placeholder="Type a command..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
            />
            <span className="cpw-esc">esc</span>
          </div>

          <div className="cpw-grid">
            {filtered.length === 0 && (
              <div className="cpw-empty" style={{ gridColumn: "1/-1" }}>
                no results for "{query}"
              </div>
            )}

            {filtered.map((cmd, i) => (
              <div
                key={cmd.id}
                className={`cpw-cmd${i === active ? " active" : ""}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => {
                  cmd.run();
                  onClose?.();
                }}
              >
                <div className="cpw-cmd-top">
                  <div
                    className="cpw-icon-box"
                    style={{
                      background: cmd.iconBg,
                      borderColor: cmd.iconBorder,
                    }}
                  >
                    {cmd.icon}
                  </div>
                  <span className="cpw-kbd">{cmd.kbd}</span>
                </div>
                <div>
                  <div className="cpw-cmd-title">{cmd.title}</div>
                  <div className="cpw-cmd-sub">{cmd.sub}</div>
                </div>
                <div className="cpw-cmd-char">
                  <MiniChar color1={cmd.c1} color2={cmd.c2} />
                </div>
              </div>
            ))}
          </div>

          <div className="cpw-footer">
            <div className="cpw-fkeys">
              {["move", "open", "close"].map((lbl) => (
                <div key={lbl} className="cpw-fk">
                  {lbl === "move" && (
                    <>
                      <span className="cpw-fkey">↑</span>
                      <span className="cpw-fkey">↓</span>
                    </>
                  )}
                  {lbl === "open" && <span className="cpw-fkey">↵</span>}
                  {lbl === "close" && <span className="cpw-fkey">esc</span>}
                  <span className="cpw-flbl">{lbl}</span>
                </div>
              ))}
            </div>
            <div className="cpw-brand">
              TRACKR <span>world</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
