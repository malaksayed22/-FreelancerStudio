import { useState } from "react";

const TAG_STYLES = {
  design: {
    bg: "rgba(155,92,255,0.18)",
    color: "#c7a8ff",
    border: "rgba(155,92,255,0.35)",
  },
  dev: {
    bg: "rgba(0,245,255,0.14)",
    color: "#7cf7ff",
    border: "rgba(0,245,255,0.3)",
  },
  copy: {
    bg: "rgba(255,45,120,0.16)",
    color: "#ff8ec0",
    border: "rgba(255,45,120,0.3)",
  },
  react: {
    bg: "rgba(202,255,0,0.14)",
    color: "#dfff70",
    border: "rgba(202,255,0,0.32)",
  },
  motion: {
    bg: "rgba(255,107,0,0.16)",
    color: "#ffbb7a",
    border: "rgba(255,107,0,0.32)",
  },
  css: {
    bg: "rgba(0,245,255,0.14)",
    color: "#7cf7ff",
    border: "rgba(0,245,255,0.3)",
  },
  email: {
    bg: "rgba(155,92,255,0.16)",
    color: "#bda7ff",
    border: "rgba(155,92,255,0.32)",
  },
  brand: {
    bg: "rgba(255,45,120,0.16)",
    color: "#ff8ec0",
    border: "rgba(255,45,120,0.3)",
  },
  task: {
    bg: "rgba(255,255,255,0.06)",
    color: "#888",
    border: "rgba(255,255,255,0.1)",
  },
};

function getProgressStyle(pct) {
  if (pct === 100) return { fill: "#52d8a6", text: "#52d8a6" };
  if (pct >= 60) return { fill: "#caff00", text: "#caff00" };
  if (pct >= 30) return { fill: "#ffb866", text: "#ffb866" };
  return { fill: "#9b5cff", text: "#9b5cff" };
}

export default function TaskCard({
  task,
  isDone,
  tag = "design",
  id = "#FS-041",
  title = "Redesign landing page hero section",
  date = "Apr 12",
  progress = 20,
  done = false,
}) {
  const [hovered, setHovered] = useState(false);

  // Keep compatibility with current board calls: <TaskCard task={task} isDone={...} />
  const resolvedTag = task?.tag ?? tag;
  const resolvedId = task?.id ? `#${task.id}` : id;
  const resolvedTitle = task?.title ?? title;
  const resolvedDate = task?.date ?? date;
  const resolvedProgress = task?.progress ?? progress;
  const resolvedDone = typeof isDone === "boolean" ? isDone : done;

  const tagStyle =
    TAG_STYLES[String(resolvedTag).toLowerCase()] ?? TAG_STYLES.task;
  const { fill, text } = getProgressStyle(resolvedProgress);

  return (
    <>
      <style>{`
				.tc-root {
					background: #1c1c1f;
					border-radius: 10px;
					border: 1px solid rgba(255,255,255,0.07);
					padding: 14px;
          margin-bottom: 8px;
					cursor: pointer;
					transition: background 0.15s, border-color 0.15s, transform 0.15s;
					position: relative;
					width: 100%;
					font-family: 'Syne', sans-serif;
				}
				.tc-root:hover {
					background: #222226;
					border-color: rgba(255,255,255,0.13);
					transform: translateY(-1px);
				}
				.tc-top {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 10px;
				}
				.tc-tag {
					font-family: 'DM Mono', monospace;
					font-size: 9px;
					font-weight: 500;
					letter-spacing: 0.08em;
					text-transform: uppercase;
					padding: 3px 8px;
					border-radius: 4px;
					border: 1px solid;
				}
				.tc-id {
					font-family: 'DM Mono', monospace;
					font-size: 9px;
					color: #555;
					letter-spacing: 0.05em;
				}
				.tc-title {
					font-family: 'Syne', sans-serif;
					font-size: 13px;
					font-weight: 600;
					color: #f0f0f0;
					line-height: 1.45;
					margin-bottom: 12px;
					letter-spacing: -0.15px;
				}
				.tc-title.done {
					text-decoration: line-through;
					color: #555;
					font-weight: 500;
				}
				.tc-footer {
					display: flex;
					align-items: center;
					justify-content: space-between;
				}
				.tc-date {
					font-family: 'DM Mono', monospace;
					font-size: 10px;
					color: #555;
				}
				.tc-prog {
					display: flex;
					align-items: center;
					gap: 7px;
				}
				.tc-track {
					width: 48px;
					height: 2px;
					background: rgba(255,255,255,0.08);
					border-radius: 99px;
					overflow: hidden;
				}
				.tc-fill {
					height: 100%;
					border-radius: 99px;
					transition: width 0.4s ease;
				}
				.tc-pct {
					font-family: 'DM Mono', monospace;
					font-size: 10px;
					font-weight: 500;
					min-width: 28px;
					text-align: right;
				}
				.tc-check {
					width: 16px;
					height: 16px;
					border-radius: 50%;
					background: rgba(91,203,138,0.15);
					border: 1px solid rgba(91,203,138,0.3);
					display: flex;
					align-items: center;
					justify-content: center;
				}
			`}</style>

      <div
        className="tc-root"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="tc-top">
          <span
            className="tc-tag"
            style={{
              background: tagStyle.bg,
              color: tagStyle.color,
              borderColor: tagStyle.border,
            }}
          >
            {resolvedTag}
          </span>
          <span className="tc-id">{resolvedId}</span>
        </div>

        <div className={`tc-title${resolvedDone ? " done" : ""}`}>
          {resolvedTitle}
        </div>

        <div className="tc-footer">
          <span className="tc-date">{resolvedDate}</span>
          <div className="tc-prog">
            <div className="tc-track">
              <div
                className="tc-fill"
                style={{ width: `${resolvedProgress}%`, background: fill }}
              />
            </div>
            {resolvedDone ? (
              <div className="tc-check">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path
                    d="M1.5 4L3 5.5L6.5 2"
                    stroke="#5bcb8a"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            ) : (
              <span className="tc-pct" style={{ color: text }}>
                {resolvedProgress}%
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
