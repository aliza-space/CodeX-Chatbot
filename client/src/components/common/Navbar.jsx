import { useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle.jsx";
import MainSidebar from "./MainSidebar.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { useChatStore } from "../../store/chatStore.js";
import { IconMap, IconGuide, IconUser } from "./Icons.jsx";

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
      <header className="sticky top-0 z-40 w-full border-b border-terminal-border bg-terminal-dark/90 backdrop-blur-xl shrink-0 transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
          {/* Left: Terminal Hamburger & Brand */}
          <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
            {/* Single Terminal Hamburger Button */}
            <button
              onClick={() => {
                setSidebarTab("guide");
                setSidebarOpen(true);
              }}
              className="p-2 sm:p-2.5 rounded-xl text-terminal-muted hover:text-brand-400 hover:bg-terminal-panel border border-terminal-border hover:border-brand-500/40 transition-all active:scale-95 shrink-0"
              aria-label="Open terminal drawer"
              title="System Menu & Guide"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" />
              </svg>
            </button>

            {/* Official Logo & Cyberpunk Brand Lockup */}
            <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group min-w-0">
              <div className="relative shrink-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden ring-1 ring-brand-500/40 group-hover:ring-brand-400 transition-all shadow-terminal-glow bg-terminal-panel flex items-center justify-center p-0.5">
                  <img src="/logo.jpg" alt="Coders' Club Logo" className="w-full h-full object-cover rounded-lg" />
                </div>
                {/* Emerald Pulse Indicator */}
                <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-500 ring-2 ring-terminal-dark" />
                </span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-bold text-sm sm:text-base tracking-tight text-white truncate">
                    CodeX <span className="text-brand-400">4.0</span>
                  </span>
                  <span className="hidden xs:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-500/15 text-brand-400 border border-brand-500/30">
                    SYS://ONLINE
                  </span>
                </div>
                <p className="text-[10px] font-mono text-terminal-muted truncate hidden sm:block">
                  Coders' Club GPREC
                </p>
              </div>
            </Link>
          </div>

          {/* Right: Terminal Action Controls (Campus Radar, Guide, Theme, Profile) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* 1. Terminal Campus Map Button */}
            <button
              type="button"
              onClick={() => openMap()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs font-mono font-bold text-terminal-dark bg-brand-400 hover:bg-brand-300 active:bg-brand-500 shadow-terminal-glow border border-brand-300 transition-all active:scale-95"
              title="Open Campus Radar & Wayfinding"
            >
              <IconMap className="w-3.5 h-3.5" />
              <span>[Map]</span>
            </button>

            {/* 2. Guide Button */}
            <button
              type="button"
              onClick={handleOpenGuide}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-mono font-semibold text-terminal-text bg-terminal-panel hover:bg-terminal-border border border-terminal-border hover:border-brand-500/30 transition active:scale-95"
              title="CodeX 4.0 Event Guide"
            >
              <IconGuide className="w-3.5 h-3.5 text-brand-400" />
              <span className="hidden sm:inline">[Guide]</span>
            </button>

            {/* 3. Theme Toggle */}
            <ThemeToggle />

            {/* 4. Profile / Sign In */}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleOpenProfile}
                className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-terminal-panel hover:bg-terminal-border border border-terminal-border hover:border-brand-500/40 transition text-xs font-mono font-semibold text-terminal-text"
                title="Open user profile & session"
              >
                <div className="w-6 h-6 rounded-lg bg-brand-500 text-terminal-dark font-bold flex items-center justify-center text-xs uppercase shrink-0">
                  {user?.name ? user.name[0] : "U"}
                </div>
                <span className="hidden sm:inline truncate max-w-[85px]">
                  {user?.name?.split(" ")[0] || "Profile"}
                </span>
              </button>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold text-terminal-dark bg-brand-400 hover:bg-brand-300 transition active:scale-95 shadow-terminal-glow"
              >
                <IconUser className="w-3.5 h-3.5" />
                <span>[login]</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Slide-out Terminal Left Drawer */}
      <MainSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        defaultTab={sidebarTab}
      />
    </>
  );
}