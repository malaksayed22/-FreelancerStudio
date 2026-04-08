// src/components/ClientList.jsx
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "./src/context/AppContext";
import Skeleton from "./src/components/Skeleton";

const AVATAR_STYLES = {
  ca1: { background: "rgba(202,255,0,0.13)", color: "#CAFF00" },
  ca2: { background: "rgba(255,45,120,0.13)", color: "#FF2D78" },
  ca3: { background: "rgba(0,245,255,0.10)", color: "#00F5FF" },
  ca4: { background: "rgba(155,92,255,0.13)", color: "#9B5CFF" },
  ca5: { background: "rgba(255,107,0,0.13)", color: "#FF6B00" },
};

const STATUS_STYLES = {
  active: { background: "#CAFF00", boxShadow: "0 0 7px #CAFF00" },
  idle: { background: "#FF6B00" },
  away: { background: "rgba(240,240,248,0.42)" },
};

export default function ClientList() {
  const { clients } = useApp();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024);
  const scrollRef = useRef(null);
  const [scrollMeta, setScrollMeta] = useState({
    visible: false,
    top: 0,
    height: 0,
  });
  const visibleRows = 3;
  const clientRowHeight = 64;
  const maxListHeight = visibleRows * clientRowHeight;
  const hasOverflow = isDesktop && clients.length > visibleRows;

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
  }, [hasOverflow, isLoaded, clients.length]);

  const rows =
    isLoaded &&
    clients.map((client, i) => (
      <motion.div
        key={client.id}
        whileHover={{ x: 6 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="flex items-center gap-3 py-3 border-b border-white/[0.07] last:border-0"
        style={{ cursor: "none" }}
      >
        <div
          className="w-10 h-10 rounded-[12px] flex items-center justify-center font-syne text-[13px] font-extrabold flex-shrink-0"
          style={AVATAR_STYLES[client.colorClass]}
        >
          {client.initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-semibold text-[#F0F0F8] truncate">
            {client.name}
          </div>
          <div className="text-[11px] text-muted font-mono">{client.role}</div>
        </div>

        <div
          className="w-[7px] h-[7px] rounded-full flex-shrink-0 relative"
          style={STATUS_STYLES[client.status]}
        >
          {client.status === "active" && i === 0 && (
            <div
              className="absolute inset-[-4px] rounded-full border-2 border-lime pulse-ring"
              style={{ borderColor: "#CAFF00" }}
            />
          )}
        </div>
      </motion.div>
    ));

  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, type: "spring", stiffness: 180, damping: 22 }}
      className="bg-surface rounded-[22px] border border-white/[0.07] p-[20px] md:p-[26px]"
    >
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-syne font-bold text-[17px] text-[#F0F0F8]">
          Clients
        </h2>
        <button
          className="add-btn"
          onClick={() => {
            navigate("/clients");
            setTimeout(
              () => window.dispatchEvent(new Event("fs:new-client")),
              120,
            );
          }}
          aria-label="Add new client"
        >
          +
        </button>
      </div>

      {!isLoaded &&
        Array.from({ length: 5 }).map((_, index) => (
          <div
            key={`client-skeleton-${index}`}
            className="flex items-center gap-3 py-3 border-b border-white/[0.07] last:border-0"
          >
            <Skeleton width={40} height={40} borderRadius={12} />
            <div className="flex-1 space-y-2">
              <Skeleton width="58%" height={12} borderRadius={8} />
              <Skeleton width="36%" height={10} borderRadius={8} />
            </div>
            <Skeleton width={8} height={8} borderRadius={999} />
          </div>
        ))}

      {isLoaded && clients.length === 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "28px 0",
            gap: 10,
          }}
        >
          {/* CSS pixel-art person icon */}
          <div
            style={{
              position: "relative",
              width: 24,
              height: 24,
              marginBottom: 4,
            }}
          >
            <div
              style={{
                position: "absolute",
                width: 1,
                height: 1,
                boxShadow: [
                  "10px 1px 0 4px rgba(202,255,0,0.5)",
                  "10px 8px 0 5px rgba(155,92,255,0.55)",
                  "5px 10px 0 3px rgba(155,92,255,0.45)",
                  "17px 10px 0 3px rgba(155,92,255,0.45)",
                  "7px 16px 0 3px rgba(28,28,40,0.8)",
                  "13px 16px 0 3px rgba(28,28,40,0.8)",
                ].join(", "),
              }}
            />
          </div>
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 11,
              color: "rgba(240,240,248,0.3)",
            }}
          >
            No clients yet
          </span>
          <button
            className="add-btn"
            style={{
              width: "auto",
              padding: "0 12px",
              fontSize: 11,
              height: 30,
            }}
            onClick={() => {
              navigate("/clients");
              setTimeout(
                () => window.dispatchEvent(new Event("fs:new-client")),
                120,
              );
            }}
          >
            + Add Client
          </button>
        </div>
      )}

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
              paddingRight: "18px",
            }}
          >
            {rows}
          </div>

          <div
            className="kanban-scroll-rail"
            style={{ right: "4px" }}
            aria-hidden
          >
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
        <div>{rows}</div>
      )}
    </motion.section>
  );
}
