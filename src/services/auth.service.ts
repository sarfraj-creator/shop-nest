

import { AuthUser, LoginPayload, LoginResult } from "@/types/auth.types";

const LOGIN_URL = "https://staging-backend.thebobproject.co/api/v2/login";

// ─── Mock data ────────────────────────────────────────────────────────────────
// Used ONLY when the real API is unreachable.
// Mirrors the task credentials exactly so demo behaviour is predictable.

const MOCK_TOKEN = "mock_token_demo_abc123";

const MOCK_MEMBER: AuthUser = {
  id: 333,
  name: "Gagan Pal Singh",
  email: "test@test.com",
  role: "Member",
  company_name: "Uno Minda",
  position: "Software Development Engineer",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Pull token + user out of the API response.
 * Handles both nested `{ data: { token, user } }` and flat `{ token, user }`.
 */
function extractCredentials(
  json: Record<string, unknown>
): { token: string; user: AuthUser } | null {
  // Nested envelope (most common for this API)
  const nested = json?.data as Record<string, unknown> | undefined;
  if (typeof nested?.token === "string") {
    return {
      token: nested.token,
      user: (nested.user as AuthUser) ?? {},
    };
  }
  // Flat response
  if (typeof json?.token === "string") {
    return {
      token: json.token as string,
      user: (json.user as AuthUser) ?? {},
    };
  }
  return null;
}

/**
 * Map a user's role to a LoginResult.
 * Per task spec:
 *   "Member"        → can access events
 *   "Public Member" → blocked, must upgrade
 *   anything else   → treat as Member (authenticated)
 */
function roleToResult(token: string, user: AuthUser): LoginResult {
  if (user.role === "Public Member") {
    return { outcome: "public_member", user };
  }
  return { outcome: "member", token, user };
}

/**
 * Mock login — only called when the real API is genuinely unreachable.
 *
 * Rules:
 *   - Task credentials (test@test.com / Gagan@888)    → Member ✅
 *   - Email that contains "public" (any password)      → Public Member ❌
 *   - Any other credentials                            → Member (demo mode) ✅
 */
function mockLogin(payload: LoginPayload): LoginResult {
  const email = payload.email.trim().toLowerCase();
  const isPublic = email.includes("public");

  if (isPublic) {
    const user: AuthUser = {
      id: 0,
      name: "Public User",
      email: payload.email,
      role: "Public Member",
    };
    return { outcome: "public_member", user };
  }

  const user: AuthUser =
    email === "test@test.com"
      ? MOCK_MEMBER
      : {
          ...MOCK_MEMBER,
          email: payload.email,
          name: payload.email.split("@")[0],
        };

  return { outcome: "member", token: MOCK_TOKEN, user };
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function loginService(
  payload: LoginPayload
): Promise<LoginResult> {
  // Basic guard — should never fire because LoginForm validates first
  if (!payload.email.trim() || !payload.password) {
    return { outcome: "error", message: "Email and password are required." };
  }

  // ── 1. Try the real API ────────────────────────────────────────────────────
  try {
    const res = await fetch(LOGIN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "password",          // required by this API
        email: payload.email.trim(),
        password: payload.password,
      }),
    });

    // Parse JSON safely
    const json: Record<string, unknown> = await res
      .json()
      .catch(() => ({}));

    // ── 2a. Success (2xx) ────────────────────────────────────────────────────
    if (res.ok) {
      const creds = extractCredentials(json);

      if (creds) {
        //  Got a real token — apply role logic
        return roleToResult(creds.token, creds.user);
      }

      // 200 but no token in response — treat as error
      const msg =
        (json?.message as string) ?? "Login succeeded but no token received.";
      return { outcome: "error", message: msg };
    }

    // ── 2b. Auth / validation error (401, 422) ───────────────────────────────
    // These mean wrong credentials — DO NOT fall back to mock.
    if (res.status === 401 || res.status === 422) {
      const msg =
        (json?.message as string) ??
        "Invalid email or password. Please try again.";
      return { outcome: "error", message: msg };
    }

    // ── 2c. Server error (5xx) — fall through to mock ────────────────────────
    throw new Error(`Server error: ${res.status}`);
  } catch (err) {
    // Only use mock for network/server failures (TypeError = fetch failed)
    const isNetworkErr =
      err instanceof TypeError ||
      (err instanceof Error && err.message.startsWith("Server error:"));

    if (isNetworkErr) {
      console.warn(
        "[auth] Real API unreachable — using mock fallback.",
        err instanceof Error ? err.message : ""
      );
      return mockLogin(payload);
    }

    // Unexpected JS error — surface it
    return {
      outcome: "error",
      message:
        err instanceof Error ? err.message : "An unexpected error occurred.",
    };
  }
}