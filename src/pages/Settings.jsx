import { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { useToast } from "../context/ToastContext";

// ── CONSTANTS ─────────────────────────────────────────────────────────────────

const ACCENT_COLORS = [
  { hex: "#C8FF57" },
  { hex: "#FF3DE8" },
  { hex: "#3D9EFF" },
  { hex: "#FF8C00" },
  { hex: "#A855F7" },
  { hex: "#00E5A0" },
];

const FONT_OPTIONS = ["Space Mono", "Inter", "JetBrains"];

const SECTIONS = [
  {
    id: "profile",
    icon: "👤",
    label: "Profile",
    title: "Profile",
    sub: "Manage your identity and studio info",
    speech: "settings? let's go!",
  },
  {
    id: "appearance",
    icon: "🎨",
    label: "Appearance",
    title: "Appearance",
    sub: "Customize your studio look and feel",
    speech: "looking good! 🎨",
  },
  {
    id: "notifications",
    icon: "🔔",
    label: "Notifications",
    title: "Notifications",
    sub: "Control what pings you and when",
    speech: "i'll keep u posted!",
  },
  {
    id: "shortcuts",
    icon: "⌨️",
    label: "Shortcuts",
    title: "Shortcuts",
    sub: "Speed up your workflow with keys",
    speech: "ctrl+everything!",
  },
  {
    id: "billing",
    icon: "💳",
    label: "Billing",
    title: "Billing",
    sub: "Manage your plan and usage",
    speech: "money stuff 💸",
  },
  {
    id: "danger",
    icon: "⚠️",
    label: "Account",
    title: "Danger Zone",
    sub: "Irreversible actions — be careful",
    speech: "uh oh... careful!",
    isDanger: true,
  },
];

const SHORTCUTS = [
  { name: "Open command palette", keys: ["CMD", "K"] },
  { name: "Go to Dashboard", keys: ["D"] },
  { name: "New task", keys: ["N"] },
  { name: "Go to Projects", keys: ["P"] },
  { name: "Go to Analytics", keys: ["A"] },
  { name: "Toggle sidebar", keys: ["CMD", "\\"] },
  { name: "Search clients", keys: ["CMD", "F"] },
];

const COUNTRIES = [
  "Egypt 🇪🇬",
  "USA 🇺🇸",
  "UAE 🇦🇪",
  "UK 🇬🇧",
  "Germany 🇩🇪",
  "France 🇫🇷",
];
const TIMEZONES = [
  "UTC+2 Cairo",
  "UTC+0 London",
  "UTC-5 New York",
  "UTC+1 Berlin",
  "UTC+4 Dubai",
];
const CURRENCIES = ["USD $", "EGP ج.م", "EUR €", "GBP £", "AED د.إ"];

// ── PIXEL BANNER ──────────────────────────────────────────────────────────────

function PixelBanner({ speech }) {
  return (
    <div
      style={{
        height: 90,
        borderRadius: 12,
        overflow: "hidden",
        position: "relative",
        background: "#0E0F11",
        border: "1px solid rgba(255,255,255,0.07)",
        marginBottom: 20,
      }}
    >
      <style>{`
        @keyframes st-move { 0%{left:32px} 45%{left:calc(100% - 80px)} 50%{left:calc(100% - 80px);transform:scaleX(-1)} 95%{left:32px;transform:scaleX(-1)} 100%{left:32px;transform:none} }
        @keyframes st-walk { 0%{transform:scaleX(1)} 50%{transform:scaleX(-1)} }
        @keyframes st-bobble { 0%{transform:translateY(0)} 100%{transform:translateY(-3px)} }
        .st-char { position:absolute; bottom:18px; animation:st-walk .8s steps(2) infinite, st-move 6s linear infinite; }
        .st-speech { position:absolute; bottom:52px; left:60px; background:#C8FF57; color:#000; font-family:'DM Mono',monospace; font-size:9px; font-weight:700; padding:3px 8px; border-radius:4px; white-space:nowrap; animation:st-bobble .8s ease-in-out infinite alternate; }
        .st-speech::after { content:''; position:absolute; bottom:-5px; left:10px; width:0; height:0; border-left:5px solid transparent; border-right:5px solid transparent; border-top:5px solid #C8FF57; }
      `}</style>

      {/* Pixel city */}
      <svg
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          width: "100%",
          height: 60,
        }}
        viewBox="0 0 900 60"
        preserveAspectRatio="none"
      >
        <rect width="900" height="60" fill="#0E0F11" />
        <rect x="0" y="20" width="40" height="40" fill="#1C1E21" rx="2" />
        <rect x="5" y="25" width="6" height="6" fill="#C8FF57" opacity=".7" />
        <rect x="15" y="25" width="6" height="6" fill="#C8FF57" opacity=".4" />
        <rect x="5" y="35" width="6" height="6" fill="#C8FF57" opacity=".9" />
        <rect x="15" y="35" width="6" height="6" fill="#3D9EFF" opacity=".6" />
        <rect x="45" y="5" width="55" height="55" fill="#1C1E21" rx="2" />
        <rect x="50" y="10" width="8" height="8" fill="#C8FF57" opacity=".8" />
        <rect x="62" y="10" width="8" height="8" fill="#3D9EFF" opacity=".5" />
        <rect x="74" y="10" width="8" height="8" fill="#C8FF57" opacity=".3" />
        <rect x="50" y="22" width="8" height="8" fill="#C8FF57" opacity=".6" />
        <rect x="62" y="22" width="8" height="8" fill="#C8FF57" opacity=".9" />
        <rect x="74" y="22" width="8" height="8" fill="#3D9EFF" opacity=".7" />
        <rect x="105" y="15" width="35" height="45" fill="#232629" rx="2" />
        <rect x="110" y="20" width="6" height="6" fill="#FF3DE8" opacity=".6" />
        <rect x="120" y="20" width="6" height="6" fill="#C8FF57" opacity=".7" />
        <rect x="110" y="30" width="6" height="6" fill="#C8FF57" opacity=".4" />
        <rect x="120" y="30" width="6" height="6" fill="#3D9EFF" opacity=".8" />
        <rect x="150" y="0" width="70" height="60" fill="#1C1E21" rx="2" />
        <rect x="155" y="5" width="9" height="9" fill="#C8FF57" opacity=".8" />
        <rect x="168" y="5" width="9" height="9" fill="#3D9EFF" opacity=".6" />
        <rect x="155" y="18" width="9" height="9" fill="#FF3DE8" opacity=".5" />
        <rect x="168" y="18" width="9" height="9" fill="#C8FF57" opacity=".9" />
        <rect x="270" y="10" width="50" height="50" fill="#1C1E21" rx="2" />
        <rect x="275" y="15" width="8" height="8" fill="#C8FF57" opacity=".6" />
        <rect x="287" y="15" width="8" height="8" fill="#C8FF57" opacity=".8" />
        <rect x="275" y="27" width="8" height="8" fill="#C8FF57" opacity=".4" />
        <rect x="287" y="27" width="8" height="8" fill="#FF3DE8" opacity=".6" />
        <rect x="0" y="56" width="900" height="4" fill="#2A2D31" />
      </svg>

      {/* Walking pixel character */}
      <div className="st-char">
        <svg width="18" height="28" viewBox="0 0 18 28">
          <rect x="4" y="0" width="10" height="10" fill="#C8FF57" />
          <rect x="5" y="2" width="2" height="2" fill="#0E0F11" />
          <rect x="11" y="2" width="2" height="2" fill="#0E0F11" />
          <rect x="5" y="6" width="8" height="2" fill="#0E0F11" />
          <rect x="3" y="10" width="12" height="10" fill="#3D9EFF" />
          <rect x="0" y="12" width="4" height="6" fill="#3D9EFF" />
          <rect x="14" y="12" width="4" height="6" fill="#3D9EFF" />
          <rect x="3" y="20" width="5" height="8" fill="#232629" />
          <rect x="10" y="20" width="5" height="8" fill="#232629" />
          <rect x="2" y="26" width="5" height="2" fill="#C8FF57" />
          <rect x="11" y="26" width="5" height="2" fill="#C8FF57" />
        </svg>
      </div>

      <div className="st-speech">{speech}</div>
    </div>
  );
}

// ── SHARED COMPONENTS ─────────────────────────────────────────────────────────

function SettingsCard({ dot, title, children }) {
  return (
    <div
      style={{
        background: "#161619",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "14px 18px 12px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        {dot && (
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 2,
              background: dot,
              flexShrink: 0,
            }}
          />
        )}
        <span
          style={{
            fontFamily: "'DM Mono',monospace",
            fontSize: 10,
            color: "#e0e0e0",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: ".06em",
          }}
        >
          {title}
        </span>
      </div>
      <div style={{ padding: "14px 18px" }}>{children}</div>
    </div>
  );
}

function FieldLabel({ children }) {
  return (
    <div
      style={{
        fontFamily: "'DM Mono',monospace",
        fontSize: 9,
        color: "#555",
        textTransform: "uppercase",
        letterSpacing: ".08em",
        marginBottom: 6,
      }}
    >
      {children}
    </div>
  );
}

function StInput({ value, onChange, type = "text", placeholder, children }) {
  if (children) {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="st-input"
      >
        {children}
      </select>
    );
  }
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="st-input"
    />
  );
}

function ToggleRow({ label, desc, checked, onChange, last }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "9px 0",
        borderBottom: last ? "none" : "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div>
        <div style={{ fontSize: 13, color: "#e0e0e0" }}>{label}</div>
        {desc && (
          <div
            style={{
              fontFamily: "'DM Mono',monospace",
              fontSize: 9,
              color: "#555",
              marginTop: 2,
            }}
          >
            {desc}
          </div>
        )}
      </div>
      <button
        onClick={() => onChange(!checked)}
        aria-label={label}
        style={{
          width: 36,
          height: 20,
          borderRadius: 10,
          border: "none",
          background: checked ? "#C8FF57" : "rgba(255,255,255,0.1)",
          position: "relative",
          flexShrink: 0,
          transition: "background .2s",
          outline: "none",
        }}
      >
        <span
          style={{
            position: "absolute",
            width: 14,
            height: 14,
            background: "#fff",
            borderRadius: "50%",
            top: 3,
            left: checked ? 19 : 3,
            transition: "left .2s",
          }}
        />
      </button>
    </div>
  );
}

function ShortcutKbd({ keys }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {keys.map((k) => (
        <span
          key={k}
          style={{
            display: "inline-block",
            padding: "2px 6px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 4,
            fontFamily: "'DM Mono',monospace",
            fontSize: 9,
            color: "#555",
          }}
        >
          {k}
        </span>
      ))}
    </div>
  );
}

// ── SECTION PANELS ─────────────────────────────────────────────────────────────

function ProfileSection({ draft, onChange }) {
  const set = (k) => (v) => onChange({ ...draft, [k]: v });
  const initials = (draft.name || "FS")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SettingsCard dot="#C8FF57" title="Identity">
        {/* Avatar row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 14,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 10,
              background: "rgba(200,255,87,0.1)",
              border: "1.5px solid rgba(200,255,87,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'DM Mono',monospace",
              fontSize: 13,
              fontWeight: 700,
              color: "#C8FF57",
            }}
          >
            {initials}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#e0e0e0" }}>
              {draft.name}
            </div>
            <div
              style={{
                fontFamily: "'DM Mono',monospace",
                fontSize: 10,
                color: "#555",
                marginTop: 2,
              }}
            >
              Freelancer · Pro Plan
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <FieldLabel>Display Name</FieldLabel>
          <StInput
            value={draft.name}
            onChange={set("name")}
            placeholder="Your name"
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <FieldLabel>Email</FieldLabel>
          <StInput
            type="email"
            value={draft.email}
            onChange={set("email")}
            placeholder="you@example.com"
          />
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <FieldLabel>Country</FieldLabel>
            <StInput value={draft.country} onChange={set("country")}>
              {COUNTRIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </StInput>
          </div>
          <div style={{ flex: 1 }}>
            <FieldLabel>Timezone</FieldLabel>
            <StInput value={draft.timezone} onChange={set("timezone")}>
              {TIMEZONES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </StInput>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard dot="#3D9EFF" title="Studio Info">
        <div style={{ marginBottom: 12 }}>
          <FieldLabel>Studio Name</FieldLabel>
          <StInput
            value={draft.studioName}
            onChange={set("studioName")}
            placeholder="FreelancerStudio"
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <FieldLabel>Tagline</FieldLabel>
          <StInput
            value={draft.tagline}
            onChange={set("tagline")}
            placeholder="Design · Code · Deliver"
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <FieldLabel>Currency</FieldLabel>
          <StInput value={draft.currency} onChange={set("currency")}>
            {CURRENCIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </StInput>
        </div>
        <div>
          <FieldLabel>Plan</FieldLabel>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 10px",
              background: "rgba(200,255,87,0.08)",
              border: "1px solid rgba(200,255,87,0.25)",
              borderRadius: 20,
              fontFamily: "'DM Mono',monospace",
              fontSize: 10,
              color: "#C8FF57",
              fontWeight: 700,
            }}
          >
            <div
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "#C8FF57",
                animation: "st-pulse 1.5s infinite",
              }}
            />
            PRO ACTIVE
          </div>
        </div>
      </SettingsCard>
    </div>
  );
}

function AppearanceSection({ draft, onChange }) {
  const set = (k) => (v) => onChange({ ...draft, [k]: v });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SettingsCard dot="#FF3DE8" title="Accent Color">
        <FieldLabel>Choose your vibe</FieldLabel>
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            padding: "4px 0",
            marginBottom: 16,
          }}
        >
          {ACCENT_COLORS.map(({ hex }) => (
            <button
              key={hex}
              onClick={() => set("accentColor")(hex)}
              aria-label={"Select color " + hex}
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: hex,
                border: "none",
                outline:
                  draft.accentColor === hex
                    ? "2px solid #fff"
                    : "2px solid transparent",
                outlineOffset: 2,
                position: "relative",
                transition: "outline .15s",
              }}
            >
              {draft.accentColor === hex && (
                <span
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                    fontSize: 12,
                    color: "#000",
                    fontWeight: 700,
                  }}
                >
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
        <div>
          <FieldLabel>Font Style</FieldLabel>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {FONT_OPTIONS.map((f) => (
              <button
                key={f}
                onClick={() => set("fontStyle")(f)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 20,
                  border: "1px solid",
                  borderColor:
                    draft.fontStyle === f ? "#C8FF57" : "rgba(255,255,255,0.1)",
                  background: draft.fontStyle === f ? "#C8FF57" : "transparent",
                  color: draft.fontStyle === f ? "#000" : "#555",
                  fontFamily: "'DM Mono',monospace",
                  fontSize: 10,
                  fontWeight: draft.fontStyle === f ? 700 : 400,
                  transition: "all .15s",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </SettingsCard>

      <SettingsCard dot="#C8FF57" title="Interface">
        <ToggleRow
          label="Pixel character"
          desc="Show Pixel walking around"
          checked={draft.pixelCharacter}
          onChange={set("pixelCharacter")}
        />
        <ToggleRow
          label="Ticker bar"
          desc="Live stats scrolling at top"
          checked={draft.tickerBar}
          onChange={set("tickerBar")}
        />
        <ToggleRow
          label="Animations"
          desc="Motion effects & transitions"
          checked={draft.animations}
          onChange={set("animations")}
        />
        <ToggleRow
          label="Compact mode"
          desc="Tighter layout density"
          checked={draft.compactMode}
          onChange={set("compactMode")}
          last
        />
      </SettingsCard>
    </div>
  );
}

function NotificationsSection({ draft, onChange }) {
  const set = (k) => (v) => onChange({ ...draft, [k]: v });
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
      <SettingsCard dot="#C8FF57" title="Notification Channels">
        <ToggleRow
          label="New client added"
          desc="Alert when a client joins your studio"
          checked={draft.notifNewClient}
          onChange={set("notifNewClient")}
        />
        <ToggleRow
          label="Task completed"
          desc="Celebrate every win"
          checked={draft.notifTaskComplete}
          onChange={set("notifTaskComplete")}
        />
        <ToggleRow
          label="Revenue milestone"
          desc="Get notified on earning targets"
          checked={draft.notifRevenueMilestone}
          onChange={set("notifRevenueMilestone")}
        />
        <ToggleRow
          label="Weekly digest email"
          desc="Summary every Monday morning"
          checked={draft.notifWeeklyDigest}
          onChange={set("notifWeeklyDigest")}
        />
        <ToggleRow
          label="Overdue task alerts"
          desc="Remind when tasks pass deadline"
          checked={draft.notifOverdueAlert}
          onChange={set("notifOverdueAlert")}
          last
        />
      </SettingsCard>
    </div>
  );
}

function ShortcutsSection() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
      <SettingsCard dot="#3D9EFF" title="Keyboard Shortcuts">
        {SHORTCUTS.map((s, i) => (
          <div
            key={s.name}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "7px 0",
              borderBottom:
                i < SHORTCUTS.length - 1
                  ? "1px solid rgba(255,255,255,0.05)"
                  : "none",
            }}
          >
            <span style={{ fontSize: 12, color: "#e0e0e0" }}>{s.name}</span>
            <ShortcutKbd keys={s.keys} />
          </div>
        ))}
      </SettingsCard>
    </div>
  );
}

function UsageBar({ label, pct, color, used, max }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <FieldLabel>{label}</FieldLabel>
      <div
        style={{
          background: "rgba(255,255,255,0.06)",
          borderRadius: 20,
          height: 8,
          overflow: "hidden",
          marginBottom: 4,
        }}
      >
        <div
          style={{
            width: pct + "%",
            height: "100%",
            background: color,
            borderRadius: 20,
            transition: "width 1s",
          }}
        />
      </div>
      <div
        style={{
          fontFamily: "'DM Mono',monospace",
          fontSize: 9,
          color: "#555",
        }}
      >
        {used} / {max}
      </div>
    </div>
  );
}

function BillingSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SettingsCard dot="#C8FF57" title="Current Plan">
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 10px",
            background: "rgba(200,255,87,0.08)",
            border: "1px solid rgba(200,255,87,0.25)",
            borderRadius: 20,
            fontFamily: "'DM Mono',monospace",
            fontSize: 10,
            color: "#C8FF57",
            fontWeight: 700,
            marginBottom: 14,
          }}
        >
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#C8FF57",
              animation: "st-pulse 1.5s infinite",
            }}
          />
          PRO ACTIVE
        </div>
        <div style={{ marginBottom: 12 }}>
          <FieldLabel>Billing cycle</FieldLabel>
          <div style={{ fontSize: 13, color: "#e0e0e0" }}>
            Monthly · Renews May 8, 2026
          </div>
        </div>
        <div>
          <FieldLabel>Next charge</FieldLabel>
          <div
            style={{
              fontFamily: "'DM Mono',monospace",
              fontSize: 20,
              color: "#C8FF57",
              fontWeight: 700,
            }}
          >
            $19{" "}
            <span style={{ fontSize: 11, color: "#555", fontWeight: 400 }}>
              /month
            </span>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard dot="#3D9EFF" title="Usage">
        <UsageBar
          label="Clients"
          pct={60}
          color="#C8FF57"
          used="9 clients"
          max="15 clients"
        />
        <UsageBar
          label="Projects"
          pct={40}
          color="#3D9EFF"
          used="6 projects"
          max="15 projects"
        />
        <UsageBar
          label="Storage"
          pct={22}
          color="#FF3DE8"
          used="2.2 GB"
          max="10 GB"
        />
      </SettingsCard>
    </div>
  );
}

function DangerSection({ showToast }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const dangerItems = [
    {
      label: "Export all data",
      desc: "Download a full backup of your studio",
      btn: "Export",
      action: () =>
        showToast("Export started — check your downloads", "success"),
    },
    {
      label: "Reset workspace",
      desc: "Clear all tasks, projects and clients",
      btn: "Reset",
      action: () => showToast("Workspace has been reset", "info"),
    },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
      <SettingsCard dot="#FF3DE8" title="Danger Zone">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {dangerItems.map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                background: "rgba(255,61,232,0.05)",
                border: "1px solid rgba(255,61,232,0.15)",
                borderRadius: 10,
                padding: "12px 14px",
              }}
            >
              <div>
                <div style={{ fontSize: 13, color: "#FF3DE8" }}>
                  {item.label}
                </div>
                <div
                  style={{
                    fontFamily: "'DM Mono',monospace",
                    fontSize: 9,
                    color: "#555",
                    marginTop: 2,
                  }}
                >
                  {item.desc}
                </div>
              </div>
              <button
                onClick={item.action}
                style={{
                  padding: "6px 14px",
                  borderRadius: 7,
                  background: "transparent",
                  border: "1px solid #FF3DE8",
                  color: "#FF3DE8",
                  fontFamily: "'DM Mono',monospace",
                  fontSize: 10,
                  fontWeight: 600,
                  transition: "background .15s",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,61,232,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {item.btn}
              </button>
            </div>
          ))}

          {/* Delete — needs confirmation */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              background: "rgba(255,61,232,0.08)",
              border: "1px solid rgba(255,61,232,0.35)",
              borderRadius: 10,
              padding: "12px 14px",
            }}
          >
            <div>
              <div style={{ fontSize: 13, color: "#FF3DE8" }}>
                Delete account
              </div>
              <div
                style={{
                  fontFamily: "'DM Mono',monospace",
                  fontSize: 9,
                  color: "#555",
                  marginTop: 2,
                }}
              >
                Permanently remove your studio. No undo.
              </div>
            </div>
            {confirmDelete ? (
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  onClick={() => {
                    showToast("Account deletion cancelled", "info");
                    setConfirmDelete(false);
                  }}
                  style={{
                    padding: "5px 10px",
                    borderRadius: 7,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "transparent",
                    color: "#555",
                    fontFamily: "'DM Mono',monospace",
                    fontSize: 9,
                    transition: "color .15s",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    showToast("Account deleted (simulated)", "error");
                    setConfirmDelete(false);
                  }}
                  style={{
                    padding: "5px 10px",
                    borderRadius: 7,
                    border: "1px solid #FF3DE8",
                    background: "#FF3DE8",
                    color: "#000",
                    fontFamily: "'DM Mono',monospace",
                    fontSize: 9,
                    fontWeight: 700,
                  }}
                >
                  Confirm Delete
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 7,
                  background: "transparent",
                  border: "1px solid #FF3DE8",
                  color: "#FF3DE8",
                  fontFamily: "'DM Mono',monospace",
                  fontSize: 10,
                  fontWeight: 600,
                  transition: "background .15s",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,61,232,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </SettingsCard>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { profile, updateProfile, settings, updateSettings } = useApp();
  const { showToast } = useToast();

  const [section, setSection] = useState("profile");
  const mounted = useRef(false);

  const buildProfileDraft = () => ({
    name: profile?.name || "",
    email: profile?.email || "",
    country: profile?.country || "Egypt 🇪🇬",
    timezone: profile?.timezone || "UTC+2 Cairo",
    studioName: profile?.studioName || "FreelancerStudio",
    tagline: profile?.tagline || "Design · Code · Deliver",
    currency: profile?.currency || "USD $",
  });

  const buildSettingsDraft = () => ({
    accentColor: settings?.accentColor ?? "#C8FF57",
    fontStyle: settings?.fontStyle ?? "Space Mono",
    pixelCharacter: settings?.pixelCharacter !== false,
    tickerBar: settings?.tickerBar !== false,
    animations: settings?.animations !== false,
    compactMode: settings?.compactMode ?? false,
    notifNewClient: settings?.notifNewClient !== false,
    notifTaskComplete: settings?.notifTaskComplete !== false,
    notifRevenueMilestone: settings?.notifRevenueMilestone !== false,
    notifWeeklyDigest: settings?.notifWeeklyDigest ?? false,
    notifOverdueAlert: settings?.notifOverdueAlert !== false,
  });

  const [profileDraft, setProfileDraft] = useState(buildProfileDraft);
  const [stnDraft, setStnDraft] = useState(buildSettingsDraft);
  const [hasChanges, setHasChanges] = useState(false);

  // Track changes after mount
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    setHasChanges(true);
  }, [profileDraft, stnDraft]);

  useEffect(() => {
    document.title = "Settings — Freelancer Studio";
  }, []);

  const activeSec = SECTIONS.find((s) => s.id === section);

  const handleSave = () => {
    updateProfile(
      {
        name: profileDraft.name,
        email: profileDraft.email,
        country: profileDraft.country,
        timezone: profileDraft.timezone,
        studioName: profileDraft.studioName,
        tagline: profileDraft.tagline,
        currency: profileDraft.currency,
      },
      { silent: true },
    );
    updateSettings({
      accentColor: stnDraft.accentColor,
      fontStyle: stnDraft.fontStyle,
      pixelCharacter: stnDraft.pixelCharacter,
      tickerBar: stnDraft.tickerBar,
      animations: stnDraft.animations,
      compactMode: stnDraft.compactMode,
      notifNewClient: stnDraft.notifNewClient,
      notifTaskComplete: stnDraft.notifTaskComplete,
      notifRevenueMilestone: stnDraft.notifRevenueMilestone,
      notifWeeklyDigest: stnDraft.notifWeeklyDigest,
      notifOverdueAlert: stnDraft.notifOverdueAlert,
    });
    setHasChanges(false);
  };

  const handleDiscard = () => {
    setProfileDraft(buildProfileDraft());
    setStnDraft(buildSettingsDraft());
    setHasChanges(false);
    showToast("Changes discarded", "info");
  };

  return (
    <>
      <style>{`
        @keyframes st-pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        .st-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 8px;
          padding: 8px 10px;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: #e0e0e0;
          outline: none;
          transition: border-color .15s;
          box-sizing: border-box;
        }
        .st-input:focus { border-color: rgba(200,255,87,0.4); }
        .st-input option { background: #161619; }
        .st-nav-item {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 14px; border-radius: 0; border: none;
          background: transparent; text-align: left; white-space: nowrap;
          font-family: 'DM Mono', monospace; font-size: 11px;
          color: #555; transition: all .15s; position: relative;
          border-bottom: 2px solid transparent; flex-shrink: 0;
        }
        .st-nav-item:hover { color: #e0e0e0; background: rgba(255,255,255,0.03); }
        .st-nav-item.active { color: #C8FF57; border-bottom-color: #C8FF57; }
        .st-nav-item.danger { color: #555; }
        .st-nav-item.danger:hover { color: #FF3DE8; background: rgba(255,61,232,0.04); }
        .st-nav-item.danger.active { color: #FF3DE8; border-bottom-color: #FF3DE8; }
        .st-nav-dash { display: none; }
      `}</style>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "calc(100vh - 64px)",
          background: "#0a0a0c",
        }}
      >
        {/* ── TOP NAV BAR ── */}
        <div
          style={{
            background: "#161619",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            display: "flex",
            alignItems: "stretch",
            padding: "0 16px",
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
        >
          {/* Label */}
          <div
            style={{
              fontFamily: "'DM Mono',monospace",
              fontSize: 9,
              color: "#333",
              textTransform: "uppercase",
              letterSpacing: ".12em",
              display: "flex",
              alignItems: "center",
              paddingRight: 12,
              borderRight: "1px solid rgba(255,255,255,0.07)",
              marginRight: 4,
              flexShrink: 0,
            }}
          >
            Settings
          </div>

          {SECTIONS.filter((s) => !s.isDanger).map((s) => (
            <button
              key={s.id}
              className={"st-nav-item" + (section === s.id ? " active" : "")}
              onClick={() => setSection(s.id)}
              aria-label={s.label}
            >
              <div className="st-nav-dash" />
              {s.label}
            </button>
          ))}

          {/* Divider */}
          <div
            style={{
              width: 1,
              background: "rgba(255,255,255,0.07)",
              margin: "10px 6px",
              flexShrink: 0,
            }}
          />

          {SECTIONS.filter((s) => s.isDanger).map((s) => (
            <button
              key={s.id}
              className={
                "st-nav-item danger" + (section === s.id ? " active" : "")
              }
              onClick={() => setSection(s.id)}
              aria-label={s.label}
            >
              <div className="st-nav-dash" />
              {s.label}
            </button>
          ))}

          {/* LIVE indicator pushed to right */}
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 5,
              paddingLeft: 12,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#C8FF57",
                animation: "st-pulse 1.5s infinite",
              }}
            />
            <span
              style={{
                fontFamily: "'DM Mono',monospace",
                fontSize: 9,
                color: "#444",
              }}
            >
              LIVE
            </span>
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Scrollable content */}
          <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
            {/* Page header */}
            <div style={{ marginBottom: 20 }}>
              <h1
                style={{
                  fontFamily: "'Syne',sans-serif",
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#f0f0f0",
                  letterSpacing: "-.5px",
                  lineHeight: 1,
                }}
              >
                {activeSec?.title}{" "}
                <span style={{ color: "#C8FF57" }}>Settings</span>
              </h1>
              <p
                style={{
                  fontFamily: "'DM Mono',monospace",
                  fontSize: 11,
                  color: "#555",
                  marginTop: 6,
                }}
              >
                {activeSec?.sub}
              </p>
            </div>

            {/* Pixel walking banner */}
            <PixelBanner speech={activeSec?.speech || "settings? let's go!"} />

            {/* Section panels */}
            {section === "profile" && (
              <ProfileSection draft={profileDraft} onChange={setProfileDraft} />
            )}
            {section === "appearance" && (
              <AppearanceSection draft={stnDraft} onChange={setStnDraft} />
            )}
            {section === "notifications" && (
              <NotificationsSection draft={stnDraft} onChange={setStnDraft} />
            )}
            {section === "shortcuts" && <ShortcutsSection />}
            {section === "billing" && <BillingSection />}
            {section === "danger" && <DangerSection showToast={showToast} />}
          </div>

          {/* ── SAVE BAR ── */}
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.07)",
              padding: "14px 24px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "#161619",
            }}
          >
            <div
              style={{
                flex: 1,
                fontFamily: "'DM Mono',monospace",
                fontSize: 10,
                color: "#444",
              }}
            >
              Pixel says:{" "}
              <span style={{ color: hasChanges ? "#C8FF57" : "#444" }}>
                {hasChanges
                  ? "you have unsaved changes →"
                  : "all changes saved ✓"}
              </span>
            </div>
            <button
              onClick={handleDiscard}
              disabled={!hasChanges}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.1)",
                fontFamily: "'DM Mono',monospace",
                fontSize: 11,
                color: hasChanges ? "#888" : "#333",
                transition: "all .15s",
              }}
              onMouseEnter={(e) => {
                if (hasChanges) {
                  e.currentTarget.style.borderColor = "rgba(200,255,87,0.2)";
                  e.currentTarget.style.color = "#C8FF57";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.color = hasChanges ? "#888" : "#333";
              }}
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              style={{
                padding: "8px 18px",
                borderRadius: 8,
                background: hasChanges ? "#C8FF57" : "rgba(200,255,87,0.15)",
                border: "none",
                fontFamily: "'Syne',sans-serif",
                fontSize: 13,
                fontWeight: 700,
                color: hasChanges ? "#0a0a0c" : "#555",
                transition: "all .15s, transform .15s",
              }}
              onMouseEnter={(e) => {
                if (hasChanges) {
                  e.currentTarget.style.opacity = ".9";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.transform = "none";
              }}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
