import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../hooks/useAuth.js";
import { useChatStream } from "../../hooks/useChatStream.js";
import { useChatStore } from "../../store/chatStore.js";
import ChangePasswordModal from "./ChangePasswordModal.jsx";
import {
  IconGuide,
  IconChat,
  IconUser,
  IconMap,
  IconTrophy,
  IconUsers,
  IconPin,
  IconSparkles,
  IconShield,
  IconKey,
  IconLogOut,
  IconCross,
  IconTrash,
  IconCpu
} from "./Icons.jsx";

export default function MainSidebar({ open, onClose, defaultTab = "guide" }) {
  const [activeTab, setActiveTab] = useState(defaultTab); // "guide" | "history" | "profile"
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

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

  const handleSignOut = () => {
    logout();
    onClose();
    navigate("/");
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40"
            />

            {/* Sidebar Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="relative w-80 sm:w-88 max-w-[85vw] h-full bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 shadow-2xl z-50 flex flex-col overflow-hidden text-slate-900 dark:text-slate-100"
            >
              {/* Header */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/70 dark:bg-slate-900/50">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl overflow-hidden ring-1 ring-blue-500/30 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center shrink-0 p-0.5">
                    <img src="/logo.jpg" alt="Coders' Club Logo" className="w-full h-full object-cover rounded-lg" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-display font-bold text-sm tracking-tight text-slate-900 dark:text-white truncate">
                      CodeX <span className="text-blue-600 dark:text-blue-400">4.0</span> Portal
                    </h2>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Coders' Club • GPREC</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  aria-label="Close sidebar"
                >
                  <IconCross className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Segment Tabs */}
              <div className="grid grid-cols-3 gap-1 p-2 bg-slate-100/60 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold shrink-0">
                <button
                  onClick={() => setActiveTab("guide")}
                  className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
                    activeTab === "guide"
                      ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/60 dark:border-slate-700/60"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <IconGuide className="w-3.5 h-3.5" />
                  <span>Guide</span>
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition relative ${
                    activeTab === "history"
                      ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/60 dark:border-slate-700/60"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <IconChat className="w-3.5 h-3.5" />
                  <span>Chats</span>
                  {conversations.length > 0 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 absolute top-1.5 right-2" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
                    activeTab === "profile"
                      ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/60 dark:border-slate-700/60"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <IconUser className="w-3.5 h-3.5" />
                  <span>Profile</span>
                </button>
              </div>

              {/* Body Content Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                {/* 1. EVENT GUIDE TAB */}
                {activeTab === "guide" && (
                  <div className="space-y-4 animate-fade-in">
                    {/* Event Spotlight Card */}
                    <div className="rounded-2xl p-4 border border-blue-200/60 dark:border-blue-900/40 bg-gradient-to-br from-blue-50/50 via-white to-slate-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/20 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1">
                          <IconCpu className="w-3 h-3" />
                          <span>Flagship Hackathon</span>
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          24 Sept 2026
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                        CodeX 4.0 Hackathon
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                        Full-day team coding competition hosted by Coders' Club at GPREC, Kurnool.
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-slate-200/80 dark:border-slate-800 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                            <IconPin className="w-3.5 h-3.5 text-blue-500" />
                            <span>Venue</span>
                          </span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">CSM Computer Labs</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                            <IconUsers className="w-3.5 h-3.5 text-blue-500" />
                            <span>Format</span>
                          </span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">2 - 3 per Team</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                            <IconTrophy className="w-3.5 h-3.5 text-orange-500" />
                            <span>Prize Pool</span>
                          </span>
                          <span className="font-bold text-orange-600 dark:text-orange-400">₹50,000</span>
                        </div>
                      </div>
                    </div>

                    {/* Instant Query Shortcuts */}
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                        Quick Inquiries
                      </h4>
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
                            onClick={() => handleQuickTopic(item.query)}
                            className="w-full text-left p-2.5 rounded-xl text-xs text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200/60 dark:border-slate-800/60 transition flex items-center justify-between group"
                          >
                            <span className="truncate">{item.label}</span>
                            <span className="text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition font-semibold">→</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Career & Internships */}
                    <div className="rounded-2xl p-3.5 bg-orange-50/60 dark:bg-orange-950/20 border border-orange-200/60 dark:border-orange-900/40 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-orange-600 dark:text-orange-400 mb-1">
                        <IconSparkles className="w-3.5 h-3.5" />
                        <span>Career Opportunities</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        Top winning teams secure direct internship interview opportunities with technical sponsor <strong className="text-slate-900 dark:text-white">WeDevit</strong>!
                      </p>
                    </div>
                  </div>
                )}

                {/* 2. CHAT HISTORY TAB */}
                {activeTab === "history" && (
                  <div className="space-y-3 animate-fade-in">
                    <button
                      onClick={handleStartNewChat}
                      className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm shadow-blue-500/20 transition active:scale-98"
                    >
                      <span className="text-sm font-bold">+</span>
                      <span>New Chat Session</span>
                    </button>

                    {historyLoading && (
                      <div className="py-8 text-center text-xs text-slate-400">
                        <span className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin inline-block mr-2" />
                        Loading chat sessions...
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
                                  ? "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 shadow-xs"
                                  : "bg-slate-50/60 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                              }`}
                            >
                              <button
                                onClick={() => handleSelectConversation(c._id)}
                                className="flex-1 text-left min-w-0"
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
                                className="p-1 text-slate-400 hover:text-rose-500 rounded transition"
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

                {/* 3. PROFILE & SETTINGS TAB */}
                {activeTab === "profile" && (
                  <div className="space-y-4 animate-fade-in">
                    {isAuthenticated ? (
                      <div className="space-y-4">
                        {/* User Card */}
                        <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm uppercase shadow-sm">
                              {user?.name ? user.name[0] : "U"}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                                {user?.name || "Participant"}
                              </h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                              <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                {user?.role || "Member"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Account Actions */}
                        <div className="space-y-2">
                          {user?.role === "admin" && (
                            <Link
                              to="/admin"
                              onClick={onClose}
                              className="w-full p-2.5 rounded-xl text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 flex items-center gap-2 transition"
                            >
                              <IconShield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              <span>Admin Control Center</span>
                            </Link>
                          )}

                          <button
                            onClick={() => setPasswordModalOpen(true)}
                            className="w-full p-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-2 transition"
                          >
                            <IconKey className="w-4 h-4 text-slate-400" />
                            <span>Change Password</span>
                          </button>

                          <button
                            onClick={handleSignOut}
                            className="w-full p-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-100 dark:hover:bg-rose-900/40 flex items-center gap-2 transition"
                          >
                            <IconLogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 px-2 space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto border border-blue-200 dark:border-blue-800">
                          <IconUser className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                            Join CodeX 4.0 Platform
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Sign in to save chat sessions and access hackathon features.
                          </p>
                        </div>
                        <Link
                          to="/login"
                          onClick={onClose}
                          className="inline-block w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-sm transition"
                        >
                          Sign In / Register
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Quick Campus Map Trigger */}
              <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shrink-0">
                <button
                  onClick={() => {
                    openMap();
                    onClose();
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 text-blue-600 dark:text-blue-400 font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition"
                >
                  <IconMap className="w-4 h-4" />
                  <span>Open Campus Map</span>
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <ChangePasswordModal open={passwordModalOpen} onClose={() => setPasswordModalOpen(false)} />
    </>
  );
}
