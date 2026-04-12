"use client";


import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

// ─── Client-side validation ───────────────────────────────────────────────────

interface FieldErrors {
  email?: string;
  password?: string;
}

function validate(email: string, password: string): FieldErrors {
  const errs: FieldErrors = {};
  if (!email.trim()) {
    errs.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errs.email = "Enter a valid email address.";
  }
  if (!password) {
    errs.password = "Password is required.";
  } else if (password.length < 4) {
    errs.password = "Password is too short.";
  }
  return errs;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LoginForm() {
  const router = useRouter();
  const { setAuth, isAuthenticated } = useAuthStore();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string>("");
  // ← Task spec: show this when role is "Public Member"
  const [showUpgrade, setShowUpgrade] = useState(false);

  // Already authenticated → skip login
  useEffect(() => {
    if (isAuthenticated) router.replace("/events");
  }, [isAuthenticated, router]);

  const clearErrors = () => {
    setFieldErrors({});
    setServerError("");
    setShowUpgrade(false);
  };

  // ─── Submit handler ──────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearErrors();

    // 1. Validate locally first (fast feedback)
    const errs = validate(email, password);
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    setLoading(true);
    try {
      // 2. Call service — handles real API + mock fallback internally
      const result = await loginService({ email, password });

      // 3. Act on the result
      switch (result.outcome) {
        case "member":
          // ✅ Task spec: Member → /events
          setAuth(result.token, result.user);
          router.push("/events");
          break;

        case "public_member":
          // ❌ Task spec: Public Member → stay + show upgrade message
          setShowUpgrade(true);
          break;

        case "error":
          setServerError(result.message);
          break;
      }
    } catch {
      // Unexpected JS error — should never happen but handle gracefully
      setServerError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Quick fill for demo ─────────────────────────────────────────────────
  const fillTaskCredentials = () => {
    setEmail("test@test.com");
    setPassword("Gagan@888");
    clearErrors();
  };

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-[calc(100vh-130px)] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

          {/* Header */}
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-gray-900">Sign in</h1>
            <p className="text-sm text-gray-500 mt-1">
              Access the BOB events platform
            </p>
          </div>

          {/* ── "Upgrade Your Account" banner ─────────────────────────────
              Task spec: shown when role === "Public Member"
          ────────────────────────────────────────────────────────────────── */}
          {showUpgrade && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4"
            >
              <span className="mt-0.5 text-lg text-amber-500 flex-shrink-0">⚠</span>
              <div>
                <p className="text-sm font-semibold text-amber-900">
                  Upgrade Your Account
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-amber-700">
                  Your account doesn&apos;t have access to this area.
                  Please upgrade to a full BOB membership to continue.
                </p>
              </div>
            </div>
          )}

          {/* ── Server / API error ───────────────────────────────────────── */}
          {serverError && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
            >
              <p className="text-sm text-red-700">{serverError}</p>
            </div>
          )}

          {/* ── Form ─────────────────────────────────────────────────────── */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="test@test.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  // Clear field error as user types
                  if (fieldErrors.email)
                    setFieldErrors((p) => ({ ...p, email: undefined }));
                  if (showUpgrade) setShowUpgrade(false);
                }}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${
                  fieldErrors.email
                    ? "border-red-400 bg-red-50 focus:ring-red-200"
                    : "border-gray-300 focus:border-gray-400 focus:ring-black/10"
                }`}
              />
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="login-password"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password)
                      setFieldErrors((p) => ({ ...p, password: undefined }));
                  }}
                  className={`w-full rounded-lg border px-3 py-2.5 pr-16 text-sm outline-none transition focus:ring-2 ${
                    fieldErrors.password
                      ? "border-red-400 bg-red-50 focus:ring-red-200"
                      : "border-gray-300 focus:border-gray-400 focus:ring-black/10"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400 hover:text-gray-700"
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full rounded-lg bg-black py-2.5 text-sm font-semibold text-white transition-all hover:bg-gray-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in…
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Demo hint */}
          {/* <div className="mt-6 border-t border-gray-100 pt-5 text-center">
            <p className="text-xs text-gray-400">
              Use task credentials?{" "}
              <button
                type="button"
                onClick={fillTaskCredentials}
                className="font-medium text-gray-600 underline underline-offset-2 hover:text-black"
              >
                Fill automatically
              </button>
            </p>
          </div> */}
        </div>

        {/* Role legend — helps during testing */}
        {/* <div className="mt-4 rounded-xl border border-gray-200 bg-white/70 px-4 py-3 text-xs text-gray-500 space-y-1">
          <p className="font-semibold text-gray-700 mb-1">Test accounts:</p>
          <p><span className="font-mono text-gray-800">test@test.com</span> / <span className="font-mono text-gray-800">Gagan@888</span> → Member (→ /events)</p>
          <p><span className="font-mono text-gray-800">public@test.com</span> / any password → Public Member (Upgrade banner)</p>
        </div> */}
      </div>
    </div>
  );
}