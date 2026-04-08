// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PixelScene from "../components/PixelScene";
import FieldMascot from "../components/FieldMascot";
import { clearUserData } from "../utils/userStorage";

// SHA-256 hash using the Web Crypto API (browser-native, no library needed)
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
import Cursor from "../../Cursor";

// Mascot config per field step (0=email, 1=password, 2=submit)
const MASCOT = [
  { title: "Your Email", hint: "Enter the address you sign in with." },
  { title: "Password", hint: "Min 8 chars recommended." },
  { title: "Let's Go!", hint: "Hit the button to log in." },
];

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  // Field mascot step: advances only when a field has valid content
  const [step, setStep] = useState(0);

  function triggerShake(msg) {
    setError(msg);
    setShake(true);
    setTimeout(() => setShake(false), 520);
  }

  // Advance mascot when email field blurs with content
  function handleEmailBlur() {
    if (email.trim() && step === 0) setStep(1);
  }
  // Advance mascot when password field blurs with content
  function handlePasswordBlur() {
    if (password && step === 1) setStep(2);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || !password)
      return triggerShake("fill in both fields first.");

    setLoading(true);
    setProgress(0);
    setError("");

    // Hash the entered password BEFORE the animation starts so we don't
    // waste 1.5 s on an invalid attempt.
    let enteredHash;
    try {
      enteredHash = await hashPassword(password);
    } catch {
      setLoading(false);
      return triggerShake("login failed, please try again.");
    }

    // Look up the user in the registry (set by signup)
    let users = [];
    try {
      users = JSON.parse(localStorage.getItem("fs_users") || "[]");
    } catch {
      /* ignore parse errors */
    }

    const user = users.find((u) => u.email === email.trim().toLowerCase());

    // --- WRONG EMAIL ---
    if (!user) {
      setLoading(false);
      return triggerShake("no account found with that email.");
    }

    // --- WRONG PASSWORD — guard: do NOT touch any stored data ---
    if (enteredHash !== user.passwordHash) {
      setLoading(false);
      return triggerShake("incorrect password.");
    }

    // --- CREDENTIALS CORRECT — animate then navigate ---
    const iv = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(iv);
          return 100;
        }
        return p + 2;
      });
    }, 28);

    setTimeout(() => {
      clearInterval(iv);
      setProgress(100);

      // If a DIFFERENT user is logging in, wipe the previous user's data so
      // Account B never sees Account A's tasks / projects / clients / profile.
      try {
        const prevAuth = JSON.parse(localStorage.getItem("fs_auth") || "{}");
        if (prevAuth.email !== user.email) {
          clearUserData();
        }
      } catch {
        clearUserData(); // if parse fails, safe to wipe
      }

      // Save session — include name so every consumer (Header, Profile) has it
      localStorage.setItem(
        "fs_auth",
        JSON.stringify({
          loggedIn: true,
          email: user.email,
          name: user.name,
        }),
      );
      // Full page reload so AppContext remounts fresh from localStorage.
      // nav("/") is intentionally NOT used here — React Router navigation
      // keeps AppContext alive in memory with the previous user's state.
      window.location.replace("/");
    }, 1480);
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#060D06",
      }}
    >
      {/* PixelScene backdrop  city scene only, no city-walker mascot */}
      <div style={{ position: "absolute", inset: 0 }}>
        <PixelScene speechText="" showMascot={false} />
      </div>

      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(3,7,3,0.62)",
          backdropFilter: "blur(1.5px)",
          WebkitBackdropFilter: "blur(1.5px)",
        }}
      />

      <Cursor />

      {/* Centered wrapper */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <div style={{ position: "relative", width: 420 }}>
          {/* Form card */}
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "relative",
              zIndex: 10,
              background: "rgba(6,10,6,0.91)",
              border: "1px solid rgba(202,255,0,0.18)",
              borderRadius: 16,
              padding: "36px 32px 32px",
              width: "100%",
              overflow: "visible",
              boxShadow:
                "0 0 0 1px rgba(202,255,0,0.05), 0 32px 80px rgba(0,0,0,0.75)",
            }}
          >
            {/* Form */}
            <motion.form
              onSubmit={handleSubmit}
              animate={shake ? { x: [-6, 6, -4, 4, -2, 2, 0] } : { x: 0 }}
              transition={{ duration: 0.45 }}
              style={{ display: "flex", flexDirection: "column", gap: 0 }}
            >
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 10,
                      color: "#FF2D78",
                      padding: "8px 12px",
                      marginBottom: 10,
                      border: "1px solid rgba(255,45,120,0.3)",
                      borderRadius: 6,
                      background: "rgba(255,45,120,0.08)",
                    }}
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/*  EMAIL ROW  */}
              <div style={{ marginBottom: 14 }}>
                <label
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontSize: 10,
                    color: step === 0 ? "#CAFF00" : "rgba(255,255,255,0.5)",
                    transition: "color .3s",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  email
                </label>
                <div style={{ position: "relative" }}>
                  <FieldMascot
                    active={step === 0}
                    title={MASCOT[0].title}
                    hint={MASCOT[0].hint}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={handleEmailBlur}
                    onFocus={() => {
                      if (step > 0 && !email.trim()) setStep(0);
                    }}
                    placeholder="you@example.com"
                    autoComplete="email"
                    style={{
                      width: "100%",
                      background:
                        step === 0
                          ? "rgba(202,255,0,0.04)"
                          : "rgba(255,255,255,0.04)",
                      border: `1px solid ${step === 0 ? "rgba(202,255,0,0.5)" : email.trim() ? "rgba(202,255,0,0.3)" : "rgba(202,255,0,0.2)"}`,
                      borderRadius: 8,
                      padding: "12px 14px",
                      fontFamily: "'Space Mono',monospace",
                      fontSize: 12,
                      color: "#fff",
                      outline: "none",
                      transition: "border-color .2s, background .2s",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              {/*  PASSWORD ROW  */}
              <div style={{ marginBottom: 14 }}>
                <label
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontSize: 10,
                    color: step === 1 ? "#CAFF00" : "rgba(255,255,255,0.5)",
                    transition: "color .3s",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  password
                </label>
                <div style={{ position: "relative" }}>
                  <FieldMascot
                    active={step === 1}
                    title={MASCOT[1].title}
                    hint={MASCOT[1].hint}
                  />
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={handlePasswordBlur}
                    onFocus={() => {
                      if (step === 0 && email.trim()) setStep(1);
                    }}
                    placeholder=""
                    autoComplete="current-password"
                    style={{
                      width: "100%",
                      background:
                        step === 1
                          ? "rgba(202,255,0,0.04)"
                          : "rgba(255,255,255,0.04)",
                      border: `1px solid ${step === 1 ? "rgba(202,255,0,0.5)" : password ? "rgba(202,255,0,0.3)" : "rgba(202,255,0,0.2)"}`,
                      borderRadius: 8,
                      padding: "12px 44px 12px 14px",
                      fontFamily: "'Space Mono',monospace",
                      fontSize: 12,
                      color: "#fff",
                      outline: "none",
                      transition: "border-color .2s, background .2s",
                      boxSizing: "border-box",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 16,
                      lineHeight: 1,
                    }}
                  >
                    {showPw ? "" : ""}
                  </button>
                </div>
              </div>

              {/*  SUBMIT  */}
              <div
                style={{
                  position: "relative",
                  overflow: "visible",
                  marginTop: 4,
                }}
              >
                <FieldMascot
                  active={step === 2}
                  title={MASCOT[2].title}
                  hint={MASCOT[2].hint}
                />
                <motion.button
                  type="submit"
                  disabled={loading}
                  onFocus={() => {
                    if (email.trim() && password) setStep(2);
                  }}
                  onClick={() => {
                    if (email.trim() && password) setStep(2);
                  }}
                  whileHover={!loading ? { scale: 1.02 } : {}}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                  style={{
                    width: "100%",
                    padding: "13px 0",
                    background: loading ? "rgba(202,255,0,0.15)" : "#CAFF00",
                    border: "none",
                    borderRadius: 8,
                    cursor: loading ? "not-allowed" : "pointer",
                    fontFamily: "'Press Start 2P',monospace",
                    fontSize: 10,
                    color: loading ? "rgba(202,255,0,0.5)" : "#0A0A0F",
                    position: "relative",
                    overflow: "hidden",
                    boxShadow:
                      step === 2 && !loading
                        ? "0 0 20px rgba(202,255,0,0.4)"
                        : "none",
                    transition: "box-shadow .3s",
                  }}
                >
                  {loading && (
                    <motion.div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: `linear-gradient(90deg, rgba(202,255,0,0.25) ${progress}%, transparent ${progress}%)`,
                      }}
                    />
                  )}
                  <span style={{ position: "relative", zIndex: 1 }}>
                    {loading ? "logging in..." : "LOG IN"}
                  </span>
                </motion.button>
              </div>
            </motion.form>

            {/* Social divider */}
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                margin: "20px 0",
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: "rgba(255,255,255,0.08)",
                }}
              />
              <span
                style={{
                  fontFamily: "'Space Mono',monospace",
                  fontSize: 9,
                  color: "rgba(255,255,255,0.25)",
                }}
              >
                or
              </span>
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: "rgba(255,255,255,0.08)",
                }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              {[
                {
                  label: "GitHub",
                  icon: (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  ),
                },
                {
                  label: "Google",
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  ),
                },
              ].map(({ label, icon }) => (
                <motion.button
                  key={label}
                  type="button"
                  whileHover={{ background: "rgba(255,255,255,0.07)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => triggerShake(`${label} login coming soon!`)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "10px 0",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8,
                    cursor: "pointer",
                    color: "rgba(255,255,255,0.7)",
                    fontFamily: "'Space Mono',monospace",
                    fontSize: 10,
                  }}
                >
                  {icon} {label}
                </motion.button>
              ))}
            </div>

            <p
              style={{
                marginTop: 24,
                textAlign: "center",
                fontFamily: "'Space Mono',monospace",
                fontSize: 10,
                color: "rgba(255,255,255,0.3)",
              }}
            >
              no account?{" "}
              <Link
                to="/signup"
                style={{ color: "#CAFF00", textDecoration: "none" }}
              >
                sign up
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
