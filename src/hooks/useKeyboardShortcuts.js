import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function useKeyboardShortcuts({
  onNewTask,
  onClose,
  onCommandPalette,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();
      const target = event.target;
      const isTypingTarget =
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if ((event.metaKey || event.ctrlKey) && key === "k") {
        event.preventDefault();
        onCommandPalette?.();
        return;
      }

      if (isTypingTarget) return;

      if (key === "escape") {
        onClose?.();
        return;
      }

      if (key === "c") {
        navigate("/clients");
        return;
      }

      if (key === "d") {
        navigate("/");
        return;
      }

      if (key === "p") {
        navigate("/projects");
        return;
      }

      if (key === "a") {
        navigate("/analytics");
        return;
      }

      if (key === "u") {
        navigate("/profile");
        return;
      }

      if (key === "s") {
        navigate("/settings");
        return;
      }

      if (key === "n" && location.pathname === "/") {
        onNewTask?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [location.pathname, navigate, onClose, onCommandPalette, onNewTask]);
}
