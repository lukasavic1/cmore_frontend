/**
 * date: 9.4.2026.
 * owner: lukasavic18@gmail.com
 *
 * Provides shared date parsing and validation helpers for task form
 * inputs.
 */

/** Lightweight email check (aligned with typical HTML5 type=email behaviour). */
export function isValidEmail(value) {
  const s = typeof value === "string" ? value.trim() : "";
  if (!s) return false;
  // Single @, local + domain with at least one dot in domain
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}
