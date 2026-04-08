// src/components/Header.jsx
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useKeyboardShortcuts from "./src/hooks/useKeyboardShortcuts";
import { useApp } from "./src/context/AppContext";
import NavbarCharacter from "./src/components/NavbarCharacter";
import MobileSidebar, { HamburgerButton } from "./src/components/MobileSidebar";

export default function Header({
  onNewTask,
  onCloseOverlays,
  onOpenCommandPalette,
}) {
  const { pathname } = useLocation();
  const { profile } = useApp();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    try {
      window.localStorage.removeItem("fs_auth");
    } catch {
      /* ignore */
    }
    navigate("/login");
  };

  useKeyboardShortcuts({
    onNewTask,
    onClose: onCloseOverlays,
    onCommandPalette: onOpenCommandPalette,
  });

  const initials = (profile?.name || "?")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <header
        id="tour-navbar"
        className="flex items-center justify-between px-7 py-[18px] border-b border-white/[0.07] sticky top-0 z-50"
        style={{
          background: "rgba(10,10,15,0.88)",
          backdropFilter: "blur(22px)",
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 no-underline"
          style={{ textDecoration: "none" }}
        >
          <div
            className="w-[9px] h-[9px] rounded-full bg-lime"
            style={{ animation: "blink 1.6s ease-in-out infinite" }}
          />
          <span className="font-syne font-extrabold text-[21px] tracking-tight text-[#F0F0F8]">
            Freelancer<span className="text-lime">Studio</span>
          </span>
        </Link>

        {/* Right side desktop/tablet */}
        <div className="hidden md:flex items-center gap-[10px]">
          <NavbarCharacter
            hasNotif
            onOpenCommandPalette={onOpenCommandPalette}
          />
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden">
          <HamburgerButton
            open={mobileSidebarOpen}
            onClick={() => setMobileSidebarOpen((o) => !o)}
          />
        </div>

        <style>{`
          @keyframes blink {
            0%,100% { opacity:1; transform:scale(1); }
            50% { opacity:.2; transform:scale(.5); }
          }
        `}</style>
      </header>

      {/* Mobile sidebar (overlay + panel) */}
      <MobileSidebar
        open={mobileSidebarOpen}
        onOpenChange={setMobileSidebarOpen}
        activeRoute={(() => {
          if (pathname === "/") return "dashboard";
          const seg = pathname.split("/")[1];
          return seg || "dashboard";
        })()}
        onNavigate={(key) => navigate(key === "dashboard" ? "/" : `/${key}`)}
        onNewTask={onNewTask}
        onCommandPalette={onOpenCommandPalette}
        onLogout={() => setShowLogoutConfirm(true)}
        userName={profile?.name || ""}
        userInitials={initials}
        userRole={profile?.role || "Freelancer"}
      />

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutConfirm && (
        <>
          <style>{`
            @keyframes hdr-fade { from{opacity:0;transform:scale(.97)} to{opacity:1;transform:scale(1)} }
            @keyframes hdr-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
          `}</style>
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              background: "rgba(0,0,0,0.82)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px 16px",
              animation: "hdr-fade .2s ease both",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowLogoutConfirm(false);
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Log out confirmation"
          >
            <div
              style={{
                background: "#0f0f12",
                border: "1.5px solid #c8ff57",
                borderRadius: 22,
                padding: "32px 28px 28px",
                maxWidth: 420,
                width: "100%",
                boxShadow:
                  "0 0 60px rgba(200,255,87,0.12), 0 30px 80px rgba(0,0,0,0.7)",
                animation: "hdr-fade .25s ease both",
              }}
            >
              {/* Character + message row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 20,
                  marginBottom: 24,
                }}
              >
                {/* Pixel character */}
                <div
                  style={{
                    flexShrink: 0,
                    animation: "hdr-float 2s ease-in-out infinite",
                  }}
                >
                  <svg width="72" height="86" viewBox="0 0 38 46" fill="none">
                    <path
                      d="M22 16 Q28 20 26 26 Q23 29 21 25"
                      fill="none"
                      stroke="rgba(200,255,87,0.4)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <rect
                      x="11"
                      y="17"
                      width="16"
                      height="16"
                      rx="3"
                      fill="#1e2e1e"
                    />
                    <rect
                      x="11"
                      y="17"
                      width="16"
                      height="7"
                      rx="2.5"
                      fill="#2a3f2a"
                    />
                    <rect
                      x="15"
                      y="17"
                      width="8"
                      height="3.5"
                      rx="1.5"
                      fill="#c8ff57"
                    />
                    <rect
                      x="6"
                      y="18"
                      width="5"
                      height="9"
                      rx="2.5"
                      fill="#1e2e1e"
                    />
                    <rect
                      x="27"
                      y="18"
                      width="5"
                      height="9"
                      rx="2.5"
                      fill="#1e2e1e"
                    />
                    <circle cx="8.5" cy="27.5" r="2.5" fill="#f4b97f" />
                    <circle cx="29.5" cy="27.5" r="2.5" fill="#f4b97f" />
                    <rect
                      x="13"
                      y="33"
                      width="5"
                      height="9"
                      rx="2.5"
                      fill="#1a1a22"
                    />
                    <rect
                      x="20"
                      y="33"
                      width="5"
                      height="9"
                      rx="2.5"
                      fill="#1a1a22"
                    />
                    <rect
                      x="11"
                      y="40"
                      width="7"
                      height="4"
                      rx="2"
                      fill="#c8ff57"
                    />
                    <rect
                      x="20"
                      y="40"
                      width="7"
                      height="4"
                      rx="2"
                      fill="#c8ff57"
                    />
                    <rect
                      x="15.5"
                      y="14"
                      width="7"
                      height="4"
                      rx="1.5"
                      fill="#f4b97f"
                    />
                    <rect
                      x="10"
                      y="3"
                      width="18"
                      height="14"
                      rx="5"
                      fill="#f4b97f"
                    />
                    <rect
                      x="10"
                      y="3"
                      width="18"
                      height="5.5"
                      rx="5"
                      fill="#1a1a1a"
                    />
                    <rect
                      x="10"
                      y="5"
                      width="5"
                      height="5"
                      rx="1.5"
                      fill="#1a1a1a"
                    />
                    <path
                      d="M13 11.5 Q14.75 10 16.5 11.5"
                      stroke="#1a1a1a"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <rect
                      x="21"
                      y="10"
                      width="3.5"
                      height="3.5"
                      rx="1.2"
                      fill="#1a1a1a"
                    />
                    <rect
                      x="21.8"
                      y="10.6"
                      width="1.2"
                      height="1.2"
                      rx=".6"
                      fill="white"
                    />
                    <path
                      d="M14 15 Q19 17 24 15"
                      stroke="#c07050"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <rect
                      x="8"
                      y="8"
                      width="3.5"
                      height="5"
                      rx="1.5"
                      fill="#f4b97f"
                    />
                    <rect
                      x="26.5"
                      y="8"
                      width="3.5"
                      height="5"
                      rx="1.5"
                      fill="#f4b97f"
                    />
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
                </div>

                {/* Speech bubble */}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      position: "relative",
                      background: "rgba(200,255,87,0.06)",
                      border: "1px solid rgba(200,255,87,0.2)",
                      borderRadius: 14,
                      padding: "14px 16px",
                      marginLeft: 4,
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        left: -7,
                        top: 22,
                        width: 0,
                        height: 0,
                        borderTop: "6px solid transparent",
                        borderBottom: "6px solid transparent",
                        borderRight: "7px solid rgba(200,255,87,0.2)",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        left: -5,
                        top: 23,
                        width: 0,
                        height: 0,
                        borderTop: "5px solid transparent",
                        borderBottom: "5px solid transparent",
                        borderRight: "6px solid rgba(200,255,87,0.06)",
                      }}
                    />
                    <div
                      style={{
                        fontFamily: "'DM Mono',monospace",
                        fontSize: 9,
                        color: "#c8ff57",
                        letterSpacing: ".1em",
                        textTransform: "uppercase",
                        marginBottom: 6,
                      }}
                    >
                      Pixel says
                    </div>
                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 800,
                        color: "#f0f0f0",
                        letterSpacing: "-.3px",
                        fontFamily: "'Syne',sans-serif",
                        marginBottom: 6,
                      }}
                    >
                      Leaving so soon?
                    </div>
                    <div
                      style={{
                        fontFamily: "'DM Mono',monospace",
                        fontSize: 10,
                        color: "#555",
                        lineHeight: 1.7,
                      }}
                    >
                      You still have work to do.
                      <br />
                      Your data is safe — I'll keep it warm.
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div
                style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}
              >
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  aria-label="Stay logged in"
                  style={{
                    padding: "9px 22px",
                    borderRadius: 99,
                    background: "#c8ff57",
                    border: "none",
                    fontFamily: "'Syne',sans-serif",
                    fontSize: 12,
                    fontWeight: 800,
                    color: "#0a0a0c",
                    cursor: "pointer",
                  }}
                >
                  Stay ✦
                </button>
                <button
                  onClick={handleLogout}
                  aria-label="Confirm log out"
                  style={{
                    padding: "9px 22px",
                    borderRadius: 99,
                    background: "transparent",
                    border: "1px solid rgba(255,45,120,0.35)",
                    fontFamily: "'DM Mono',monospace",
                    fontSize: 10,
                    color: "#FF2D78",
                    letterSpacing: ".06em",
                    cursor: "pointer",
                  }}
                >
                  Yes, log out
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
