import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import Skeleton from "./Skeleton";

function relativeTime(ts) {
  const diffMs = Date.now() - ts;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (hours < 48) return "Yesterday";
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
}

export default function ActivityFeed() {
  const { activityHistory, clearActivityHistory } = useApp();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024);
  const scrollRef = useRef(null);
  const [scrollMeta, setScrollMeta] = useState({
    visible: false,
    top: 0,
    height: 0,
  });
  const items = activityHistory;
  const visibleRows = 3;
  const activityRowHeight = 45;
  const maxListHeight = visibleRows * activityRowHeight;
  const hasOverflow = isDesktop && items.length > visibleRows;

  const updateScrollMeta = () => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollTop, scrollHeight, clientHeight } = el;
    const canScroll = scrollHeight > clientHeight + 1;

    if (!canScroll) {
      setScrollMeta({ visible: false, top: 0, height: 0 });
      return;
    }

    const thumbHeight = Math.max(
      28,
      (clientHeight * clientHeight) / scrollHeight,
    );
    const maxTop = clientHeight - thumbHeight;
    const top = (scrollTop / (scrollHeight - clientHeight)) * maxTop;

    setScrollMeta({ visible: true, top, height: thumbHeight });
  };

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoaded(true), 400);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!hasOverflow || !isLoaded) {
      setScrollMeta({ visible: false, top: 0, height: 0 });
      return;
    }

    const raf = requestAnimationFrame(updateScrollMeta);
    window.addEventListener("resize", updateScrollMeta);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateScrollMeta);
    };
  }, [hasOverflow, isLoaded, items.length]);

  const content = (
    <div className="space-y-3">
      {!isLoaded &&
        Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`activity-skeleton-${index}`}
            className="flex items-start gap-3"
          >
            <Skeleton
              width={8}
              height={8}
              borderRadius={999}
              className="mt-[5px]"
            />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton width="72%" height={12} borderRadius={8} />
              <Skeleton width="26%" height={10} borderRadius={8} />
            </div>
          </div>
        ))}

      {isLoaded && (
        <>
          {items.length === 0 && (
            <div className="font-mono text-[10px] text-muted">
              No activity yet.
            </div>
          )}
          {items.map((item, index) => (
            <motion.div
              key={`${item.timestamp}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 220,
                damping: 24,
                delay: index * 0.04,
              }}
              className="flex items-start gap-3"
            >
              <span
                className="mt-[5px] w-[7px] h-[7px] rounded-full"
                style={{ background: item.color || "#CAFF00" }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-[13px] text-[#F0F0F8] font-body leading-[1.35]">
                  {item.action} {item.target}
                </p>
                <p className="font-mono text-[10px] text-muted mt-[2px]">
                  {relativeTime(item.timestamp)}
                </p>
              </div>
            </motion.div>
          ))}
        </>
      )}
    </div>
  );

  return (
    <section className="bg-surface rounded-[22px] border border-white/[0.07] p-[18px] md:p-[22px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-syne font-bold text-[17px] text-[#F0F0F8]">
          Recent Activity
        </h2>
        <button
          onClick={clearActivityHistory}
          className="font-mono text-[10px] uppercase tracking-[1.2px] text-muted"
        >
          Clear history
        </button>
      </div>

      {hasOverflow ? (
        <div
          className="kanban-scroll-wrap"
          style={{ maxHeight: `${maxListHeight}px` }}
        >
          <div
            className="kanban-scroll-native"
            ref={scrollRef}
            onScroll={updateScrollMeta}
            style={{
              maxHeight: `${maxListHeight}px`,
              overflowY: "auto",
              overflowX: "hidden",
              paddingRight: "14px",
            }}
          >
            {content}
          </div>

          <div className="kanban-scroll-rail" aria-hidden>
            {scrollMeta.visible && (
              <div
                className="kanban-scroll-thumb"
                style={{
                  height: `${scrollMeta.height}px`,
                  transform: `translateY(${scrollMeta.top}px)`,
                }}
              />
            )}
          </div>
        </div>
      ) : (
        content
      )}
    </section>
  );
}
