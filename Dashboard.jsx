// src/pages/Dashboard.jsx
import { useEffect } from "react";
import StatCard from "./StatCard";
import KanbanBoard from "./src/components/KanbanBoard";
import ClientList from "./ClientList";
import ActivityChart from "./ActivityChart";
import RevenueCard from "./RevenueCard";
import { useApp } from "./src/context/AppContext";
import ActivityFeed from "./src/components/ActivityFeed";

export default function Dashboard() {
  const { stats } = useApp();
  const revenue = stats.find((s) => s.label === "Revenue")?.value ?? 0;

  useEffect(() => {
    document.title = "Dashboard — Freelancer Studio";
  }, []);

  return (
    <main className="p-4 md:p-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[14px] md:gap-[18px]">
      {/* STATS ROW */}
      <div
        id="tour-stats"
        className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-4 gap-[10px] md:gap-[14px]"
      >
        {stats.map((stat, i) => (
          <StatCard key={stat.id} stat={stat} index={i} />
        ))}
      </div>

      {/* LEFT SIDE — main content */}
      <div className="md:col-span-2 lg:col-span-2 space-y-[14px] md:space-y-[18px]">
        <div id="tour-taskboard">
          <KanbanBoard />
        </div>
        <div id="tour-activity">
          <ActivityChart />
        </div>
      </div>

      {/* RIGHT SIDE — stacked cards */}
      <div className="md:col-span-2 lg:col-span-1 space-y-[14px] md:space-y-[18px]">
        <div id="tour-clients">
          <ClientList />
        </div>
        <ActivityFeed />
        <RevenueCard amount={revenue} />
      </div>
    </main>
  );
}
