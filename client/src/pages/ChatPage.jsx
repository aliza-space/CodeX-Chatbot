import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import MainSidebar from "../components/common/MainSidebar.jsx";
import ChatWindow from "../components/chat/ChatWindow.jsx";
import UserProfileModal from "../components/common/UserProfileModal.jsx";
import { useChatStore } from "../store/chatStore.js";
import { useChatStream } from "../hooks/useChatStream.js";
import api from "../api/axios.js";
import { IconSparkles, IconExternal } from "../components/common/Icons.jsx";

export default function ChatPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { openMap } = useChatStore();
  const { sendMessage } = useChatStream();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [announcement, setAnnouncement] = useState(
    "CodeX 4.0 registrations close on 23 September 2026 — register before slots fill up!"
  );
  const [showBanner, setShowBanner] = useState(true);
  const processedDeepLink = useRef(false);

  // Handle QR code deep links (?q=/events or ?nav=csm-labs)
  useEffect(() => {
    if (processedDeepLink.current) return;
    const query = searchParams.get("q") || searchParams.get("cmd");
    const nav = searchParams.get("nav");

    if (query) {
      processedDeepLink.current = true;
      sendMessage(query);
      setSearchParams({}, { replace: true });
    } else if (nav) {
      processedDeepLink.current = true;
      openMap(nav);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, sendMessage, openMap, setSearchParams]);

  // Fetch active announcements from server
  useEffect(() => {
    api
      .get("/api/announcements")
      .then((res) => {
        const active = res.data?.announcements?.find((a) => a.active);
        if (active) setAnnouncement(active.text);
      })
      .catch(() => {
        // Fallback banner text is already initialized
      });
  }, []);

  const handleToggleSidebar = () => {
    // If on mobile / tablet (< 1024px), toggle mobile overlay
    if (window.innerWidth < 1024) {
      setMobileSidebarOpen((prev) => !prev);
    } else {
      setSidebarOpen((prev) => !prev);
    }
  };

  return (
    <div className="relative flex h-[100dvh] w-full overflow-hidden bg-white dark:bg-[#070a13] text-slate-900 dark:text-slate-100 font-sans">
      {/* 1. Desktop Persistent / Collapsible Sidebar */}
      <MainSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenProfile={() => setProfileModalOpen(true)}
        isMobile={false}
      />

      {/* 2. Mobile Slide-Over Drawer Sidebar */}
      <MainSidebar
        open={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        onOpenProfile={() => setProfileModalOpen(true)}
        isMobile={true}
      />

      {/* 3. Main Chat Viewport */}
      <div className="relative flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Optional Slim Announcement Pill */}
        {showBanner && (
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white px-3 py-1.5 text-xs font-medium flex items-center justify-between shadow-xs z-30 shrink-0">
            <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 text-center w-full px-2 min-w-0">
              <IconSparkles className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate max-w-[280px] sm:max-w-xl">{announcement}</span>
              <a
                href="https://codex4-0-registration-portal.codersclubgprec.in"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-1 font-semibold underline underline-offset-2 hover:text-blue-100 shrink-0 ml-1.5"
              >
                <span>Register</span>
                <IconExternal className="w-3 h-3" />
              </a>
            </div>
            <button
              onClick={() => setShowBanner(false)}
              aria-label="Dismiss banner"
              className="p-1 rounded-md hover:bg-white/20 transition-colors text-white/80 hover:text-white shrink-0 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Full-Height Chat Canvas */}
        <main className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
          <ChatWindow
            onToggleSidebar={handleToggleSidebar}
            sidebarOpen={sidebarOpen}
          />
        </main>
      </div>

      {/* 4. Dedicated User Profile Modal */}
      <UserProfileModal
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </div>
  );
}