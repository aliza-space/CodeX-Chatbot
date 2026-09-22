/**
 * Dynamically resolves the API Base URL.
 * - If VITE_API_URL is set and not a localhost URL, use it directly (e.g. from Vercel / Netlify build).
 * - When running on Render (e.g. https://codex-chatbot-1.onrender.com), returns window.location.origin.
 * - When running on Vercel or Netlify, targets https://codex-chatbot-1.onrender.com.
 * - On LAN IP (e.g. 192.168.x.x for mobile testing), targets the same host IP on port 5000.
 * - On localhost dev, targets http://localhost:5000.
 */
export function getApiBaseUrl() {
  const envUrl = import.meta.env.VITE_API_URL;

  // 1. If explicit non-localhost production env var is provided, use it
  if (envUrl && !envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")) {
    return envUrl;
  }

  if (typeof window !== "undefined") {
    const { hostname, protocol, origin } = window.location;

    // 2. If running directly on Render (unified or co-located service)
    if (hostname.includes("onrender.com")) {
      return origin;
    }

    // 3. If running on Vercel or Netlify frontend
    if (hostname.includes("vercel.app") || hostname.includes("netlify.app")) {
      return "https://codex-chatbot-1.onrender.com";
    }

    // 4. Local LAN IP (e.g. 192.168.x.x for phone testing on same Wi-Fi)
    const isLAN =
      hostname !== "localhost" &&
      hostname !== "127.0.0.1" &&
      /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);

    if (isLAN) {
      return `${protocol}//${hostname}:5000`;
    }

    // 5. Localhost dev
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return envUrl || "http://localhost:5000";
    }

    // 6. Any other custom domain
    return origin;
  }

  return envUrl || "https://codex-chatbot-1.onrender.com";
}
