import { useEffect, useState, useCallback } from "react";
import Navbar from "../components/common/Navbar.jsx";
import DocumentUploader from "../components/admin/DocumentUploader.jsx";
import DocumentTable from "../components/admin/DocumentTable.jsx";
import AnalyticsCards from "../components/admin/AnalyticsCards.jsx";
import UnansweredList from "../components/admin/UnansweredList.jsx";
import AnnouncementForm from "../components/admin/AnnouncementForm.jsx";
import api from "../api/axios.js";

const TABS = [
  { id: "Overview", label: "Analytics Overview", icon: "📊" },
  { id: "Documents", label: "Knowledge Base", icon: "📚" },
  { id: "Announcements", label: "Live Announcements", icon: "📢" },
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 mb-1.5">
              <span>Admin Management Portal</span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">
              CodeX 4.0 Control Center
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage knowledge documents, monitor RAG analytics, and broadcast announcements.
            </p>
          </div>

          <button
            onClick={refresh}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 shadow-sm transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Sync Data</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 mb-6 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 pb-3 px-3 text-sm font-semibold transition-all relative whitespace-nowrap ${
                tab === t.id
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
              {tab === t.id && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-primary-600 dark:bg-primary-400 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="flex items-center justify-center py-16 text-sm text-slate-400">
            <span className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mr-3" />
            Loading portal data...
          </div>
        ) : (
          <div className="space-y-6">
            {tab === "Overview" && (
              <>
                <AnalyticsCards analytics={analytics} />
                <div className="rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display font-bold text-base text-slate-900 dark:text-white">
                      Unanswered Questions Log
                    </h2>
                    <span className="text-xs text-slate-400">
                      Shows questions where RAG confidence was below threshold
                    </span>
                  </div>
                  <UnansweredList unanswered={analytics?.unanswered} />
                </div>
              </>
            )}

            {tab === "Documents" && (
              <div className="space-y-6">
                <DocumentUploader onUploaded={refresh} />
                <div className="rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 shadow-sm">
                  <h2 className="font-display font-bold text-base text-slate-900 dark:text-white mb-4">
                    Indexed Knowledge Base Files
                  </h2>
                  <DocumentTable documents={documents} onChanged={refresh} />
                </div>
              </div>
            )}

            {tab === "Announcements" && (
              <div className="rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 shadow-sm">
                <h2 className="font-display font-bold text-base text-slate-900 dark:text-white mb-1">
                  Ticker Announcements
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  These announcements show at the top of the chatbot page. Highest priority active item will be highlighted.
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
