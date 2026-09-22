import { useState } from "react";
import { Link } from "react-router-dom";
import MainSidebar from "./MainSidebar.jsx";
import UserProfileModal from "./UserProfileModal.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { IconUser } from "./Icons.jsx";

export default function Navbar() {
  const { isAuthenticated, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl shrink-0 transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-3">
          {/* Left: Back Button & Hamburger Navigation Trigger */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Explicit Back to Chat Button */}
            <Link
              to="/"
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer active:scale-95 shadow-xs"
              title="Return to main chat"
            >
              <span>←</span>
              <span className="hidden xs:inline">Back to Chat</span>
              <span className="xs:hidden">Back</span>
            </Link>

            {/* Hamburger Button for Navigation Drawer */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 transition-all active:scale-95 shrink-0 cursor-pointer shadow-xs"
              aria-label="Open menu"
              title="Open Navigation Menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Official Logo & Brand Lockup */}
            <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group min-w-0">
              <div className="relative shrink-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden ring-1 ring-blue-500/30 group-hover:ring-blue-500 transition-all shadow-sm bg-white dark:bg-slate-900 flex items-center justify-center p-0.5">
                  <img src="/logo.jpg" alt="Coders' Club Logo" className="w-full h-full object-cover rounded-lg" />
                </div>
                {/* Live Pulse Indicator */}
                <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500 ring-2 ring-white dark:ring-slate-950" />
                </span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-bold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white truncate">
                    CodeX <span className="text-blue-600 dark:text-blue-400">4.0</span>
                  </span>
                  <span className="hidden xs:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>24/7 AI Active</span>
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate hidden sm:block">
                  Coders' Club • GPREC
                </p>
              </div>
            </Link>
          </div>

          {/* Right: Dedicated Profile Section (+ Quick Theme Switch) */}
          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />

            {isAuthenticated ? (
              /* Profile Button Trigger (Opens dedicated Profile panel) */
              <button
                type="button"
                onClick={() => setProfileModalOpen(true)}
                className="flex items-center gap-2 p-1 sm:px-3 sm:py-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700 transition-all text-xs font-semibold text-slate-800 dark:text-slate-100 shadow-xs cursor-pointer active:scale-95 group"
                title="View Profile Details"
              >
                <div className="w-7 h-7 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-xs uppercase shrink-0 shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  {user?.name ? user.name[0].toUpperCase() : "U"}
                </div>
                <span className="hidden sm:inline truncate max-w-[100px] font-medium">
                  {user?.name?.split(" ")[0] || "Profile"}
                </span>
                <span className="hidden sm:inline text-slate-400 text-[10px]">▼</span>
              </button>
            ) : (
              /* Sign In Trigger */
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-sm shadow-blue-500/20 transition-all active:scale-95"
              >
                <IconUser className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Slide-out Full Hamburger Menu Drawer */}
      <MainSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenProfile={() => setProfileModalOpen(true)}
      />

      {/* Dedicated User Profile Modal */}
      <UserProfileModal
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </>
  );
}