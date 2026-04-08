import { motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useApp } from "../context/AppContext";

const STATUS_COLORS = {
  "In Progress": { bg: "rgba(155,92,255,0.12)", color: "#9B5CFF" },
  Planning: { bg: "rgba(0,245,255,0.10)", color: "#00F5FF" },
  Review: { bg: "rgba(255,107,0,0.12)", color: "#FF6B00" },
  Done: { bg: "rgba(202,255,0,0.10)", color: "#CAFF00" },
};

const ASSIGNEE_NAMES = {
  ZA: "Zain Ali",
  NX: "Nexora Team",
  VL: "Velora Team",
  PM: "PulseMedia Team",
  AV: "Avante Team",
};

export default function ProjectDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { projects, tasks, archiveProject, deleteProject } = useApp();

  const project = projects.find((item) => item.id === id);

  useEffect(() => {
    document.title = "Projects — Freelancer Studio";
  }, []);

  const projectTasks = useMemo(() => {
    if (!project) return { todo: [], inProgress: [], done: [] };
    const pick = (arr) => arr.filter((task) => task.projectId === project.id);
    return {
      todo: pick(tasks.todo),
      inProgress: pick(tasks.inProgress),
      done: pick(tasks.done),
    };
  }, [project, tasks]);

  const allProjectTasks = useMemo(
    () => [
      ...projectTasks.todo,
      ...projectTasks.inProgress,
      ...projectTasks.done,
    ],
    [projectTasks],
  );

  const assignees = useMemo(() => {
    const set = new Set();
    allProjectTasks.forEach((task) => {
      (task.assignees || []).forEach((assignee) => set.add(assignee));
    });
    return [...set];
  }, [allProjectTasks]);

  const progress = project?.progress || 0;
  const size = 200;
  const stroke = 16;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress / 100);

  if (!project) {
    return (
      <main className="p-7">
        <div className="bg-surface rounded-[22px] border border-white/[0.07] p-6">
          <p className="font-body text-[14px] text-muted">Project not found.</p>
          <button
            className="mt-3 font-mono text-[11px] text-lime"
            onClick={() => navigate("/projects")}
          >
            Back
          </button>
        </div>
      </main>
    );
  }

  const sc = STATUS_COLORS[project.status] || STATUS_COLORS["In Progress"];

  return (
    <main className="p-7 space-y-4">
      <Link
        to="/projects"
        className="font-mono text-[12px] text-muted hover:text-lime"
      >
        ← Projects
      </Link>

      <section className="bg-surface rounded-[22px] border border-white/[0.07] p-6">
        <div className="flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">
          <div>
            <h1 className="font-syne text-[32px] font-extrabold text-[#F0F0F8] mb-2">
              {project.name}
            </h1>
            <div className="flex flex-wrap gap-2 items-center">
              <span className="font-mono text-[10px] px-3 py-[4px] rounded-full bg-surface2 text-[#F0F0F8]">
                {project.client}
              </span>
              <span
                className="font-mono text-[10px] px-3 py-[4px] rounded-full"
                style={{ background: sc.bg, color: sc.color }}
              >
                {project.status}
              </span>
              <span className="font-mono text-[10px] text-muted">
                Due {project.due || "TBD"}
              </span>
            </div>
          </div>

          <div className="relative w-[200px] h-[200px]">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={stroke}
                fill="none"
              />
              <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={project.color || "#CAFF00"}
                strokeWidth={stroke}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{
                  type: "spring",
                  stiffness: 180,
                  damping: 20,
                  delay: 0.15,
                }}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-syne text-[28px] font-extrabold text-[#F0F0F8]">
                {progress}%
              </span>
              <span className="font-mono text-[10px] text-muted uppercase tracking-[1.2px]">
                complete
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface rounded-[22px] border border-white/[0.07] p-6">
        <h2 className="font-syne text-[18px] font-bold text-[#F0F0F8] mb-3">
          Project Tasks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            ["todo", "To Do", "#FF2D78"],
            ["inProgress", "In Progress", "#9B5CFF"],
            ["done", "Done", "#CAFF00"],
          ].map(([key, label, color]) => (
            <div
              key={key}
              className="bg-surface2 rounded-[12px] border border-white/[0.06] p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] uppercase tracking-[1.6px] text-muted">
                  {label}
                </span>
                <span className="font-mono text-[10px] text-[#F0F0F8]">
                  {projectTasks[key].length}
                </span>
              </div>
              <div className="space-y-2 min-h-[80px]">
                {projectTasks[key].map((task) => (
                  <div
                    key={task.id}
                    className="bg-surface rounded-[10px] border border-white/[0.08] p-2"
                  >
                    <div
                      className="h-[3px] rounded-full mb-2"
                      style={{ background: color }}
                    />
                    <div className="font-body text-[12px] text-[#F0F0F8]">
                      {task.title}
                    </div>
                    <div className="font-mono text-[9px] text-muted mt-1">
                      {task.taskId || `#${task.id}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface rounded-[22px] border border-white/[0.07] p-6">
        <h2 className="font-syne text-[18px] font-bold text-[#F0F0F8] mb-3">
          Team
        </h2>
        <div className="flex items-center gap-2">
          {assignees.length === 0 && (
            <span className="font-mono text-[10px] text-muted">
              No assignees yet
            </span>
          )}
          {assignees.map((initials, idx) => (
            <div key={initials} className="group relative">
              <div
                className="w-9 h-9 rounded-full border-2 border-surface flex items-center justify-center text-[10px] font-bold"
                style={{
                  background: [
                    "#9B5CFF22",
                    "#FF2D7822",
                    "#00F5FF22",
                    "#FF6B0022",
                  ][idx % 4],
                  color: ["#9B5CFF", "#FF2D78", "#00F5FF", "#FF6B00"][idx % 4],
                }}
              >
                {initials}
              </div>
              <div className="absolute top-[44px] left-1/2 -translate-x-1/2 px-2 py-1 rounded-[8px] bg-surface2 border border-white/[0.10] font-mono text-[10px] text-muted opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {ASSIGNEE_NAMES[initials] || initials}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface rounded-[22px] border border-[#FF2D78]/30 p-6">
        <h2 className="font-syne text-[18px] font-bold text-[#F0F0F8] mb-3">
          Danger Zone
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => archiveProject(project.id)}
            className="px-4 py-2 rounded-[10px] font-mono text-[11px]"
            style={{ background: "rgba(255,107,0,0.14)", color: "#FF6B00" }}
          >
            Archive Project
          </button>
          <button
            onClick={() => {
              deleteProject(project.id);
              navigate("/projects");
            }}
            className="px-4 py-2 rounded-[10px] font-mono text-[11px]"
            style={{ background: "rgba(255,45,120,0.14)", color: "#FF2D78" }}
          >
            Delete Project
          </button>
        </div>
      </section>
    </main>
  );
}
