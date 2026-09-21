import { useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle.jsx";
import MainSidebar from "./MainSidebar.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { useChatStore } from "../../store/chatStore.js";

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
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md shrink-0">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
          {/* Left: Hamburger Menu & Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Hamburger Button */}
            <button
              onClick={() => {
                setSidebarTab("guide");
                setSidebarOpen(true);
              }}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-95 shrink-0"
              aria-label="Open navigation menu"
              title="Menu & Guide"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Brand / Logo */}
            <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group min-w-0">
              <div className="relative shrink-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden ring-2 ring-primary-500/30 group-hover:ring-primary-500/60 transition shadow-sm bg-white flex items-center justify-center">
                  <img src="/logo.jpg" alt="Coders' Club Logo" className="w-full h-full object-cover" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900" title="Online" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-bold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white truncate">
                    CodeX <span className="text-primary-600 dark:text-primary-400">4.0</span>
                  </span>
                  <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800/60">
                    CodeBuddy
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium leading-none truncate hidden sm:block">
                  Coders' Club GPREC
                </p>
              </div>
            </Link>
          </div>

          {/* Right: Essential Action Controls Only (Guide, Map, Theme, Profile) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* 1. Guide Action Button */}
            <button
              type="button"
              onClick={handleOpenGuide}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition active:scale-95"
              title="CodeX 4.0 Event Guide"
            >
              <span>📌</span>
              <span className="hidden xs:inline sm:inline">Guide</span>
            </button>

            {/* 2. Map Action Button */}
            <button
              type="button"
              onClick={() => openMap()}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800/80 hover:bg-primary-100 dark:hover:bg-primary-900/60 transition active:scale-95"
              title="GPREC Campus Walking Navigation"
            >
              <span>🗺️</span>
              <span className="hidden xs:inline sm:inline">Map</span>
            </button>

            {/* 3. Theme Toggle */}
            <ThemeToggle />

            {/* 4. Profile / Sign In */}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleOpenProfile}
                className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition text-xs font-semibold text-slate-800 dark:text-slate-100"
                title="Open profile & account settings"
              >
                <div className="w-6 h-6 rounded-lg bg-primary-600 text-white font-bold flex items-center justify-center text-xs uppercase shrink-0">
                  {user?.name ? user.name[0] : "U"}
                </div>
                <span className="hidden sm:inline truncate max-w-[80px]">
                  {user?.name?.split(" ")[0] || "Profile"}
                </span>
              </button>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 active:bg-primary-800 shadow-sm transition"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Modern Slide-out Left Hamburger Drawer */}
      <MainSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        defaultTab={sidebarTab}
      />
    </>
  );
}