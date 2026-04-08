import { buildSeedData } from "../data/seedData";

/**
 * seedUserData()
 *
 * Writes demo content to localStorage so every new account starts with a
 * populated dashboard. Call this right after clearUserData() during signup.
 *
 * Does NOT touch fs_profile, fs_auth, or fs_users — those are written by
 * the caller with the real user's name/email/password hash.
 */
export function seedUserData() {
  const { clients, projects, tasks, activityHistory, activityDates } =
    buildSeedData();
  try {
    localStorage.setItem("fs_clients", JSON.stringify(clients));
    localStorage.setItem("fs_projects", JSON.stringify(projects));
    localStorage.setItem("fs_tasks", JSON.stringify(tasks));
    localStorage.setItem("fs_activity", JSON.stringify(activityHistory));
    localStorage.setItem("fs_activity_dates", JSON.stringify(activityDates));

    // Seed profile stats + skills derived from the demo data
    const activeClients = clients.filter((c) => c.status === "active").length;
    const totalProjects = projects.length;
    const existing = (() => {
      try {
        return JSON.parse(localStorage.getItem("profileData") || "{}");
      } catch {
        return {};
      }
    })();
    const seededProfile = {
      ...existing,
      role: existing.role || "Freelance Developer",
      bio:
        existing.bio ||
        "Building clean, modern digital products for startups and growing businesses. Open to new projects.",
      location: existing.location || "Remote",
      stats: {
        projects: totalProjects,
        platforms: 4,
        streak: 12,
        clients: activeClients,
      },
      skills:
        existing.skills && existing.skills.length > 0
          ? existing.skills
          : [
              "React",
              "Node.js",
              "TypeScript",
              "Figma",
              "Tailwind CSS",
              "Framer Motion",
              "REST APIs",
              "UI/UX",
            ],
    };
    localStorage.setItem("profileData", JSON.stringify(seededProfile));
  } catch {
    /* ignore quota / private-mode errors */
  }
}
