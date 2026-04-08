// src/data/store.js
// All app data — edit this to customize your dashboard

export const CLIENTS = [];

export const STATS = [
  {
    id: "s1",
    label: "Clients",
    value: 24,
    suffix: "",
    delta: "↑ +3 this month",
    color: "lime",
    accent: "#CAFF00",
  },
  {
    id: "s2",
    label: "Projects",
    value: 8,
    suffix: "",
    delta: "↑ +2 this week",
    color: "hot",
    accent: "#FF2D78",
  },
  {
    id: "s3",
    label: "Tasks",
    value: 47,
    suffix: "",
    delta: "↓ 12 completed",
    color: "neon",
    accent: "#00F5FF",
  },
  {
    id: "s4",
    label: "Revenue",
    value: 9200,
    suffix: "$",
    delta: "↑ +18% vs last",
    color: "blaze",
    accent: "#FF6B00",
  },
];

export const ACTIVITY = [
  { day: "Mon", height: 55, color: "#CAFF00" },
  { day: "Tue", height: 80, color: "#FF2D78" },
  { day: "Wed", height: 40, color: "#CAFF00" },
  { day: "Thu", height: 90, color: "#9B5CFF" },
  { day: "Fri", height: 70, color: "#00F5FF" },
  { day: "Sat", height: 30, color: "#FF6B00" },
  { day: "Sun", height: 60, color: "#CAFF00" },
];

export const TICKER_ITEMS = [
  "24 clients active",
  "★",
  "8 live projects",
  "★",
  "$9,200 earned this month",
  "★",
  "VELORA delivered",
  "★",
  "Nexora Labs onboarded",
  "★",
  "47 tasks in motion",
  "★",
];

// Task color variants — add/remove freely
export const TASK_COLORS = {
  pink: { accent: "#FF2D78", bg: "rgba(255,45,120,0.12)", text: "#FF2D78" },
  cyan: { accent: "#00F5FF", bg: "rgba(0,245,255,0.10)", text: "#00F5FF" },
  orange: { accent: "#FF6B00", bg: "rgba(255,107,0,0.12)", text: "#FF6B00" },
  purple: { accent: "#9B5CFF", bg: "rgba(155,92,255,0.12)", text: "#9B5CFF" },
  lime: { accent: "#CAFF00", bg: "rgba(202,255,0,0.10)", text: "#CAFF00" },
};

export const INITIAL_TASKS = {
  todo: [],
  inProgress: [],
  done: [],
};

export const ASSIGNEE_COLORS = {
  ZA: { bg: "rgba(155,92,255,0.2)", color: "#9B5CFF" },
  NX: { bg: "rgba(255,107,0,0.2)", color: "#FF6B00" },
  VL: { bg: "rgba(0,245,255,0.15)", color: "#00F5FF" },
  PM: { bg: "rgba(255,45,120,0.2)", color: "#FF2D78" },
  AV: { bg: "rgba(202,255,0,0.15)", color: "#CAFF00" },
};
