// src/pages/Signup.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PixelScene from "../components/PixelScene";
import FieldMascot from "../components/FieldMascot";
import Cursor from "../../Cursor";
import { clearUserData } from "../utils/userStorage";
import { seedUserData } from "../utils/seedStorage";

// SHA-256 hash using the Web Crypto API (browser-native, no library needed)
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function getPasswordStrength(pw) {
  if (!pw) return -1;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

const STRENGTH_COLORS = ["#FF2D78", "#FF6B00", "#CAFF00", "#00F5FF"];
const STRENGTH_LABELS = ["weak", "fair", "good", "strong"];

// Mascot config per field step (0=name, 1=email, 2=password, 3=confirm, 4=submit)
const MASCOT = [
  { title: "Your Name", hint: "How should we call you?" },
  { title: "Your Email", hint: "The address you sign in with." },
  { title: "Password", hint: "Min 6 chars. Mix uppercase, numbers & symbols." },
  { title: "Confirm Password", hint: "Retype your password to be sure." },
  { title: "All Set!", hint: "Hit create to get started." },
];

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [step, setStep] = useState(0);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const strength = getPasswordStrength(password);

  function setFieldError(field, msg) {
    setFieldErrors((prev) => ({ ...prev, [field]: msg }));
  }

  function validateNameField() {
    if (!name.trim()) {
      setFieldError("name", "name is required");
      return false;
    }
    if (name.trim().length < 2) {
      setFieldError("name", "at least 2 characters");
      return false;
    }
    setFieldError("name", "");
    return true;
  }
  function validateEmailField() {
    if (!email.trim()) {
      setFieldError("email", "email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFieldError("email", "invalid email format");
      return false;
    }
    setFieldError("email", "");
    return true;
  }
  function validatePasswordField() {
    if (password.length < 6) {
      setFieldError("password", "minimum 6 characters");
      return false;
    }
    if (strength < 2) {
      setFieldError("password", "too weak — add uppercase, numbers or symbols");
      return false;
    }
    setFieldError("password", "");
    return true;
  }
  function validateConfirmField() {
    if (!confirmPassword) {
      setFieldError("confirmPassword", "please confirm your password");
      return false;
    }
    if (confirmPassword !== password) {
      setFieldError("confirmPassword", "passwords don't match");
      return false;
    }
    setFieldError("confirmPassword", "");
    return true;
  }

  function triggerShake(msg) {
    setError(msg);
    setShake(true);
    setTimeout(() => setShake(false), 520);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Run all field validators — they set per-field errors as a side-effect
    const ok =
      validateNameField() &
      validateEmailField() &
      validatePasswordField() &
      validateConfirmField();

    if (!ok) return triggerShake("please fix the errors highlighted below.");

    // Check for duplicate email before animation starts
    try {
      const existingUsers = JSON.parse(
        localStorage.getItem("fs_users") || "[]",
      );
      if (existingUsers.some((u) => u.email === email.trim().toLowerCase())) {
        setFieldError("email", "an account with this email already exists");
        return triggerShake("email already registered.");
      }
    } catch {
      /* ignore parse errors */
    }

    setLoading(true);
    setProgress(0);
    setError("");

    // Hash the password before the animation so we can await it cleanly
    let passwordHash;
    try {
      passwordHash = await hashPassword(password);
    } catch {
      setLoading(false);
      return triggerShake("signup failed, please try again.");
    }

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

      const userId = "u_" + Date.now();
      const normalizedEmail = email.trim().toLowerCase();
      const trimmedName = name.trim();

      // Wipe any data left behind by a previously logged-in account so this
      // brand-new account starts with a completely blank slate.
      clearUserData();
      seedUserData();

      // --- Register the user ---
      try {
        const users = JSON.parse(localStorage.getItem("fs_users") || "[]");
        users.push({
          id: userId,
          name: trimmedName,
          email: normalizedEmail,
          passwordHash,
        });
        localStorage.setItem("fs_users", JSON.stringify(users));
      } catch {
        /* ignore write failures */
      }

      // --- Persist profile data for Profile page ---
      try {
        localStorage.setItem(
          "fs_profile",
          JSON.stringify({
            name: trimmedName,
            email: normalizedEmail,
          }),
        );
      } catch {
        /* ignore */
      }

      // --- Set session ---
      localStorage.setItem(
        "fs_auth",
        JSON.stringify({
          loggedIn: true,
          email: normalizedEmail,
          name: trimmedName,
          isNewSignup: true,
        }),
      );

      // Full page reload so AppContext remounts fresh from the now-cleared
      // localStorage. nav("/") is intentionally NOT used — React Router keeps
      // AppContext alive in memory, causing the new account to see stale data.
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
      <div style={{ position: "absolute", inset: 0 }}>
        <PixelScene speechText="" showMascot={false} />
      </div>
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

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          zIndex: 10,
        }}
      >
        <div style={{ position: "relative", width: 420 }}>
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

              {/*  NAME ROW  */}
              <div style={{ marginBottom: 14 }}>
                <label
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontSize: 10,
                    color: fieldErrors.name
                      ? "#FF2D78"
                      : step === 0
                        ? "#CAFF00"
                        : "rgba(255,255,255,0.5)",
                    transition: "color .3s",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  display name
                </label>
                <div style={{ position: "relative" }}>
                  <FieldMascot
                    active={step === 0}
                    title={MASCOT[0].title}
                    hint={MASCOT[0].hint}
                  />
                  <input
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (fieldErrors.name) setFieldError("name", "");
                    }}
                    onBlur={() => {
                      validateNameField();
                      if (name.trim() && step === 0) setStep(1);
                    }}
                    onFocus={() => {
                      if (step > 0 && !name.trim()) setStep(0);
                    }}
                    placeholder="your name"
                    autoComplete="name"
                    style={{
                      width: "100%",
                      background:
                        step === 0
                          ? "rgba(202,255,0,0.04)"
                          : "rgba(255,255,255,0.04)",
                      border: `1px solid ${fieldErrors.name ? "rgba(255,45,120,0.7)" : step === 0 ? "rgba(202,255,0,0.5)" : name.trim() ? "rgba(202,255,0,0.3)" : "rgba(202,255,0,0.2)"}`,
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
                {fieldErrors.name && (
                  <p
                    style={{
                      fontFamily: "'Space Mono',monospace",
                      fontSize: 9,
                      color: "#FF2D78",
                      margin: "4px 0 0 2px",
                    }}
                  >
                    ⚠ {fieldErrors.name}
                  </p>
                )}
              </div>

              {/*  EMAIL  */}
              <div style={{ marginBottom: 14 }}>
                <label
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontSize: 10,
                    color: fieldErrors.email
                      ? "#FF2D78"
                      : step === 1
                        ? "#CAFF00"
                        : "rgba(255,255,255,0.5)",
                    transition: "color .3s",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  email
                </label>
                <div style={{ position: "relative" }}>
                  <FieldMascot
                    active={step === 1}
                    title={MASCOT[1].title}
                    hint={MASCOT[1].hint}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) setFieldError("email", "");
                    }}
                    onBlur={() => {
                      validateEmailField();
                      if (email.trim() && step === 1) setStep(2);
                    }}
                    onFocus={() => {
                      if (name.trim() && step === 0) setStep(1);
                    }}
                    placeholder="you@example.com"
                    autoComplete="email"
                    style={{
                      width: "100%",
                      background:
                        step === 1
                          ? "rgba(202,255,0,0.04)"
                          : "rgba(255,255,255,0.04)",
                      border: `1px solid ${fieldErrors.email ? "rgba(255,45,120,0.7)" : step === 1 ? "rgba(202,255,0,0.5)" : email.trim() ? "rgba(202,255,0,0.3)" : "rgba(202,255,0,0.2)"}`,
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
                {fieldErrors.email && (
                  <p
                    style={{
                      fontFamily: "'Space Mono',monospace",
                      fontSize: 9,
                      color: "#FF2D78",
                      margin: "4px 0 0 2px",
                    }}
                  >
                    ⚠ {fieldErrors.email}
                  </p>
                )}
              </div>

              {/*  PASSWORD  */}
              <div style={{ marginBottom: 14 }}>
                <label
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontSize: 10,
                    color: fieldErrors.password
                      ? "#FF2D78"
                      : step === 2
                        ? "#CAFF00"
                        : "rgba(255,255,255,0.5)",
                    transition: "color .3s",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  password
                </label>
                <div style={{ position: "relative" }}>
                  <FieldMascot
                    active={step === 2}
                    title={MASCOT[2].title}
                    hint={MASCOT[2].hint}
                  />
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password) setFieldError("password", "");
                    }}
                    onBlur={() => {
                      validatePasswordField();
                      if (password && step === 2) setStep(3);
                    }}
                    onFocus={() => {
                      if (email.trim() && step < 2) setStep(2);
                    }}
                    placeholder=""
                    autoComplete="new-password"
                    style={{
                      width: "100%",
                      background:
                        step === 2
                          ? "rgba(202,255,0,0.04)"
                          : "rgba(255,255,255,0.04)",
                      border: `1px solid ${fieldErrors.password ? "rgba(255,45,120,0.7)" : step === 2 ? "rgba(202,255,0,0.5)" : password ? "rgba(202,255,0,0.3)" : "rgba(202,255,0,0.2)"}`,
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

                {/* Strength bar */}
                {password && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 5,
                      marginTop: 6,
                    }}
                  >
                    <div style={{ display: "flex", gap: 4 }}>
                      {[0, 1, 2, 3].map((n) => (
                        <motion.div
                          key={n}
                          style={{ flex: 1, height: 3, borderRadius: 2 }}
                          animate={{
                            background:
                              strength > n
                                ? STRENGTH_COLORS[strength - 1]
                                : "rgba(255,255,255,0.08)",
                          }}
                          transition={{ duration: 0.3 }}
                        />
                      ))}
                    </div>
                    <span
                      style={{
                        fontFamily: "'Space Mono',monospace",
                        fontSize: 9,
                        color:
                          strength > 0
                            ? STRENGTH_COLORS[strength - 1]
                            : "rgba(255,255,255,0.3)",
                      }}
                    >
                      {strength > 0
                        ? STRENGTH_LABELS[strength - 1]
                        : "too short"}
                    </span>
                  </div>
                )}
                {fieldErrors.password && (
                  <p
                    style={{
                      fontFamily: "'Space Mono',monospace",
                      fontSize: 9,
                      color: "#FF2D78",
                      margin: "4px 0 0 2px",
                    }}
                  >
                    ⚠ {fieldErrors.password}
                  </p>
                )}
              </div>

              {/*  CONFIRM PASSWORD  */}
              <div style={{ marginBottom: 14 }}>
                <label
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontSize: 10,
                    color: fieldErrors.confirmPassword
                      ? "#FF2D78"
                      : step === 3
                        ? "#CAFF00"
                        : "rgba(255,255,255,0.5)",
                    transition: "color .3s",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  confirm password
                </label>
                <div style={{ position: "relative" }}>
                  <FieldMascot
                    active={step === 3}
                    title={MASCOT[3].title}
                    hint={MASCOT[3].hint}
                  />
                  <input
                    type={showConfirmPw ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (fieldErrors.confirmPassword)
                        setFieldError("confirmPassword", "");
                    }}
                    onBlur={() => {
                      validateConfirmField();
                      if (confirmPassword && step === 3) setStep(4);
                    }}
                    onFocus={() => {
                      if (password && step < 3) setStep(3);
                    }}
                    placeholder=""
                    autoComplete="new-password"
                    style={{
                      width: "100%",
                      background:
                        step === 3
                          ? "rgba(202,255,0,0.04)"
                          : "rgba(255,255,255,0.04)",
                      border: `1px solid ${fieldErrors.confirmPassword ? "rgba(255,45,120,0.7)" : step === 3 ? "rgba(202,255,0,0.5)" : confirmPassword ? (confirmPassword === password ? "rgba(91,203,138,0.5)" : "rgba(255,45,120,0.5)") : "rgba(202,255,0,0.2)"}`,
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
                    onClick={() => setShowConfirmPw((s) => !s)}
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
                    {showConfirmPw ? "" : ""}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p
                    style={{
                      fontFamily: "'Space Mono',monospace",
                      fontSize: 9,
                      color: "#FF2D78",
                      margin: "4px 0 0 2px",
                    }}
                  >
                    ⚠ {fieldErrors.confirmPassword}
                  </p>
                )}
                {confirmPassword &&
                  confirmPassword === password &&
                  !fieldErrors.confirmPassword && (
                    <p
                      style={{
                        fontFamily: "'Space Mono',monospace",
                        fontSize: 9,
                        color: "#5bcb8a",
                        margin: "4px 0 0 2px",
                      }}
                    >
                      ✓ passwords match
                    </p>
                  )}
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
                  active={step === 4}
                  title={MASCOT[4].title}
                  hint={MASCOT[4].hint}
                />
                <motion.button
                  type="submit"
                  disabled={loading}
                  onFocus={() => {
                    if (
                      name.trim() &&
                      email.trim() &&
                      password &&
                      confirmPassword
                    )
                      setStep(4);
                  }}
                  onClick={() => {
                    if (
                      name.trim() &&
                      email.trim() &&
                      password &&
                      confirmPassword
                    )
                      setStep(4);
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
                      step === 3 && !loading
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
                    {loading ? "creating..." : "CREATE ACCOUNT"}
                  </span>
                </motion.button>
              </div>
            </motion.form>

            <p
              style={{
                marginTop: 24,
                textAlign: "center",
                fontFamily: "'Space Mono',monospace",
                fontSize: 10,
                color: "rgba(255,255,255,0.3)",
              }}
            >
              have an account?{" "}
              <Link
                to="/login"
                style={{ color: "#CAFF00", textDecoration: "none" }}
              >
                log in{" "}
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
