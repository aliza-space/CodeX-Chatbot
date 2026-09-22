import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/common/Navbar.jsx";
import ChatWindow from "../components/chat/ChatWindow.jsx";
import { useChatStore } from "../store/chatStore.js";
import { useChatStream } from "../hooks/useChatStream.js";
import api from "../api/axios.js";
import {
  IconExternal,
  IconSparkles,
  IconTrophy,
  IconPin,
  IconUsers,
  IconCpu
} from "../components/common/Icons.jsx";

export default function ChatPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isMapOpen, closeMap, mapDestinationId, openMap } = useChatStore();
  const { sendMessage } = useChatStream();
  const [announcement, setAnnouncement] = useState(
    "CodeX 4.0 registrations close on 23 September 2026 — register before slots fill up!"
  );
  const [showBanner, setShowBanner] = useState(true);
  const processedDeepLink = useRef(false);

  // Handle QR code deep links (?q=/events or ?nav=csm_labs)
  useEffect(() => {
    if (processedDeepLink.current) return;
    const query = searchParams.get("q") || searchParams.get("cmd");
    const nav = searchParams.get("nav");

    if (query) {
      processedDeepLink.current = true;
      sendMessage(query);
      // Clean up URL query param cleanly
      setSearchParams({}, { replace: true });
    } else if (nav) {
      processedDeepLink.current = true;
      openMap(nav);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, sendMessage, openMap, setSearchParams]);

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
    <div className="relative flex flex-col h-[100dvh] overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Announcement Banner */}
      {showBanner && (
        <div className="relative z-50 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium flex items-center justify-between shadow-xs shrink-0">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center w-full px-2 min-w-0">
            <span className="p-1 rounded-full bg-white/15 text-white shrink-0">
              <IconSparkles className="w-3.5 h-3.5" />
            </span>
            <span className="truncate max-w-[240px] sm:max-w-xl">{announcement}</span>
            <a
              href="https://codex4-0-registration-portal.codersclubgprec.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1 font-semibold underline underline-offset-2 hover:text-blue-100 shrink-0 ml-1.5"
            >
              <span>Register Now</span>
              <IconExternal className="w-3 h-3" />
            </a>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            aria-label="Dismiss banner"
            className="p-1 rounded-lg hover:bg-white/20 transition-colors text-white/80 hover:text-white shrink-0 ml-1 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area: Responsive Split View */}
      <div className="relative flex-1 flex overflow-hidden p-0 sm:p-4 lg:p-6 max-w-7xl mx-auto w-full gap-5 min-h-0">
        {/* Desktop Left Rail: Hackathon Event Spotlight */}
        <aside className="hidden lg:flex w-80 flex-col gap-4 overflow-y-auto pr-1 shrink-0 scrollbar-thin">
          {/* Spotlight Card */}
          <div className="rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60">
                <IconCpu className="w-3 h-3" />
                <span>Flagship Event</span>
              </span>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                24 Sept 2026
              </span>
            </div>

            <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white tracking-tight">
              CodeX 4.0 Coding Event
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Full-day collegiate coding event hosted by Coders' Club at GPREC, Kurnool.
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <IconPin className="w-4 h-4 text-blue-500" />
                  <span>Venue</span>
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">CSM Computer Labs</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <IconUsers className="w-4 h-4 text-blue-500" />
                  <span>Format</span>
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">2 - 3 per Team</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <IconTrophy className="w-4 h-4 text-orange-500" />
                  <span>Prize Pool</span>
                </span>
                <span className="font-bold text-orange-600 dark:text-orange-400">Up to ₹50,000</span>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="rounded-3xl p-4 border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1 mb-2.5">
              Quick Shortcuts
            </h3>
            <div className="space-y-1.5">
              {[
                { label: "Rules & Eligibility", query: "What are the rules and eligibility criteria for CodeX 4.0?" },
                { label: "Prizes & Sponsorships", query: "What are the prizes and who are the sponsors for CodeX 4.0?" },
                { label: "Campus Food & Labs", query: "Where is the food court, cafeteria and CSM labs at GPREC?" },
                { label: "Guest Speaker Dodagatta Nihar", query: "Tell me about guest speaker Dodagatta Nihar" },
                { label: "Team Coordinators", query: "/team" },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(item.query)}
                  className="w-full text-left p-2.5 rounded-2xl text-xs text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800/70 border border-slate-200/60 dark:border-slate-800/60 transition flex items-center justify-between group cursor-pointer"
                >
                  <span className="truncate">{item.label}</span>
                  <span className="text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition font-semibold">→</span>
                </button>
              ))}
            </div>
          </div>

          {/* GPREC Campus Guide Quick Launcher */}
          <button
            onClick={() => openMap()}
            className="rounded-3xl p-4 border border-blue-200/80 dark:border-blue-900/60 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-slate-900 shadow-sm text-left hover:scale-[1.01] active:scale-[0.99] transition flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-sm shadow-blue-500/30 text-lg">
                📍
              </div>
              <div>
                <h4 className="font-display font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Explore GPREC</span>
                  <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                    2 Areas
                  </span>
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Academic & Common Facilities
                </p>
              </div>
            </div>
            <span className="text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform font-bold text-sm">
              →
            </span>
          </button>
        </aside>

        {/* Right Side: CodeBuddy Chat Interface */}
        <main className="relative flex-1 flex flex-col h-full overflow-hidden min-w-0">
          <ChatWindow variant="full" />
        </main>
      </div>
    </div>
  );
}