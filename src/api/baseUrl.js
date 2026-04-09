const raw = import.meta.env.VITE_API_BASE_URL

/** Laravel API base including `/api/v1`. Local dev: omit so `/api/v1` is proxied by Vite. */
export const API_BASE_URL =
  raw && String(raw).trim()
    ? String(raw).trim().replace(/\/$/, '')
    : '/api/v1'
