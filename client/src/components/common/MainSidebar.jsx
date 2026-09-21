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
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40"
            />

            {/* Terminal Sidebar Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="relative w-80 sm:w-88 max-w-[85vw] h-full bg-terminal-dark border-r border-terminal-border shadow-2xl z-50 flex flex-col overflow-hidden text-terminal-text"
            >
              {/* Header: System Info */}
              <div className="p-4 border-b border-terminal-border flex items-center justify-between shrink-0 bg-terminal-panel/60">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl overflow-hidden ring-1 ring-brand-500/40 bg-terminal-panel shadow-xs flex items-center justify-center shrink-0 p-0.5">
                    <img src="/logo.jpg" alt="Coders' Club Logo" className="w-full h-full object-cover rounded-lg" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-display font-bold text-sm tracking-tight text-white truncate">
                      CodeX <span className="text-brand-400">4.0 // HUD</span>
                    </h2>
                    <p className="text-[10px] font-mono text-terminal-muted truncate">Coders' Club GPREC</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-xl text-terminal-muted hover:text-brand-300 hover:bg-terminal-panel border border-transparent hover:border-terminal-border transition"
                  aria-label="Close sidebar"
                >
                  <IconCross className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Segment Tabs */}
              <div className="grid grid-cols-3 gap-1 p-2 bg-terminal-bg border-b border-terminal-border text-xs font-mono font-semibold shrink-0">
                <button
                  onClick={() => setActiveTab("guide")}
                  className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
                    activeTab === "guide"
                      ? "bg-terminal-panel text-brand-400 border border-brand-500/30 shadow-xs"
                      : "text-terminal-muted hover:text-white"
                  }`}
                >
                  <IconGuide className="w-3.5 h-3.5" />
                  <span>Guide</span>
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition relative ${
                    activeTab === "history"
                      ? "bg-terminal-panel text-brand-400 border border-brand-500/30 shadow-xs"
                      : "text-terminal-muted hover:text-white"
                  }`}
                >
                  <IconChat className="w-3.5 h-3.5" />
                  <span>Chats</span>
                  {conversations.length > 0 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-400 absolute top-1.5 right-2" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
                    activeTab === "profile"
                      ? "bg-terminal-panel text-brand-400 border border-brand-500/30 shadow-xs"
                      : "text-terminal-muted hover:text-white"
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
                    <div className="rounded-2xl p-4 border border-terminal-border bg-terminal-panel/80">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-400 flex items-center gap-1">
                          <IconCpu className="w-3 h-3" />
                          <span>Flagship Hackathon</span>
                        </span>
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-300 border border-brand-500/30">
                          24 Sept 2026
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-sm text-white">
                        CodeX 4.0 Hackathon
                      </h3>
                      <p className="text-xs text-terminal-muted mt-0.5 leading-relaxed">
                        Full-day team coding competition hosted by Coders' Club at GPREC, Kurnool.
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-terminal-border text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-terminal-muted flex items-center gap-1.5">
                            <IconPin className="w-3.5 h-3.5 text-brand-400" />
                            <span>Venue</span>
                          </span>
                          <span className="font-semibold text-white font-mono">CSM Computer Labs</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-terminal-muted flex items-center gap-1.5">
                            <IconUsers className="w-3.5 h-3.5 text-brand-400" />
                            <span>Format</span>
                          </span>
                          <span className="font-semibold text-white font-mono">2 - 3 per Team</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-terminal-muted flex items-center gap-1.5">
                            <IconTrophy className="w-3.5 h-3.5 text-brand-400" />
                            <span>Prize Pool</span>
                          </span>
                          <span className="font-bold text-brand-400 font-mono">₹50,000</span>
                        </div>
                      </div>
                    </div>

                    {/* Instant Query Shortcuts */}
                    <div>
                      <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-terminal-muted mb-2">
                        // Quick Queries
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
                            className="w-full text-left p-2.5 rounded-xl text-xs font-mono text-terminal-text hover:text-brand-300 hover:bg-terminal-panel border border-terminal-border/50 hover:border-brand-500/30 transition flex items-center justify-between group"
                          >
                            <span className="truncate">{item.label}</span>
                            <span className="text-terminal-muted group-hover:text-brand-400 group-hover:translate-x-0.5 transition font-mono">→</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Career & Internships */}
                    <div className="rounded-2xl p-3.5 bg-brand-500/10 border border-brand-500/25 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-brand-400 mb-1">
                        <IconSparkles className="w-3.5 h-3.5" />
                        <span>Career Opportunities</span>
                      </div>
                      <p className="text-[11px] text-terminal-muted leading-relaxed">
                        Top winning teams secure direct internship interview opportunities with technical sponsor <strong className="text-white">WeDevit</strong>!
                      </p>
                    </div>
                  </div>
                )}

                {/* 2. CHAT HISTORY TAB */}
                {activeTab === "history" && (
                  <div className="space-y-3 animate-fade-in">
                    <button
                      onClick={handleStartNewChat}
                      className="w-full py-2.5 px-3 rounded-xl bg-brand-500 hover:bg-brand-400 active:bg-brand-600 text-terminal-dark font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-terminal-glow transition active:scale-98"
                    >
                      <span className="text-sm">+</span>
                      <span>[New Chat Session]</span>
                    </button>

                    {historyLoading && (
                      <div className="py-8 text-center text-xs font-mono text-terminal-muted">
                        <span className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin inline-block mr-2" />
                        // Loading sessions...
                      </div>
                    )}

                    {!historyLoading && conversations.length === 0 && (
                      <div className="text-center py-10 px-2">
                        <IconChat className="w-6 h-6 text-terminal-muted mx-auto mb-2" />
                        <p className="text-xs font-mono font-semibold text-white">No saved sessions</p>
                        <p className="text-[11px] font-mono text-terminal-muted mt-0.5">// sessions auto-sync here</p>
                      </div>
                    )}

                    {!historyLoading && (
                      <div className="space-y-1.5">
                        {conversations.map((c) => {
                          const isActive = conversationId === c._id;
                          return (
                            <div
                              key={c._id}
                              className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition font-mono ${
                                isActive
                                  ? "bg-brand-500/15 border-brand-500/50 text-brand-300 shadow-xs"
                                  : "bg-terminal-panel/60 border-terminal-border text-terminal-text hover:bg-terminal-panel hover:border-brand-500/30"
                              }`}
                            >
                              <button
                                onClick={() => handleSelectConversation(c._id)}
                                className="flex-1 text-left min-w-0"
                              >
                                <p className="text-xs font-medium truncate">{c.title || "Chat session"}</p>
                                <span className="text-[10px] text-terminal-muted">
                                  {new Date(c.updatedAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                                </span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteConversation(c._id);
                                }}
                                className="p-1 text-terminal-muted hover:text-rose-400 rounded transition"
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
                        <div className="p-4 rounded-2xl bg-terminal-panel/80 border border-terminal-border">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-brand-500 text-terminal-dark font-bold flex items-center justify-center text-sm uppercase shadow-terminal-glow">
                              {user?.name ? user.name[0] : "U"}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-semibold text-sm text-white truncate">
                                {user?.name || "Participant"}
                              </h4>
                              <p className="text-xs font-mono text-terminal-muted truncate">{user?.email}</p>
                              <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-brand-500/15 text-brand-300 border border-brand-500/30">
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
                              className="w-full p-2.5 rounded-xl text-xs font-mono font-semibold text-brand-300 bg-brand-500/10 border border-brand-500/30 hover:bg-brand-500/20 flex items-center gap-2 transition"
                            >
                              <IconShield className="w-4 h-4 text-brand-400" />
                              <span>[Admin Control Center]</span>
                            </Link>
                          )}

                          <button
                            onClick={() => setPasswordModalOpen(true)}
                            className="w-full p-2.5 rounded-xl text-xs font-mono font-semibold text-terminal-text bg-terminal-panel border border-terminal-border hover:bg-terminal-border flex items-center gap-2 transition"
                          >
                            <IconKey className="w-4 h-4 text-terminal-muted" />
                            <span>Change Password</span>
                          </button>

                          <button
                            onClick={handleSignOut}
                            className="w-full p-2.5 rounded-xl text-xs font-mono font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 flex items-center gap-2 transition"
                          >
                            <IconLogOut className="w-4 h-4" />
                            <span>[Sign Out]</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 px-2 space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center mx-auto border border-brand-500/30">
                          <IconUser className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-sm text-white">
                            Join CodeX 4.0 Platform
                          </h4>
                          <p className="text-xs text-terminal-muted mt-1 font-mono">
                            Sign in to save chat sessions and access hackathon features.
                          </p>
                        </div>
                        <Link
                          to="/login"
                          onClick={onClose}
                          className="inline-block w-full py-2.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-400 text-terminal-dark font-mono font-bold text-xs shadow-terminal-glow transition"
                        >
                          [login / register]
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Quick Campus Walking Map Trigger */}
              <div className="p-3 border-t border-terminal-border bg-terminal-bg shrink-0">
                <button
                  onClick={() => {
                    openMap();
                    onClose();
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-terminal-panel border border-terminal-border hover:border-brand-500/40 text-brand-300 font-mono font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition"
                >
                  <IconMap className="w-4 h-4 text-brand-400" />
                  <span>[Open Campus Radar]</span>
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
