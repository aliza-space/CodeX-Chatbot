import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../hooks/useAuth.js";
import ChangePasswordModal from "./ChangePasswordModal.jsx";
import {
  IconUser,
  IconKey,
  IconShield,
  IconCross,
  IconCheck
} from "./Icons.jsx";

export default function UserProfileModal({ open, onClose }) {
  const { user } = useAuth();
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  if (!open) return null;

  const isAdmin = user?.role === "admin";
  const userInitials = user?.name ? user.name[0].toUpperCase() : "U";

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-40"
          />

          {/* Profile Card Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: "spring", damping: 25, stiffness: 320 }}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl z-50 overflow-hidden text-slate-900 dark:text-slate-100"
          >
            {/* Header Banner */}
            <div className="relative h-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-5 pt-4 flex items-start justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-sm">
                Participant Profile
              </span>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition cursor-pointer"
                aria-label="Close profile modal"
              >
                <IconCross className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Avatar & Info Body */}
            <div className="px-5 sm:px-6 pb-6 pt-0 relative">
              {/* Avatar Floating Over Header */}
              <div className="-mt-12 mb-4 flex items-end justify-between">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-blue-600 text-white text-2xl font-bold flex items-center justify-center ring-4 ring-white dark:ring-slate-900 shadow-lg">
                    {userInitials}
                  </div>
                  <span
                    className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"
                    title="Active Session"
                  />
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-xs ${
                    isAdmin
                      ? "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                      : "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                  }`}
                >
                  {user?.role || "Member"}
                </span>
              </div>

              {/* User Identity Details */}
              <div className="space-y-1 mb-5">
                <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                  {user?.name || "Participant"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {user?.email || "No email provided"}
                </p>
              </div>

              {/* Account Meta Cards */}
              <div className="grid grid-cols-2 gap-2.5 mb-5 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                    Account Status
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                    <IconCheck className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                    Platform Access
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-blue-600 dark:text-blue-400">
                    <IconShield className="w-3.5 h-3.5" />
                    <span>CodeX 4.0</span>
                  </div>
                </div>
              </div>

              {/* Security & Account Settings */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-0.5">
                  Account Security
                </h4>

                <button
                  type="button"
                  onClick={() => setPasswordModalOpen(true)}
                  className="w-full p-3 rounded-2xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 flex items-center justify-between transition cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-xl bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300">
                      <IconKey className="w-4 h-4" />
                    </div>
                    <span>Change Account Password</span>
                  </div>
                  <span className="text-slate-400 group-hover:translate-x-0.5 transition-transform font-bold">
                    →
                  </span>
                </button>
              </div>

              {/* Close Button */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      <ChangePasswordModal
        open={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
      />
    </>
  );
}
