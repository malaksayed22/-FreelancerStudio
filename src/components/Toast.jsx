import { motion } from "framer-motion";

export default function Toast({ message, type, accentColor }) {
  const fallback =
    type === "success" ? "#CAFF00" : type === "error" ? "#FF2D78" : "#00F5FF";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 60 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="rounded-[12px] border border-white/[0.07] bg-surface px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
      style={{ borderLeft: `3px solid ${accentColor || fallback}` }}
    >
      <p className="font-mono text-[11px] text-[#F0F0F8]">{message}</p>
    </motion.div>
  );
}
