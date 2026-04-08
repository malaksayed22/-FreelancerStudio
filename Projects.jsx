import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "./src/context/AppContext";
import NewProjectModal from "./src/components/NewProjectModal";

const STATUS_COLORS = {
  "In Progress": { bg: "rgba(155,92,255,0.12)", color: "#9B5CFF" },
  Planning: { bg: "rgba(0,245,255,0.10)", color: "#00F5FF" },
  Review: { bg: "rgba(255,107,0,0.12)", color: "#FF6B00" },
  Done: { bg: "rgba(202,255,0,0.10)", color: "#CAFF00" },
};

const STATUS_FILTERS = ["All", "In Progress", "Planning", "Review", "Done"];
const SORT_OPTIONS = ["By Due Date", "By Progress", "By Client", "By Name"];

function compareProjects(sortBy, a, b) {
  if (sortBy === "By Progress") return (b.progress || 0) - (a.progress || 0);
  if (sortBy === "By Client")
    return (a.client || "").localeCompare(b.client || "");
  if (sortBy === "By Name") return (a.name || "").localeCompare(b.name || "");
  const da = new Date(a.due || a.dueDate || "9999-12-31").getTime();
  const db = new Date(b.due || b.dueDate || "9999-12-31").getTime();
  return da - db;
}

export default function Projects() {
  const navigate = useNavigate();
  const {
    projects,
    clients,
    addProject,
    addClient,
    archiveProject,
    deleteProject,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("By Due Date");
  const [menuOpenFor, setMenuOpenFor] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [isNewOpen, setIsNewOpen] = useState(false);

  useEffect(() => {
    document.title = "Projects — Freelancer Studio";
  }, []);

  useEffect(() => {
    const handler = () => setIsNewOpen(true);
    window.addEventListener("fs:new-project", handler);
    return () => window.removeEventListener("fs:new-project", handler);
  }, []);

  const visibleProjects = useMemo(() => {
    const filtered = projects.filter((project) => {
      if (project.archived) return false;
      return statusFilter === "All" || project.status === statusFilter;
    });
    return [...filtered].sort((a, b) => compareProjects(sortBy, a, b));
  }, [projects, statusFilter, sortBy]);

  const createProject = (formData) => {
    // Map status keys from new modal to old format
    const statusMap = {
      planning: "Planning",
      progress: "In Progress",
      review: "Review",
      done: "Done",
    };

    const id = `p${Date.now()}`;
    addProject({
      id,
      name: formData.name.trim(),
      client: formData.client || clients[0]?.name || "Unassigned",
      status: statusMap[formData.status] || "In Progress",
      progress: 0,
      color: formData.color,
      due: formData.dueDate || "",
      startDate: formData.startDate || "",
      dueDate: formData.dueDate || "",
      description: formData.description || "",
      priority: formData.priority || "medium",
      budget: formData.budget || "",
      archived: false,
    });

    setIsNewOpen(false);
  };

  const handleAddNewClient = (clientName) => {
    const newClient = {
      id: `c${Date.now()}`,
      name: clientName,
      email: "",
      phone: "",
      company: clientName,
      projects: [],
      revenue: 0,
      status: "Active",
      avatar: clientName.charAt(0).toUpperCase(),
    };
    addClient(newClient);
  };

  return (
    <main className="p-7">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-syne font-extrabold text-[28px] tracking-tight text-[#F0F0F8]">
          Projects
        </h1>
        <button
          className="font-mono text-[11px] font-bold px-5 py-2 rounded-full text-bg"
          style={{ background: "#CAFF00", cursor: "none" }}
          onClick={() => setIsNewOpen(true)}
        >
          + New Project
        </button>
      </div>

      <div className="mb-5 flex flex-col md:flex-row md:items-center gap-3 md:justify-between">
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className="font-mono text-[10px] uppercase tracking-[1.2px] px-3 py-[6px] rounded-full border"
              style={{
                background: statusFilter === status ? "#CAFF00" : "transparent",
                color:
                  statusFilter === status ? "#0A0A0F" : "rgba(240,240,248,0.6)",
                borderColor:
                  statusFilter === status
                    ? "#CAFF00"
                    : "rgba(255,255,255,0.10)",
              }}
            >
              {status}
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-surface border border-white/[0.10] rounded-[10px] px-3 py-2 font-mono text-[11px] text-[#F0F0F8] outline-none"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4">
        {projects.filter((p) => !p.archived).length === 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 280,
              gap: 14,
            }}
          >
            {/* Pixel icon */}
            <div
              style={{
                position: "relative",
                width: 32,
                height: 32,
                marginBottom: 4,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  width: 1,
                  height: 1,
                  boxShadow: [
                    /* folder shape */
                    "4px 4px 0 5px rgba(155,92,255,0.45)",
                    "4px 14px 0 8px rgba(155,92,255,0.35)",
                    "18px 6px 0 4px rgba(202,255,0,0.4)",
                  ].join(", "),
                }}
              />
            </div>
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 12,
                color: "rgba(240,240,248,0.35)",
                textAlign: "center",
              }}
            >
              No projects yet. Start building.
            </span>
            <button
              className="font-mono text-[11px] font-bold px-5 py-2 rounded-full text-bg"
              style={{ background: "#CAFF00", cursor: "none" }}
              onClick={() => setIsNewOpen(true)}
            >
              + New Project
            </button>
          </div>
        )}
        <AnimatePresence>
          {visibleProjects.map((project, i) => {
            const sc =
              STATUS_COLORS[project.status] || STATUS_COLORS["In Progress"];
            const deleting = confirmDeleteId === project.id;

            return (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{
                  delay: i * 0.04,
                  type: "spring",
                  stiffness: 220,
                  damping: 24,
                }}
                whileHover={{ x: 6, borderColor: "rgba(255,255,255,0.16)" }}
                className="bg-surface border border-white/[0.07] rounded-[16px] p-5 flex items-center gap-5 relative"
                style={{
                  cursor: "none",
                  borderColor: "rgba(255,255,255,0.07)",
                  background: deleting ? "rgba(255,45,120,0.08)" : "#13131A",
                }}
              >
                <button
                  className="absolute inset-0"
                  onClick={() => navigate(`/projects/${project.id}`)}
                  aria-label={`Open ${project.name}`}
                />

                <div
                  className="w-[10px] h-[10px] rounded-full flex-shrink-0 relative z-[1]"
                  style={{
                    background: project.color,
                    boxShadow: `0 0 8px ${project.color}`,
                  }}
                />

                <div className="flex-1 min-w-0 relative z-[1]">
                  <div className="text-[14px] font-semibold text-[#F0F0F8] mb-[3px] truncate">
                    {project.name}
                  </div>
                  <div className="font-mono text-[11px] text-muted truncate">
                    {project.client}
                  </div>
                </div>

                <span
                  className="font-mono text-[10px] uppercase tracking-[1px] px-3 py-[4px] rounded-full flex-shrink-0 relative z-[1]"
                  style={{ background: sc.bg, color: sc.color }}
                >
                  {project.status}
                </span>

                <div
                  className="flex items-center gap-3 flex-shrink-0 relative z-[1]"
                  style={{ width: "140px" }}
                >
                  <div
                    className="flex-1 h-[3px] rounded-full overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${project.progress || 0}%` }}
                      transition={{
                        duration: 0.8,
                        ease: [0.34, 1.56, 0.64, 1],
                      }}
                      style={{ background: project.color }}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-muted w-[32px] text-right">
                    {project.progress || 0}%
                  </span>
                </div>

                <div className="font-mono text-[11px] text-muted flex-shrink-0 relative z-[1]">
                  {project.due}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="relative z-[2]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="w-8 h-8 rounded-full border border-white/[0.12] text-muted"
                    onClick={() =>
                      setMenuOpenFor((prev) =>
                        prev === project.id ? null : project.id,
                      )
                    }
                  >
                    ⋯
                  </button>

                  <AnimatePresence>
                    {menuOpenFor === project.id && !deleting && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{
                          type: "spring",
                          stiffness: 280,
                          damping: 24,
                        }}
                        className="absolute right-0 mt-2 w-[140px] rounded-[12px] border border-white/[0.10] bg-surface2 overflow-hidden"
                      >
                        <button
                          className="w-full text-left px-3 py-2 font-mono text-[11px] text-[#F0F0F8] hover:bg-white/[0.04]"
                          onClick={() => {
                            navigate(`/projects/${project.id}`);
                            setMenuOpenFor(null);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="w-full text-left px-3 py-2 font-mono text-[11px] text-[#F0F0F8] hover:bg-white/[0.04]"
                          onClick={() => {
                            archiveProject(project.id);
                            setMenuOpenFor(null);
                          }}
                        >
                          Archive
                        </button>
                        <button
                          className="w-full text-left px-3 py-2 font-mono text-[11px] text-[#FF2D78] hover:bg-white/[0.04]"
                          onClick={() => {
                            setConfirmDeleteId(project.id);
                            setMenuOpenFor(null);
                          }}
                        >
                          Delete
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <AnimatePresence>
                  {deleting && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-[3] flex items-center gap-2 rounded-[10px] bg-[#1C1C28] border border-[#FF2D78]/40 px-3 py-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="font-mono text-[10px] text-[#FF2D78]">
                        Delete?
                      </span>
                      <button
                        className="font-mono text-[10px] text-[#F0F0F8] px-2"
                        onClick={() => {
                          deleteProject(project.id);
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {isNewOpen && (
        <NewProjectModal
          onClose={() => setIsNewOpen(false)}
          onSubmit={createProject}
          clients={clients.map((c) => c.name)}
          onAddNewClient={handleAddNewClient}
        />
      )}
    </main>
  );
}
