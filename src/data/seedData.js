/**
 * buildSeedData()
 *
 * Returns a realistic fake dataset written to localStorage on signup so the
 * dashboard never looks empty on first login. All timestamps are relative to
 * Date.now() so activity feed times always read like "4 hours ago".
 */
export function buildSeedData() {
  const now = Date.now();
  const hoursAgo = (h) => now - h * 3_600_000;

  // ── CLIENTS ──────────────────────────────────────────────────────────────
  const clients = [
    {
      id: "c1",
      name: "Nexora Labs",
      initials: "NL",
      role: "SaaS / Product",
      status: "active",
      colorClass: "ca4",
    },
    {
      id: "c2",
      name: "Velora Studio",
      initials: "VS",
      role: "Creative Agency",
      status: "active",
      colorClass: "ca2",
    },
    {
      id: "c3",
      name: "PulseMedia",
      initials: "PM",
      role: "Digital Marketing",
      status: "idle",
      colorClass: "ca3",
    },
    {
      id: "c4",
      name: "Stackr Inc.",
      initials: "SI",
      role: "FinTech",
      status: "active",
      colorClass: "ca5",
    },
    {
      id: "c5",
      name: "Orbix Design",
      initials: "OD",
      role: "UI/UX Studio",
      status: "away",
      colorClass: "ca1",
    },
    {
      id: "c6",
      name: "Launchpad HQ",
      initials: "LH",
      role: "Startup Growth",
      status: "active",
      colorClass: "ca2",
    },
  ];

  // ── PROJECTS ─────────────────────────────────────────────────────────────
  const projects = [
    {
      id: "p1",
      name: "Nexora Dashboard v2",
      client: "Nexora Labs",
      status: "In Progress",
      color: "#9B5CFF",
      progress: 68,
    },
    {
      id: "p2",
      name: "Velora Brand Identity",
      client: "Velora Studio",
      status: "Review",
      color: "#FF2D78",
      progress: 91,
    },
    {
      id: "p3",
      name: "PulseMedia Campaign Site",
      client: "PulseMedia",
      status: "Planning",
      color: "#00F5FF",
      progress: 22,
    },
    {
      id: "p4",
      name: "Stackr Payments UI",
      client: "Stackr Inc.",
      status: "In Progress",
      color: "#FF6B00",
      progress: 55,
    },
    {
      id: "p5",
      name: "Orbix Design System",
      client: "Orbix Design",
      status: "Done",
      color: "#CAFF00",
      progress: 100,
    },
    {
      id: "p6",
      name: "Launchpad Landing Page",
      client: "Launchpad HQ",
      status: "In Progress",
      color: "#FF2D78",
      progress: 44,
    },
  ];

  // ── TASKS ─────────────────────────────────────────────────────────────────
  const tasks = {
    todo: [
      {
        id: "t1",
        title: "Design hero section layout",
        tag: "design",
        date: "Apr 15",
        progress: 0,
        assignees: ["ZA"],
        projectId: "p1",
      },
      {
        id: "t2",
        title: "Write API docs for payments",
        tag: "dev",
        date: "Apr 18",
        progress: 0,
        assignees: ["NX"],
        projectId: "p4",
      },
      {
        id: "t3",
        title: "Brand color palette finalisation",
        tag: "brand",
        date: "Apr 16",
        progress: 15,
        assignees: ["VL"],
        projectId: "p2",
      },
      {
        id: "t4",
        title: "Set up campaign analytics tracking",
        tag: "dev",
        date: "Apr 20",
        progress: 0,
        assignees: ["PM"],
        projectId: "p3",
      },
      {
        id: "t5",
        title: "Homepage copy & CTA review",
        tag: "copy",
        date: "Apr 21",
        progress: 5,
        assignees: ["ZA", "AV"],
        projectId: "p6",
      },
    ],
    inProgress: [
      {
        id: "t6",
        title: "Build sidebar component",
        tag: "react",
        date: "Apr 12",
        progress: 60,
        assignees: ["ZA"],
        projectId: "p1",
      },
      {
        id: "t7",
        title: "Animate onboarding flow",
        tag: "motion",
        date: "Apr 13",
        progress: 45,
        assignees: ["VL"],
        projectId: "p2",
      },
      {
        id: "t8",
        title: "Responsive layout polish",
        tag: "css",
        date: "Apr 14",
        progress: 75,
        assignees: ["ZA", "NX"],
        projectId: "p4",
      },
      {
        id: "t9",
        title: "Email template system",
        tag: "email",
        date: "Apr 12",
        progress: 50,
        assignees: ["AV"],
        projectId: "p6",
      },
    ],
    done: [
      {
        id: "t10",
        title: "Logo design — final iteration",
        tag: "design",
        date: "Apr 6",
        progress: 100,
        assignees: ["VL"],
        projectId: "p2",
      },
      {
        id: "t11",
        title: "Component library setup",
        tag: "react",
        date: "Apr 5",
        progress: 100,
        assignees: ["ZA"],
        projectId: "p5",
      },
      {
        id: "t12",
        title: "Typography tokens defined",
        tag: "design",
        date: "Apr 4",
        progress: 100,
        assignees: ["NX"],
        projectId: "p5",
      },
      {
        id: "t13",
        title: "Landing page wireframes approved",
        tag: "design",
        date: "Apr 7",
        progress: 100,
        assignees: ["PM"],
        projectId: "p3",
      },
      {
        id: "t14",
        title: "Auth flow implementation",
        tag: "dev",
        date: "Apr 8",
        progress: 100,
        assignees: ["ZA"],
        projectId: "p1",
      },
    ],
  };

  // ── ACTIVITY HISTORY ─────────────────────────────────────────────────────
  const activityHistory = [
    {
      action: "Completed task",
      target: "Auth flow implementation",
      timestamp: hoursAgo(4),
      color: "#CAFF00",
    },
    {
      action: "Updated project",
      target: "Nexora Dashboard v2",
      timestamp: hoursAgo(5),
      color: "#9B5CFF",
    },
    {
      action: "Completed task",
      target: "Landing page wireframes approved",
      timestamp: hoursAgo(26),
      color: "#CAFF00",
    },
    {
      action: "Added client",
      target: "Launchpad HQ",
      timestamp: hoursAgo(27),
      color: "#CAFF00",
    },
    {
      action: "Created project",
      target: "Launchpad Landing Page",
      timestamp: hoursAgo(28),
      color: "#00F5FF",
    },
    {
      action: "Updated project",
      target: "Stackr Payments UI",
      timestamp: hoursAgo(48),
      color: "#9B5CFF",
    },
    {
      action: "Added client",
      target: "Stackr Inc.",
      timestamp: hoursAgo(50),
      color: "#CAFF00",
    },
    {
      action: "Created project",
      target: "Orbix Design System",
      timestamp: hoursAgo(72),
      color: "#00F5FF",
    },
    {
      action: "Completed task",
      target: "Component library setup",
      timestamp: hoursAgo(96),
      color: "#CAFF00",
    },
    {
      action: "Added client",
      target: "Nexora Labs",
      timestamp: hoursAgo(120),
      color: "#CAFF00",
    },
  ];

  // ── ACTIVITY DATES (streak / heatmap) ────────────────────────────────────
  const activityDates = {};
  activityHistory.forEach(({ timestamp }) => {
    const d = new Date(timestamp);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    activityDates[key] = (activityDates[key] || 0) + 1;
  });

  return { clients, projects, tasks, activityHistory, activityDates };
}
