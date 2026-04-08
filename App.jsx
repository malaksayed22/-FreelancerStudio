// src/App.jsx
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import Cursor from "./Cursor";
import Ticker from "./Ticker";
import Header from "./Header";

import Dashboard from "./Dashboard";
import Projects from "./Projects";
import Clients from "./Clients";
import Analytics from "./Analytics";
import Profile from "./src/pages/Profile";
import Settings from "./src/pages/Settings";
import Login from "./src/pages/Login";
import Signup from "./src/pages/Signup";
import ProtectedRoute from "./src/components/ProtectedRoute";
import ProjectDetail from "./src/pages/ProjectDetail";
import ClientDetail from "./src/pages/ClientDetail";
import { AppProvider } from "./src/context/AppContext";
import { ToastProvider } from "./src/context/ToastContext";
import CommandPalette from "./src/components/CommandPalette";
import ErrorBoundary from "./src/components/ErrorBoundary";
import OnboardingTour from "./src/components/OnboardingTour";

import "./globals.css";

const pageVariants = {
  initial: { opacity: 0, x: 30 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    x: -30,
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
  },
};

function AnimatedRoute({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}

function PlaceholderPage({ title }) {
  useEffect(() => {
    document.title = `${title} — Freelancer Studio`;
  }, [title]);

  return (
    <main className="p-7">
      <section className="bg-surface rounded-[22px] border border-white/[0.07] p-[26px]">
        <h1 className="font-syne font-extrabold text-[28px] tracking-tight text-[#F0F0F8]">
          {title}
        </h1>
        <p className="font-body text-[14px] text-muted mt-2">Coming soon.</p>
      </section>
    </main>
  );
}

function NotFoundPage() {
  useEffect(() => {
    document.title = "404 — Freelancer Studio";
  }, []);

  return (
    <main
      className="p-7 flex flex-col items-center justify-center"
      style={{ minHeight: "60vh" }}
    >
      <section className="bg-surface rounded-[22px] border border-white/[0.07] p-[40px] text-center">
        <div
          className="font-syne font-extrabold text-[72px] leading-none"
          style={{ color: "#CAFF00" }}
        >
          404
        </div>
        <h1 className="font-syne font-bold text-[22px] text-[#F0F0F8] mt-3">
          Page not found
        </h1>
        <p className="font-body text-[14px] text-muted mt-2 mb-6">
          This page doesn&apos;t exist in the Studio.
        </p>
        <a
          href="/"
          className="font-mono text-[11px] font-bold px-6 py-2 rounded-full"
          style={{ background: "#CAFF00", color: "#0A0A0F" }}
        >
          Back to Dashboard
        </a>
      </section>
    </main>
  );
}

function RoutedPages() {
  const location = useLocation();

  return (
    <AnimatePresence mode="sync">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <AnimatedRoute>
              <ErrorBoundary>
                <Dashboard />
              </ErrorBoundary>
            </AnimatedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <AnimatedRoute>
              <ErrorBoundary>
                <Projects />
              </ErrorBoundary>
            </AnimatedRoute>
          }
        />
        <Route
          path="/projects/:id"
          element={
            <AnimatedRoute>
              <ErrorBoundary>
                <ProjectDetail />
              </ErrorBoundary>
            </AnimatedRoute>
          }
        />
        <Route
          path="/clients"
          element={
            <AnimatedRoute>
              <ErrorBoundary>
                <Clients />
              </ErrorBoundary>
            </AnimatedRoute>
          }
        />
        <Route
          path="/clients/:id"
          element={
            <AnimatedRoute>
              <ErrorBoundary>
                <ClientDetail />
              </ErrorBoundary>
            </AnimatedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <AnimatedRoute>
              <ErrorBoundary>
                <Analytics />
              </ErrorBoundary>
            </AnimatedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <AnimatedRoute>
              <ErrorBoundary>
                <Profile />
              </ErrorBoundary>
            </AnimatedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <AnimatedRoute>
              <ErrorBoundary>
                <Settings />
              </ErrorBoundary>
            </AnimatedRoute>
          }
        />
        <Route
          path="*"
          element={
            <AnimatedRoute>
              <NotFoundPage />
            </AnimatedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function AppShell() {
  const location = useLocation();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [tourDone, setTourDone] = useState(() =>
    Boolean(localStorage.getItem("tour_complete")),
  );

  useEffect(() => {
    if (location.pathname === "/") {
      setTourDone(Boolean(localStorage.getItem("tour_complete")));
    }
  }, [location.pathname]);

  const closeOverlays = () => {
    setIsCommandPaletteOpen(false);
  };

  return (
    <ProtectedRoute>
      {/* Ambient blobs */}
      <div className="noise-layer" />
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      {/* Custom cursor */}
      <Cursor />

      <div style={{ position: "relative", zIndex: 1 }}>
        <Ticker />
        <Header
          onNewTask={() => {
            window.dispatchEvent(new Event("fs:new-task-inline"));
          }}
          onCloseOverlays={closeOverlays}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />

        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          onNewTask={() => {
            window.dispatchEvent(new Event("fs:new-task-inline"));
          }}
          onNewProject={() => window.dispatchEvent(new Event("fs:new-project"))}
          onNewClient={() => window.dispatchEvent(new Event("fs:new-client"))}
        />

        <RoutedPages />

        {!tourDone && location.pathname === "/" && (
          <OnboardingTour
            onComplete={() => {
              setTourDone(true);
              localStorage.setItem("tour_complete", "1");
            }}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}

function AppRootRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<AppShell />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppProvider>
          <AppRootRoutes />
        </AppProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
