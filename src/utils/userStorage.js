// Keys that belong exclusively to the logged-in user.
// These are cleared whenever a different account takes over the session
// so that Account B never sees Account A's data.
//
// DO NOT include "fs_users" (shared account registry) or "fs_auth" (session,
// gets overwritten directly by the caller).
export const USER_DATA_KEYS = [
  "fs_clients",
  "fs_projects",
  "fs_tasks",
  "fs_profile",
  "fs_activity",
  "fs_activity_dates",
  "fs_settings",
  "profileData", // used by Profile.jsx (LS_KEY constant)
  "tour_complete",
  "profile_tour_complete",
];

/**
 * Wipe every per-user localStorage key.
 * Call this before writing a new session (fs_auth) whenever the active
 * user is changing, so the incoming user starts with a clean slate.
 */
export function clearUserData() {
  USER_DATA_KEYS.forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore quota / private-mode errors */
    }
  });
}
