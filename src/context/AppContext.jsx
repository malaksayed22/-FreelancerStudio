import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { ACTIVITY, CLIENTS, INITIAL_TASKS, STATS } from "../../store";
import useLocalStorage from "../hooks/useLocalStorage";
import { useToast } from "./ToastContext";

const DEFAULT_PROJECTS = [];

// Name is intentionally blank — it is populated on mount from fs_auth
// (set by login / signup) so we never show a hardcoded placeholder.
const DEFAULT_PROFILE = {
  id: "u1",
  name: "",
  role: "Freelancer",
  timezone: "UTC+2",
  notifications: true,
  commandPaletteEnabled: true,
};

const DEFAULT_ANALYTICS_MONTHLY = [];

const DEFAULT_TOP_CLIENTS = [];

const AppContext = createContext(null);

function normalizeTaskColumns(tasks) {
  return {
    todo: tasks?.todo || [],
    inProgress: tasks?.inProgress || [],
    done: tasks?.done || [],
  };
}

function allTasksSafe(tasks) {
  const safe = normalizeTaskColumns(tasks);
  return [...safe.todo, ...safe.inProgress, ...safe.done];
}

export function AppProvider({ children }) {
  const [clients, setClients] = useLocalStorage("fs_clients", CLIENTS);
  const [projects, setProjects] = useLocalStorage(
    "fs_projects",
    DEFAULT_PROJECTS,
  );
  const [tasks, setTasks] = useLocalStorage(
    "fs_tasks",
    normalizeTaskColumns(INITIAL_TASKS),
  );
  const [profile, setProfile] = useLocalStorage("fs_profile", DEFAULT_PROFILE);
  const [activityHistory, setActivityHistory] = useLocalStorage(
    "fs_activity",
    [],
  );
  const [activityDates, setActivityDates] = useLocalStorage(
    "fs_activity_dates",
    {},
  );
  const [settings, setSettings] = useLocalStorage("fs_settings", {
    commandPaletteEnabled: true,
  });

  const { showToast } = useToast();

  // On first mount, populate profile name/email from the auth session if the
  // stored profile has no name (e.g. fresh install or cleared profileData).
  useEffect(() => {
    if (!profile.name) {
      try {
        const auth = JSON.parse(localStorage.getItem("fs_auth") || "{}");
        if (auth.name) {
          setProfile((prev) => ({
            ...prev,
            name: auth.name,
            email: prev.email || auth.email || "",
          }));
        }
      } catch {
        /* ignore */
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pushActivity = useCallback(
    (action, target, color) => {
      const now = Date.now();
      setActivityHistory((prev) =>
        [
          {
            action,
            target,
            timestamp: now,
            color,
          },
          ...prev,
        ].slice(0, 100),
      );
      const d = new Date(now);
      const todayKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      setActivityDates((prev) => ({
        ...prev,
        [todayKey]: (prev[todayKey] || 0) + 1,
      }));
    },
    [setActivityHistory, setActivityDates],
  );

  const safeTasks = normalizeTaskColumns(tasks);

  const addClient = (client) => {
    setClients((prev) => [...prev, client]);
    showToast("Client added", "success", "#CAFF00");
    pushActivity("Added client", client.name || client.id, "#CAFF00");
  };

  const updateClient = (id, data) => {
    setClients((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...data } : item)),
    );
    pushActivity("Updated client", data?.name || id, "#00F5FF");
  };

  const deleteClient = (id) => {
    const client = clients.find((item) => item.id === id);
    setClients((prev) => prev.filter((item) => item.id !== id));
    showToast("Client deleted", "info", "#FF2D78");
    pushActivity("Deleted client", client?.name || id, "#FF2D78");
  };

  const addProject = (project) => {
    setProjects((prev) => [...prev, project]);
    showToast("Project created", "success", "#00F5FF");
    pushActivity("Created project", project.name || project.id, "#00F5FF");
  };

  const updateProject = (id, data) => {
    setProjects((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...data } : item)),
    );
    pushActivity("Updated project", data?.name || id, "#9B5CFF");
  };

  const deleteProject = (id) => {
    const project = projects.find((item) => item.id === id);
    setProjects((prev) => prev.filter((item) => item.id !== id));
    pushActivity("Deleted project", project?.name || id, "#FF2D78");
  };

  const archiveProject = (id) => {
    setProjects((prev) =>
      prev.map((item) => (item.id === id ? { ...item, archived: true } : item)),
    );
    const project = projects.find((item) => item.id === id);
    pushActivity("Archived project", project?.name || id, "#FF6B00");
  };

  const addTask = (column, task) => {
    const target = column in safeTasks ? column : "todo";
    setTasks((prev) => ({
      ...normalizeTaskColumns(prev),
      [target]: [...(prev[target] || []), task],
    }));
    pushActivity("Added task", task.title || task.id, "#00F5FF");
  };

  const updateTask = (id, data) => {
    setTasks((prev) => {
      const next = normalizeTaskColumns(prev);
      for (const col of Object.keys(next)) {
        next[col] = next[col].map((task) =>
          task.id === id ? { ...task, ...data } : task,
        );
      }
      return next;
    });
    pushActivity("Updated task", data?.title || id, "#9B5CFF");
  };

  const moveTask = (id, fromCol, toCol, toIndex) => {
    setTasks((prev) => {
      const next = normalizeTaskColumns(prev);
      if (!next[fromCol] || !next[toCol]) return next;

      const fromTasks = [...next[fromCol]];
      const movingIndex = fromTasks.findIndex((task) => task.id === id);
      if (movingIndex === -1) return next;

      const [movingTask] = fromTasks.splice(movingIndex, 1);
      const destTasks = fromCol === toCol ? fromTasks : [...next[toCol]];
      const insertIndex =
        typeof toIndex === "number"
          ? Math.max(0, Math.min(toIndex, destTasks.length))
          : destTasks.length;
      destTasks.splice(insertIndex, 0, movingTask);

      const updated = {
        ...next,
        [fromCol]: fromCol === toCol ? destTasks : fromTasks,
        [toCol]: destTasks,
      };

      return updated;
    });

    showToast("Task moved", "info", "#9B5CFF");
    const movedTask = allTasksSafe(safeTasks).find((t) => t.id === id);
    const destLabel =
      toCol === "inProgress"
        ? "In Progress"
        : toCol === "done"
          ? "Done"
          : "To Do";
    pushActivity(
      "Moved task",
      `${movedTask?.title || id} to ${destLabel}`,
      "#9B5CFF",
    );
  };

  const deleteTask = (id) => {
    const task = allTasksSafe(safeTasks).find((item) => item.id === id);
    setTasks((prev) => {
      const next = normalizeTaskColumns(prev);
      return {
        todo: next.todo.filter((t) => t.id !== id),
        inProgress: next.inProgress.filter((t) => t.id !== id),
        done: next.done.filter((t) => t.id !== id),
      };
    });
    pushActivity("Deleted task", task?.title || id, "#FF2D78");
  };

  const updateProfile = (data, options = {}) => {
    setProfile((prev) => ({ ...prev, ...data }));
    if (!options.silent) {
      showToast("Profile saved", "success", "#CAFF00");
    }
    pushActivity(
      "Saved profile",
      data?.name || profile.name || "Profile",
      "#CAFF00",
    );
  };

  const updateSettings = (data) => {
    setSettings((prev) => ({ ...prev, ...data }));
    showToast("Settings changed", "info", "#00F5FF");
    pushActivity("Updated settings", "Preferences", "#00F5FF");
  };

  const clearActivityHistory = () => {
    setActivityHistory([]);
  };

  const derivedStats = [
    {
      ...STATS[0],
      value: clients.length,
      delta:
        clients.length > 0
          ? `↑ +${Math.max(1, Math.floor(clients.length / 3))} this month`
          : "—",
    },
    {
      ...STATS[1],
      value: projects.filter((p) => !p.archived).length,
      delta:
        projects.length > 0
          ? `↑ +${Math.max(1, Math.floor(projects.length / 4))} this week`
          : "—",
    },
    {
      ...STATS[2],
      value:
        safeTasks.todo.length +
        safeTasks.inProgress.length +
        safeTasks.done.length,
      delta:
        safeTasks.todo.length +
          safeTasks.inProgress.length +
          safeTasks.done.length >
        0
          ? `↓ ${safeTasks.done.length} completed`
          : "—",
    },
    {
      ...STATS[3],
      value: projects.reduce(
        (sum, p) =>
          sum +
          (p.revenue ? Number(p.revenue) : Math.round((p.progress || 0) * 100)),
        0,
      ),
      delta: projects.length > 0 ? STATS[3].delta : "—",
    },
  ];

  const derivedActivity = ACTIVITY.map((item, idx) => {
    const cols = [safeTasks.todo, safeTasks.inProgress, safeTasks.done];
    const source = cols[idx % cols.length] || [];
    const h = source.length
      ? Math.min(100, 20 + source.length * 15)
      : item.height;
    return { ...item, height: h };
  });

  const tickerItems = [
    `${clients.length} clients active`,
    "★",
    `${projects.filter((p) => !p.archived).length} live projects`,
    "★",
    `$${derivedStats[3].value.toLocaleString()} earned this month`,
    "★",
    `${safeTasks.todo.length + safeTasks.inProgress.length} tasks in motion`,
    "★",
  ];

  // Build monthly chart from real project data when available; otherwise empty.
  const monthly = (() => {
    if (projects.length === 0) return [];
    const MONTH_LABELS = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      const label = MONTH_LABELS[d.getMonth()];
      const rev =
        derivedStats[3].value > 0
          ? Math.round((derivedStats[3].value / 6) * (0.7 + i * 0.06))
          : 0;
      const taskCount =
        safeTasks.todo.length +
        safeTasks.inProgress.length +
        safeTasks.done.length;
      return { month: label, revenue: rev, tasks: Math.round(taskCount / 6) };
    });
  })();

  const topClients = clients.slice(0, 5).map((cl, i) => {
    const PALETTE = ["#CAFF00", "#FF2D78", "#9B5CFF", "#00F5FF", "#FF6B00"];
    return {
      name: cl.name || cl.id,
      initials: cl.initials || (cl.name || "?").slice(0, 2).toUpperCase(),
      color: PALETTE[i % PALETTE.length],
      revenue:
        derivedStats[3].value > 0
          ? Math.round(derivedStats[3].value / (clients.length || 1)) + i * 80
          : 0,
    };
  });

  const value = useMemo(
    () => ({
      clients,
      projects,
      tasks: safeTasks,
      profile,
      settings,
      activityHistory,
      activityDates,
      stats: derivedStats,
      activity: derivedActivity,
      tickerItems,
      monthly,
      topClients,
      addClient,
      updateClient,
      deleteClient,
      addProject,
      updateProject,
      deleteProject,
      archiveProject,
      addTask,
      updateTask,
      moveTask,
      deleteTask,
      updateProfile,
      updateSettings,
      clearActivityHistory,
    }),
    [
      clients,
      projects,
      safeTasks,
      profile,
      settings,
      activityHistory,
      activityDates,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used inside AppProvider");
  }
  return ctx;
}
