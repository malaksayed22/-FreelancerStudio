import { useEffect, useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { motion, AnimatePresence } from "framer-motion";
import TaskCard from "./TaskCard";
import { useApp } from "../context/AppContext";

const COLUMNS = [
  { key: "todo", label: "To Do", dot: "#FF2D78" },
  { key: "inProgress", label: "In Progress", dot: "#9B5CFF" },
  { key: "done", label: "Done", dot: "#CAFF00" },
];

const TAG_OPTIONS = [
  {
    key: "TASK",
    label: "Task",
    bg: "rgba(255,255,255,0.06)",
    color: "#888",
    border: "rgba(255,255,255,0.1)",
  },
  {
    key: "design",
    label: "Design",
    bg: "rgba(155,92,255,0.18)",
    color: "#c7a8ff",
    border: "rgba(155,92,255,0.35)",
  },
  {
    key: "dev",
    label: "Dev",
    bg: "rgba(0,245,255,0.14)",
    color: "#7cf7ff",
    border: "rgba(0,245,255,0.3)",
  },
  {
    key: "copy",
    label: "Copy",
    bg: "rgba(255,45,120,0.16)",
    color: "#ff8ec0",
    border: "rgba(255,45,120,0.3)",
  },
  {
    key: "react",
    label: "React",
    bg: "rgba(202,255,0,0.14)",
    color: "#dfff70",
    border: "rgba(202,255,0,0.32)",
  },
  {
    key: "motion",
    label: "Motion",
    bg: "rgba(255,107,0,0.16)",
    color: "#ffbb7a",
    border: "rgba(255,107,0,0.32)",
  },
  {
    key: "brand",
    label: "Brand",
    bg: "rgba(255,45,120,0.16)",
    color: "#ff8ec0",
    border: "rgba(255,45,120,0.3)",
  },
];

const COL_META = {
  todo: { label: "To Do", dot: "#FF2D78" },
  inProgress: { label: "In Progress", dot: "#9B5CFF" },
  done: { label: "Done", dot: "#CAFF00" },
};

function AddTaskModal({ column, onAdd, onClose }) {
  const today = new Date();
  const defaultDate = today.toISOString().split("T")[0];
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("TASK");
  const [dueDate, setDueDate] = useState(defaultDate);
  const [progress, setProgress] = useState(0);
  const [shake, setShake] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
    if (e.key === "Escape") onClose();
  };

  const submit = () => {
    if (!title.trim()) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    const d = new Date(dueDate);
    const formatted = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const autoProgress =
      column === "done" ? 100 : column === "inProgress" ? Number(progress) : 0;
    onAdd(column, {
      id: `FS-${Date.now()}`,
      tag,
      title: title.trim(),
      date: formatted,
      progress: autoProgress,
    });
    onClose();
  };

  const colMeta = COL_META[column];
  const selectedTag = TAG_OPTIONS.find((t) => t.key === tag);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.78)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        padding: "24px 16px",
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: "spring", stiffness: 340, damping: 28 }}
        style={{
          background: "linear-gradient(145deg,#12141c 0%,#0d0f14 100%)",
          border: "1px solid rgba(200,241,53,0.14)",
          borderRadius: 20,
          width: "100%",
          maxWidth: 480,
          padding: "28px 28px 24px",
          boxShadow:
            "0 0 60px rgba(200,255,87,0.08), 0 30px 80px rgba(0,0,0,0.7)",
          fontFamily: "'Syne', sans-serif",
        }}
        onKeyDown={handleKey}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 22,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: colMeta.dot,
                boxShadow: `0 0 6px ${colMeta.dot}`,
              }}
            />
            <span
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: "#f0f0f0",
                letterSpacing: "-0.3px",
              }}
            >
              Add Task
            </span>
            <span
              style={{
                fontFamily: "'DM Mono',monospace",
                fontSize: 9,
                letterSpacing: ".06em",
                textTransform: "uppercase",
                padding: "2px 9px",
                borderRadius: 99,
                background: `rgba(${colMeta.dot === "#FF2D78" ? "255,45,120" : colMeta.dot === "#9B5CFF" ? "155,92,255" : "200,255,87"},0.12)`,
                color: colMeta.dot,
                border: `1px solid ${colMeta.dot}44`,
              }}
            >
              {colMeta.label}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#444",
              fontSize: 18,
              cursor: "pointer",
              lineHeight: 1,
              padding: "4px 6px",
              borderRadius: 6,
              transition: "color .15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#f0f0f0";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#444";
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Title */}
        <div style={{ marginBottom: 18 }}>
          <label
            style={{
              fontFamily: "'DM Mono',monospace",
              fontSize: 9,
              color: "#555",
              letterSpacing: ".08em",
              textTransform: "uppercase",
              display: "block",
              marginBottom: 6,
            }}
          >
            Task Title <span style={{ color: "#c8ff57" }}>*</span>
          </label>
          <input
            ref={titleRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            aria-label="Task title"
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.04)",
              border: shake
                ? "1px solid #FF2D78"
                : "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10,
              padding: "10px 14px",
              fontFamily: "'DM Mono',monospace",
              fontSize: 12,
              color: "#e0e0e0",
              outline: "none",
              transition: "border-color .15s, box-shadow .15s",
              boxSizing: "border-box",
              animation: shake ? "kb-shake .4s ease" : "none",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "rgba(200,255,87,0.4)";
              e.target.style.boxShadow = "0 0 0 3px rgba(200,255,87,0.08)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(255,255,255,0.1)";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        {/* Tag + Due Date row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
            marginBottom: 18,
          }}
        >
          <div>
            <label
              style={{
                fontFamily: "'DM Mono',monospace",
                fontSize: 9,
                color: "#555",
                letterSpacing: ".08em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: 6,
              }}
            >
              Tag
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {TAG_OPTIONS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTag(t.key)}
                  style={{
                    fontFamily: "'DM Mono',monospace",
                    fontSize: 8,
                    letterSpacing: ".06em",
                    textTransform: "uppercase",
                    padding: "3px 9px",
                    borderRadius: 4,
                    background: tag === t.key ? t.bg : "rgba(255,255,255,0.04)",
                    color: tag === t.key ? t.color : "#555",
                    border: `1px solid ${tag === t.key ? t.border : "rgba(255,255,255,0.08)"}`,
                    cursor: "pointer",
                    transition: "all .13s",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label
              style={{
                fontFamily: "'DM Mono',monospace",
                fontSize: 9,
                color: "#555",
                letterSpacing: ".08em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: 6,
              }}
            >
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              aria-label="Due date"
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10,
                padding: "8px 12px",
                fontFamily: "'DM Mono',monospace",
                fontSize: 11,
                color: "#e0e0e0",
                outline: "none",
                boxSizing: "border-box",
                colorScheme: "dark",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(200,255,87,0.4)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255,255,255,0.1)";
              }}
            />
          </div>
        </div>

        {/* Progress — only visible when adding to In Progress */}
        {column === "inProgress" && (
          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                fontFamily: "'DM Mono',monospace",
                fontSize: 9,
                color: "#555",
                letterSpacing: ".08em",
                textTransform: "uppercase",
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span>Progress</span>
              <span style={{ color: "#c8ff57" }}>{progress}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              aria-label="Task progress"
              style={{
                width: "100%",
                accentColor: "#c8ff57",
                height: 4,
                cursor: "pointer",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 3,
              }}
            >
              <span
                style={{
                  fontFamily: "'DM Mono',monospace",
                  fontSize: 8,
                  color: "#333",
                }}
              >
                0%
              </span>
              <span
                style={{
                  fontFamily: "'DM Mono',monospace",
                  fontSize: 8,
                  color: "#333",
                }}
              >
                100%
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 10,
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "8px 18px",
              borderRadius: 99,
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.12)",
              fontFamily: "'DM Mono',monospace",
              fontSize: 10,
              color: "#555",
              cursor: "pointer",
              transition: "all .15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
              e.currentTarget.style.color = "#aaa";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
              e.currentTarget.style.color = "#555";
            }}
          >
            Cancel
          </button>
          <button
            onClick={submit}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "9px 20px",
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
            Add Task
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path
                d="M2 5.5h7M5.5 2L9 5.5 5.5 9"
                stroke="#0a0a0c"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <style>{`
          @keyframes kb-shake {
            0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-5px)} 40%,80%{transform:translateX(5px)}
          }
        `}</style>
      </motion.div>
    </motion.div>
  );
}

function ProgressAdjustModal({ taskTitle, onUpdate, onClose }) {
  const [progress, setProgress] = useState(0);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.78)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        padding: "24px 16px",
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: "spring", stiffness: 340, damping: 28 }}
        style={{
          background: "linear-gradient(145deg,#12141c 0%,#0d0f14 100%)",
          border: "1px solid rgba(155,92,255,0.2)",
          borderRadius: 20,
          width: "100%",
          maxWidth: 400,
          padding: "28px 28px 24px",
          boxShadow:
            "0 0 60px rgba(155,92,255,0.08), 0 30px 80px rgba(0,0,0,0.7)",
          fontFamily: "'Syne', sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#9B5CFF",
                boxShadow: "0 0 6px #9B5CFF",
              }}
            />
            <span
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: "#f0f0f0",
                letterSpacing: "-0.3px",
              }}
            >
              Set Progress
            </span>
            <span
              style={{
                fontFamily: "'DM Mono',monospace",
                fontSize: 9,
                letterSpacing: ".06em",
                textTransform: "uppercase",
                padding: "2px 9px",
                borderRadius: 99,
                background: "rgba(155,92,255,0.12)",
                color: "#9B5CFF",
                border: "1px solid rgba(155,92,255,0.3)",
              }}
            >
              In Progress
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#444",
              fontSize: 18,
              cursor: "pointer",
              lineHeight: 1,
              padding: "4px 6px",
              borderRadius: 6,
              transition: "color .15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#f0f0f0";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#444";
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Task name pill */}
        <div
          style={{
            marginBottom: 20,
            padding: "10px 14px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 10,
          }}
        >
          <span
            style={{
              fontFamily: "'DM Mono',monospace",
              fontSize: 11,
              color: "#aaa",
            }}
          >
            {taskTitle}
          </span>
        </div>

        {/* Slider */}
        <div style={{ marginBottom: 24 }}>
          <label
            style={{
              fontFamily: "'DM Mono',monospace",
              fontSize: 9,
              color: "#555",
              letterSpacing: ".08em",
              textTransform: "uppercase",
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <span>Progress</span>
            <span style={{ color: "#c8ff57" }}>{progress}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            aria-label="Task progress"
            style={{
              width: "100%",
              accentColor: "#c8ff57",
              height: 4,
              cursor: "pointer",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 3,
            }}
          >
            <span
              style={{
                fontFamily: "'DM Mono',monospace",
                fontSize: 8,
                color: "#333",
              }}
            >
              0%
            </span>
            <span
              style={{
                fontFamily: "'DM Mono',monospace",
                fontSize: 8,
                color: "#333",
              }}
            >
              100%
            </span>
          </div>
        </div>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 10,
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "8px 18px",
              borderRadius: 99,
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.12)",
              fontFamily: "'DM Mono',monospace",
              fontSize: 10,
              color: "#555",
              cursor: "pointer",
              transition: "all .15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
              e.currentTarget.style.color = "#aaa";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
              e.currentTarget.style.color = "#555";
            }}
          >
            Skip
          </button>
          <button
            onClick={() => onUpdate(progress)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "9px 20px",
              borderRadius: 99,
              background: "#9B5CFF",
              border: "none",
              fontFamily: "'Syne',sans-serif",
              fontSize: 12,
              fontWeight: 800,
              color: "#fff",
              cursor: "pointer",
              transition: "transform .15s, box-shadow .15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.04)";
              e.currentTarget.style.boxShadow =
                "0 4px 20px rgba(155,92,255,0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Update
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function KanbanBoard() {
  const { tasks, moveTask, addTask, updateTask } = useApp();
  const scrollRefs = useRef({});
  const [scrollMeta, setScrollMeta] = useState({});
  const [colMaxHeights, setColMaxHeights] = useState({});
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024);

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Measure actual rendered height of first 3 cards so we clip exactly at card #3
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const heights = {};
      const visibleCards = isDesktop ? 3 : 1;
      COLUMNS.forEach(({ key }) => {
        if ((tasks[key]?.length ?? 0) <= visibleCards) return;
        const native = scrollRefs.current[key];
        if (!native) return;
        const droppable = native.firstElementChild;
        if (!droppable || droppable.children.length < visibleCards + 1) return;
        const containerTop = native.getBoundingClientRect().top;
        // Bottom of last visible card = exact clip point
        const lastVisible =
          droppable.children[visibleCards - 1].getBoundingClientRect().bottom;
        heights[key] = Math.round(lastVisible - containerTop);
      });
      setColMaxHeights((prev) => ({ ...prev, ...heights }));
    });
    return () => cancelAnimationFrame(raf);
  }, [tasks, isDesktop]);

  const [addModal, setAddModal] = useState({ open: false, column: "todo" });
  const [progressModal, setProgressModal] = useState(null);

  const updateScrollMeta = (colKey) => {
    const el = scrollRefs.current[colKey];
    if (!el) return;

    const { scrollTop, scrollHeight, clientHeight } = el;
    const canScroll = scrollHeight > clientHeight + 1;

    if (!canScroll) {
      setScrollMeta((prev) => ({
        ...prev,
        [colKey]: { visible: false, top: 0, height: 0 },
      }));
      return;
    }

    const thumbHeight = Math.max(
      28,
      (clientHeight * clientHeight) / scrollHeight,
    );
    const maxTop = clientHeight - thumbHeight;
    const top = (scrollTop / (scrollHeight - clientHeight)) * maxTop;

    setScrollMeta((prev) => ({
      ...prev,
      [colKey]: {
        visible: true,
        top,
        height: thumbHeight,
      },
    }));
  };

  useEffect(() => {
    const updateAll = () => {
      COLUMNS.forEach((col) => updateScrollMeta(col.key));
    };

    const raf = requestAnimationFrame(updateAll);
    window.addEventListener("resize", updateAll);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateAll);
    };
  }, [tasks, colMaxHeights]);

  const openModal = (colKey) => setAddModal({ open: true, column: colKey });

  const handleAddTask = (colKey, task) => {
    const today = new Date();
    const month = today.toLocaleString("en-US", { month: "short" });
    addTask(colKey, {
      ...task,
      date: task.date || `${month} ${today.getDate()}`,
    });
  };

  const onDragEnd = ({ source, destination }) => {
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const task = tasks[source.droppableId]?.[source.index];
    if (!task) return;
    moveTask(
      task.id,
      source.droppableId,
      destination.droppableId,
      destination.index,
    );
    if (
      destination.droppableId === "inProgress" &&
      source.droppableId !== "inProgress"
    ) {
      setProgressModal({ taskId: task.id, taskTitle: task.title || task.id });
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 180, damping: 22 }}
      className="col-span-2 bg-surface rounded-[22px] border border-white/[0.07] p-[26px] relative"
    >
      <div
        className="absolute top-4 right-5 font-syne font-extrabold pointer-events-none select-none"
        style={{
          fontSize: "55px",
          color: "rgba(255,255,255,0.018)",
          letterSpacing: "-2px",
        }}
      >
        BOARD
      </div>

      <div className="flex items-center justify-between mb-5">
        <h2 className="font-syne font-bold text-[17px] text-[#F0F0F8]">
          Task Board
        </h2>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[14px]">
          {COLUMNS.map((col) => (
            <div key={col.key}>
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[2px] text-muted mb-[10px]">
                <div className="flex items-center gap-2">
                  <div
                    className="w-[6px] h-[6px] rounded-full flex-shrink-0"
                    style={{ background: col.dot }}
                  />
                  {col.label}
                  <span
                    className="rounded-full px-[8px] py-[1px] text-[10px] text-[#F0F0F8] ml-1"
                    style={{ background: "#1C1C28" }}
                  >
                    {tasks[col.key].length}
                  </span>
                </div>

                <button
                  className="w-5 h-5 rounded-[6px] border border-white/[0.1] bg-white/[0.03] text-[#9ea3b8] leading-none"
                  onClick={() => openModal(col.key)}
                  aria-label={`Add task to ${col.label}`}
                >
                  +
                </button>
              </div>

              <Droppable droppableId={col.key}>
                {(provided, snapshot) => {
                  const clipH = colMaxHeights[col.key]
                    ? `${colMaxHeights[col.key]}px`
                    : !isDesktop && tasks[col.key].length > 1
                    ? "110px"
                    : undefined;
                  return (
                    <div
                      className={clipH ? "kanban-scroll-wrap" : undefined}
                      style={clipH ? { maxHeight: clipH } : undefined}
                    >
                      <div
                        className={clipH ? "kanban-scroll-native" : undefined}
                        ref={(node) => {
                          scrollRefs.current[col.key] = node;
                        }}
                        onScroll={() => updateScrollMeta(col.key)}
                        style={
                          clipH
                            ? {
                                maxHeight: clipH,
                                overflowY: "auto",
                                overflowX: "hidden",
                                paddingRight: "10px",
                              }
                            : undefined
                        }
                      >
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          style={{ minHeight: "120px" }}
                        >
                          {tasks[col.key].length === 0 &&
                            !snapshot.isDraggingOver && (
                              <div
                                style={{
                                  border: "1.5px dashed rgba(202,255,0,0.2)",
                                  borderRadius: 10,
                                  minHeight: 100,
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: 6,
                                  marginTop: 4,
                                }}
                              >
                                <button
                                  style={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: 6,
                                    border: "1px solid rgba(202,255,0,0.25)",
                                    background: "transparent",
                                    color: "rgba(202,255,0,0.4)",
                                    fontSize: 14,
                                    lineHeight: 1,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                  onClick={() => openModal(col.key)}
                                  aria-label={`Add task to ${col.label}`}
                                >
                                  +
                                </button>
                                <span
                                  style={{
                                    fontFamily: "'Space Mono', monospace",
                                    fontSize: 10,
                                    color: "rgba(240,240,248,0.25)",
                                  }}
                                >
                                  No tasks yet
                                </span>
                              </div>
                            )}
                          {tasks[col.key].map((task, index) => (
                            <Draggable
                              key={task.id}
                              draggableId={task.id}
                              index={index}
                            >
                              {(prov, snap) => (
                                <div
                                  ref={prov.innerRef}
                                  {...prov.draggableProps}
                                  {...prov.dragHandleProps}
                                  style={{
                                    ...prov.draggableProps.style,
                                    opacity: snap.isDragging ? 0.85 : 1,
                                    transform: snap.isDragging
                                      ? `${prov.draggableProps.style?.transform} rotate(2deg)`
                                      : prov.draggableProps.style?.transform,
                                  }}
                                >
                                  <TaskCard
                                    task={task}
                                    isDone={col.key === "done"}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      </div>

                      {clipH && (
                        <div className="kanban-scroll-rail" aria-hidden>
                          {scrollMeta[col.key]?.visible && (
                            <div
                              className="kanban-scroll-thumb"
                              style={{
                                height: `${scrollMeta[col.key].height}px`,
                                transform: `translateY(${scrollMeta[col.key].top}px)`,
                              }}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  );
                }}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <AnimatePresence>
        {addModal.open && (
          <AddTaskModal
            column={addModal.column}
            onAdd={handleAddTask}
            onClose={() => setAddModal({ open: false, column: "todo" })}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {progressModal && (
          <ProgressAdjustModal
            taskTitle={progressModal.taskTitle}
            onUpdate={(v) => {
              updateTask(progressModal.taskId, { progress: v });
              setProgressModal(null);
            }}
            onClose={() => setProgressModal(null)}
          />
        )}
      </AnimatePresence>
    </motion.section>
  );
}
