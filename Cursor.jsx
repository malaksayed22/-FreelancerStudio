// Cursor.jsx
// Zero-lag custom cursor — element lives on document.body, OUTSIDE React's
// virtual DOM and outside #root.  This prevents three root causes of lag:
//   1. React's Framer-Motion-animated ancestors (AnimatedRoute wraps pages in
//      a motion.div with x/opacity transforms; any CSS `transform` on an
//      ancestor breaks `position:fixed`, making the cursor drift with the page
//      during route transitions).
//   2. React.StrictMode double-invocation of effects (no DOM churn here).
//   3. React reconciliation/concurrent-mode rendering touching the cursor node.
//
// The cursor div is created once via vanilla DOM, appended to <body> (zero
// ancestors with transforms), and all event listeners are attached there.
// React renders `null` — it never knows this element exists.
import { useEffect } from "react";

export default function Cursor() {
  useEffect(() => {
    // Skip custom cursor on touch/mobile devices — they have no mouse pointer
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const el = document.createElement("div");
    el.className = "cursor";
    document.body.appendChild(el);

    let clicking = false;

    const write = (x, y) => {
      const s = clicking ? " scale(0.65)" : "";
      el.style.transform = `translate3d(${x}px,${y}px,0)${s}`;
    };

    const onMove = (e) => write(e.clientX - 7, e.clientY - 7);
    const onDown = (e) => {
      clicking = true;
      write(e.clientX - 7, e.clientY - 7);
    };
    const onUp = (e) => {
      clicking = false;
      write(e.clientX - 7, e.clientY - 7);
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mousedown", onDown, { passive: true });
    document.addEventListener("mouseup", onUp, { passive: true });

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      if (el.parentNode) el.parentNode.removeChild(el);
    };
  }, []);

  // React renders nothing — the cursor element is managed purely via vanilla DOM
  return null;
}
