import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useApp } from "./src/context/AppContext";

const COLORS = ["ca1", "ca2", "ca3", "ca4", "ca5"];
const AVATAR_STYLES = {
  ca1: { background: "rgba(202,255,0,0.13)", color: "#CAFF00" },
  ca2: { background: "rgba(255,45,120,0.13)", color: "#FF2D78" },
  ca3: { background: "rgba(0,245,255,0.10)", color: "#00F5FF" },
  ca4: { background: "rgba(155,92,255,0.13)", color: "#9B5CFF" },
  ca5: { background: "rgba(255,107,0,0.13)", color: "#FF6B00" },
};
const STATUS_COLORS = {
  active: { bg: "rgba(202,255,0,0.10)", color: "#CAFF00", label: "Active" },
  idle: { bg: "rgba(255,107,0,0.12)", color: "#FF6B00", label: "Idle" },
  away: {
    bg: "rgba(255,255,255,0.06)",
    color: "rgba(240,240,248,0.42)",
    label: "Away",
  },
};

const FILTERS = ["All", "Active", "Idle", "Away"];
const SORTS = ["By Revenue", "By Name", "By Status"];

function getRevenue(client, projects) {
  const byProjects = projects
    .filter((project) => project.client === client.name)
    .reduce(
      (sum, project) => sum + Math.round((project.progress || 0) * 90),
      0,
    );
  const base = Number.parseInt(String(client.id).replace(/\D/g, ""), 10) || 1;
  return byProjects > 0 ? byProjects : base * 320 + 800;
}

export default function Clients() {
  const navigate = useNavigate();
  const { clients, projects, addClient, deleteClient } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", status: "active" });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("By Revenue");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    document.title = "Clients — Freelancer Studio";
  }, []);

  useEffect(() => {
    const handler = () => setShowForm(true);
    window.addEventListener("fs:new-client", handler);
    return () => window.removeEventListener("fs:new-client", handler);
  }, []);

  const withRevenue = useMemo(
    () =>
      clients.map((client) => ({
        ...client,
        revenue: getRevenue(client, projects),
      })),
    [clients, projects],
  );

  const maxRevenue = useMemo(
    () => Math.max(1, ...withRevenue.map((client) => client.revenue || 0)),
    [withRevenue],
  );

  const visibleClients = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = withRevenue.filter((client) => {
      const matchesSearch =
        !q ||
        client.name.toLowerCase().includes(q) ||
        (client.role || "").toLowerCase().includes(q);
      const matchesFilter =
        filter === "All" || client.status === filter.toLowerCase();
      return matchesSearch && matchesFilter;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "By Name") return a.name.localeCompare(b.name);
      if (sortBy === "By Status")
        return (a.status || "").localeCompare(b.status || "");
      return (b.revenue || 0) - (a.revenue || 0);
    });
  }, [withRevenue, search, filter, sortBy]);

  const handleAddClient = () => {
    if (!form.name.trim()) return;
    const initials = form.name
      .trim()
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    const colorClass = COLORS[clients.length % COLORS.length];
    addClient({
      id: `c${Date.now()}`,
      initials,
      name: form.name.trim(),
      role: form.role.trim() || "Client",
      status: form.status,
      colorClass,
    });
    setForm({ name: "", role: "", status: "active" });
    setShowForm(false);
  };

  return (
    <main className="p-7 overflow-x-hidden">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-syne font-extrabold text-[28px] tracking-tight text-[#F0F0F8]">
          Clients
        </h1>
        <button
          className="font-mono text-[11px] font-bold px-5 py-2 rounded-full text-bg"
          style={{ background: "#CAFF00", cursor: "none" }}
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? "✕ Cancel" : "+ Add Client"}
        </button>
      </div>

      <div className="mb-5 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search clients..."
          className="bg-surface border border-white/[0.10] rounded-[12px] px-4 py-3 text-[13px] text-[#F0F0F8] outline-none"
          style={{ caretColor: "#CAFF00" }}
        />

        <div className="flex flex-wrap gap-2 justify-start md:justify-end">
          {FILTERS.map((label) => (
            <button
              key={label}
              onClick={() => setFilter(label)}
              className="font-mono text-[10px] uppercase tracking-[1.2px] px-3 py-[6px] rounded-full border"
              style={{
                background: filter === label ? "#CAFF00" : "transparent",
                color: filter === label ? "#0A0A0F" : "rgba(240,240,248,0.6)",
                borderColor:
                  filter === label ? "#CAFF00" : "rgba(255,255,255,0.10)",
              }}
            >
              {label}
            </button>
          ))}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-surface border border-white/[0.10] rounded-[10px] px-3 py-2 font-mono text-[11px] text-[#F0F0F8] outline-none"
          >
            {SORTS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            className="bg-surface border border-white/[0.07] rounded-[18px] p-6 mb-5 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {[
              {
                key: "name",
                placeholder: "Client / Company name",
                label: "Name",
              },
              {
                key: "role",
                placeholder: "e.g. E-commerce, SaaS",
                label: "Role / Industry",
              },
            ].map(({ key, placeholder, label }) => (
              <div key={key}>
                <div className="font-mono text-[10px] uppercase tracking-[2px] text-muted mb-2">
                  {label}
                </div>
                <input
                  className="w-full bg-surface2 border border-white/[0.07] rounded-[10px] px-3 py-2 text-[13px] text-[#F0F0F8] outline-none"
                  style={{ caretColor: "#CAFF00" }}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                />
              </div>
            ))}
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[2px] text-muted mb-2">
                Status
              </div>
              <select
                className="w-full bg-surface2 border border-white/[0.07] rounded-[10px] px-3 py-2 text-[13px] text-[#F0F0F8] outline-none"
                value={form.status}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, status: e.target.value }))
                }
              >
                <option value="active">Active</option>
                <option value="idle">Idle</option>
                <option value="away">Away</option>
              </select>
            </div>
            <div className="md:col-span-3 flex justify-end">
              <button
                className="font-mono text-[11px] font-bold px-6 py-2 rounded-full text-bg"
                style={{ background: "#CAFF00", cursor: "none" }}
                onClick={handleAddClient}
              >
                Save Client →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
      >
        <AnimatePresence>
          {visibleClients.map((client) => {
            const av = AVATAR_STYLES[client.colorClass] || AVATAR_STYLES.ca1;
            const sc = STATUS_COLORS[client.status] || STATUS_COLORS.away;
            const pct = Math.round(((client.revenue || 0) / maxRevenue) * 100);
            return (
              <motion.div
                key={client.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.88, y: -10 }}
                transition={{ type: "spring", stiffness: 220, damping: 24 }}
                whileHover={{ y: -5, borderColor: "rgba(255,255,255,0.16)" }}
                className="bg-surface border border-white/[0.07] rounded-[18px] p-5 flex flex-col gap-4 relative group"
                style={{
                  cursor: "none",
                  borderColor: "rgba(255,255,255,0.07)",
                }}
              >
                <button
                  onClick={() => navigate(`/clients/${client.id}`)}
                  className="absolute inset-0"
                  aria-label={`Open ${client.name}`}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmDeleteId(client.id);
                  }}
                  className="absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold opacity-0 group-hover:opacity-100 transition-opacity z-[2]"
                  style={{
                    background: "rgba(255,45,120,0.15)",
                    color: "#FF2D78",
                    cursor: "none",
                  }}
                >
                  ✕
                </button>
                <div className="flex items-center gap-3 relative z-[1]">
                  <div
                    className="w-12 h-12 rounded-[14px] flex items-center justify-center font-syne text-[15px] font-extrabold"
                    style={av}
                  >
                    {client.initials}
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-[#F0F0F8]">
                      {client.name}
                    </div>
                    <div className="font-mono text-[11px] text-muted">
                      {client.role}
                    </div>
                  </div>
                </div>
                <div className="relative z-[1]">
                  <div className="flex items-center justify-between mb-[6px]">
                    <span className="font-mono text-[10px] text-muted">
                      Revenue
                    </span>
                    <span
                      className="font-mono text-[10px]"
                      style={{ color: "#CAFF00" }}
                    >
                      ${client.revenue.toLocaleString()}
                    </span>
                  </div>
                  <div
                    className="h-[3px] rounded-full overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{
                        type: "spring",
                        stiffness: 220,
                        damping: 26,
                      }}
                      style={{ background: "#CAFF00" }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between relative z-[1]">
                  <span
                    className="font-mono text-[10px] px-3 py-[3px] rounded-full"
                    style={{ background: sc.bg, color: sc.color }}
                  >
                    {sc.label}
                  </span>
                  <span className="font-mono text-[10px] text-muted">
                    View →
                  </span>
                </div>
                <AnimatePresence>
                  {confirmDeleteId === client.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute inset-x-4 bottom-4 z-[3] flex items-center justify-between rounded-[10px] bg-[#1C1C28] border border-[#FF2D78]/40 px-3 py-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="font-mono text-[10px] text-[#FF2D78]">
                        Delete client?
                      </span>
                      <div className="flex gap-2">
                        <button
                          className="font-mono text-[10px] text-[#F0F0F8] px-2"
                          onClick={() => {
                            deleteClient(client.id);
                            setConfirmDeleteId(null);
                          }}
                        >
                          Yes
                        </button>
                        <button
                          className="font-mono text-[10px] text-muted px-2"
                          onClick={() => setConfirmDeleteId(null)}
                        >
                          No
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}
