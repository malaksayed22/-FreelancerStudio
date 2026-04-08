import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useToast } from "../context/ToastContext";
import ProfileOnboardingTour from "../components/ProfileOnboardingTour";

//  CONSTANTS

const LS_KEY = "profileData";

const DEFAULT_PROFILE_DATA = {
  name: "",
  role: "",
  location: "",
  bio: "",
  avatar: "",
  banner: "",
  github: "",
  linkedin: "",
  email: "",
  website: "",
  skills: [],
  stats: { projects: 0, platforms: 0, streak: 0, clients: 0 },
};

const STAT_META = [
  {
    key: "projects",
    label: "Projects Built",
    color: "#c8ff57",
    delta: " AI-powered endpoints",
    dc: "#5bcb8a",
  },
  {
    key: "platforms",
    label: "Platforms",
    color: "#a8a6ff",
    delta: "integrated systems",
    dc: "#555",
  },
  {
    key: "streak",
    label: "Day Streak",
    color: "#fcd34d",
    delta: " personal best",
    dc: "#5bcb8a",
  },
  {
    key: "clients",
    label: "Active Clients",
    color: "#5bcb8a",
    delta: " +3 this month",
    dc: "#5bcb8a",
  },
];

const SKILL_PROJECTS = [];

function loadRecentProjects() {
  try {
    const raw = localStorage.getItem("fs_projects");
    if (!raw) return [];
    const projects = JSON.parse(raw);
    return projects.slice(0, 4).map((p) => ({
      name: p.name,
      sub: p.client || "Personal",
      status: p.status === "Done" ? "live" : "active",
      pct: p.progress ?? 0,
    }));
  } catch {
    return [];
  }
}

function genActivity() {
  return Array.from({ length: 70 }, () => {
    const r = Math.random();
    return r < 0.3 ? 0 : r < 0.55 ? 1 : r < 0.75 ? 2 : r < 0.9 ? 3 : 4;
  });
}
const ACTIVITY = genActivity();

//  HELPERS

function loadProfileData() {
  try {
    let signupName = "";
    let signupEmail = "";
    try {
      const auth = JSON.parse(localStorage.getItem("fs_auth") || "{}");
      signupName = auth.name || "";
      signupEmail = auth.email || "";
    } catch {
      /* ignore */
    }
    try {
      const fsp = JSON.parse(localStorage.getItem("fs_profile") || "{}");
      if (!signupName) signupName = fsp.name || "";
      if (!signupEmail) signupEmail = fsp.email || "";
    } catch {
      /* ignore */
    }

    const raw = localStorage.getItem(LS_KEY);
    const saved = raw ? JSON.parse(raw) : {};
    const merged = { ...DEFAULT_PROFILE_DATA, ...saved };
    if (!merged.name) merged.name = signupName;
    if (!merged.email) merged.email = signupEmail;

    // Auto-populate stats from live data if all zeros (existing accounts pre-seed)
    const statsAllZero =
      !merged.stats || Object.values(merged.stats).every((v) => v === 0);
    if (statsAllZero) {
      try {
        const projects = JSON.parse(
          localStorage.getItem("fs_projects") || "[]",
        );
        const clients = JSON.parse(localStorage.getItem("fs_clients") || "[]");
        merged.stats = {
          projects: projects.length || 0,
          platforms: 4,
          streak: 12,
          clients: clients.filter((c) => c.status === "active").length || 0,
        };
      } catch {
        /* ignore */
      }
    }

    // Auto-populate skills if empty
    if (!merged.skills || merged.skills.length === 0) {
      merged.skills = [
        "React",
        "Node.js",
        "TypeScript",
        "Figma",
        "Tailwind CSS",
        "Framer Motion",
        "REST APIs",
        "UI/UX",
      ];
    }

    // Auto-populate role/bio/location if blank
    if (!merged.role) merged.role = "Freelance Developer";
    if (!merged.bio)
      merged.bio =
        "Building clean, modern digital products for startups and growing businesses. Open to new projects.";
    if (!merged.location) merged.location = "Remote";

    return merged;
  } catch {
    return { ...DEFAULT_PROFILE_DATA };
  }
}

function saveProfileData(data) {
  try {
    const serialized = JSON.stringify(data);
    if (serialized.length > 4.5 * 1024 * 1024) {
      return {
        ok: false,
        error: "Data exceeds 5MB limit. Try a smaller image.",
      };
    }
    localStorage.setItem(LS_KEY, serialized);
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not save to localStorage." };
  }
}

function compressImage(file, maxDim = 400) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ratio = Math.min(maxDim / img.width, maxDim / img.height, 1);
        canvas.width = Math.round(img.width * ratio);
        canvas.height = Math.round(img.height * ratio);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function validateProfile(data) {
  const errors = {};
  if (!data.name || data.name.trim().length < 3) {
    errors.name = "Name must be at least 3 characters";
  }
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Invalid email format";
  }
  for (const key of ["github", "linkedin", "website"]) {
    if (data[key] && data[key].trim() && !data[key].startsWith("https://")) {
      errors[key] = "URL must start with https://";
    }
  }
  if (data.stats) {
    for (const k of Object.keys(data.stats)) {
      const v = Number(data.stats[k]);
      if (isNaN(v) || v < 0)
        errors["stats_" + k] = "Must be a non-negative number";
    }
  }
  if (data.skills && data.skills.length > 30) {
    errors.skills = "Maximum 30 skills allowed";
  }
  return errors;
}

//  SUB-COMPONENTS

function ActivityCell({ level }) {
  const [hov, setHov] = useState(false);
  const colors = [
    "rgba(255,255,255,0.04)",
    "rgba(200,255,87,0.15)",
    "rgba(200,255,87,0.35)",
    "rgba(200,255,87,0.6)",
    "#c8ff57",
  ];
  const bc = [
    "rgba(255,255,255,0.06)",
    "rgba(200,255,87,0.2)",
    "rgba(200,255,87,0.4)",
    "rgba(200,255,87,0.65)",
    "#c8ff57",
  ];
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 10,
        height: 10,
        borderRadius: 2,
        background: colors[level],
        border: "1px solid " + bc[level],
        boxShadow: level === 4 ? "0 0 4px rgba(200,255,87,0.5)" : "none",
        transform: hov ? "scale(1.5)" : "none",
        transition: "transform .1s",
      }}
    />
  );
}

function Character() {
  return (
    <svg width="60" height="72" viewBox="0 0 38 46" fill="none">
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

function ProjectItem({ name, sub, status, pct }) {
  const [hov, setHov] = useState(false);
  const stStyle =
    status === "live"
      ? {
          bg: "rgba(200,255,87,0.1)",
          color: "#a8cc3a",
          border: "rgba(200,255,87,0.2)",
        }
      : {
          bg: "rgba(91,203,138,0.1)",
          color: "#5bcb8a",
          border: "rgba(91,203,138,0.2)",
        };
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: 12,
        borderRadius: 12,
        background: hov ? "rgba(255,255,255,0.03)" : "transparent",
        border: "1px solid " + (hov ? "rgba(255,255,255,0.07)" : "transparent"),
        transition: "all .15s",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#c0c0c0",
            marginBottom: 2,
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontFamily: "'DM Mono',monospace",
            fontSize: 9,
            color: "#444",
          }}
        >
          {sub}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 4,
        }}
      >
        <span
          style={{
            fontFamily: "'DM Mono',monospace",
            fontSize: 8,
            fontWeight: 500,
            padding: "2px 8px",
            borderRadius: 4,
            letterSpacing: ".04em",
            textTransform: "uppercase",
            background: stStyle.bg,
            color: stStyle.color,
            border: "1px solid " + stStyle.border,
          }}
        >
          {status}
        </span>
        <span
          style={{
            fontFamily: "'DM Mono',monospace",
            fontSize: 9,
            color: "#444",
          }}
        >
          {pct}%
        </span>
      </div>
    </div>
  );
}

//  EDIT FIELD COMPONENTS

function EditInput({
  value,
  onChange,
  placeholder,
  error,
  label,
  ariaLabel,
  type = "text",
  autoFocus,
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {label && (
        <label
          style={{
            fontFamily: "'DM Mono',monospace",
            fontSize: 9,
            color: "#555",
            letterSpacing: ".08em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel || label || placeholder}
        autoFocus={autoFocus}
        className="pg-edit-input"
        style={{ borderColor: error ? "#FF2D78" : undefined }}
      />
      {error && (
        <span
          style={{
            fontFamily: "'DM Mono',monospace",
            fontSize: 9,
            color: "#FF2D78",
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}

function EditTextarea({
  value,
  onChange,
  placeholder,
  error,
  label,
  maxLength = 400,
}) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.height = "auto";
    ref.current.style.height = ref.current.scrollHeight + "px";
  }, [value]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {label && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <label
            style={{
              fontFamily: "'DM Mono',monospace",
              fontSize: 9,
              color: "#555",
              letterSpacing: ".08em",
              textTransform: "uppercase",
            }}
          >
            {label}
          </label>
          <span
            style={{
              fontFamily: "'DM Mono',monospace",
              fontSize: 9,
              color: value.length > maxLength * 0.85 ? "#FF6B00" : "#333",
            }}
          >
            {value.length}/{maxLength}
          </span>
        </div>
      )}
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        placeholder={placeholder}
        aria-label={label || placeholder}
        rows={3}
        className="pg-edit-input"
        style={{
          resize: "none",
          overflow: "hidden",
          borderColor: error ? "#FF2D78" : undefined,
        }}
      />
      {error && (
        <span
          style={{
            fontFamily: "'DM Mono',monospace",
            fontSize: 9,
            color: "#FF2D78",
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}

function SkillsEditor({ skills, onChange, error }) {
  const [inputVal, setInputVal] = useState("");
  const [dragIdx, setDragIdx] = useState(null);
  const [dragOver, setDragOver] = useState(null);

  const addSkill = () => {
    const trimmed = inputVal.trim();
    if (!trimmed || skills.includes(trimmed) || skills.length >= 30) return;
    onChange([...skills, trimmed]);
    setInputVal("");
  };

  const removeSkill = (idx) => onChange(skills.filter((_, i) => i !== idx));

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
    if (e.key === "Backspace" && inputVal === "" && skills.length > 0) {
      onChange(skills.slice(0, -1));
    }
  };

  const handleDragStart = (idx) => setDragIdx(idx);
  const handleDragOver = (e, idx) => {
    e.preventDefault();
    setDragOver(idx);
  };
  const handleDrop = (e, idx) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    const next = [...skills];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(idx, 0, moved);
    onChange(next);
    setDragIdx(null);
    setDragOver(null);
  };
  const handleDragEnd = () => {
    setDragIdx(null);
    setDragOver(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <label
          style={{
            fontFamily: "'DM Mono',monospace",
            fontSize: 9,
            color: "#555",
            letterSpacing: ".08em",
            textTransform: "uppercase",
          }}
        >
          Tech Stack Tags
        </label>
        <span
          style={{
            fontFamily: "'DM Mono',monospace",
            fontSize: 9,
            color: skills.length >= 28 ? "#FF6B00" : "#333",
          }}
        >
          {skills.length}/30
        </span>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          padding: 10,
          borderRadius: 10,
          background: "rgba(255,255,255,0.03)",
          border: "1px dashed rgba(200,255,87,0.2)",
          minHeight: 44,
        }}
      >
        {skills.map((s, i) => (
          <div
            key={s + i}
            draggable
            onDragStart={() => handleDragStart(i)}
            onDragOver={(e) => handleDragOver(e, i)}
            onDrop={(e) => handleDrop(e, i)}
            onDragEnd={handleDragEnd}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "3px 8px 3px 10px",
              borderRadius: 4,
              background:
                dragOver === i
                  ? "rgba(200,255,87,0.15)"
                  : "rgba(200,255,87,0.08)",
              border:
                "1px solid " +
                (dragOver === i
                  ? "rgba(200,255,87,0.4)"
                  : "rgba(200,255,87,0.2)"),
              color: "#a8cc3a",
              fontFamily: "'DM Mono',monospace",
              fontSize: 9,
              letterSpacing: ".06em",
              textTransform: "uppercase",
              opacity: dragIdx === i ? 0.4 : 1,
              transition: "all .15s",
              userSelect: "none",
            }}
          >
            <span style={{ fontSize: 9, color: "#555", marginRight: 2 }}></span>
            {s}
            <button
              onClick={() => removeSkill(i)}
              aria-label={"Remove " + s}
              style={{
                background: "none",
                border: "none",
                color: "#555",
                fontSize: 10,
                lineHeight: 1,
                padding: "0 2px",
                marginLeft: 2,
                transition: "color .12s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#FF2D78";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#555";
              }}
            ></button>
          </div>
        ))}
        <input
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add skill (Enter)"
          aria-label="Add new skill"
          style={{
            background: "none",
            border: "none",
            outline: "none",
            fontFamily: "'DM Mono',monospace",
            fontSize: 9,
            color: "#888",
            minWidth: 100,
            padding: "3px 4px",
          }}
        />
      </div>
      {error && (
        <span
          style={{
            fontFamily: "'DM Mono',monospace",
            fontSize: 9,
            color: "#FF2D78",
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}

function AvatarUpload({ avatar, name, editing, onChange, onDirectSave }) {
  const fileRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [hov, setHov] = useState(false);

  const handleClick = () => {
    fileRef.current?.click();
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const compressed = await compressImage(file, 400);
      if (editing) {
        onChange(compressed);
      } else {
        onDirectSave?.(compressed);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  const initials = (name || "ZA")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <div
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label="Click to upload profile photo"
        onKeyDown={(e) => {
          if (e.key === "Enter") handleClick();
        }}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          position: "relative",
          zIndex: 1,
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: avatar
            ? "transparent"
            : "linear-gradient(135deg,#9b5de5,#f72585)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          fontWeight: 800,
          color: "#fff",
          border: "3px solid #161619",
          overflow: "hidden",
          cursor: "pointer",
          filter: editing || hov ? "brightness(0.78)" : "none",
          transition: "filter .2s",
        }}
      >
        {avatar ? (
          <img
            src={avatar}
            alt="Avatar"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          initials
        )}
        {(hov || loading) && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
            }}
          >
            {loading ? (
              <div className="pg-spin-sm" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="13"
                  r="4"
                  stroke="white"
                  strokeWidth="1.8"
                />
              </svg>
            )}
          </div>
        )}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 2,
          right: 2,
          zIndex: 2,
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: "#c8ff57",
          border: "3px solid #161619",
        }}
      />
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        style={{ display: "none" }}
        aria-label="Upload profile photo"
      />
    </div>
  );
}

function BannerUpload({ banner, editing, onChange }) {
  const fileRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const compressed = await compressImage(file, 1200);
      onChange(compressed);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  return (
    <div
      style={{
        height: 130,
        position: "relative",
        overflow: "hidden",
        background: banner
          ? "transparent"
          : "linear-gradient(135deg,#0d1a0d 0%,#111a08 40%,#0a0a10 100%)",
      }}
    >
      {banner ? (
        <img
          src={banner}
          alt="Banner"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(200,255,87,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(200,255,87,0.04) 1px,transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "radial-gradient(circle,rgba(200,255,87,0.15) 1px,transparent 1px)",
              backgroundSize: "48px 48px",
              backgroundPosition: "24px 24px",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: -40,
              left: 120,
              width: 300,
              height: 200,
              background:
                "radial-gradient(ellipse,rgba(200,255,87,0.12) 0%,transparent 65%)",
              pointerEvents: "none",
            }}
          />
        </>
      )}
      {editing ? (
        <>
          <button
            className="pg-edit-banner"
            onClick={() => fileRef.current?.click()}
            aria-label="Upload banner image"
          >
            {loading ? "Uploading..." : "Edit Banner"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            style={{ display: "none" }}
            aria-label="Banner image upload"
          />
        </>
      ) : null}
    </div>
  );
}

//  MAIN PAGE

export default function ProfilePage() {
  const { updateProfile: syncToAppContext } = useApp();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [profileTourDone, setProfileTourDone] = useState(() => {
    // If it's a brand-new signup, always show the profile tour regardless of
    // any stale "profile_tour_complete" key left from a previous session.
    try {
      const auth = JSON.parse(localStorage.getItem("fs_auth") || "{}");
      if (auth.isNewSignup) {
        localStorage.removeItem("profile_tour_complete");
        // Clear the flag so returning to this page later won't retrigger the tour
        localStorage.setItem(
          "fs_auth",
          JSON.stringify({ ...auth, isNewSignup: false }),
        );
        return false;
      }
    } catch {
      /* ignore */
    }
    return Boolean(localStorage.getItem("profile_tour_complete"));
  });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    try {
      localStorage.removeItem("fs_auth");
    } catch {
      /* ignore */
    }
    navigate("/login");
  };

  const [profileData, setProfileData] = useState(() => loadProfileData());
  const [recentProjects, setRecentProjects] = useState(() =>
    loadRecentProjects(),
  );
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [undoStack, setUndoStack] = useState([]);
  const [autoSave, setAutoSave] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState("");
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [skillsEditOpen, setSkillsEditOpen] = useState(false);
  const [skillsEditDraft, setSkillsEditDraft] = useState([]);
  const skillRef = useRef(null);
  const autoSaveRef = useRef(null);
  const autoSaveStatusRef = useRef(null);

  // Custom scrollbar refs — mirrors ClientList kanban-scroll system
  const skillsScrollRef = useRef(null);
  const projectsScrollRef = useRef(null);
  const [skillsScrollMeta, setSkillsScrollMeta] = useState({
    visible: false,
    top: 0,
    height: 0,
  });
  const [projectsScrollMeta, setProjectsScrollMeta] = useState({
    visible: false,
    top: 0,
    height: 0,
  });

  const calcScrollMeta = (el, setter) => {
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollHeight <= clientHeight + 1) {
      setter({ visible: false, top: 0, height: 0 });
      return;
    }
    const thumbHeight = Math.max(
      28,
      (clientHeight * clientHeight) / scrollHeight,
    );
    const maxTop = clientHeight - thumbHeight;
    const top = (scrollTop / (scrollHeight - clientHeight)) * maxTop;
    setter({ visible: true, top, height: thumbHeight });
  };

  const updateSkillsMeta = useCallback(() => {
    calcScrollMeta(skillsScrollRef.current, setSkillsScrollMeta);
  }, []);

  const updateProjectsMeta = useCallback(() => {
    calcScrollMeta(projectsScrollRef.current, setProjectsScrollMeta);
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(updateSkillsMeta);
    window.addEventListener("resize", updateSkillsMeta);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateSkillsMeta);
    };
  }, [updateSkillsMeta]);

  useEffect(() => {
    const raf = requestAnimationFrame(updateProjectsMeta);
    window.addEventListener("resize", updateProjectsMeta);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateProjectsMeta);
    };
  }, [updateProjectsMeta]);

  useEffect(() => {
    document.title = "Profile  Freelancer Studio";
  }, []);

  useEffect(() => {
    if (!autoSave || !editing || !draft) return;
    clearInterval(autoSaveRef.current);
    autoSaveRef.current = setInterval(() => {
      const errs = validateProfile(draft);
      if (Object.keys(errs).length > 0) return;
      setAutoSaveStatus("saving");
      clearTimeout(autoSaveStatusRef.current);
      const result = saveProfileData(draft);
      if (result.ok) {
        setProfileData({ ...draft });
        syncToAppContext(
          { name: draft.name, role: draft.role },
          { silent: true },
        );
        setAutoSaveStatus("saved");
        autoSaveStatusRef.current = setTimeout(
          () => setAutoSaveStatus(""),
          2000,
        );
      }
    }, 5000);
    return () => clearInterval(autoSaveRef.current);
  }, [autoSave, editing, draft, syncToAppContext]);

  const enterEditMode = () => {
    setDraft({ ...profileData });
    setErrors({});
    setEditing(true);
  };

  const cancelEdit = () => {
    const hasChanges = JSON.stringify(draft) !== JSON.stringify(profileData);
    if (hasChanges) {
      setConfirmDiscard(true);
    } else {
      doCancel();
    }
  };

  const doCancel = () => {
    setDraft(null);
    setErrors({});
    setEditing(false);
    setConfirmDiscard(false);
    clearInterval(autoSaveRef.current);
    showToast("Changes discarded", "info");
  };

  const saveChanges = async () => {
    const errs = validateProfile(draft);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      showToast("Please fix highlighted fields", "error");
      return;
    }
    setIsSaving(true);
    setUndoStack((prev) => [...prev.slice(-9), { ...profileData }]);
    await new Promise((r) => setTimeout(r, 350));
    const result = saveProfileData(draft);
    setIsSaving(false);
    if (!result.ok) {
      showToast(result.error || "Save failed", "error");
      return;
    }
    setProfileData({ ...draft });
    syncToAppContext({ name: draft.name, role: draft.role }, { silent: true });
    setDraft(null);
    setErrors({});
    setEditing(false);
    clearInterval(autoSaveRef.current);
    showToast("Profile updated successfully", "success");
  };

  const undoLast = () => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setUndoStack((s) => s.slice(0, -1));
    setDraft({ ...prev });
    showToast("Undo applied", "info");
  };

  const setDraftField = useCallback((key, value) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }, []);

  const setDraftStat = useCallback((key, value) => {
    const num = parseInt(value, 10);
    setDraft((prev) => ({
      ...prev,
      stats: { ...prev.stats, [key]: isNaN(num) ? 0 : Math.max(0, num) },
    }));
    setErrors((prev) => ({ ...prev, ["stats_" + key]: undefined }));
  }, []);

  const handleDirectAvatarSave = useCallback(
    async (dataUrl) => {
      const newData = { ...profileData, avatar: dataUrl };
      setProfileData(newData);
      const result = saveProfileData(newData);
      if (result.ok) {
        showToast("Profile photo updated!", "success");
      } else {
        showToast(result.error || "Could not save photo", "error");
      }
    },
    [profileData, showToast],
  );

  const d = editing ? draft : profileData;
  const card = {
    background: "#161619",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 16,
    padding: 20,
  };
  const mono = { fontFamily: "'DM Mono', monospace" };
  const editBorder = editing ? "1px dashed rgba(200,255,87,0.3)" : undefined;

  return (
    <>
      <style>{`
        .pg-avatar-ring { display: none; }
        @keyframes pg-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .prof-scroll-3::-webkit-scrollbar { width: 3px; border-radius: 999px; }
        .prof-scroll-3::-webkit-scrollbar-track { background: transparent; border-radius: 999px; }
        .prof-scroll-3::-webkit-scrollbar-thumb { background: #caff00; border-radius: 999px; }
        .prof-scroll-3::-webkit-scrollbar-thumb:hover { background: #00f5ff; }
        .prof-scroll-3 { scrollbar-color: #caff00 transparent; }
        .pg-char-float { animation: pg-float 2s ease-in-out infinite; }
        @keyframes pg-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        .pg-avail-dot { animation: pg-adot 1.8s ease-in-out infinite; }
        @keyframes pg-adot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(.8)} }
        .pg-avail-ring {
          position: absolute; inset: -4px; border-radius: 50%;
          border: 1.5px solid rgba(200,255,87,.5);
          animation: pg-aring 1.8s ease-in-out infinite;
        }
        @keyframes pg-aring { 0%{transform:scale(.5);opacity:.9} 100%{transform:scale(2.5);opacity:0} }
        .pg-link-pill {
          display: flex; align-items: center; gap: 6px;
          padding: 5px 12px; border-radius: 99px;
          border: 1px solid rgba(255,255,255,0.07);
          background: transparent; color: #555; text-decoration: none;
          font-family: 'DM Mono', monospace; font-size: 9px; transition: all .15s;
        }
        .pg-link-pill:hover { border-color: rgba(200,255,87,0.2); color: #c8ff57; }
        .pg-stat-card {
          background: #161619; border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 16px; transition: border-color .15s, transform .15s;
        }
        .pg-stat-card:hover { border-color: rgba(200,255,87,0.2); transform: translateY(-2px); }
        .pg-contact-row {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 12px; border-radius: 10px; border: 1px solid transparent; transition: all .15s;
        }
        .pg-contact-row:hover { background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.07); }
        .pg-btn-primary {
          padding: 8px 20px; border-radius: 99px; background: #c8ff57; border: none;
          font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700; color: #0a0a0c;
          transition: transform .15s, box-shadow .15s; display: flex; align-items: center; gap: 6px;
        }
        .pg-btn-primary:hover { transform: scale(1.03); box-shadow: 0 4px 20px rgba(200,255,87,.4); }
        .pg-btn-primary:disabled { opacity: .6; transform: none; }
        .pg-btn-secondary {
          padding: 8px 16px; border-radius: 99px; background: transparent;
          border: 1px solid rgba(255,255,255,0.13); font-family: 'DM Mono', monospace;
          font-size: 10px; color: #555; transition: all .15s;
        }
        .pg-btn-secondary:hover { border-color: rgba(200,255,87,0.2); color: #c8ff57; }
        .pg-hire-btn {
          width: 100%; padding: 9px; border-radius: 99px; background: #c8ff57; border: none;
          font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700; color: #0a0a0c;
          margin-top: 12px; transition: transform .15s, box-shadow .15s;
        }
        .pg-hire-btn:hover { transform: scale(1.02); box-shadow: 0 4px 16px rgba(200,255,87,.4); }
        .pg-section-action {
          font-family: 'DM Mono', monospace; font-size: 9px; color: #444;
          letter-spacing: .06em; background: none; border: none;
          text-transform: uppercase; transition: color .15s; padding: 4px;
        }
        .pg-section-action:hover { color: #c8ff57; }
        .pg-edit-banner {
          position: absolute; top: 12px; right: 12px;
          padding: 5px 12px; border-radius: 99px; border: 1px solid rgba(255,255,255,0.12);
          background: rgba(0,0,0,0.4); font-family: 'DM Mono', monospace; font-size: 9px; color: #666;
          letter-spacing: .06em; text-transform: uppercase; transition: all .15s; backdrop-filter: blur(6px);
        }
        .pg-edit-banner:hover { border-color: rgba(200,255,87,0.2); color: #c8ff57; }
        .pg-edit-input {
          width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px; padding: 8px 12px; font-family: 'DM Mono', monospace;
          font-size: 11px; color: #e0e0e0; outline: none;
          transition: border-color .15s, box-shadow .15s; box-sizing: border-box;
        }
        .pg-edit-input:focus { border-color: rgba(200,255,87,0.4); box-shadow: 0 0 0 3px rgba(200,255,87,0.08); }
        .pg-edit-input::placeholder { color: #333; }
        @keyframes pg-edit-fade { from{opacity:0;transform:scale(.97)} to{opacity:1;transform:scale(1)} }
        .pg-edit-animate { animation: pg-edit-fade .2s ease both; }
        @keyframes pg-spin-sm { to{transform:rotate(360deg)} }
        .pg-spin-sm {
          width: 12px; height: 12px; border-radius: 50%;
          border: 2px solid rgba(10,10,12,0.3); border-top-color: #0a0a0c;
          animation: pg-spin-sm .7s linear infinite; display: inline-block;
        }
        .pg-autosave-indicator {
          font-family: 'DM Mono', monospace; font-size: 9px; color: #555;
          letter-spacing: .06em; display: flex; align-items: center; gap: 5px;
          opacity: 0; transition: opacity .3s;
        }
        .pg-autosave-indicator.visible { opacity: 1; }
        .pg-confirm-overlay {
          position: fixed; inset: 0; z-index: 9000;
          background: rgba(0,0,0,0.7); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          animation: pg-edit-fade .15s ease both;
        }
        .pg-confirm-card {
          background: #0f0f12; border: 1.5px solid rgba(255,255,255,0.1);
          border-radius: 16px; padding: 28px 32px; text-align: center;
          box-shadow: 0 20px 60px rgba(0,0,0,.6); min-width: 300px;
          animation: pg-edit-fade .2s ease both;
        }
        .pg-undo-btn {
          padding: 5px 12px; border-radius: 99px; border: 1px solid rgba(255,255,255,0.1);
          background: transparent; font-family: 'DM Mono', monospace; font-size: 9px; color: #444;
          letter-spacing: .06em; text-transform: uppercase; transition: all .15s;
        }
        .pg-undo-btn:hover { border-color: rgba(200,255,87,0.25); color: #c8ff57; }
        .pg-undo-btn:disabled { opacity: .3; }
        .pg-stat-edit-input {
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 6px; padding: 4px 8px; font-family: 'Syne', sans-serif;
          font-size: 22px; font-weight: 800; letter-spacing: -.5px; line-height: 1;
          width: 80px; outline: none; transition: border-color .15s, box-shadow .15s;
          box-sizing: border-box; text-align: center; -moz-appearance: textfield;
        }
        .pg-stat-edit-input::-webkit-inner-spin-button,
        .pg-stat-edit-input::-webkit-outer-spin-button { -webkit-appearance: none; }
        .pg-stat-edit-input:focus { border-color: rgba(200,255,87,0.4); box-shadow: 0 0 0 2px rgba(200,255,87,0.08); }
        .pg-edit-mode-bar {
          position: sticky; top: 0; z-index: 50;
          background: rgba(15,15,18,0.95); backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(200,255,87,0.15);
          padding: 12px 20px;
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
          animation: pg-edit-fade .2s ease both;
        }
      `}</style>

      {/* STICKY EDIT BAR */}
      {editing && (
        <div
          className="pg-edit-mode-bar"
          role="toolbar"
          aria-label="Profile edit toolbar"
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#c8ff57",
                boxShadow: "0 0 6px rgba(200,255,87,0.6)",
              }}
            />
            <span
              style={{
                ...mono,
                fontSize: 10,
                color: "#c8ff57",
                letterSpacing: ".08em",
              }}
            >
              EDITING PROFILE
            </span>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                ...mono,
                fontSize: 9,
                color: "#444",
                textTransform: "uppercase",
                letterSpacing: ".06em",
              }}
            >
              <input
                type="checkbox"
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
                aria-label="Enable auto-save"
                style={{ accentColor: "#c8ff57" }}
              />
              Auto-save
            </label>
            <span
              className={
                "pg-autosave-indicator" + (autoSaveStatus ? " visible" : "")
              }
            >
              {autoSaveStatus === "saving" && (
                <>
                  <div
                    className="pg-spin-sm"
                    style={{ borderTopColor: "#555" }}
                  />{" "}
                  Saving...
                </>
              )}
              {autoSaveStatus === "saved" && (
                <>
                  <span style={{ color: "#c8ff57" }}></span> Saved
                </>
              )}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              className="pg-undo-btn"
              onClick={undoLast}
              disabled={undoStack.length === 0}
              aria-label="Undo last save"
            >
              {" "}
              Undo
            </button>
            <button
              className="pg-btn-secondary"
              onClick={cancelEdit}
              aria-label="Cancel editing"
            >
              Cancel
            </button>
            <button
              className="pg-btn-primary"
              onClick={saveChanges}
              disabled={isSaving}
              aria-label="Save changes"
            >
              {isSaving ? (
                <>
                  <div className="pg-spin-sm" /> Saving
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      )}

      <div
        style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px 16px" }}
      >
        {/* HERO */}
        <div
          id="ptour-hero"
          style={{
            background: "#161619",
            border: editing
              ? "1px solid rgba(200,255,87,0.2)"
              : "1px solid rgba(255,255,255,0.07)",
            borderRadius: 20,
            overflow: "hidden",
            marginBottom: 16,
            transition: "border-color .2s",
            boxShadow: editing ? "0 0 0 1px rgba(200,255,87,0.06)" : "none",
          }}
        >
          <BannerUpload
            banner={d.banner}
            editing={editing}
            onChange={(v) => setDraftField("banner", v)}
          />

          <div style={{ padding: "0 24px 24px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                marginTop: -42,
                marginBottom: 16,
              }}
            >
              <AvatarUpload
                avatar={d.avatar}
                name={d.name}
                editing={editing}
                onChange={(v) => setDraftField("avatar", v)}
                onDirectSave={handleDirectAvatarSave}
              />
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  paddingTop: 12,
                }}
              >
                {editing ? (
                  <>
                    <button
                      className="pg-btn-secondary"
                      onClick={cancelEdit}
                      aria-label="Cancel"
                    >
                      Cancel
                    </button>
                    <button
                      className="pg-btn-primary"
                      onClick={saveChanges}
                      disabled={isSaving}
                      aria-label="Save changes"
                    >
                      {isSaving ? (
                        <>
                          <div className="pg-spin-sm" /> Saving
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="pg-btn-secondary"
                      onClick={() => {
                        navigator.clipboard?.writeText(window.location.href);
                        showToast("Profile link copied!", "success");
                      }}
                      aria-label="Copy profile link"
                    >
                      Share
                    </button>
                    <button
                      className="pg-btn-primary"
                      onClick={enterEditMode}
                      aria-label="Edit profile"
                    >
                      Edit Profile
                    </button>
                  </>
                )}
              </div>
            </div>

            {editing ? (
              <div className="pg-edit-animate" style={{ marginBottom: 10 }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 10,
                    marginBottom: 10,
                  }}
                >
                  <EditInput
                    label="Full Name"
                    value={draft.name}
                    onChange={(v) => setDraftField("name", v)}
                    error={errors.name}
                    placeholder="Your name"
                    autoFocus
                    ariaLabel="Full name"
                  />
                  <EditInput
                    label="Role / Title"
                    value={draft.role}
                    onChange={(v) => setDraftField("role", v)}
                    placeholder="e.g. Senior AI Engineer"
                    ariaLabel="Role or title"
                  />
                </div>
                <EditInput
                  label="Location"
                  value={draft.location}
                  onChange={(v) => setDraftField("location", v)}
                  placeholder="e.g. Cairo, Egypt"
                  ariaLabel="Location"
                />
              </div>
            ) : (
              <>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    letterSpacing: "-.5px",
                    marginBottom: 3,
                    fontFamily: "'Syne', sans-serif",
                    color: "#f0f0f0",
                  }}
                >
                  {d.name.split(" ")[0]}{" "}
                  <span style={{ color: "#c8ff57" }}>
                    {d.name.split(" ").slice(1).join(" ")}
                  </span>
                </div>
                <div
                  style={{
                    ...mono,
                    fontSize: 10,
                    color: "#555",
                    letterSpacing: ".08em",
                    textTransform: "uppercase",
                    marginBottom: 10,
                  }}
                >
                  {d.role} {d.location}
                </div>
              </>
            )}

            {editing ? (
              <div className="pg-edit-animate" style={{ marginBottom: 14 }}>
                <EditTextarea
                  label="Bio"
                  value={draft.bio}
                  onChange={(v) => setDraftField("bio", v)}
                  placeholder="Tell the world what you build..."
                  maxLength={400}
                />
              </div>
            ) : (
              <div
                style={{
                  fontSize: 13,
                  color: "#666",
                  lineHeight: 1.6,
                  maxWidth: 480,
                  marginBottom: 14,
                }}
              >
                {d.bio}
              </div>
            )}

            {editing ? (
              <div className="pg-edit-animate" style={{ marginBottom: 14 }}>
                <SkillsEditor
                  skills={draft.skills}
                  onChange={(v) => setDraftField("skills", v)}
                  error={errors.skills}
                />
              </div>
            ) : (
              <div
                className="prof-scroll-3"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                  marginBottom: 14,
                  maxHeight: d.skills.length > 6 ? 76 : "none",
                  overflowY: d.skills.length > 6 ? "auto" : "visible",
                  paddingRight: d.skills.length > 6 ? 4 : 0,
                }}
              >
                {d.skills.map((s) => (
                  <span
                    key={s}
                    style={{
                      fontFamily: "'DM Mono',monospace",
                      fontSize: 9,
                      fontWeight: 500,
                      padding: "3px 10px",
                      borderRadius: 4,
                      letterSpacing: ".06em",
                      textTransform: "uppercase",
                      background: "rgba(200,255,87,0.08)",
                      color: "#a8cc3a",
                      border: "1px solid rgba(200,255,87,0.2)",
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}

            {editing ? (
              <div className="pg-edit-animate">
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 10,
                  }}
                >
                  <EditInput
                    label="GitHub URL"
                    value={draft.github}
                    onChange={(v) => setDraftField("github", v)}
                    error={errors.github}
                    placeholder="https://github.com/..."
                    type="url"
                    ariaLabel="GitHub URL"
                  />
                  <EditInput
                    label="LinkedIn URL"
                    value={draft.linkedin}
                    onChange={(v) => setDraftField("linkedin", v)}
                    error={errors.linkedin}
                    placeholder="https://linkedin.com/in/..."
                    type="url"
                    ariaLabel="LinkedIn URL"
                  />
                  <EditInput
                    label="Email"
                    value={draft.email}
                    onChange={(v) => setDraftField("email", v)}
                    error={errors.email}
                    placeholder="you@example.com"
                    type="email"
                    ariaLabel="Email address"
                  />
                  <EditInput
                    label="Portfolio Website (optional)"
                    value={draft.website}
                    onChange={(v) => setDraftField("website", v)}
                    error={errors.website}
                    placeholder="https://yoursite.com"
                    type="url"
                    ariaLabel="Portfolio website URL"
                  />
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {[
                  { label: "GitHub", dot: "#f0f0f0", href: d.github },
                  { label: "LinkedIn", dot: "#0077b5", href: d.linkedin },
                  { label: "Email", dot: "#c8ff57", href: "mailto:" + d.email },
                  ...(d.website
                    ? [{ label: "Portfolio", dot: "#a8a6ff", href: d.website }]
                    : []),
                ]
                  .filter((l) => l.href)
                  .map((l) => (
                    <a
                      key={l.label}
                      className="pg-link-pill"
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={l.label}
                    >
                      <div
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: l.dot,
                          flexShrink: 0,
                        }}
                      />
                      {l.label}
                    </a>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* STATS */}
        <div
          id="ptour-stats"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 10,
            marginBottom: 16,
          }}
        >
          {STAT_META.map((s) => (
            <div
              key={s.key}
              className="pg-stat-card"
              style={editing ? { border: editBorder } : {}}
            >
              <div
                style={{
                  ...mono,
                  fontSize: 9,
                  color: "#444",
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                {s.label}
              </div>
              {editing ? (
                <div className="pg-edit-animate">
                  <input
                    type="number"
                    min="0"
                    value={draft.stats[s.key]}
                    onChange={(e) => setDraftStat(s.key, e.target.value)}
                    aria-label={s.label}
                    className="pg-stat-edit-input"
                    style={{ color: s.color }}
                  />
                  {errors["stats_" + s.key] && (
                    <span
                      style={{
                        ...mono,
                        fontSize: 9,
                        color: "#FF2D78",
                        display: "block",
                        marginTop: 3,
                      }}
                    >
                      {errors["stats_" + s.key]}
                    </span>
                  )}
                </div>
              ) : (
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 800,
                    letterSpacing: "-.5px",
                    lineHeight: 1,
                    color: s.color,
                    fontFamily: "'Syne', sans-serif",
                  }}
                >
                  {d.stats[s.key]}
                </div>
              )}
              <div style={{ ...mono, fontSize: 9, marginTop: 5, color: s.dc }}>
                {s.delta}
              </div>
            </div>
          ))}
        </div>

        {/* TWO COL */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 320px",
            gap: 16,
            marginBottom: 16,
          }}
        >
          <div id="ptour-skills" style={card} ref={skillRef}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#d0d0d0",
                  fontFamily: "'Syne', sans-serif",
                }}
              >
                Skills & Expertise
              </div>
              <button
                className="pg-section-action"
                onClick={() => {
                  setSkillsEditDraft([...d.skills]);
                  setSkillsEditOpen(true);
                }}
                aria-label="Edit skills"
              >
                ✏ Edit
              </button>
            </div>
            <div
              className="kanban-scroll-wrap"
              style={d.skills.length > 6 ? { maxHeight: 210 } : {}}
            >
              <div
                ref={skillsScrollRef}
                onScroll={updateSkillsMeta}
                className="kanban-scroll-native"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  ...(d.skills.length > 6
                    ? {
                        maxHeight: 210,
                        overflowY: "auto",
                        overflowX: "hidden",
                        paddingRight: 18,
                      }
                    : {}),
                }}
              >
                {d.skills.map((s, i) => {
                  const pct = Math.max(60, 95 - i * 5);
                  const clrs = [
                    "#c8ff57",
                    "#a8a6ff",
                    "#c8ff57",
                    "#f9a8d4",
                    "#7dd3fc",
                    "#c8ff57",
                  ];
                  return (
                    <div
                      key={s}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 5,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: "#c0c0c0",
                          }}
                        >
                          {s}
                        </span>
                        <span
                          style={{
                            ...mono,
                            fontSize: 10,
                            fontWeight: 500,
                            color: clrs[i % clrs.length],
                          }}
                        >
                          {pct}%
                        </span>
                      </div>
                      <div
                        style={{
                          height: 3,
                          background: "rgba(255,255,255,0.06)",
                          borderRadius: 99,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            borderRadius: 99,
                            background: clrs[i % clrs.length],
                            width: pct + "%",
                            transition:
                              "width 1s " +
                              i * 0.1 +
                              "s cubic-bezier(.77,0,.18,1)",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              {d.skills.length > 6 && (
                <div
                  className="kanban-scroll-rail"
                  style={{ right: "4px" }}
                  aria-hidden
                >
                  {skillsScrollMeta.visible && (
                    <div
                      className="kanban-scroll-thumb"
                      style={{
                        height: `${skillsScrollMeta.height}px`,
                        transform: `translateY(${skillsScrollMeta.top}px)`,
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div id="ptour-contact" style={{ ...card, padding: 16 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#d0d0d0",
                  marginBottom: 12,
                  fontFamily: "'Syne', sans-serif",
                }}
              >
                Contact
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  {
                    icon: "",
                    iconBg: "rgba(200,255,87,0.08)",
                    iconBc: "rgba(200,255,87,0.15)",
                    lbl: "Email",
                    val: d.email || "",
                  },
                  {
                    icon: "",
                    iconBg: "rgba(56,189,248,0.08)",
                    iconBc: "rgba(56,189,248,0.15)",
                    lbl: "Location",
                    val: d.location || "",
                  },
                  ...(d.website
                    ? [
                        {
                          icon: "",
                          iconBg: "rgba(108,106,245,0.08)",
                          iconBc: "rgba(108,106,245,0.15)",
                          lbl: "Website",
                          val: d.website.replace("https://", ""),
                        },
                      ]
                    : []),
                ].map((c) => (
                  <div
                    key={c.lbl}
                    className="pg-contact-row"
                    onClick={() => {
                      navigator.clipboard?.writeText(c.val);
                      showToast("Copied: " + c.val, "info");
                    }}
                    style={{ cursor: "default" }}
                  >
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 8,
                        background: c.iconBg,
                        border: "1px solid " + c.iconBc,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 13,
                        flexShrink: 0,
                      }}
                    >
                      {c.icon}
                    </div>
                    <div>
                      <div
                        style={{
                          ...mono,
                          fontSize: 9,
                          color: "#444",
                          textTransform: "uppercase",
                          letterSpacing: ".08em",
                          marginBottom: 2,
                        }}
                      >
                        {c.lbl}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#c0c0c0",
                        }}
                      >
                        {c.val}
                      </div>
                    </div>
                    <span
                      style={{
                        marginLeft: "auto",
                        ...mono,
                        fontSize: 8,
                        color: "#333",
                      }}
                    >
                      copy
                    </span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  background: "rgba(200,255,87,0.06)",
                  border: "1px solid rgba(200,255,87,0.2)",
                  borderRadius: 14,
                  padding: 16,
                  marginTop: 10,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 6,
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: 7,
                      height: 7,
                      flexShrink: 0,
                    }}
                  >
                    <div
                      className="pg-avail-dot"
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: "#c8ff57",
                        position: "relative",
                        zIndex: 1,
                      }}
                    />
                    <div className="pg-avail-ring" />
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#c8ff57",
                      fontFamily: "'Syne', sans-serif",
                    }}
                  >
                    Available for Work
                  </div>
                </div>
                <div
                  style={{
                    ...mono,
                    fontSize: 9,
                    color: "#666",
                    lineHeight: 1.6,
                  }}
                >
                  Open to full-time AI Engineer roles & consulting projects.
                  Response within 24h.
                </div>
                <button
                  className="pg-hire-btn"
                  onClick={() => showToast("Hire request sent!", "success")}
                  aria-label="Hire me"
                >
                  Hire Me{" "}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* PROJECTS */}
        <div id="ptour-projects" style={{ ...card, marginBottom: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#d0d0d0",
                fontFamily: "'Syne', sans-serif",
              }}
            >
              Recent Projects
            </div>
            <button
              className="pg-section-action"
              onClick={() => navigate("/projects")}
              aria-label="View all projects"
            >
              View All
            </button>
          </div>
          <div className="kanban-scroll-wrap" style={{ maxHeight: 192 }}>
            <div
              ref={projectsScrollRef}
              onScroll={updateProjectsMeta}
              className="kanban-scroll-native"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                maxHeight: 192,
                overflowY: "auto",
                overflowX: "hidden",
                paddingRight: 18,
              }}
            >
              {recentProjects.length === 0 ? (
                <div
                  style={{
                    fontFamily: "'DM Mono',monospace",
                    fontSize: 11,
                    color: "#444",
                    padding: "12px 0",
                  }}
                >
                  No projects yet — add one from the Projects page.
                </div>
              ) : (
                recentProjects.map((p) => <ProjectItem key={p.name} {...p} />)
              )}
            </div>
            <div
              className="kanban-scroll-rail"
              style={{ right: "4px" }}
              aria-hidden
            >
              {projectsScrollMeta.visible && (
                <div
                  className="kanban-scroll-thumb"
                  style={{
                    height: `${projectsScrollMeta.height}px`,
                    transform: `translateY(${projectsScrollMeta.top}px)`,
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* ACTIVITY */}
        <div
          style={{
            ...card,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: -20,
              top: -20,
              width: 200,
              height: 200,
              background:
                "radial-gradient(circle,rgba(200,255,87,0.05) 0%,transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div style={{ maxWidth: 480 }}>
            <div
              style={{
                ...mono,
                fontSize: 9,
                color: "#c8ff57",
                letterSpacing: ".12em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              weekly activity{" "}
              {new Date().toLocaleString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: "-.3px",
                marginBottom: 6,
                fontFamily: "'Syne', sans-serif",
                color: "#f0f0f0",
              }}
            >
              {d.stats.streak}-day streak
            </div>
            <div
              style={{
                ...mono,
                fontSize: 10,
                color: "#444",
                lineHeight: 1.7,
                marginBottom: 14,
              }}
            >
              255 active days tracked 52 weeks of data
              <br />
              Keep the lime cells glowing!
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 3,
                maxWidth: 380,
              }}
            >
              {ACTIVITY.map((lvl, i) => (
                <ActivityCell key={i} level={lvl} />
              ))}
            </div>
          </div>
          <div className="pg-char-float" style={{ flexShrink: 0 }}>
            <Character />
          </div>
        </div>
      </div>

      {/* SIGN OUT */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          paddingTop: 6,
          paddingBottom: 8,
        }}
      >
        <div
          style={{
            fontFamily: "'DM Mono',monospace",
            fontSize: 9,
            color: "#2e2e35",
            letterSpacing: ".1em",
            textTransform: "uppercase",
          }}
        >
          — end of profile —
        </div>
        <button
          onClick={() => setShowLogoutConfirm(true)}
          aria-label="Log out of Freelancer Studio"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "9px 24px",
            borderRadius: 99,
            background: "transparent",
            border: "1px solid rgba(255,45,120,0.2)",
            fontFamily: "'DM Mono',monospace",
            fontSize: 10,
            color: "#555",
            letterSpacing: ".08em",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "all .2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,45,120,0.5)";
            e.currentTarget.style.color = "#FF2D78";
            e.currentTarget.style.boxShadow = "0 0 16px rgba(255,45,120,0.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,45,120,0.2)";
            e.currentTarget.style.color = "#555";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M4.5 2H2a1 1 0 00-1 1v6a1 1 0 001 1h2.5M8 8.5L11 6 8 3.5M5 6h6"
              stroke="#FF2D78"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Log out
        </button>
      </div>

      {/* LOGOUT CONFIRMATION — Pixel asks "Leaving so soon?" */}
      {showLogoutConfirm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9500,
            background: "rgba(0,0,0,0.82)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px 16px",
            animation: "pg-edit-fade .2s ease both",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowLogoutConfirm(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Sign out confirmation"
        >
          <div
            style={{
              background: "#0f0f12",
              border: "1.5px solid #c8ff57",
              borderRadius: 22,
              padding: "32px 36px 28px",
              maxWidth: 440,
              width: "100%",
              boxShadow:
                "0 0 60px rgba(200,255,87,0.12), 0 30px 80px rgba(0,0,0,0.7)",
              animation: "pg-edit-fade .25s ease both",
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
              {/* Pixel with wink */}
              <div
                style={{
                  flexShrink: 0,
                  animation: "pg-float 2s ease-in-out infinite",
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
                  {/* wink left eye */}
                  <path
                    d="M13 11.5 Q14.75 10 16.5 11.5"
                    stroke="#1a1a1a"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* right eye open */}
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
                  {/* smile */}
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

              {/* Speech bubble tail triangle */}
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
                  {/* left pointing tail */}
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
                  transition: "transform .15s, box-shadow .15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.04)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 20px rgba(200,255,87,0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
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
                  transition: "all .15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,45,120,0.12)";
                  e.currentTarget.style.borderColor = "rgba(255,45,120,0.6)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "rgba(255,45,120,0.35)";
                }}
              >
                Yes, log out
              </button>
            </div>
          </div>
        </div>
      )}
      {skillsEditOpen && (
        <div
          className="pg-confirm-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Edit skills"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSkillsEditOpen(false);
          }}
        >
          <div
            className="pg-confirm-card"
            style={{
              minWidth: 380,
              maxWidth: 500,
              width: "90vw",
              textAlign: "left",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#f0f0f0",
                  fontFamily: "'Syne',sans-serif",
                }}
              >
                Edit Skills
              </div>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "#555",
                  fontSize: 16,
                  cursor: "pointer",
                  padding: "2px 6px",
                }}
                onClick={() => setSkillsEditOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <SkillsEditor
              skills={skillsEditDraft}
              onChange={setSkillsEditDraft}
            />
            <div
              style={{
                display: "flex",
                gap: 8,
                justifyContent: "flex-end",
                marginTop: 16,
              }}
            >
              <button
                className="pg-btn-secondary"
                onClick={() => setSkillsEditOpen(false)}
                aria-label="Cancel skill editing"
              >
                Cancel
              </button>
              <button
                className="pg-btn-primary"
                onClick={() => {
                  if (editing) {
                    setDraftField("skills", skillsEditDraft);
                  } else {
                    const newData = { ...profileData, skills: skillsEditDraft };
                    setProfileData(newData);
                    saveProfileData(newData);
                    showToast("Skills updated!", "success");
                  }
                  setSkillsEditOpen(false);
                }}
                aria-label="Save skills"
              >
                Save Skills
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DISCARD CONFIRM */}
      {confirmDiscard && (
        <div
          className="pg-confirm-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Discard changes confirmation"
        >
          <div className="pg-confirm-card">
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: "#f0f0f0",
                fontFamily: "'Syne',sans-serif",
                marginBottom: 8,
              }}
            >
              Discard changes?
            </div>
            <div
              style={{
                ...mono,
                fontSize: 10,
                color: "#555",
                lineHeight: 1.7,
                marginBottom: 20,
              }}
            >
              You have unsaved changes.
              <br />
              They will be permanently lost.
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              <button
                className="pg-btn-secondary"
                onClick={() => setConfirmDiscard(false)}
                aria-label="Keep editing"
              >
                Keep Editing
              </button>
              <button
                style={{
                  padding: "8px 20px",
                  borderRadius: 99,
                  background: "#FF2D78",
                  border: "none",
                  fontFamily: "'Syne',sans-serif",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#fff",
                  transition: "transform .15s",
                }}
                onClick={doCancel}
                aria-label="Discard changes"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROFILE ONBOARDING TOUR — shown only on first visit */}
      {!profileTourDone && (
        <ProfileOnboardingTour
          onComplete={() => {
            setProfileTourDone(true);
            localStorage.setItem("profile_tour_complete", "1");
          }}
        />
      )}
    </>
  );
}
