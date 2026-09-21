import { useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle.jsx";
import MainSidebar from "./MainSidebar.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { useChatStore } from "../../store/chatStore.js";
import { IconMap, IconGuide, IconUser, IconCompass } from "./Icons.jsx";

export default function Navbar() {
  const { isAuthenticated, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState("guide");
  const openMap = useChatStore((s) => s.openMap);

  const handleOpenGuide = () => {
    setSidebarTab("guide");
    setSidebarOpen(true);
  };

  const handleOpenProfile = () => {
    setSidebarTab("profile");
    setSidebarOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-cyan-500/20 bg-white/80 dark:bg-[#070d1a]/85 backdrop-blur-xl shrink-0 transition-colors shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
          {/* Left: Hamburger & Brand Identity */}
          <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
            {/* Cyber Hamburger Button */}
            <button
              onClick={() => {
                setSidebarTab("guide");
                setSidebarOpen(true);
              }}
              className="p-2 sm:p-2.5 rounded-xl text-slate-600 dark:text-cyan-400/90 hover:text-slate-900 dark:hover:text-cyan-300 hover:bg-slate-100 dark:hover:bg-cyan-950/40 border border-transparent dark:hover:border-cyan-500/30 transition-all active:scale-95 shrink-0"
              aria-label="Open navigation menu"
              title="Menu & Guide"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" />
              </svg>
            </button>

            {/* Brand Logo & Live AI Beacon */}
            <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group min-w-0">
              <div className="relative shrink-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden ring-1 ring-slate-200 dark:ring-cyan-500/40 group-hover:ring-cyan-400 transition shadow-sm bg-white dark:bg-slate-900 flex items-center justify-center p-0.5">
                  <img src="/logo.jpg" alt="Coders' Club Logo" className="w-full h-full object-cover rounded-lg" />
                </div>
                {/* Live pulsing green online radar dot */}
                <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 ring-2 ring-white dark:ring-[#070d1a]" />
                </span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-display font-bold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white truncate">
                    CodeX <span className="text-cyan-600 dark:text-cyan-400">4.0</span>
                  </span>
                  <span className="hidden xs:inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                    AI
                  </span>
                </div>
                <p className="text-[10px] font-mono text-slate-400 dark:text-slate-400 truncate hidden sm:block">
                  Coders' Club GPREC
                </p>
              </div>
            </Link>
          </div>

          {/* Right: Essential Action Controls (Hero Campus Map, Guide, Theme, Profile) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* 1. HERO CAMPUS RADAR / MAP BUTTON */}
            <button
              type="button"
              onClick={() => openMap()}
              className="relative group inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-display font-bold text-white bg-gradient-to-r from-cyan-600 via-primary-600 to-cyan-500 hover:from-cyan-500 hover:to-primary-500 shadow-md shadow-cyan-500/25 hover:shadow-cyan-500/40 border border-cyan-400/40 transition-all duration-200 active:scale-95"
              title="Open GPREC Campus Radar & Live Walking Navigation"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              <IconMap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white shrink-0" />
              <span className="tracking-wide">Campus Map</span>
            </button>

            {/* 2. Quick Guide Trigger */}
            <button
              type="button"
              onClick={handleOpenGuide}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700/60 transition active:scale-95"
              title="CodeX 4.0 Event Guide"
            >
              <IconGuide className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
              <span className="hidden md:inline">Guide</span>
            </button>

            {/* 3. Theme Toggle */}
            <ThemeToggle />

            {/* 4. Profile / Sign In */}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleOpenProfile}
                className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700/60 transition text-xs font-semibold text-slate-800 dark:text-slate-100"
                title="Open user profile & account settings"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-600 to-primary-600 text-white font-bold flex items-center justify-center text-xs uppercase shrink-0 shadow-xs">
                  {user?.name ? user.name[0] : "U"}
                </div>
                <span className="hidden sm:inline truncate max-w-[85px]">
                  {user?.name?.split(" ")[0] || "Profile"}
                </span>
              </button>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-slate-900 dark:bg-cyan-600 hover:bg-slate-800 dark:hover:bg-cyan-500 shadow-sm transition active:scale-95"
              >
                <IconUser className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Cyber Slide-out Left Drawer */}
      <MainSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        defaultTab={sidebarTab}
      />
    </>
  );
}