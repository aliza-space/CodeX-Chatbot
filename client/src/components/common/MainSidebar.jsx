import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../hooks/useAuth.js";
import { useChatStream } from "../../hooks/useChatStream.js";
import { useChatStore } from "../../store/chatStore.js";
import { useModalBackHandler } from "../../hooks/useModalBackHandler.js";
import ThemeToggle from "./ThemeToggle.jsx";
import {
  IconChat,
  IconTrophy,
  IconShield,
  IconLogOut,
  IconTrash,
  IconUser,
  IconSparkles,
  IconPin,
} from "./Icons.jsx";

export default function MainSidebar({
  open,
  onClose,
  onOpenProfile,
  isMobile = false,
}) {
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  useModalBackHandler(isMobile && open, onClose);
  useModalBackHandler(showSignOutConfirm, () => setShowSignOutConfirm(false));
  const { isAuthenticated, user, logout } = useAuth();
  const {
    conversations,
    historyLoading,
    conversationId,
    openConversation,
    deleteConversation,
    newChat,
    sendMessage,
  } = useChatStream();
  const openMap = useChatStore((s) => s.openMap);
  const navigate = useNavigate();

  const handleSelectConversation = (id) => {
    openConversation(id);
    if (isMobile && onClose) onClose();
  };

  const handleStartNewChat = () => {
    newChat();
    if (isMobile && onClose) onClose();
  };

  const handleConfirmSignOut = () => {
    setShowSignOutConfirm(false);
    logout();
    if (onClose) onClose();
    navigate("/login", { replace: true });
  };

  const sidebarContent = (
    <div className="flex flex-col h-full w-full bg-slate-50/95 dark:bg-[#0b0f19] border-r border-slate-200/80 dark:border-slate-800/80 text-slate-800 dark:text-slate-200 transition-colors select-none">
      {/* 1. Top Brand Header */}
      <div className="p-3.5 sm:p-4 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 shrink-0">
        <Link to="/" className="flex items-center gap-2.5 group min-w-0" onClick={isMobile ? onClose : undefined}>
          <div className="w-8 h-8 rounded-xl overflow-hidden ring-1 ring-blue-500/30 p-0.5 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center shrink-0">
            <img src="/logo.jpg" alt="Coders' Club Logo" className="w-full h-full object-cover rounded-lg" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-sm text-slate-900 dark:text-white tracking-tight truncate">
                CodeX <span className="text-blue-600 dark:text-blue-400">Buddy</span>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate font-mono">
              Coders' Club • GPREC
            </p>
          </div>
        </Link>

        {isMobile && onClose && (
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="p-1.5 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* 2. New Chat Button (ChatGPT / Claude Style) */}
      <div className="p-3 shrink-0">
        <button
          onClick={handleStartNewChat}
          className="w-full py-2.5 px-3 rounded-2xl bg-white dark:bg-slate-900/90 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 font-semibold text-xs flex items-center justify-between shadow-xs transition-all cursor-pointer group active:scale-[0.99]"
        >
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </span>
            <span>New Chat</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">
            +
          </span>
        </button>
      </div>

      {/* 3. Middle Scrollable Conversation History */}
      <div className="flex-1 overflow-y-auto px-3 py-1 space-y-1 scrollbar-thin">
        <div className="px-2 py-1 flex items-center justify-between text-[11px] font-semibold tracking-wider uppercase text-slate-400 dark:text-slate-500">
          <span>Recent Chats</span>
          {historyLoading && <span className="animate-spin text-xs">⏳</span>}
        </div>

        {conversations.length === 0 ? (
          <div className="text-center py-6 px-2">
            <p className="text-xs text-slate-400 dark:text-slate-500">No chat history yet</p>
            <p className="text-[11px] text-slate-400/80 dark:text-slate-600 mt-0.5">
              Ask any question to get started!
            </p>
          </div>
        ) : (
          conversations.map((c) => {
            const isActive = c._id === conversationId;
            return (
              <div
                key={c._id}
                className={`group relative flex items-center justify-between rounded-xl px-2.5 py-2 text-xs transition-all cursor-pointer ${
                  isActive
                    ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium border border-blue-500/30"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
                onClick={() => handleSelectConversation(c._id)}
              >
                <div className="flex items-center gap-2 min-w-0 pr-6">
                  <IconChat className="w-3.5 h-3.5 shrink-0 opacity-70" />
                  <span className="truncate">{c.title || "Conversation"}</span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConversation(c._id);
                  }}
                  className="absolute right-1.5 opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-all"
                  title="Delete chat"
                >
                  <IconTrash className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* 4. Pinned Utility Tools & Campus Navigation */}
      <div className="p-3 border-t border-slate-200/60 dark:border-slate-800/60 space-y-1.5 shrink-0 bg-slate-100/40 dark:bg-slate-950/40">
        {/* Campus Guide Launcher */}
        <button
          onClick={() => {
            openMap();
            if (isMobile && onClose) onClose();
          }}
          className="w-full py-2 px-2.5 rounded-xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20 border border-blue-500/20 text-xs font-semibold text-blue-700 dark:text-blue-300 flex items-center justify-between transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-blue-600 text-white text-xs">
              📍
            </span>
            <span>Campus Interactive Map</span>
          </div>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-600 text-white">
            GPS
          </span>
        </button>

        {/* CodeX 4.0 Quick Info */}
        <button
          onClick={() => {
            sendMessage("What are the key details, rules and prize pool of CodeX 4.0?");
            if (isMobile && onClose) onClose();
          }}
          className="w-full py-1.5 px-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-850 text-xs flex items-center gap-2 transition-colors text-left"
        >
          <IconTrophy className="w-3.5 h-3.5 text-amber-500" />
          <span className="truncate">CodeX 4.0 Overview & Prizes</span>
        </button>

        {/* Admin Portal Link (if admin) */}
        {user?.role === "admin" && (
          <Link
            to="/admin"
            className="w-full py-1.5 px-2.5 rounded-xl text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-xs flex items-center gap-2 transition-colors"
            onClick={isMobile ? onClose : undefined}
          >
            <IconShield className="w-3.5 h-3.5" />
            <span className="font-semibold">Admin Dashboard</span>
          </Link>
        )}
      </div>

      {/* 5. Bottom User Dock & Theme Switcher */}
      <div className="p-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between gap-2 shrink-0 bg-white/60 dark:bg-slate-900/60">
        {isAuthenticated ? (
          <div className="flex items-center justify-between w-full">
            <button
              onClick={() => {
                if (onOpenProfile) onOpenProfile();
                if (isMobile && onClose) onClose();
              }}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800 text-left min-w-0 flex-1 transition-colors group cursor-pointer"
            >
              <div className="w-7 h-7 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-xs uppercase shrink-0 shadow-xs">
                {user?.name ? user.name[0].toUpperCase() : "U"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {user?.name || "User"}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {user?.email || "Signed In"}
                </p>
              </div>
            </button>

            <div className="flex items-center gap-1 shrink-0">
              <ThemeToggle />
              <button
                onClick={() => setShowSignOutConfirm(true)}
                title="Sign Out"
                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                <IconLogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <Link
              to="/login"
              className="py-1.5 px-3 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition-colors inline-flex items-center gap-1.5"
            >
              <IconUser className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
            <ThemeToggle />
          </div>
        )}
      </div>

      {/* Developer Credit */}
      <div className="px-3 py-2.5 text-center border-t border-slate-200/60 dark:border-slate-800/60 shrink-0 bg-slate-100/30 dark:bg-slate-950/30">
        <p className="text-[11px] text-slate-500 dark:text-slate-400 select-none leading-relaxed">
          Developed By <span className="font-bold text-blue-600 dark:text-blue-400">Aliza Juhaina</span>
          <br />
          <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">(Full Stack Developer)</span>
        </p>
      </div>

      {/* Sign Out Confirmation Modal */}
      {showSignOutConfirm && (
        <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xl max-w-xs w-full text-center space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Sign out of CodeX Buddy?
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              You will need to sign in again to access your conversation history.
            </p>
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                onClick={() => setShowSignOutConfirm(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSignOut}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 transition shadow-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // If Mobile Drawer Mode
  if (isMobile) {
    return (
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 320 }}
              className="relative w-72 max-w-[80vw] h-full z-50 shadow-2xl"
            >
              {sidebarContent}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    );
  }

  // Desktop Rail Mode
  return (
    <aside
      className={`hidden lg:flex flex-col h-full shrink-0 transition-all duration-300 overflow-hidden ${
        open ? "w-64" : "w-0 border-r-0"
      }`}
    >
      {sidebarContent}
    </aside>
  );
}
