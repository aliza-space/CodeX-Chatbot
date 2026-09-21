import { useState } from "react";
import api from "../../api/axios.js";

export default function DocumentUploader({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    setSuccess(false);
    try {
      const formData = new FormData();
      formData.append("file", file);
      await api.post("/api/admin/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFile(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      onUploaded?.();
    } catch (err) {
      setError(err.response?.data?.error || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-2xl p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-center shadow-sm">
      <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 mx-auto flex items-center justify-center text-xl mb-3">
        📤
      </div>

      <h3 className="font-display font-bold text-base text-slate-800 dark:text-slate-100 mb-1">
        Ingest Knowledge Base Document
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 max-w-sm mx-auto">
        Uploaded files will be parsed, split into semantically relevant chunks, and embedded into vector search.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
          <span>Choose File</span>
          <input
            type="file"
            accept=".md,.txt,.pdf,.docx"
            onChange={(e) => {
              setFile(e.target.files[0]);
              setError(null);
            }}
            className="hidden"
          />
        </label>

        {file && (
          <span className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate max-w-xs px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg">
            📄 {file.name}
          </span>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 active:bg-primary-800 disabled:opacity-40 disabled:pointer-events-none shadow-sm transition-all"
        >
          {uploading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Indexing Chunks...</span>
            </>
          ) : (
            <span>Upload & Index</span>
          )}
        </button>
      </div>

      {error && (
        <p className="text-xs font-medium text-rose-500 mt-3">{error}</p>
      )}

      {success && (
        <p className="text-xs font-medium text-emerald-500 mt-3">
          ✓ Document successfully ingested and indexed!
        </p>
      )}

      <p className="text-[11px] text-slate-400 mt-3">
        Supported formats: <span className="font-mono">.md</span>, <span className="font-mono">.pdf</span>, <span className="font-mono">.docx</span>, <span className="font-mono">.txt</span>
      </p>
    </div>
  );
}
