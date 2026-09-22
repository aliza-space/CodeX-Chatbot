/**
 * Dynamically resolves the API Base URL.
 * When accessing from localhost, uses http://localhost:5000.
 * When accessing from a mobile phone or another device on the local Wi-Fi (e.g. 192.168.x.x),
 * it dynamically targets the same host IP on port 5000 instead of failing on the phone's localhost.
 */
export function getApiBaseUrl() {
  const envUrl = import.meta.env.VITE_API_URL;

  if (typeof window !== "undefined") {
    const { hostname, protocol } = window.location;
    const isNetworkHost = hostname !== "localhost" && hostname !== "127.0.0.1";

    // If on a LAN IP (e.g. 192.168.x.x for local phone testing)
    if (isNetworkHost && !hostname.includes("vercel.app") && (!envUrl || envUrl.includes("localhost") || envUrl.includes("127.0.0.1"))) {
      return `${protocol}//${hostname}:5000`;
    }

    // If deployed on Vercel or live production domain
    if (hostname.includes("vercel.app") && (!envUrl || envUrl.includes("localhost"))) {
      return "https://codex-chatbot-rcxe.onrender.com";
    }
  }

  return envUrl || "https://codex-chatbot-rcxe.onrender.com";
}
