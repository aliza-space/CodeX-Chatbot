import { useEffect, useState, useCallback } from "react";
import Navbar from "../components/common/Navbar.jsx";
import DocumentUploader from "../components/admin/DocumentUploader.jsx";
import DocumentTable from "../components/admin/DocumentTable.jsx";
import AnalyticsCards from "../components/admin/AnalyticsCards.jsx";
import UnansweredList from "../components/admin/UnansweredList.jsx";
import AnnouncementForm from "../components/admin/AnnouncementForm.jsx";
import api from "../api/axios.js";
import { IconCpu, IconGuide, IconSparkles } from "../components/common/Icons.jsx";

const TABS = [
  { id: "Overview", label: "Analytics Overview", icon: IconCpu },
  { id: "Documents", label: "Knowledge Base", icon: IconGuide },
  { id: "Announcements", label: "Live Announcements", icon: IconSparkles },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState("Overview");
  const [documents, setDocuments] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [docsRes, analyticsRes, annRes] = await Promise.all([
        api.get("/api/admin/documents"),
        api.get("/api/admin/analytics"),
        api.get("/api/announcements"),
      ]);
      setDocuments(docsRes.data.documents || []);
      setAnalytics(analyticsRes.data);
      setAnnouncements(annRes.data.announcements || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="min-h-screen bg-terminal-bg bg-hud-grid text-terminal-text flex flex-col font-mono">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-brand-500/15 text-brand-400 border border-brand-500/30 mb-1.5">
              <span>// ADMIN_MANAGEMENT_PORTAL</span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">
              CodeX 4.0 <span className="text-brand-400">Control Center</span>
            </h1>
            <p className="text-xs sm:text-sm text-terminal-muted mt-1 font-mono">
              Manage knowledge base documents, monitor RAG analytics, and broadcast announcements.
            </p>
          </div>

          <button
            onClick={refresh}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold text-terminal-dark bg-brand-400 hover:bg-brand-300 shadow-terminal-glow transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>[SYNC_DATA]</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-terminal-border mb-6 overflow-x-auto">
          {TABS.map((t) => {
            const IconComp = t.icon;
            const isActive = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-mono font-semibold transition-all relative whitespace-nowrap ${
                  isActive
                    ? "text-brand-400"
                    : "text-terminal-muted hover:text-white"
                }`}
              >
                <IconComp className="w-4 h-4" />
                <span>[{t.label}]</span>
                {isActive && (
                  <span className="absolute bottom-0 inset-x-0 h-0.5 bg-brand-400 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="flex items-center justify-center py-16 text-xs sm:text-sm font-mono text-terminal-muted">
            <span className="w-5 h-5 border-2 border-brand-400 border-t-transparent rounded-full animate-spin mr-3" />
            // Loading portal telemetry...
          </div>
        ) : (
          <div className="space-y-6">
            {tab === "Overview" && (
              <>
                <AnalyticsCards analytics={analytics} onRefresh={refresh} />
                <div className="rounded-2xl p-4 sm:p-5 border border-terminal-border bg-terminal-dark shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display font-bold text-base text-white">
                      Unanswered Questions Log
                    </h2>
                    <span className="text-[11px] font-mono text-terminal-muted">
                      // RAG low confidence questions
                    </span>
                  </div>
                  <UnansweredList unanswered={analytics?.unanswered} />
                </div>
              </>
            )}

            {tab === "Documents" && (
              <div className="space-y-6">
                <DocumentUploader onUploaded={refresh} />
                <div className="rounded-2xl p-5 border border-terminal-border bg-terminal-dark shadow-xl">
                  <h2 className="font-display font-bold text-base text-white mb-4">
                    Indexed Knowledge Base Files
                  </h2>
                  <DocumentTable documents={documents} onChanged={refresh} />
                </div>
              </div>
            )}

            {tab === "Announcements" && (
              <div className="rounded-2xl p-5 border border-terminal-border bg-terminal-dark shadow-xl">
                <h2 className="font-display font-bold text-base text-white mb-1">
                  Ticker Announcements
                </h2>
                <p className="text-xs font-mono text-terminal-muted mb-4">
                  // Live announcements broadcasted across all user sessions.
                </p>
                <AnnouncementForm announcements={announcements} onChanged={refresh} />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
