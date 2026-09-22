import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { useAuthStore } from "../../store/authStore.js";

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, user } = useAuth();
  const _hasHydrated = useAuthStore((s) => s._hasHydrated);

  // Wait for Zustand to finish reading persisted auth from localStorage.
  // Without this guard, on mobile after OAuth redirect the app briefly sees
  // isAuthenticated=false and redirects to /login, creating a blank page.
  if (!_hasHydrated) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400">Loading…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requireAdmin && user?.role !== "admin") return <Navigate to="/" replace />;

  return children;
}
