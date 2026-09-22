/**
 * Dynamically resolves the API Base URL.
 * - In local development on localhost: defaults to http://localhost:5000.
 * - In local development on a phone/LAN (e.g. 192.168.x.x): targets the local machine on port 5000.
 * - In production (Render static site https://codex-chatbot-1.onrender.com, Vercel, Netlify, etc.):
 *   targets the live Render backend Web Service: https://codex-chatbot-rcxe.onrender.com
 */
export function getApiBaseUrl() {
  const envUrl = import.meta.env.VITE_API_URL;

  // 1. If explicit non-localhost production env var is provided, use it
  if (envUrl && !envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")) {
    return envUrl;
  }

  if (typeof window !== "undefined") {
    const { hostname, protocol, origin } = window.location;

    // 2. If running locally on localhost / 127.0.0.1
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return envUrl || "http://localhost:5000";
    }

    // 3. If accessing from a local phone / LAN IP on the same Wi-Fi
    const isLAN = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
    if (isLAN) {
      return `${protocol}//${hostname}:5000`;
    }

    // 4. If accessed directly on the backend's own hostname
    if (hostname === "codex-chatbot-rcxe.onrender.com") {
      return origin;
    }
  }

  // 5. Default production backend URL for all deployed frontends (codex-chatbot-1.onrender.com, vercel, etc.)
  return "https://codex-chatbot-rcxe.onrender.com";
}
