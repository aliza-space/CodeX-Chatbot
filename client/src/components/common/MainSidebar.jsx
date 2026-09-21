import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../hooks/useAuth.js";
import { useChatStream } from "../../hooks/useChatStream.js";
import { useChatStore } from "../../store/chatStore.js";
import {
  IconChat,
  IconTrophy,
  IconUsers,
  IconPin,
  IconShield,
  IconLogOut,
  IconCross,
  IconTrash,
  IconExternal,
  IconUser
} from "./Icons.jsx";

export default function MainSidebar({ open, onClose, onOpenProfile }) {
  const [view, setView] = useState("menu"); // "menu" | "history"
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

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
    onClose();
  };

  const handleStartNewChat = () => {
    newChat();
    onClose();
  };

  const handleQuickTopic = (query) => {
    sendMessage(query);
    onClose();
  };

  const handleLaunchCampusGuide = (destId = null) => {
    openMap(destId);
    onClose();
  };

  const handleConfirmSignOut = () => {
    setShowSignOutConfirm(false);
    logout();
    onClose();
    navigate("/login", { replace: true });
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop with smooth blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              setShowSignOutConfirm(false);
              onClose();
            }}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40"
          />

          {/* Drawer Panel */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            className="relative w-80 sm:w-88 max-w-[85vw] h-full bg-white dark:bg-slate-950 border-r border-slate-200/80 dark:border-slate-800/80 shadow-2xl z-50 flex flex-col overflow-hidden text-slate-900 dark:text-slate-100 font-sans"
          >
            {/* 1. Header: Clean Brand & Close */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl overflow-hidden ring-1 ring-blue-500/30 bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-0.5 shrink-0 shadow-xs">
                  <img src="/logo.jpg" alt="Coders' Club" className="w-full h-full object-cover rounded-lg" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-display font-bold text-sm text-slate-900 dark:text-white tracking-tight truncate">
                    CodeX <span className="text-blue-600 dark:text-blue-400">4.0</span>
                  </h2>
                  <p className="text-[11px] text-slate-400 truncate">
                    Coders' Club • GPREC
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowSignOutConfirm(false);
                  onClose();
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition cursor-pointer"
                aria-label="Close menu"
              >
                <IconCross className="w-4 h-4" />
              </button>
            </div>

            {/* 2. Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin">
              {view === "menu" ? (
                <div className="space-y-5 animate-fade-in">
                  {/* Primary Navigation Actions */}
                  <div className="space-y-1.5">
                    {/* GPREC Campus Guide Launcher */}
                    <button
                      onClick={() => handleLaunchCampusGuide()}
                      className="w-full p-3 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 hover:bg-blue-100/80 dark:hover:bg-blue-900/40 border border-blue-200/70 dark:border-blue-800/60 text-left transition flex items-center justify-between group cursor-pointer shadow-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs text-sm">
                          📍
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>Explore GPREC</span>
                            <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-full bg-blue-600 text-white">
                              2 Areas
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            Academic & Student Common Facilities
                          </p>
                        </div>
                      </div>
                      <span className="text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform font-bold text-xs">
                        →
                      </span>
                    </button>

                    {/* Chat History View Switcher */}
                    <button
                      onClick={() => setView("history")}
                      className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800/60 text-left transition flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          <IconChat className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 dark:text-white">
                            Saved Chat Sessions
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {conversations.length} conversation{conversations.length === 1 ? "" : "s"}
                          </p>
                        </div>
                      </div>
                      <span className="text-slate-400 group-hover:translate-x-0.5 transition-transform font-bold text-xs">
                        →
                      </span>
                    </button>

                    {/* Admin Portal (if admin) */}
                    {user?.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={onClose}
                        className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800/60 text-left transition flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                            <IconShield className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                              Admin Control Center
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                              Knowledge base & analytics
                            </p>
                          </div>
                        </div>
                        <span className="text-slate-400 group-hover:translate-x-0.5 transition-transform font-bold text-xs">
                          →
                        </span>
                      </Link>
                    )}
                  </div>

                  {/* Clean Hackathon Summary Strip */}
                  <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        CodeX 4.0 Hackathon
                      </span>
                      <span className="text-[10px] font-medium text-slate-400">
                        24 Sept 2026
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-200/40 dark:border-slate-800/40 text-center">
                      <div className="p-1.5 rounded-xl bg-white dark:bg-slate-800/60">
                        <IconPin className="w-3 h-3 text-blue-500 mx-auto mb-0.5" />
                        <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 block truncate">
                          CSM Labs
                        </span>
                      </div>
                      <div className="p-1.5 rounded-xl bg-white dark:bg-slate-800/60">
                        <IconUsers className="w-3 h-3 text-blue-500 mx-auto mb-0.5" />
                        <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 block truncate">
                          2-3 Team
                        </span>
                      </div>
                      <div className="p-1.5 rounded-xl bg-white dark:bg-slate-800/60">
                        <IconTrophy className="w-3 h-3 text-orange-500 mx-auto mb-0.5" />
                        <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 block truncate">
                          ₹50,000
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Questions */}
                  <div>
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1 mb-2">
                      Quick Questions
                    </h3>
                    <div className="space-y-1">
                      {[
                        { label: "Rules & Eligibility", query: "What are the rules and eligibility criteria for CodeX 4.0?" },
                        { label: "Prizes & Sponsorships", query: "What are the prizes and who are the sponsors for CodeX 4.0?" },
                        { label: "Campus Food & Labs", query: "Where is the food court, cafeteria and CSM labs at GPREC?" },
                        { label: "Guest Speaker Nihar", query: "Tell me about guest speaker Dodagatta Nihar" },
                        { label: "Team Coordinators", query: "/team" },
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleQuickTopic(item.query)}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-900/80 transition flex items-center justify-between group cursor-pointer"
                        >
                          <span className="truncate">{item.label}</span>
                          <span className="text-slate-300 dark:text-slate-600 group-hover:text-blue-500 group-hover:translate-x-0.5 transition font-semibold text-xs">
                            →
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* External Registration Link */}
                  <a
                    href="https://codex4-0-registration-portal.codersclubgprec.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full p-2.5 rounded-xl text-xs text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <IconExternal className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">Registration Portal</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">External ↗</span>
                  </a>
                </div>
              ) : (
                /* CHAT HISTORY SUB-VIEW */
                <div className="space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between mb-2">
                    <button
                      onClick={() => setView("menu")}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>← Back to Menu</span>
                    </button>

                    <button
                      onClick={handleStartNewChat}
                      className="px-2.5 py-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1 shadow-xs transition active:scale-95 cursor-pointer"
                    >
                      <span className="text-sm leading-none">+</span>
                      <span>New Chat</span>
                    </button>
                  </div>

                  {historyLoading && (
                    <div className="py-8 text-center text-xs text-slate-400">
                      <span className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin inline-block mr-2" />
                      Loading sessions...
                    </div>
                  )}

                  {!historyLoading && conversations.length === 0 && (
                    <div className="text-center py-10 px-2">
                      <IconChat className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">No saved sessions</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Your conversations will appear here</p>
                    </div>
                  )}

                  {!historyLoading && (
                    <div className="space-y-1.5">
                      {conversations.map((c) => {
                        const isActive = conversationId === c._id;
                        return (
                          <div
                            key={c._id}
                            className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition ${
                              isActive
                                ? "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
                                : "bg-slate-50/60 dark:bg-slate-900/60 border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                            }`}
                          >
                            <button
                              onClick={() => handleSelectConversation(c._id)}
                              className="flex-1 text-left min-w-0 cursor-pointer"
                            >
                              <p className="text-xs font-medium truncate">{c.title || "Chat session"}</p>
                              <span className="text-[10px] text-slate-400">
                                {new Date(c.updatedAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                              </span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteConversation(c._id);
                              }}
                              className="p-1 text-slate-400 hover:text-rose-500 rounded transition cursor-pointer"
                              title="Delete session"
                            >
                              <IconTrash className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 3. Bottom Action Bar: Clean & Minimal */}
            <div className="p-3.5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 shrink-0">
              {isAuthenticated ? (
                <div>
                  {!showSignOutConfirm ? (
                    <div className="flex items-center justify-between">
                      {/* User Avatar + Profile Quick Trigger */}
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenProfile?.();
                        }}
                        className="flex items-center gap-2 text-left hover:opacity-80 transition cursor-pointer min-w-0 flex-1"
                        title="Open Profile"
                      >
                        <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs uppercase shrink-0">
                          {user?.name ? user.name[0].toUpperCase() : "U"}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                            {user?.name || "Participant"}
                          </p>
                          <span className="text-[10px] text-slate-400 block truncate">
                            {user?.email || "Profile"}
                          </span>
                        </div>
                      </button>

                      {/* Sign Out Button */}
                      <button
                        type="button"
                        onClick={() => setShowSignOutConfirm(true)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer shrink-0"
                        title="Sign Out"
                        aria-label="Sign Out"
                      >
                        <IconLogOut className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    /* Inline Confirmation Step */
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 shadow-md space-y-2 animate-fade-in">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white text-center">
                        Sign out of your session?
                      </p>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => setShowSignOutConfirm(false)}
                          className="py-1 px-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleConfirmSignOut}
                          className="py-1 px-2 rounded-lg text-xs font-medium text-white bg-rose-600 hover:bg-rose-500 transition cursor-pointer shadow-xs"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={onClose}
                  className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 flex items-center justify-center gap-2 transition"
                >
                  <IconUser className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
