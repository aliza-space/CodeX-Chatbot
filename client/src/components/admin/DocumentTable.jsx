import api from "../../api/axios.js";

export default function DocumentTable({ documents, onChanged }) {
  const handleReindex = async (id) => {
    await api.post(`/api/admin/documents/${id}/reindex`);
    onChanged?.();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this document and all its indexed chunks?")) return;
    await api.delete(`/api/admin/documents/${id}`);
    onChanged?.();
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-left text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-200 dark:border-slate-800">
          <tr>
            <th className="pb-3 pr-4">Document Title</th>
            <th className="pb-3 pr-4">Category</th>
            <th className="pb-3 pr-4">Chunks</th>
            <th className="pb-3 pr-4">Last Indexed</th>
            <th className="pb-3 pr-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {documents.map((d) => (
            <tr key={d._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
              <td className="py-3 pr-4 font-medium text-slate-800 dark:text-slate-200">
                {d.title}
              </td>
              <td className="py-3 pr-4">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 border border-primary-200/80 dark:border-primary-800/80">
                  {d.category || "General"}
                </span>
              </td>
              <td className="py-3 pr-4 text-slate-600 dark:text-slate-300 font-mono text-xs">
                {d.chunkCount}
              </td>
              <td className="py-3 pr-4 text-xs text-slate-400">
                {d.lastIndexedAt ? new Date(d.lastIndexedAt).toLocaleString() : "—"}
              </td>
              <td className="py-3 pr-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleReindex(d._id)}
                    className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Reindex
                  </button>
                  <button
                    onClick={() => handleDelete(d._id)}
                    className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {documents.length === 0 && (
            <tr>
              <td colSpan={5} className="py-8 text-center text-xs text-slate-400">
                No documents found in knowledge base. Upload a document to index it into chunks.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
