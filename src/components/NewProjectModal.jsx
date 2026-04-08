import { useState, useEffect, useRef } from "react";

const COLORS = [
  { hex: "#c8f135", label: "Lime", name: "Lime" },
  { hex: "#ff3eac", label: "Pink", name: "Pink" },
  { hex: "#00eaff", label: "Cyan", name: "Cyan" },
  { hex: "#ff7a00", label: "Orange", name: "Orange" },
  { hex: "#a855f7", label: "Purple", name: "Purple" },
  { hex: "#f59e0b", label: "Amber", name: "Amber" },
];

const STATUSES = [
  {
    label: "Planning",
    key: "planning",
    bg: "rgba(255,62,172,0.12)",
    border: "rgba(255,62,172,0.3)",
    color: "#ff3eac",
    icon: "○",
  },
  {
    label: "In Progress",
    key: "progress",
    bg: "rgba(200,241,53,0.10)",
    border: "rgba(200,241,53,0.3)",
    color: "#c8f135",
    icon: "◐",
  },
  {
    label: "In Review",
    key: "review",
    bg: "rgba(0,234,255,0.08)",
    border: "rgba(0,234,255,0.25)",
    color: "#00eaff",
    icon: "◑",
  },
  {
    label: "Done",
    key: "done",
    bg: "rgba(255,255,255,0.06)",
    border: "rgba(255,255,255,0.12)",
    color: "#888",
    icon: "●",
  },
];

const PRIORITIES = [
  {
    label: "Low",
    key: "low",
    bg: "rgba(255,255,255,0.06)",
    border: "rgba(255,255,255,0.1)",
    color: "#666",
    icon: "↓",
  },
  {
    label: "Medium",
    key: "medium",
    bg: "rgba(200,241,53,0.10)",
    border: "rgba(200,241,53,0.3)",
    color: "#c8f135",
    icon: "→",
  },
  {
    label: "High",
    key: "high",
    bg: "rgba(255,122,0,0.1)",
    border: "rgba(255,122,0,0.3)",
    color: "#ff7a00",
    icon: "↑",
  },
  {
    label: "Critical",
    key: "critical",
    bg: "rgba(255,62,172,0.12)",
    border: "rgba(255,62,172,0.3)",
    color: "#ff3eac",
    icon: "⚠",
  },
];

const s = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.75)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "24px 16px",
    animation: "fadeIn 0.2s ease",
  },
  modal: {
    background: "linear-gradient(135deg, #12151d 0%, #0d0f14 100%)",
    border: "1px solid rgba(200,241,53,0.12)",
    borderRadius: 20,
    width: "100%",
    maxWidth: 560,
    fontFamily: "'Space Grotesk', sans-serif",
    overflow: "hidden",
    boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(200,241,53,0.05)",
    animation: "modalSlideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
  accentBar: {
    height: 3,
    background: "linear-gradient(90deg, #c8f135 0%, #a0d820 100%)",
    boxShadow: "0 0 20px rgba(200,241,53,0.3)",
  },
  header: {
    padding: "28px 32px 24px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  title: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 24,
    fontWeight: 800,
    background: "linear-gradient(135deg, #e8e8e8 0%, #c8c8c8 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    letterSpacing: "-0.03em",
    lineHeight: 1,
    margin: 0,
  },
  sub: {
    fontSize: 10,
    color: "#4a5568",
    marginTop: 7,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#555",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    flexShrink: 0,
    transition: "all 0.2s",
  },
  stepBar: {
    display: "flex",
    alignItems: "center",
    padding: "0 32px",
    height: 50,
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    background: "rgba(0,0,0,0.2)",
  },
  stepLine: (filled) => ({
    flex: 1,
    height: 2,
    background: filled
      ? "linear-gradient(90deg, rgba(200,241,53,0.3) 0%, rgba(200,241,53,0.15) 100%)"
      : "#1a1e28",
    margin: "0 10px",
    transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
    borderRadius: 2,
  }),
  body: {
    padding: "32px 32px 28px",
    display: "flex",
    flexDirection: "column",
    gap: 22,
  },
  fieldRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  field: { display: "flex", flexDirection: "column", gap: 8 },
  label: {
    fontSize: 10,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    fontWeight: 700,
    color: "#4a5568",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  input: {
    background: "#0a0c10",
    border: "1px solid #1a1e28",
    borderRadius: 12,
    padding: "12px 14px",
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 14,
    color: "#d8d8d8",
    outline: "none",
    width: "100%",
    transition: "all 0.2s",
    fontWeight: 500,
  },
  textarea: {
    background: "#0a0c10",
    border: "1px solid #1a1e28",
    borderRadius: 12,
    padding: "12px 14px",
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 13,
    color: "#d8d8d8",
    outline: "none",
    width: "100%",
    resize: "none",
    height: 90,
    lineHeight: 1.7,
    transition: "all 0.2s",
    fontWeight: 400,
  },
  pillsWrap: { display: "flex", gap: 8, flexWrap: "wrap" },
  footer: {
    padding: "20px 32px 28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderTop: "1px solid rgba(255,255,255,0.05)",
    background: "rgba(0,0,0,0.2)",
  },
  cancelBtn: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 12,
    fontWeight: 600,
    color: "#4a5568",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "10px 6px",
    transition: "all 0.2s",
    letterSpacing: "0.05em",
    display: "flex",
    alignItems: "center",
    gap: 6,
    textTransform: "uppercase",
  },
  createBtn: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 13,
    fontWeight: 700,
    color: "#0a0c10",
    background: "linear-gradient(135deg, #c8f135 0%, #b0d820 100%)",
    border: "none",
    borderRadius: 100,
    padding: "12px 32px",
    cursor: "pointer",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    display: "flex",
    alignItems: "center",
    gap: 10,
    transition: "all 0.2s",
    boxShadow: "0 4px 16px rgba(200,241,53,0.25)",
    position: "relative",
    overflow: "hidden",
  },
  btnIcon: {
    width: 18,
    height: 18,
    background: "rgba(0,0,0,0.2)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 700,
  },
  summaryCard: {
    border: "1px solid rgba(200,241,53,0.2)",
    borderRadius: 16,
    padding: 24,
    background:
      "linear-gradient(135deg, rgba(200,241,53,0.05) 0%, rgba(200,241,53,0.02) 100%)",
    boxShadow: "0 0 30px rgba(200,241,53,0.08)",
  },
  summaryLabel: {
    fontSize: 11,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    fontWeight: 800,
    color: "#c8f135",
    marginBottom: 18,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 28,
  },
  summaryKey: {
    fontSize: 11,
    color: "#4a5568",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontWeight: 700,
  },
  summaryVal: { fontSize: 14, color: "#d8d8d8", fontWeight: 600 },
  divider: {
    height: 1,
    background:
      "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)",
    margin: "10px 0",
  },
};

// Modern Client Selector Component
function ClientSelector({ selected, onSelect, clients = [], onAddNew }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewClientInput, setShowNewClientInput] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const clientList =
    clients.length > 0
      ? clients
      : [
          "Nexora Labs",
          "VELORA Fashion",
          "Avante Studio",
          "PulseMedia",
          "Rexon Finance",
        ];

  const filteredClients = clientList.filter((c) =>
    c.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearchTerm("");
        setShowNewClientInput(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (showNewClientInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showNewClientInput]);

  const handleAddNewClient = () => {
    if (newClientName.trim()) {
      onAddNew?.(newClientName.trim());
      onSelect(newClientName.trim());
      setNewClientName("");
      setShowNewClientInput(false);
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddNewClient();
    } else if (e.key === "Escape") {
      setShowNewClientInput(false);
      setNewClientName("");
    }
  };

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          ...s.input,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: isOpen ? "#12151d" : "#0a0c10",
          borderColor: isOpen ? "rgba(200,241,53,0.3)" : "#1a1e28",
          color: selected ? "#d8d8d8" : "#555",
        }}
      >
        <span
          style={{
            flex: 1,
            textAlign: "left",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {selected || "Select client"}
        </span>
        <span
          style={{
            fontSize: 10,
            transition: "transform 0.2s",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            color: "#4a5568",
          }}
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            background: "#0f1318",
            border: "1px solid rgba(200,241,53,0.2)",
            borderRadius: 12,
            overflow: "hidden",
            zIndex: 1000,
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(200,241,53,0.1)",
            animation: "dropdownSlide 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
            maxHeight: 280,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Search Input */}
          <div
            style={{
              padding: "8px 10px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <input
              type="text"
              placeholder="🔍 Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                background: "#0a0c10",
                border: "1px solid #1a1e28",
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: 12,
                color: "#d8d8d8",
                outline: "none",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Client List */}
          <div style={{ maxHeight: 180, overflowY: "auto" }}>
            {filteredClients.length > 0 ? (
              filteredClients.map((client, i) => (
                <button
                  key={client}
                  onClick={() => {
                    onSelect(client);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    background:
                      selected === client
                        ? "rgba(200,241,53,0.08)"
                        : "transparent",
                    border: "none",
                    borderTop:
                      i > 0 ? "1px solid rgba(255,255,255,0.03)" : "none",
                    color: selected === client ? "#c8f135" : "#d8d8d8",
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: 13,
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: selected === client ? 600 : 500,
                    transition: "all 0.15s",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                  onMouseEnter={(e) => {
                    if (selected !== client) {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.04)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selected !== client) {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: selected === client ? "#c8f135" : "#2a3040",
                      flexShrink: 0,
                    }}
                  />
                  {client}
                  {selected === client && (
                    <span style={{ marginLeft: "auto", fontSize: 10 }}>✓</span>
                  )}
                </button>
              ))
            ) : (
              <div
                style={{
                  padding: "16px",
                  textAlign: "center",
                  color: "#4a5568",
                  fontSize: 12,
                }}
              >
                No clients found
              </div>
            )}
          </div>

          {/* Add New Client Section */}
          <div
            style={{
              borderTop: "1px solid rgba(200,241,53,0.15)",
              background: "rgba(200,241,53,0.03)",
            }}
          >
            {!showNewClientInput ? (
              <button
                onClick={() => setShowNewClientInput(true)}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  background: "transparent",
                  border: "none",
                  color: "#c8f135",
                  textAlign: "left",
                  cursor: "pointer",
                  fontSize: 12,
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  transition: "all 0.15s",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  letterSpacing: "0.03em",
                  textTransform: "uppercase",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(200,241,53,0.08)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <span style={{ fontSize: 14, fontWeight: 400 }}>+</span>
                Add New Client
              </button>
            ) : (
              <div style={{ padding: "10px", display: "flex", gap: 6 }}>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Client name..."
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  style={{
                    flex: 1,
                    background: "#0a0c10",
                    border: "1px solid rgba(200,241,53,0.3)",
                    borderRadius: 8,
                    padding: "8px 12px",
                    fontSize: 12,
                    color: "#d8d8d8",
                    outline: "none",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                />
                <button
                  onClick={handleAddNewClient}
                  style={{
                    padding: "8px 16px",
                    background: "#c8f135",
                    border: "none",
                    borderRadius: 8,
                    color: "#0a0c10",
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "'Space Grotesk', sans-serif",
                    textTransform: "uppercase",
                    letterSpacing: "0.03em",
                  }}
                  disabled={!newClientName.trim()}
                >
                  Add
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes dropdownSlide {
          from { opacity: 0; transform: translateY(-8px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

function StepIndicator({ current }) {
  const steps = [{ label: "Info" }, { label: "Schedule" }, { label: "Launch" }];

  return (
    <div style={s.stepBar}>
      {steps.map((step, i) => {
        const n = i + 1;
        const isActive = n === current;
        const isDone = n < current;
        return (
          <div
            key={step.label}
            style={{
              display: "flex",
              alignItems: "center",
              flex: i < 2 ? "0 0 auto" : undefined,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 11,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: isActive ? "#c8f135" : isDone ? "#6a7488" : "#353945",
                paddingRight: i < 2 ? 10 : 0,
                transition: "all 0.3s",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  fontSize: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  flexShrink: 0,
                  transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  background: isActive
                    ? "linear-gradient(135deg, #c8f135 0%, #b0d820 100%)"
                    : isDone
                      ? "rgba(200,241,53,0.15)"
                      : "#1a1e28",
                  border: `2px solid ${isActive ? "#c8f135" : isDone ? "rgba(200,241,53,0.3)" : "#2a3040"}`,
                  color: isActive ? "#0a0c10" : isDone ? "#c8f135" : "#4a5568",
                  boxShadow: isActive
                    ? "0 4px 16px rgba(200,241,53,0.3)"
                    : "none",
                  transform: isActive ? "scale(1.05)" : "scale(1)",
                }}
              >
                {isDone ? "✓" : n}
              </div>
              <span
                style={{ display: window.innerWidth < 500 ? "none" : "inline" }}
              >
                {step.label}
              </span>
            </div>
            {i < 2 && <div style={s.stepLine(n < current)} />}
          </div>
        );
      })}
    </div>
  );
}

function PillSelector({ options, selected, onSelect }) {
  return (
    <div style={s.pillsWrap}>
      {options.map((opt) => {
        const isSelected = selected === opt.key;
        return (
          <button
            key={opt.key}
            onClick={() => onSelect(opt.key)}
            style={{
              padding: "8px 16px",
              borderRadius: 100,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.03em",
              cursor: "pointer",
              transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
              fontFamily: "'Space Grotesk', sans-serif",
              background: isSelected ? opt.bg : "#0a0c10",
              border: `1.5px solid ${isSelected ? opt.border : "#1a1e28"}`,
              color: isSelected ? opt.color : "#555",
              display: "flex",
              alignItems: "center",
              gap: 6,
              transform: isSelected ? "scale(1.02)" : "scale(1)",
              boxShadow: isSelected ? `0 0 16px ${opt.color}20` : "none",
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.borderColor = opt.border;
                e.currentTarget.style.color = opt.color;
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.borderColor = "#1a1e28";
                e.currentTarget.style.color = "#555";
              }
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function ColorPicker({ selected, onSelect }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      {COLORS.map((c) => {
        const isSelected = selected === c.hex;
        return (
          <button
            key={c.hex}
            onClick={() => onSelect(c.hex)}
            title={c.label}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: c.hex,
              border: "3px solid transparent",
              cursor: "pointer",
              padding: 0,
              transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
              transform: isSelected ? "scale(1.2)" : "scale(1)",
              boxShadow: isSelected
                ? `0 0 0 3px #12151d, 0 0 0 5px ${c.hex}, 0 4px 16px ${c.hex}60`
                : "0 2px 8px rgba(0,0,0,0.3)",
              position: "relative",
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.transform = "scale(1.1)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.transform = "scale(1)";
              }
            }}
          />
        );
      })}
    </div>
  );
}

function InfoPage({ form, onChange, clients = [], onAddNewClient }) {
  return (
    <div style={s.body}>
      <div style={s.fieldRow}>
        <div style={s.field}>
          <div style={s.label}>Project Name</div>
          <input
            style={s.input}
            type="text"
            placeholder="e.g. VELORA Redesign"
            value={form.name}
            onChange={(e) => onChange("name", e.target.value)}
            onFocus={(e) => {
              e.target.style.borderColor = "rgba(200,241,53,0.4)";
              e.target.style.background = "#12151d";
              e.target.style.boxShadow = "0 0 0 3px rgba(200,241,53,0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#1a1e28";
              e.target.style.background = "#0a0c10";
              e.target.style.boxShadow = "none";
            }}
            autoFocus
          />
        </div>
        <div style={s.field}>
          <div style={s.label}>Client</div>
          <ClientSelector
            selected={form.client}
            onSelect={(client) => onChange("client", client)}
            clients={clients}
            onAddNew={onAddNewClient}
          />
        </div>
      </div>

      <div style={s.field}>
        <div style={s.label}>Status</div>
        <PillSelector
          options={STATUSES}
          selected={form.status}
          onSelect={(v) => onChange("status", v)}
        />
      </div>

      <div style={s.field}>
        <div style={s.label}>Color Tag</div>
        <ColorPicker
          selected={form.color}
          onSelect={(v) => onChange("color", v)}
        />
      </div>

      <div style={s.field}>
        <div style={s.label}>
          Description
          <span style={{ color: "#2a3040", fontSize: 9, fontWeight: 500 }}>
            (Optional)
          </span>
        </div>
        <textarea
          style={s.textarea}
          placeholder="What's this project about? Key objectives, deliverables, scope..."
          value={form.description}
          onChange={(e) => onChange("description", e.target.value)}
          onFocus={(e) => {
            e.target.style.borderColor = "rgba(200,241,53,0.4)";
            e.target.style.background = "#12151d";
            e.target.style.boxShadow = "0 0 0 3px rgba(200,241,53,0.1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#1a1e28";
            e.target.style.background = "#0a0c10";
            e.target.style.boxShadow = "none";
          }}
        />
      </div>
    </div>
  );
}

function SchedulePage({ form, onChange }) {
  return (
    <div style={s.body}>
      <div style={s.fieldRow}>
        <div style={s.field}>
          <div style={s.label}>Start Date</div>
          <div style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#4a5568",
                pointerEvents: "none",
                zIndex: 1,
              }}
            >
              From
            </span>
            <input
              type="date"
              style={{ ...s.input, paddingLeft: 52, colorScheme: "dark" }}
              value={form.startDate}
              onChange={(e) => onChange("startDate", e.target.value)}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(200,241,53,0.4)";
                e.target.style.background = "#12151d";
                e.target.style.boxShadow = "0 0 0 3px rgba(200,241,53,0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#1a1e28";
                e.target.style.background = "#0a0c10";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
        </div>
        <div style={s.field}>
          <div style={s.label}>Due Date</div>
          <div style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#4a5568",
                pointerEvents: "none",
                zIndex: 1,
              }}
            >
              To
            </span>
            <input
              type="date"
              style={{ ...s.input, paddingLeft: 52, colorScheme: "dark" }}
              value={form.dueDate}
              onChange={(e) => onChange("dueDate", e.target.value)}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(200,241,53,0.4)";
                e.target.style.background = "#12151d";
                e.target.style.boxShadow = "0 0 0 3px rgba(200,241,53,0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#1a1e28";
                e.target.style.background = "#0a0c10";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
        </div>
      </div>

      <div style={s.field}>
        <div style={s.label}>Priority Level</div>
        <PillSelector
          options={PRIORITIES}
          selected={form.priority}
          onSelect={(v) => onChange("priority", v)}
        />
      </div>

      <div style={s.field}>
        <div style={s.label}>
          Estimated Budget
          <span style={{ color: "#2a3040", fontSize: 9, fontWeight: 500 }}>
            (Optional)
          </span>
        </div>
        <div style={{ position: "relative" }}>
          <span
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 16,
              fontWeight: 700,
              color: "#4a5568",
              pointerEvents: "none",
            }}
          >
            $
          </span>
          <input
            type="number"
            style={{ ...s.input, paddingLeft: 32 }}
            placeholder="0.00"
            value={form.budget}
            onChange={(e) => onChange("budget", e.target.value)}
            onFocus={(e) => {
              e.target.style.borderColor = "rgba(200,241,53,0.4)";
              e.target.style.background = "#12151d";
              e.target.style.boxShadow = "0 0 0 3px rgba(200,241,53,0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#1a1e28";
              e.target.style.background = "#0a0c10";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
      </div>

      <div
        style={{
          padding: "14px 18px",
          background: "rgba(200,241,53,0.05)",
          border: "1px solid rgba(200,241,53,0.15)",
          borderRadius: 12,
          fontSize: 11,
          color: "#6a7488",
          lineHeight: 1.6,
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
        }}
      >
        <span>
          Set realistic timelines and budget to track project health. You can
          always adjust these later in the project dashboard.
        </span>
      </div>
    </div>
  );
}

function LaunchPage({ form }) {
  const statusObj = STATUSES.find((s) => s.key === form.status) || STATUSES[1];
  const priorityObj =
    PRIORITIES.find((p) => p.key === form.priority) || PRIORITIES[1];
  const colorObj = COLORS.find((c) => c.hex === form.color) || COLORS[0];

  const rows = [
    { key: "Project", val: form.name || "Untitled Project" },
    { key: "Client", val: form.client || "No Client" },
    {
      key: "Status",
      val: (
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            padding: "4px 12px",
            borderRadius: 100,
            background: statusObj.bg,
            color: statusObj.color,
            border: `1.5px solid ${statusObj.border}`,
          }}
        >
          {statusObj.label}
        </span>
      ),
    },
    {
      key: "Priority",
      val: (
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            padding: "4px 12px",
            borderRadius: 100,
            background: priorityObj.bg,
            color: priorityObj.color,
            border: `1.5px solid ${priorityObj.border}`,
          }}
        >
          {priorityObj.label}
        </span>
      ),
    },
    { key: "Start", val: form.startDate || "Not set" },
    { key: "Due", val: form.dueDate || "Not set" },
    {
      key: "Budget",
      val: form.budget ? `$${Number(form.budget).toLocaleString()}` : "Not set",
    },
    {
      key: "Color",
      val: (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, color: "#6a7488", fontWeight: 600 }}>
            {colorObj.name}
          </span>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: form.color,
              flexShrink: 0,
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div style={s.body}>
      <div style={s.summaryCard}>
        <div style={s.summaryLabel}>Summary</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {rows.map((row, i) => (
            <div key={row.key}>
              <div style={s.summaryRow}>
                <span style={s.summaryKey}>{row.key}</span>
                <span style={s.summaryVal}>{row.val}</span>
              </div>
              {i < rows.length - 1 && <div style={s.divider} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function NewProjectModal({
  onClose,
  onSubmit,
  clients = [],
  onAddNewClient,
}) {
  const [step, setStep] = useState(1);
  const [launched, setLaunched] = useState(false);
  const [form, setForm] = useState({
    name: "",
    client: "",
    status: "progress",
    color: "#c8f135",
    description: "",
    startDate: "",
    dueDate: "",
    priority: "medium",
    budget: "",
  });

  const onChange = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleLeft = () => {
    if (step === 1) onClose?.();
    else setStep((s) => s - 1);
  };

  const handleRight = () => {
    if (step < 3) {
      setStep((s) => s + 1);
    } else {
      setLaunched(true);
      setTimeout(() => {
        onSubmit?.(form);
        onClose?.();
      }, 800);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Enter key for next/launch on steps 2-3
      if (e.key === "Enter" && !e.shiftKey && step >= 2) {
        e.preventDefault();
        handleRight();
      }
      // Left arrow for back
      if (e.key === "ArrowLeft" && !e.target.matches("input, textarea")) {
        e.preventDefault();
        handleLeft();
      }
      // Escape to close
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [step, launched]);

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

      <div
        style={s.overlay}
        onClick={(e) => e.target === e.currentTarget && onClose?.()}
      >
        <div style={s.modal}>
          {/* Accent line */}
          <div style={s.accentBar} />

          {/* Header */}
          <div style={s.header}>
            <div>
              <h2 style={s.title}>New Project</h2>
              <p style={s.sub}>Define your next mission</p>
            </div>
            <button
              style={s.closeBtn}
              onClick={onClose}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                e.currentTarget.style.color = "#888";
                e.currentTarget.style.transform = "rotate(90deg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                e.currentTarget.style.color = "#555";
                e.currentTarget.style.transform = "rotate(0deg)";
              }}
            >
              ✕
            </button>
          </div>

          {/* Step bar */}
          <StepIndicator current={step} />

          {/* Pages */}
          {step === 1 && (
            <InfoPage
              form={form}
              onChange={onChange}
              clients={clients}
              onAddNewClient={onAddNewClient}
            />
          )}
          {step === 2 && <SchedulePage form={form} onChange={onChange} />}
          {step === 3 && <LaunchPage form={form} />}

          {/* Footer */}
          <div style={s.footer}>
            <button
              style={s.cancelBtn}
              onClick={handleLeft}
              onMouseEnter={(e) => {
                e.target.style.color = "#888";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = "#4a5568";
              }}
            >
              {step === 1 ? (
                <>
                  <span style={{ fontSize: 12 }}>✕</span>
                  Cancel
                </>
              ) : (
                <>
                  <span style={{ fontSize: 12 }}>←</span>
                  Back
                </>
              )}
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Progress dots */}
              <div style={{ display: "flex", gap: 6 }}>
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    style={{
                      width: n === step ? 20 : 6,
                      height: 6,
                      borderRadius: 100,
                      background:
                        n === step
                          ? "linear-gradient(90deg, #c8f135 0%, #b0d820 100%)"
                          : n < step
                            ? "rgba(200,241,53,0.4)"
                            : "#1a1e28",
                      transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      boxShadow:
                        n === step ? "0 0 12px rgba(200,241,53,0.4)" : "none",
                    }}
                  />
                ))}
              </div>

              <button
                style={{
                  ...s.createBtn,
                  background: launched
                    ? "linear-gradient(135deg, #d5ff50 0%, #c8f135 100%)"
                    : "linear-gradient(135deg, #c8f135 0%, #b0d820 100%)",
                  pointerEvents: launched ? "none" : "auto",
                }}
                onClick={handleRight}
                onMouseEnter={(e) => {
                  if (!launched) {
                    e.currentTarget.style.transform =
                      "translateY(-2px) scale(1.02)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 24px rgba(200,241,53,0.4)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 16px rgba(200,241,53,0.25)";
                }}
                onMouseDown={(e) =>
                  !launched &&
                  (e.currentTarget.style.transform =
                    "translateY(0) scale(0.98)")
                }
                onMouseUp={(e) =>
                  !launched &&
                  (e.currentTarget.style.transform =
                    "translateY(-2px) scale(1.02)")
                }
              >
                {launched
                  ? "Launching..."
                  : step === 3
                    ? "Launch Project"
                    : "Continue"}
                <div style={s.btnIcon}>{launched ? "✓" : "→"}</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
