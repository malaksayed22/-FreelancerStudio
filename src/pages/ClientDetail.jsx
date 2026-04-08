import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import useLocalStorage from "../hooks/useLocalStorage";

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

function monthlyMock(clientId) {
  const base = Number.parseInt(String(clientId).replace(/\D/g, ""), 10) || 1;
  const months = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];
  return months.map((month, index) => ({
    month,
    value: 400 + ((base * 140 + index * 190) % 1600),
  }));
}

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { clients, projects, tasks, updateClient, deleteClient } = useApp();
  const [notesByClient, setNotesByClient] = useLocalStorage(
    "fs_client_notes",
    {},
  );

  const client = clients.find((item) => item.id === id);
  const [nameDraft, setNameDraft] = useState(client?.name || "");
  const [roleDraft, setRoleDraft] = useState(client?.role || "");
  const [showSaved, setShowSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const saveTimer = useRef(0);

  useEffect(() => {
    document.title = "Clients — Freelancer Studio";
  }, []);

  useEffect(() => {
    setNameDraft(client?.name || "");
    setRoleDraft(client?.role || "");
  }, [client?.name, client?.role]);

  const clientProjects = useMemo(
    () => projects.filter((project) => project.client === client?.name),
    [projects, client?.name],
  );

  const taskCount = useMemo(() => {
    const totalTasks =
      tasks.todo.length + tasks.inProgress.length + tasks.done.length;
    if (clientProjects.length === 0) return 0;
    return Math.round(
      (totalTasks * clientProjects.length) / Math.max(1, projects.length),
    );
  }, [tasks, clientProjects.length, projects.length]);

  const revenue = useMemo(
    () =>
      clientProjects.reduce(
        (sum, project) => sum + Math.round((project.progress || 0) * 90),
        0,
      ) || 1200,
    [clientProjects],
  );

  const chart = useMemo(() => monthlyMock(client?.id || "c1"), [client?.id]);
  const max = Math.max(1, ...chart.map((item) => item.value));

  const pulseSaved = () => {
    setShowSaved(true);
    window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => setShowSaved(false), 1300);
  };

  if (!client) {
    return (
      <main className="p-7">
        <div className="bg-surface rounded-[22px] border border-white/[0.07] p-6">
          <p className="font-body text-[14px] text-muted">Client not found.</p>
        </div>
      </main>
    );
  }

  const noteValue = notesByClient[client.id] || "";
  const av = AVATAR_STYLES[client.colorClass] || AVATAR_STYLES.ca1;
  const sc = STATUS_COLORS[client.status] || STATUS_COLORS.away;

  return (
    <main className="p-7 space-y-4">
      <Link
        to="/clients"
        className="font-mono text-[12px] text-muted hover:text-lime"
      >
        ← Clients
      </Link>

      <section className="bg-surface rounded-[22px] border border-white/[0.07] p-6">
        <div className="flex items-start gap-4">
          <div
            className="w-[80px] h-[80px] rounded-[20px] flex items-center justify-center font-syne text-[24px] font-extrabold"
            style={av}
          >
            {client.initials}
          </div>

          <div className="flex-1 space-y-2">
            <input
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              onBlur={() => {
                updateClient(client.id, { name: nameDraft || client.name });
                pulseSaved();
              }}
              className="w-full bg-transparent border-0 outline-none font-syne text-[30px] font-extrabold text-[#F0F0F8]"
            />

            <input
              value={roleDraft}
              onChange={(e) => setRoleDraft(e.target.value)}
              onBlur={() => {
                updateClient(client.id, { role: roleDraft || client.role });
                pulseSaved();
              }}
              className="w-full bg-transparent border-0 outline-none font-body text-[14px] text-muted"
            />

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const statuses = ["active", "idle", "away"];
                  const idx = statuses.indexOf(client.status);
                  const next = statuses[(idx + 1) % statuses.length];
                  updateClient(client.id, { status: next });
                  pulseSaved();
                }}
                className="font-mono text-[10px] px-3 py-[4px] rounded-full"
                style={{ background: sc.bg, color: sc.color }}
              >
                {sc.label}
              </button>
              <AnimatePresence>
                {showSaved && (
                  <motion.span
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="font-mono text-[10px] text-lime"
                  >
                    Saved ✓
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          ["Revenue", `$${revenue.toLocaleString()}`, "#CAFF00"],
          ["Projects", String(clientProjects.length), "#9B5CFF"],
          ["Tasks", String(taskCount), "#00F5FF"],
        ].map(([label, value, color]) => (
          <div
            key={label}
            className="bg-surface rounded-[16px] border border-white/[0.07] p-4"
          >
            <div className="font-mono text-[10px] uppercase tracking-[1.6px] text-muted mb-2">
              {label}
            </div>
            <div
              className="font-syne text-[28px] font-extrabold"
              style={{ color }}
            >
              {value}
            </div>
          </div>
        ))}
      </section>

      <section className="bg-surface rounded-[22px] border border-white/[0.07] p-6">
        <h2 className="font-syne text-[18px] font-bold text-[#F0F0F8] mb-3">
          Projects
        </h2>
        <div className="space-y-2">
          {clientProjects.map((project) => (
            <div
              key={project.id}
              className="bg-surface2 border border-white/[0.08] rounded-[12px] px-3 py-2 flex items-center justify-between"
            >
              <span className="font-body text-[13px] text-[#F0F0F8]">
                {project.name}
              </span>
              <span className="font-mono text-[10px] text-muted">
                {project.status}
              </span>
            </div>
          ))}
          {clientProjects.length === 0 && (
            <p className="font-mono text-[10px] text-muted">
              No projects for this client yet.
            </p>
          )}
        </div>
      </section>

      <section className="bg-surface rounded-[22px] border border-white/[0.07] p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-syne text-[18px] font-bold text-[#F0F0F8]">
            Notes
          </h2>
          <AnimatePresence>
            {showSaved && (
              <motion.span
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="font-mono text-[10px] text-lime"
              >
                Saved ✓
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <textarea
          value={noteValue}
          onChange={(e) => {
            setNotesByClient((prev) => ({
              ...prev,
              [client.id]: e.target.value,
            }));
            pulseSaved();
          }}
          placeholder="Client notes..."
          className="w-full min-h-[120px] bg-surface2 border border-white/[0.10] rounded-[12px] px-3 py-3 text-[14px] text-[#F0F0F8] outline-none"
          style={{ caretColor: "#CAFF00" }}
        />
      </section>

      <section className="bg-surface rounded-[22px] border border-white/[0.07] p-6">
        <h2 className="font-syne text-[18px] font-bold text-[#F0F0F8] mb-3">
          Earnings
        </h2>
        <div className="flex items-end gap-3" style={{ height: "120px" }}>
          {chart.map((item, idx) => (
            <div
              key={item.month}
              className="flex-1 flex flex-col items-center gap-2"
            >
              <div className="font-mono text-[9px] text-muted">
                ${(item.value / 1000).toFixed(1)}k
              </div>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(item.value / max) * 85}%` }}
                transition={{
                  type: "spring",
                  stiffness: 180,
                  damping: 18,
                  delay: idx * 0.05,
                }}
                className="w-full rounded-t-[6px]"
                style={{
                  background:
                    idx === chart.length - 1
                      ? "#CAFF00"
                      : "rgba(202,255,0,0.25)",
                }}
              />
              <span className="font-mono text-[9px] text-muted">
                {item.month}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface rounded-[22px] border border-[#FF2D78]/30 p-6">
        <h2 className="font-syne text-[18px] font-bold text-[#F0F0F8] mb-3">
          Danger Zone
        </h2>
        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="px-4 py-2 rounded-[10px] font-mono text-[11px]"
            style={{ background: "rgba(255,45,120,0.14)", color: "#FF2D78" }}
          >
            Delete Client
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2"
          >
            <span className="font-mono text-[10px] text-[#FF2D78]">
              Delete this client?
            </span>
            <button
              onClick={() => {
                deleteClient(client.id);
                navigate("/clients");
              }}
              className="font-mono text-[10px] text-[#F0F0F8] px-2"
            >
              Yes
            </button>
            <button
              className="font-mono text-[10px] text-muted px-2"
              onClick={() => setConfirmDelete(false)}
            >
              No
            </button>
          </motion.div>
        )}
      </section>
    </main>
  );
}
