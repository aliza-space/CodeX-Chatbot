import { useState, useEffect } from "react";
import Navbar from "../components/common/Navbar.jsx";
import ChatWindow from "../components/chat/ChatWindow.jsx";
import CampusMapModal from "../components/navigation/CampusMapModal.jsx";
import { useChatStream } from "../hooks/useChatStream.js";
import { useChatStore } from "../store/chatStore.js";
import api from "../api/axios.js";

export default function ChatPage() {
  const { sendMessage } = useChatStream();
  const { isMapOpen, closeMap, mapDestinationId, openMap } = useChatStore();
  const [announcement, setAnnouncement] = useState(
    "CodeX 4.0 registrations close on 23 September 2026 — register before it's too late!"
  );
  const [showBanner, setShowBanner] = useState(true);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

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

  const handleQuickTrigger = (query) => {
    sendMessage(query);
    setShowMobileSidebar(false);
  };

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

      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area: Split View on Desktop, Full-bleed chat on Mobile */}
      <div className="relative flex-1 flex overflow-hidden p-0 sm:p-4 lg:p-5 max-w-7xl mx-auto w-full gap-0 sm:gap-4 lg:gap-5 min-h-0">
        {/* Left Rail: Event Info Hub (Desktop: persistent, Mobile: toggleable slide-over) */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 sm:w-80 max-w-[85vw] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 sm:p-5 flex flex-col overflow-y-auto transform transition-transform duration-300 lg:relative lg:translate-x-0 lg:z-0 lg:p-0 lg:bg-transparent lg:border-none lg:w-80 lg:shrink-0 ${
            showMobileSidebar ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          {/* Mobile close button */}
          <div className="flex items-center justify-between lg:hidden mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
            <span className="font-display font-bold text-sm">CodeX 4.0 Event Guide</span>
            <button
              onClick={() => setShowMobileSidebar(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {/* Event Spotlight Card */}
            <div className="rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800/90 bg-white/90 dark:bg-slate-900/90 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                  Flagship Event
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-accent-50 dark:bg-accent-950/60 text-accent-600 dark:text-accent-400 border border-accent-200 dark:border-accent-800">
                  24 Sept 2026
                </span>
              </div>
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                CodeX 4.0 Hackathon
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Full-day team coding competition hosted by Coders' Club at GPREC, Kurnool.
              </p>

              <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">📍 Venue</span>
                  <span className="font-medium">CSM Computer Labs</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">👥 Format</span>
                  <span className="font-medium">2 - 3 per Team</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">🏆 Prize Pool</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Up to ₹50,000</span>
                </div>
              </div>
            </div>

            {/* Quick Explore Triggers */}
            <div className="rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800/90 bg-white/90 dark:bg-slate-900/90 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
                Instant Queries
              </h4>
              <div className="space-y-1.5">
                {[
                  { label: "CodeX 4.0 Rules & Eligibility", query: "What are the rules and eligibility criteria for CodeX 4.0?", icon: "📋" },
                  { label: "Campus Map & Food Court", query: "Where is the campus food court, cafeteria, library and amphi at GPREC?", icon: "🗺️" },
                  { label: "Prizes & Sponsorships", query: "What are the prizes and who are the sponsors for CodeX 4.0?", icon: "🎁" },
                  { label: "Guest Speaker Dodagatta Nihar", query: "Tell me about guest speaker Dodagatta Nihar", icon: "🎤" },
                  { label: "Coders Club Team Coordinators", query: "/team", icon: "👥" },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickTrigger(item.query)}
                    className="w-full text-left p-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/40 border border-transparent hover:border-primary-200 dark:hover:border-primary-800/60 transition-all flex items-center justify-between group"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span>{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </span>
                    <svg
                      className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all shrink-0 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            {/* Hackathon Perks Banner */}
            <div className="rounded-2xl p-3.5 sm:p-4 bg-gradient-to-br from-primary-600/10 via-accent-500/10 to-transparent border border-primary-500/20 dark:border-primary-500/30">
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary-700 dark:text-primary-300 mb-1">
                <span>🌟</span>
                <span>Career Opportunities</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Top winning teams have opportunities to secure internships with technical sponsor <strong className="text-slate-800 dark:text-slate-200">WeDevit</strong>!
              </p>
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {showMobileSidebar && (
          <div
            onClick={() => setShowMobileSidebar(false)}
            className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          />
        )}

        {/* Right Area: Interactive CodeBuddy Chat Window (Full bleed on phones) */}
        <main className="relative flex-1 flex flex-col h-full overflow-hidden min-w-0">
          <ChatWindow
            variant="full"
            onOpenEventGuide={() => setShowMobileSidebar(true)}
          />
        </main>
      </div>

      {/* Live Campus Map & GPS Navigation Modal */}
      <CampusMapModal
        isOpen={isMapOpen}
        onClose={closeMap}
        initialDestinationId={mapDestinationId}
      />
    </div>
  );
}