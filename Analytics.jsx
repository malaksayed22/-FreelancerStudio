// src/pages/Analytics.jsx
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useApp } from "./src/context/AppContext";
import { useToast } from "./src/context/ToastContext";

const REVENUE_BREAKDOWN = [
  {
    client: "Nexora Labs",
    project: "Dashboard UI + API integration",
    amount: "$12,400",
    pct: 35,
    color: "#CAFF00",
  },
  {
    client: "VELORA Fashion",
    project: "E-commerce redesign",
    amount: "$8,900",
    pct: 25,
    color: "#FF2D78",
  },
  {
    client: "PulseMedia",
    project: "Content strategy & SEO",
    amount: "$7,100",
    pct: 20,
    color: "#9B5CFF",
  },
  {
    client: "Avante Studio",
    project: "Brand identity kit",
    amount: "$4,600",
    pct: 13,
    color: "#00F5FF",
  },
  {
    client: "Rexon Finance",
    project: "Fintech dashboard MVP",
    amount: "$2,200",
    pct: 7,
    color: "#FF6B00",
  },
];

export default function Analytics() {
  const [animate, setAnimate] = useState(false);
  const { monthly, topClients, clients, tasks, stats } = useApp();
  const { showToast } = useToast();

  const isEmpty = monthly.length === 0 && topClients.length === 0;

  const totalRevenue = stats[3]?.value ?? 0;
  const avgPerClient =
    clients.length > 0 ? Math.round(totalRevenue / clients.length) : 0;
  const tasksCompleted = tasks?.done?.length ?? 0;
  const tasksPending =
    (tasks?.todo?.length ?? 0) + (tasks?.inProgress?.length ?? 0);

  const maxRev = isEmpty ? 1 : Math.max(1, ...monthly.map((m) => m.revenue));
  const maxClient = isEmpty
    ? 1
    : Math.max(1, ...topClients.map((c) => c.revenue));

  useEffect(() => {
    document.title = "Analytics — Freelancer Studio";
    const t = setTimeout(() => setAnimate(true), 300);
    return () => clearTimeout(t);
  }, []);

  if (isEmpty) {
    return (
      <main
        className="p-7"
        style={{ minHeight: "70vh", display: "flex", flexDirection: "column" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-syne font-extrabold text-[28px] tracking-tight text-[#F0F0F8]">
            Analytics
          </h1>
          <span className="font-mono text-[11px] text-muted">
            YTD —{" "}
            {new Date().toLocaleString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            minHeight: 320,
          }}
        >
          <div
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: 28,
              color: "rgba(240,240,248,0.18)",
              textAlign: "center",
              letterSpacing: "-0.5px",
            }}
          >
            Nothing to analyze yet
          </div>
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 11,
              color: "rgba(240,240,248,0.3)",
              textAlign: "center",
            }}
          >
            Add clients and projects to see your stats
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      className="p-7 grid gap-5"
      style={{ gridTemplateColumns: "1fr 1fr 1fr" }}
    >
      <div className="col-span-3 flex items-center justify-between">
        <h1 className="font-syne font-extrabold text-[28px] tracking-tight text-[#F0F0F8]">
          Analytics
        </h1>
        <span className="font-mono text-[11px] text-muted">
          YTD —{" "}
          {new Date().toLocaleString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>

      {/* KPI row */}
      {[
        {
          label: "Total Revenue",
          value: `$${totalRevenue.toLocaleString()}`,
          delta: totalRevenue > 0 ? "↑ +22% YoY" : "—",
          accent: "#CAFF00",
        },
        {
          label: "Avg per Client",
          value: `$${avgPerClient.toLocaleString()}`,
          delta: avgPerClient > 0 ? "↑ +11% YoY" : "—",
          accent: "#FF2D78",
        },
        {
          label: "Tasks Completed",
          value: String(tasksCompleted),
          delta: tasksPending > 0 ? `↓ ${tasksPending} pending` : "—",
          accent: "#00F5FF",
        },
      ].map((kpi, i) => (
        <motion.div
          key={kpi.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: i * 0.1,
            type: "spring",
            stiffness: 200,
            damping: 22,
          }}
          className="bg-surface border border-white/[0.07] rounded-[20px] p-[22px]"
        >
          <div className="font-mono text-[10px] uppercase tracking-[2px] text-muted mb-3">
            {kpi.label}
          </div>
          <div
            className="font-syne font-extrabold text-[36px] leading-none mb-2"
            style={{ color: kpi.accent }}
          >
            {kpi.value}
          </div>
          <div className="font-mono text-[11px] text-lime">{kpi.delta}</div>
        </motion.div>
      ))}

      {/* Revenue bar chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.35,
          type: "spring",
          stiffness: 180,
          damping: 22,
        }}
        className="col-span-2 bg-surface border border-white/[0.07] rounded-[22px] p-[26px]"
      >
        <h2 className="font-syne font-bold text-[17px] text-[#F0F0F8] mb-5">
          Monthly Revenue
        </h2>
        <div className="flex items-end gap-3" style={{ height: "120px" }}>
          {monthly.map(({ month, revenue }, i) => (
            <div
              key={month}
              className="flex-1 flex flex-col items-center gap-2"
            >
              <div className="font-mono text-[9px] text-muted">
                ${(revenue / 1000).toFixed(1)}k
              </div>
              <motion.div
                className="w-full rounded-t-[6px]"
                initial={{ height: 0 }}
                animate={{
                  height: animate ? `${(revenue / maxRev) * 85}%` : 0,
                }}
                transition={{
                  delay: 0.05 * i,
                  type: "spring",
                  stiffness: 180,
                  damping: 18,
                }}
                style={{
                  background:
                    i === monthly.length - 1
                      ? "#CAFF00"
                      : "rgba(202,255,0,0.25)",
                }}
              />
              <span className="font-mono text-[9px] text-muted">{month}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Top clients */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.45,
          type: "spring",
          stiffness: 180,
          damping: 22,
        }}
        className="bg-surface border border-white/[0.07] rounded-[22px] p-[26px]"
      >
        <h2 className="font-syne font-bold text-[17px] text-[#F0F0F8] mb-5">
          Top Clients
        </h2>
        <div className="flex flex-col gap-4">
          {topClients.map(({ name, revenue, color, initials }, i) => (
            <div key={name}>
              <div className="flex items-center justify-between mb-[6px]">
                <div className="flex items-center gap-2">
                  <div
                    className="w-[22px] h-[22px] rounded-[6px] flex items-center justify-center font-mono text-[8px] font-bold"
                    style={{ background: `${color}20`, color }}
                  >
                    {initials}
                  </div>
                  <span className="text-[12px] font-medium text-[#F0F0F8]">
                    {name}
                  </span>
                </div>
                <span className="font-mono text-[11px]" style={{ color }}>
                  ${revenue.toLocaleString()}
                </span>
              </div>
              <div
                className="h-[3px] rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: animate ? `${(revenue / maxClient) * 100}%` : 0,
                  }}
                  transition={{
                    delay: 0.1 * i + 0.4,
                    duration: 1,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                  style={{ background: color }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Revenue Sources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.55,
          type: "spring",
          stiffness: 180,
          damping: 22,
        }}
        className="col-span-3 bg-surface border border-white/[0.07] rounded-[22px] p-[26px]"
      >
        <h2 className="font-syne font-bold text-[17px] text-[#F0F0F8] mb-5">
          Revenue Sources
        </h2>

        {/* Stacked bar */}
        <div
          className="flex overflow-hidden mb-6"
          style={{ height: 8, borderRadius: 99 }}
        >
          {REVENUE_BREAKDOWN.map((row) => (
            <motion.div
              key={row.client}
              initial={{ width: 0 }}
              animate={{ width: animate ? `${row.pct}%` : 0 }}
              transition={{
                delay: 0.6,
                duration: 0.9,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              style={{ background: row.color, flexShrink: 0 }}
            />
          ))}
        </div>

        {/* Client rows */}
        <div className="flex flex-col gap-[2px]">
          {REVENUE_BREAKDOWN.map((row, i) => (
            <motion.div
              key={row.client}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.65 + i * 0.07,
                type: "spring",
                stiffness: 220,
                damping: 24,
              }}
              onClick={() =>
                showToast(`${row.client} — ${row.project}`, "info", row.color)
              }
              className="flex items-center gap-4 px-3 py-[10px] rounded-[12px]"
              style={{ cursor: "none" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              {/* Color dot */}
              <div
                className="flex-shrink-0 w-[8px] h-[8px] rounded-full"
                style={{
                  background: row.color,
                  boxShadow: `0 0 6px ${row.color}80`,
                }}
              />

              {/* Client name */}
              <span
                className="font-syne font-semibold text-[13px] flex-shrink-0"
                style={{ color: "#F0F0F8", minWidth: 120 }}
              >
                {row.client}
              </span>

              {/* Project name — truncated */}
              <span className="font-mono text-[11px] text-muted flex-1 truncate">
                {row.project}
              </span>

              {/* Amount */}
              <span
                className="font-mono text-[13px] font-bold flex-shrink-0"
                style={{ color: row.color }}
              >
                {row.amount}
              </span>

              {/* Percentage bar + label */}
              <div
                className="flex items-center gap-2 flex-shrink-0"
                style={{ width: 100 }}
              >
                <div
                  className="flex-1 h-[3px] rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.07)" }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: animate ? `${row.pct}%` : 0 }}
                    transition={{
                      delay: 0.7 + i * 0.07,
                      duration: 0.8,
                      ease: [0.34, 1.56, 0.64, 1],
                    }}
                    style={{ background: row.color }}
                  />
                </div>
                <span className="font-mono text-[10px] text-muted w-[28px] text-right">
                  {row.pct}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </main>
  );
}
