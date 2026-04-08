import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CharacterAvatar({ onClick }) {
  return (
    <>
      <style>{`
        .char-wrap {
          position: relative; cursor: pointer;
          width: 42px; height: 42px; flex-shrink: 0;
        }
        .char-orbit {
          position: absolute; inset: -5px; border-radius: 50%;
          border: 1px dashed rgba(200,255,87,0.0);
          transition: border-color 0.3s;
          animation: char-orbit-spin 6s linear infinite;
          pointer-events: none;
        }
        @keyframes char-orbit-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .char-wrap:hover .char-orbit { border-color: rgba(200,255,87,0.35); }
        .char-orbit-dot {
          position: absolute; top: -3px; left: 50%; transform: translateX(-50%);
          width: 5px; height: 5px; border-radius: 50%;
          background: #c8ff57; opacity: 0;
          box-shadow: 0 0 6px #c8ff57;
          transition: opacity 0.3s;
        }
        .char-wrap:hover .char-orbit-dot { opacity: 1; }
        .char-base {
          position: absolute; inset: 0; border-radius: 50%;
          background: #1a1a1f; border: 1.5px solid rgba(255,255,255,0.1);
          overflow: hidden; transition: border-color 0.2s;
        }
        .char-wrap:hover .char-base { border-color: rgba(200,255,87,0.4); }
        .char-ground {
          position: absolute; bottom: 8px; left: 6px; right: 6px;
          height: 1px; background: rgba(255,255,255,0.08); border-radius: 99px;
        }
        .char-svg {
          position: absolute; bottom: 9px; left: 50%;
          transform: translateX(-50%);
          animation: char-idle 2.2s ease-in-out infinite;
          transition: filter 0.2s;
        }
        .char-wrap:hover .char-svg {
          filter: drop-shadow(0 0 5px rgba(200,255,87,0.5));
          animation: char-run 0.4s ease-in-out infinite alternate;
        }
        @keyframes char-idle {
          0%,100% { transform: translateX(-50%) translateY(0px); }
          50%      { transform: translateX(-50%) translateY(-3px); }
        }
        @keyframes char-run {
          0%   { transform: translateX(-52%) translateY(0px) rotate(-4deg); }
          100% { transform: translateX(-48%) translateY(-2px) rotate(3deg); }
        }
        .char-bubble {
          position: absolute; top: -22px; left: 50%;
          transform: translateX(-50%) scale(0);
          transform-origin: bottom center;
          background: #c8ff57; border-radius: 6px;
          padding: 3px 7px; white-space: nowrap;
          font-family: 'DM Mono', monospace; font-size: 8px; font-weight: 500;
          color: #0a0a0c; letter-spacing: 0.04em;
          transition: transform 0.2s cubic-bezier(.34,1.56,.64,1);
          pointer-events: none; z-index: 20;
        }
        .char-bubble::after {
          content: ''; position: absolute; bottom: -4px; left: 50%;
          transform: translateX(-50%);
          border: 4px solid transparent;
          border-top-color: #c8ff57; border-bottom: none;
        }
        .char-wrap:hover .char-bubble { transform: translateX(-50%) scale(1); }
        .char-status {
          position: absolute; bottom: 1px; right: 1px; z-index: 10;
          width: 9px; height: 9px; border-radius: 50%;
          background: #c8ff57; border: 2px solid #0a0a0c;
        }
      `}</style>

      <div className="char-wrap" onClick={onClick}>
        <div className="char-orbit">
          <div className="char-orbit-dot" />
        </div>
        <div className="char-base">
          <div className="char-ground" />

          <svg
            className="char-svg"
            width="22"
            height="26"
            viewBox="0 0 22 26"
            fill="none"
          >
            <path
              d="M13 10 Q17 13 15 18 Q13 20 12 17"
              fill="none"
              stroke="rgba(200,255,87,0.4)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <rect x="7" y="10" width="8" height="9" rx="2" fill="#2a2a35" />
            <rect x="7" y="10" width="8" height="4" rx="1.5" fill="#3a3a50" />
            <rect
              x="9.5"
              y="10"
              width="3"
              height="2"
              rx="1"
              fill="rgba(200,255,87,0.7)"
            />
            <rect x="4" y="11" width="3" height="5" rx="1.5" fill="#2a2a35" />
            <rect x="15" y="11" width="3" height="5" rx="1.5" fill="#2a2a35" />
            <circle cx="5.5" cy="16.5" r="1.5" fill="#f4b97f" />
            <circle cx="16.5" cy="16.5" r="1.5" fill="#f4b97f" />
            <rect x="8" y="19" width="3" height="5" rx="1.5" fill="#1e1e2a" />
            <rect x="11" y="19" width="3" height="5" rx="1.5" fill="#1e1e2a" />
            <rect x="7" y="23" width="4" height="2.5" rx="1.2" fill="#c8ff57" />
            <rect
              x="11"
              y="23"
              width="4"
              height="2.5"
              rx="1.2"
              fill="#c8ff57"
            />
            <rect
              x="9.5"
              y="8.5"
              width="3"
              height="2.5"
              rx="1"
              fill="#f4b97f"
            />
            <rect x="6" y="2" width="10" height="9" rx="3" fill="#f4b97f" />
            <rect x="6" y="2" width="10" height="3.5" rx="3" fill="#1a1a1a" />
            <rect x="6" y="3" width="3" height="3" rx="1" fill="#1a1a1a" />
            <rect x="8" y="6" width="2" height="2" rx="0.8" fill="#1a1a1a" />
            <rect x="12" y="6" width="2" height="2" rx="0.8" fill="#1a1a1a" />
            <rect
              x="8.5"
              y="6.3"
              width="0.8"
              height="0.8"
              rx="0.4"
              fill="white"
            />
            <rect
              x="12.5"
              y="6.3"
              width="0.8"
              height="0.8"
              rx="0.4"
              fill="white"
            />
            <path
              d="M9 9.5 Q11 10.8 13 9.5"
              stroke="#c07050"
              strokeWidth="0.8"
              strokeLinecap="round"
              fill="none"
            />
            <rect x="5" y="5" width="2" height="3" rx="1" fill="#f4b97f" />
            <rect x="15" y="5" width="2" height="3" rx="1" fill="#f4b97f" />
            <path
              d="M6 5 Q11 0.5 16 5"
              stroke="rgba(200,255,87,0.6)"
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="6" cy="5.5" r="1.2" fill="#c8ff57" />
            <circle cx="16" cy="5.5" r="1.2" fill="#c8ff57" />
          </svg>

          <div className="char-bubble">hey! 👋</div>
        </div>
        <div className="char-status" />
      </div>
    </>
  );
}

export default function NavbarCharacter({
  hasNotif = true,
  onOpenCommandPalette,
}) {
  const navigate = useNavigate();
  return (
    <>
      <style>{`
        .nb-wrap {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 99px; padding: 5px 6px;
          backdrop-filter: blur(12px);
          font-family: 'Syne', sans-serif;
        }
        .nb-live {
          display: flex; align-items: center; gap: 7px;
          padding: 6px 14px 6px 10px; border-radius: 99px;
          background: rgba(200,255,87,0.08); border: 1px solid rgba(200,255,87,0.2);
          cursor: pointer; overflow: hidden; position: relative;
          transition: background 0.2s, border-color 0.2s;
        }
        .nb-live:hover { background: rgba(200,255,87,0.14); border-color: rgba(200,255,87,0.4); }
        .nb-live::after {
          content:'';position:absolute;inset:0;
          background:linear-gradient(90deg,transparent,rgba(200,255,87,0.07),transparent);
          transform:translateX(-100%);animation:nb-shimmer 2.8s ease infinite;
        }
        @keyframes nb-shimmer{0%{transform:translateX(-100%)}60%{transform:translateX(100%)}100%{transform:translateX(100%)}}
        .nb-dot-wrap{position:relative;width:8px;height:8px;flex-shrink:0;}
        .nb-dot{width:8px;height:8px;border-radius:50%;background:#c8ff57;position:relative;z-index:1;animation:nb-dotpulse 1.8s ease-in-out infinite;}
        @keyframes nb-dotpulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.7;transform:scale(.85)}}
        .nb-ring{position:absolute;inset:-4px;border-radius:50%;border:1.5px solid rgba(200,255,87,.55);animation:nb-ringpulse 1.8s ease-in-out infinite;}
        @keyframes nb-ringpulse{0%{transform:scale(.5);opacity:.9}100%{transform:scale(2.3);opacity:0}}
        .nb-live-text{font-family:'DM Mono',monospace;font-size:10px;font-weight:500;color:#c8ff57;letter-spacing:.06em;text-transform:uppercase;}
        .nb-divider{width:1px;height:20px;background:rgba(255,255,255,0.08);flex-shrink:0;}
        .nb-cmdk{
          display:flex;align-items:center;gap:5px;padding:6px 12px;border-radius:99px;
          background:transparent;border:1px solid transparent;cursor:pointer;
          transition:background .15s,border-color .15s;position:relative;
        }
        .nb-cmdk:hover{background:rgba(255,255,255,0.05);border-color:rgba(255,255,255,0.1);}
        .nb-key{display:flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:5px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);font-family:'DM Mono',monospace;font-size:10px;color:#666;}
        .nb-keydiv{width:1px;height:12px;background:rgba(255,255,255,0.12);}
        .nb-ktext{font-family:'DM Mono',monospace;font-size:10px;font-weight:500;color:#555;letter-spacing:.04em;}
        .nb-notif{position:absolute;top:-2px;right:-2px;width:6px;height:6px;border-radius:50%;background:#ff5757;border:1.5px solid #0a0a0c;}
      `}</style>

      <div className="nb-wrap">
        <div className="nb-live">
          <div className="nb-dot-wrap">
            <div className="nb-dot" />
            <div className="nb-ring" />
          </div>
          <span className="nb-live-text">Live</span>
        </div>

        <div className="nb-divider" />

        <button
          type="button"
          className="nb-cmdk"
          onClick={onOpenCommandPalette}
          aria-label="Open command palette"
        >
          <div className="nb-key">⌘</div>
          <div className="nb-keydiv" />
          <span className="nb-ktext">K</span>
          {hasNotif && <div className="nb-notif" />}
        </button>

        <div className="nb-divider" />

        <CharacterAvatar onClick={() => navigate("/profile")} />
      </div>
    </>
  );
}
