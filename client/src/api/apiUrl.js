/**
 * Dynamically resolves the API Base URL.
 * - In production (Vercel): reads VITE_API_URL set via Vercel env vars (your Render URL).
 * - In local dev on a phone/LAN: auto-detects the host IP and targets port 5000.
 * - In local dev on localhost: defaults to http://localhost:5000.
 */
export function getApiBaseUrl() {
  const envUrl = import.meta.env.VITE_API_URL;

  // If a VITE_API_URL is set and it's not a localhost URL, always trust it (production)
  if (envUrl && !envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")) {
    return envUrl;
  }

  if (typeof window !== "undefined") {
    const { hostname, protocol } = window.location;

    // If on a LAN IP (e.g. 192.168.x.x for local phone testing)
    const isLanHost =
      hostname !== "localhost" &&
      hostname !== "127.0.0.1" &&
      !hostname.includes("vercel.app") &&
      !hostname.includes("onrender.com");

    if (isLanHost) {
      return `${protocol}//${hostname}:5000`;
    }
  }

  // Local dev default
  return envUrl || "http://localhost:5000";
}

