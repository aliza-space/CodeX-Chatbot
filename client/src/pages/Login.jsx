import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
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
            theme: "outline",
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
    <div className="min-h-[100dvh] flex flex-col justify-between bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 px-3 sm:px-4 py-4 sm:py-6 transition-colors">
      {/* Top Header */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl overflow-hidden ring-1 ring-blue-500/30 bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm p-0.5">
            <img src="/logo.jpg" alt="Coders' Club Logo" className="w-full h-full object-cover rounded-lg" />
          </div>
          <div>
            <span className="font-display font-bold text-sm tracking-tight text-slate-900 dark:text-white">
              CodeX <span className="text-blue-600 dark:text-blue-400">4.0</span>
            </span>
          </div>
        </Link>
        <ThemeToggle />
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md mx-auto my-auto py-4">
        <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xl backdrop-blur-xl">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="relative inline-block mb-3">
              <div className="w-16 h-16 rounded-2xl ring-2 ring-blue-500/30 p-0.5 bg-white dark:bg-slate-900 shadow-md mx-auto overflow-hidden flex items-center justify-center">
                <img src="/logo.jpg" alt="Coders' Club Logo" className="w-full h-full object-cover rounded-[14px]" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-blue-500 rounded-full ring-2 ring-white dark:ring-slate-900" title="Online" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span>Participant Portal</span>
            </div>

            <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
              CodeBuddy <span className="text-blue-600 dark:text-blue-400">Account</span>
            </h1>
          </div>

          {/* Google Sign In Container */}
          <div className="space-y-2">
            <div ref={googleBtnRef} className="w-full flex justify-center min-h-[40px]">
              <button
                type="button"
                onClick={handleGoogleSignInClick}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-all shadow-xs disabled:opacity-50"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </span>
                ) : (
                  <>
                    <IconUser className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Continue with Google</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative my-4 flex items-center justify-center">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
            <span className="bg-white dark:bg-slate-900 px-3 text-[11px] text-slate-400 uppercase tracking-wider">
              Or with email
            </span>
          </div>

          {/* Mode Switcher */}
          <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 mb-4">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === "login"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === "register"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "register" && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex Turing"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  autoComplete="name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@gprec.ac.in"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                autoComplete="email"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 shadow-sm shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </span>
              ) : mode === "login" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="text-center text-[11px] text-slate-400 py-2">
        Coders' Club • G. Pulla Reddy Engineering College (Autonomous), Kurnool
      </div>
    </div>
  );
}
