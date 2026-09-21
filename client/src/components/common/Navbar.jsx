import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle.jsx";
import ChangePasswordModal from "./ChangePasswordModal.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { useChatStore } from "../../store/chatStore.js";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const openMap = useChatStore((s) => s.openMap);
  const navigate = useNavigate();

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shrink-0">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          {/* Left: Brand / Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group min-w-0">
            <div className="relative shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl overflow-hidden ring-2 ring-primary-500/30 group-hover:ring-primary-500/60 transition-all shadow-sm bg-white flex items-center justify-center">
                <img src="/logo.jpg" alt="Coders' Club Logo" className="w-full h-full object-cover" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900" title="System Active" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-display font-bold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white truncate">
                  CodeX <span className="text-primary-600 dark:text-primary-400">4.0</span>
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 border border-primary-200/80 dark:border-primary-800/60 shrink-0">
                  CodeBuddy AI
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-none truncate">
                Coders' Club GPREC
              </p>
            </div>
          </Link>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Interactive Campus Map & Live GPS Navigation */}
            <button
              type="button"
              onClick={() => openMap()}
              title="GPREC Campus Map & Live Directions"
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700/80 transition-all shadow-sm active:scale-95"
            >
              <span className="text-sm">🗺️</span>
              <span className="hidden xs:inline">Campus Map</span>
            </button>

            <ThemeToggle />

            {isAuthenticated ? (
              <>
                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-xl text-xs font-semibold text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800/80 hover:bg-primary-100 dark:hover:bg-primary-900/60 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="hidden sm:inline">Admin Portal</span>
                    <span className="sm:hidden">Admin</span>
                  </Link>
                )}

                <button
                  onClick={() => setPasswordModalOpen(true)}
                  title="Change Password"
                  className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  <span className="hidden md:inline">Password</span>
                </button>

                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="px-2 sm:px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 active:bg-primary-800 shadow-sm shadow-primary-500/25 transition-all"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      <ChangePasswordModal
        open={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
      />
    </>
  );
}