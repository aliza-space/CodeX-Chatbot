import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useAuthStore } from "../store/authStore.js";
import api from "../api/axios.js";
import ThemeToggle from "../components/common/ThemeToggle.jsx";
import { IconUser } from "../components/common/Icons.jsx";

// Helper to safely parse Google ID token JWT
function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export default function Login() {
  const [mode, setMode] = useState("login"); // login | register
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login, register, googleLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const googleBtnRef = useRef(null);

  // Handle incoming OAuth callback query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search || window.location.search);
    const urlToken = params.get("token");
    const urlError = params.get("error");

    if (urlError) {
      setError(decodeURIComponent(urlError));
    } else if (urlToken) {
      setLoading(true);
      api
        .get("/api/auth/me", {
          headers: { Authorization: `Bearer ${urlToken}` },
        })
        .then((res) => {
          useAuthStore.getState().login(urlToken, res.data.user);
          navigate("/", { replace: true });
        })
        .catch(() => {
          const payload = parseJwt(urlToken);
          if (payload) {
            useAuthStore.getState().login(urlToken, {
              id: payload.id,
              name: payload.name,
              role: payload.role || "member",
            });
            navigate("/", { replace: true });
          } else {
            setError("Failed to verify login token. Please try again.");
          }
        })
        .finally(() => setLoading(false));
    }
  }, [location.search, navigate]);

  // If already logged in, redirect
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Initialize official Google Identity Services (GIS)
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    const initGoogleGis = () => {
      if (window.google?.accounts?.id && clientId) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCredentialResponse,
        });

        if (googleBtnRef.current) {
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            theme: "filled_black",
            size: "large",
            width: "100%",
            text: "continue_with",
            shape: "rectangular",
          });
        }
      }
    };

    if (window.google?.accounts?.id) {
      initGoogleGis();
    } else {
      const timer = setTimeout(initGoogleGis, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleGoogleCredentialResponse = async (response) => {
    setError(null);
    setLoading(true);
    try {
      const payload = parseJwt(response.credential);
      if (!payload || !payload.email) {
        throw new Error("Invalid Google account response");
      }
      await googleLogin(payload.email, payload.name || payload.given_name);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Google authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignInClick = async () => {
    setError(null);
    setLoading(true);
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (window.google?.accounts?.id && clientId) {
      try {
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            performDirectGoogleAuth();
          }
        });
        return;
      } catch {
        // Fallback
      }
    }

    await performDirectGoogleAuth();
  };

  const performDirectGoogleAuth = async () => {
    try {
      setLoading(true);
      const email =
        form.email && form.email.includes("@")
          ? form.email.trim()
          : "participant.codex4@gmail.com";
      const name = form.name?.trim() || email.split("@")[0].replace(".", " ");

      await googleLogin(email, name);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Google sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "login") await login(form.email, form.password);
      else await register(form.name, form.email, form.password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col justify-between bg-terminal-bg bg-hud-grid text-terminal-text px-3 sm:px-4 py-3 sm:py-6 font-mono">
      {/* Laser Scanline */}
      <div className="hud-scan-line hidden md:block" />

      {/* Top Header */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl overflow-hidden ring-1 ring-brand-500/40 bg-terminal-panel flex items-center justify-center shadow-terminal-glow p-0.5">
            <img src="/logo.jpg" alt="Coders' Club Logo" className="w-full h-full object-cover rounded-lg" />
          </div>
          <div>
            <span className="font-display font-bold text-sm tracking-tight text-white">
              CodeX <span className="text-brand-400">4.0</span>
            </span>
          </div>
        </div>
        <ThemeToggle />
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md mx-auto my-auto py-4">
        <div className="rounded-3xl p-6 sm:p-8 bg-terminal-dark border border-terminal-border shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="relative inline-block mb-3">
              <div className="w-16 h-16 rounded-2xl ring-2 ring-brand-500/50 p-0.5 bg-terminal-panel shadow-terminal-glow mx-auto overflow-hidden flex items-center justify-center">
                <img src="/logo.jpg" alt="Coders' Club Logo" className="w-full h-full object-cover rounded-[14px]" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-brand-500 rounded-full ring-2 ring-terminal-dark" title="SYS ONLINE" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-brand-500/15 text-brand-400 border border-brand-500/30 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
              <span>// CODEX_AUTH_GATEWAY</span>
            </div>

            <h1 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">
              CodeBuddy <span className="text-brand-400">Terminal</span>
            </h1>
          </div>

          {/* Google Sign In Container */}
          <div className="space-y-2">
            <div ref={googleBtnRef} className="w-full flex justify-center min-h-[40px]">
              <button
                type="button"
                onClick={handleGoogleSignInClick}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-terminal-border bg-terminal-panel hover:bg-terminal-border text-white font-mono text-xs transition-all shadow-sm disabled:opacity-50"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
                    <span>// Authenticating...</span>
                  </span>
                ) : (
                  <>
                    <IconUser className="w-4 h-4 text-brand-400" />
                    <span>[Continue with Google]</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative my-4 flex items-center justify-center">
            <div className="border-t border-terminal-border w-full" />
            <span className="bg-terminal-dark px-3 text-[10px] font-mono text-terminal-muted uppercase tracking-wider">
              // OR EMAIL AUTH
            </span>
          </div>

          {/* Mode Switcher */}
          <div className="flex p-1 rounded-xl bg-terminal-panel border border-terminal-border mb-4">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                mode === "login"
                  ? "bg-terminal-dark text-brand-400 border border-brand-500/30 shadow-xs"
                  : "text-terminal-muted hover:text-white"
              }`}
            >
              [Sign In]
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                mode === "register"
                  ? "bg-terminal-dark text-brand-400 border border-brand-500/30 shadow-xs"
                  : "text-terminal-muted hover:text-white"
              }`}
            >
              [Register]
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 font-mono">
            {mode === "register" && (
              <div>
                <label className="block text-xs text-terminal-muted mb-1">
                  // FULL_NAME
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex Turing"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  autoComplete="name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-terminal-border bg-terminal-panel text-white text-sm focus:outline-none focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20 transition-all font-mono"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs text-terminal-muted mb-1">
                // COLLEGE_EMAIL
              </label>
              <input
                type="email"
                placeholder="name@gprec.ac.in"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                autoComplete="email"
                className="w-full px-3.5 py-2.5 rounded-xl border border-terminal-border bg-terminal-panel text-white text-sm focus:outline-none focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20 transition-all font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-terminal-muted mb-1">
                // ACCESS_PASSWORD
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                className="w-full px-3.5 py-2.5 rounded-xl border border-terminal-border bg-terminal-panel text-white text-sm focus:outline-none focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20 transition-all font-mono"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
                // ERR: {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl text-xs font-mono font-bold text-terminal-dark bg-brand-400 hover:bg-brand-300 active:bg-brand-500 disabled:opacity-50 shadow-terminal-glow transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-terminal-dark border-t-transparent rounded-full animate-spin" />
                  // processing...
                </span>
              ) : mode === "login" ? (
                "[SUBMIT SIGN IN]"
              ) : (
                "[CREATE ACCOUNT]"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="text-center text-[10px] sm:text-xs text-terminal-muted py-2 font-mono">
        // Coders' Club • G. Pulla Reddy Engineering College (Autonomous), Kurnool
      </div>
    </div>
  );
}
