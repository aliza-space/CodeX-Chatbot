import { useState, useEffect } from "react";
import Navbar from "../components/common/Navbar.jsx";
import ChatWindow from "../components/chat/ChatWindow.jsx";
import CampusMapModal from "../components/navigation/CampusMapModal.jsx";
import { useChatStore } from "../store/chatStore.js";
import api from "../api/axios.js";

export default function ChatPage() {
  const { isMapOpen, closeMap, mapDestinationId } = useChatStore();
  const [announcement, setAnnouncement] = useState(
    "CodeX 4.0 registrations close on 23 September 2026 — register before it's too late!"
  );
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    api
      .get("/api/announcements")
      .then((res) => {
        const active = res.data?.announcements?.find((a) => a.active);
        if (active) setAnnouncement(active.text);
      })
      .catch(() => {
        // Fallback banner text is already set
      });
  }, []);

  return (
    <div className="relative flex flex-col h-[100dvh] overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      {/* Top Announcement Banner (Dismissible) */}
      {showBanner && (
        <div className="relative z-50 bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium flex items-center justify-between shadow-md shrink-0">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-1.5 sm:gap-2 text-center w-full px-2 min-w-0">
            <span className="shrink-0 p-0.5 rounded-full bg-white/20 text-xs">
              📢
            </span>
            <span className="truncate max-w-[240px] sm:max-w-xl">{announcement}</span>
            <a
              href="https://codex4-0-registration-portal.codersclubgprec.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1 font-semibold underline hover:text-white/80 shrink-0 ml-1.5"
            >
              <span>Register Portal</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            aria-label="Dismiss banner"
            className="p-1 rounded hover:bg-white/20 transition-colors text-white/80 hover:text-white shrink-0 ml-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Top Clean Navbar */}
      <Navbar />

      {/* Main Content Area: Centered, clean, modern chat interface */}
      <div className="relative flex-1 flex overflow-hidden p-0 sm:p-3 lg:p-4 max-w-5xl mx-auto w-full min-h-0">
        <main className="relative flex-1 flex flex-col h-full overflow-hidden min-w-0">
          <ChatWindow variant="full" />
        </main>
      </div>

      {/* Live Campus Map & GPS Walking Navigation Modal */}
      <CampusMapModal
        isOpen={isMapOpen}
        onClose={closeMap}
        initialDestinationId={mapDestinationId}
      />
    </div>
  );
}