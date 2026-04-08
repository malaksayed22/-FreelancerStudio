import { useState, useMemo, useRef } from "react";
import { useApp } from "./src/context/AppContext";

const MONTHS = [
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

function generateData() {
  return {};
}

const ACTIVITY_DATA = generateData();

function getColor(level) {
  switch (level) {
    case 0:
      return { bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.06)" };
    case 1:
      return { bg: "rgba(200,255,87,0.15)", border: "rgba(200,255,87,0.2)" };
    case 2:
      return { bg: "rgba(200,255,87,0.35)", border: "rgba(200,255,87,0.4)" };
    case 3:
      return { bg: "rgba(200,255,87,0.6)", border: "rgba(200,255,87,0.65)" };
    case 4:
      return { bg: "#c8ff57", border: "#c8ff57" };
    default:
      return { bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.06)" };
  }
}
function dateToKey(d) {
  const date = typeof d === "number" ? new Date(d) : d;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function buildGrid() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // go back to last Sunday (start of week)
  const endSunday = new Date(today);
  endSunday.setDate(today.getDate() + ((7 - today.getDay()) % 7));

  const startDate = new Date(endSunday);
  startDate.setDate(endSunday.getDate() - 52 * 7 + 1);

  // build weeks array: each week = array of 7 days Sun->Sat
  const weeks = [];
  let current = new Date(startDate);

  while (current <= endSunday) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const key = dateToKey(current);
      week.push({
        date: new Date(current),
        key,
        level: ACTIVITY_DATA[key] ?? 0,
      });
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

function getMonthLabels(weeks) {
  const labels = [];
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    const month = week[0].date.getMonth();
    if (month !== lastMonth) {
      labels.push({ index: i, label: MONTHS[month] });
      lastMonth = month;
    }
  });
  return labels;
}

function calcStreak(data) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let streak = 0;
  let d = new Date(today);
  while (true) {
    const key = dateToKey(d);
    if (data[key] && data[key] > 0) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else break;
  }
  return streak;
}

function calcTotal(data) {
  return Object.values(data).filter((v) => v > 0).length;
}

const WEEKS = buildGrid();
const MONTH_LABELS = getMonthLabels(WEEKS);
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function ActivityChart() {
  const { activityDates } = useApp();
  const [tooltip, setTooltip] = useState(null);
  const tooltipRef = useRef(null);
  const tooltipVisible = useRef(false);

  // Build activity level map from the persistent activityDates store
  // (never cleared by "Clear history")
  const activityData = useMemo(() => {
    const levels = {};
    Object.entries(activityDates || {}).forEach(([key, count]) => {
      levels[key] = count >= 6 ? 4 : count >= 4 ? 3 : count >= 2 ? 2 : 1;
    });
    return levels;
  }, [activityDates]);

  const streakCount = useMemo(() => calcStreak(activityData), [activityData]);
  const totalCount = useMemo(() => calcTotal(activityData), [activityData]);
  const CELL = 11;
  const GAP = 3;
  const STEP = CELL + GAP;

  return (
    <>
      <style>{`
        .wa-wrap {
          background: #161618;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 20px 24px;
          font-family: 'Syne', sans-serif;
          width: 100%;
          position: relative;
          overflow: hidden;
        }
        .wa-glow {
          position: absolute;
          top: -40px; right: -40px;
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(200,255,87,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .wa-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
        }
        .wa-title {
          font-size: 16px; font-weight: 700;
          color: #f0f0f0; letter-spacing: -0.3px;
        }
        .wa-badge {
          font-family: 'DM Mono', monospace;
          font-size: 10px; font-weight: 500;
          padding: 4px 12px; border-radius: 99px;
          border: 1px solid rgba(200,255,87,0.3);
          color: #c8ff57;
          background: rgba(200,255,87,0.08);
          letter-spacing: 0.04em;
        }
        .wa-stats {
          display: flex; gap: 20px;
          margin-bottom: 18px;
        }
        .wa-stat {
          display: flex; flex-direction: column; gap: 2px;
        }
        .wa-stat-val {
          font-size: 20px; font-weight: 700;
          color: #f0f0f0; letter-spacing: -0.5px;
          line-height: 1;
        }
        .wa-stat-val span {
          font-size: 13px; color: #c8ff57;
          font-weight: 600; margin-left: 2px;
        }
        .wa-stat-lbl {
          font-family: 'DM Mono', monospace;
          font-size: 9px; color: #555;
          letter-spacing: 0.08em; text-transform: uppercase;
        }
        .wa-stat-divider {
          width: 1px; background: rgba(255,255,255,0.07);
          align-self: stretch; margin: 2px 0;
        }
        .wa-grid-area { position: relative; }
        .wa-months {
          display: flex; margin-bottom: 5px;
          padding-left: 28px;
          position: relative; height: 14px;
        }
        .wa-month-lbl {
          position: absolute;
          font-family: 'DM Mono', monospace;
          font-size: 9px; color: #444;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .wa-grid-row { display: flex; gap: 0; }
        .wa-left { display: flex; flex-direction: column; justify-content: space-between; padding-right: 6px; padding-top: 1px; }
        .wa-day-lbl {
          font-family: 'DM Mono', monospace;
          font-size: 8px; color: #444;
          letter-spacing: 0.04em;
          height: ${CELL}px;
          line-height: ${CELL}px;
        }
        .wa-grid {
          display: flex; gap: ${GAP}px; align-items: flex-start;
        }
        .wa-week { display: flex; flex-direction: column; gap: ${GAP}px; }
        .wa-cell {
          width: ${CELL}px; height: ${CELL}px;
          border-radius: 2px;
          border: 1px solid;
          cursor: pointer;
          transition: transform 0.1s, filter 0.1s;
          position: relative;
          flex-shrink: 0;
        }
        .wa-cell:hover { transform: scale(1.4); filter: brightness(1.3); z-index: 10; }
        .wa-legend {
          display: flex; align-items: center; gap: 6px;
          margin-top: 12px; justify-content: flex-end;
        }
        .wa-legend-lbl {
          font-family: 'DM Mono', monospace;
          font-size: 9px; color: #444;
          letter-spacing: 0.04em;
        }
        .wa-legend-cell {
          width: ${CELL}px; height: ${CELL}px;
          border-radius: 2px; border: 1px solid;
        }
        .wa-tooltip {
          position: fixed;
          background: #1c1c1f;
          border: 1px solid rgba(255,255,255,0.13);
          border-radius: 7px;
          padding: 7px 11px;
          pointer-events: none;
          z-index: 999;
          transform: translate(-50%, -110%);
          white-space: nowrap;
        }
        .wa-tooltip-title {
          font-family: 'Syne', sans-serif;
          font-size: 11px; font-weight: 600;
          color: #f0f0f0; margin-bottom: 2px;
        }
        .wa-tooltip-sub {
          font-family: 'DM Mono', monospace;
          font-size: 9px; color: #888;
          letter-spacing: 0.04em;
        }
        .wa-streak-num {
          font-size: 20px; font-weight: 700; color: #f0f0f0; letter-spacing: -0.5px; line-height: 1;
        }
      `}</style>

      <div className="wa-wrap">
        <div className="wa-glow" />

        <div className="wa-header">
          <div className="wa-title">Weekly Activity</div>
          <div className="wa-badge">Apr 2026</div>
        </div>

        <div className="wa-stats">
          <div className="wa-stat">
            <div
              className="wa-stat-val"
              style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
            >
              {streakCount}
              <svg width="11" height="13" viewBox="0 0 12 14" fill="none">
                <path
                  d="M6 1C6 1 9 4.5 9 7.5C9 9.433 7.657 11 6 11C4.343 11 3 9.433 3 7.5C3 6.5 3.5 5.5 3.5 5.5C3.5 5.5 4 7 5 7C5 5 4 3 6 1Z"
                  fill="#c8ff57"
                  opacity="0.9"
                />
                <path
                  d="M6 9C6.828 9 7.5 8.328 7.5 7.5C7.5 7 7.2 6.5 7.2 6.5C7.2 6.5 7 7.2 6.3 7.2C5.8 7.2 5.5 6.8 5.5 6.8C5.5 7.2 5.172 9 6 9Z"
                  fill="#c8ff57"
                />
              </svg>
            </div>
            <div className="wa-stat-lbl">day streak</div>
          </div>
          <div className="wa-stat-divider" />
          <div className="wa-stat">
            <div className="wa-stat-val">{totalCount}</div>
            <div className="wa-stat-lbl">active days</div>
          </div>
          <div className="wa-stat-divider" />
          <div className="wa-stat">
            <div className="wa-stat-val">
              52<span>wks</span>
            </div>
            <div className="wa-stat-lbl">tracked</div>
          </div>
        </div>

        <div className="wa-grid-area">
          <div className="wa-months">
            {MONTH_LABELS.map(({ index, label }) => (
              <span
                key={label + index}
                className="wa-month-lbl"
                style={{ left: `${28 + index * STEP}px` }}
              >
                {label}
              </span>
            ))}
          </div>

          <div className="wa-grid-row">
            <div className="wa-left">
              {DAYS.map((d, i) => (
                <div
                  key={d}
                  className="wa-day-lbl"
                  style={{ visibility: i % 2 === 1 ? "visible" : "hidden" }}
                >
                  {d}
                </div>
              ))}
            </div>

            <div className="wa-grid">
              {WEEKS.map((week, wi) => (
                <div key={wi} className="wa-week">
                  {week.map((day) => {
                    const level = activityData[day.key] ?? 0;
                    const { bg, border } = getColor(level);
                    const isToday = day.key === dateToKey(new Date());
                    return (
                      <div
                        key={day.key}
                        className="wa-cell"
                        style={{
                          background: bg,
                          borderColor: isToday ? "#c8ff57" : border,
                          boxShadow:
                            level === 4
                              ? "0 0 4px rgba(200,255,87,0.4)"
                              : "none",
                          outline: isToday
                            ? "1px solid rgba(200,255,87,0.6)"
                            : "none",
                          outlineOffset: "1px",
                        }}
                        onMouseEnter={(e) => {
                          setTooltip({ day, level });
                          tooltipVisible.current = true;
                          if (tooltipRef.current) {
                            tooltipRef.current.style.left = e.clientX + "px";
                            tooltipRef.current.style.top = e.clientY + "px";
                          }
                        }}
                        onMouseLeave={() => {
                          setTooltip(null);
                          tooltipVisible.current = false;
                        }}
                        onMouseMove={(e) => {
                          if (tooltipVisible.current && tooltipRef.current) {
                            tooltipRef.current.style.left = e.clientX + "px";
                            tooltipRef.current.style.top = e.clientY + "px";
                          }
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="wa-legend">
            <span className="wa-legend-lbl">less</span>
            {[0, 1, 2, 3, 4].map((l) => {
              const { bg, border } = getColor(l);
              return (
                <div
                  key={l}
                  className="wa-legend-cell"
                  style={{ background: bg, borderColor: border }}
                />
              );
            })}
            <span className="wa-legend-lbl">more</span>
          </div>
        </div>

        {tooltip && (
          <div
            ref={tooltipRef}
            className="wa-tooltip"
            style={{ left: 0, top: 0 }}
          >
            <div className="wa-tooltip-title">
              {tooltip.level === 0
                ? "No activity"
                : tooltip.level === 1
                  ? "Light activity"
                  : tooltip.level === 2
                    ? "Moderate activity"
                    : tooltip.level === 3
                      ? "High activity"
                      : "Peak activity"}
            </div>
            <div className="wa-tooltip-sub">
              {tooltip.day.date.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
