
import { create } from "zustand";
import { AuthUser } from "@/types/auth.types";

const TOKEN_KEY = "token";
const USER_KEY  = "auth_user";

const ls = {
  get: (key: string) =>
    typeof window !== "undefined" ? localStorage.getItem(key) : null,
  set: (key: string, val: string) => {
    if (typeof window !== "undefined") localStorage.setItem(key, val);
  },
  remove: (key: string) => {
    if (typeof window !== "undefined") localStorage.removeItem(key);
  },
};

function setCookie(name: string, value: string, days = 7) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function removeCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

function readStoredUser(): AuthUser | null {
  try {
    const raw = ls.get(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  const token = ls.get(TOKEN_KEY);
  const user  = readStoredUser();

  return {
    token,
    user,
    isAuthenticated: !!token,

    setAuth: (token, user) => {
      ls.set(TOKEN_KEY, token);
      ls.set(USER_KEY, JSON.stringify(user));
      setCookie(TOKEN_KEY, token);           // ← middleware reads this
      set({ token, user, isAuthenticated: true });
    },

    logout: () => {
      ls.remove(TOKEN_KEY);
      ls.remove(USER_KEY);
      removeCookie(TOKEN_KEY);               // ← clears middleware cookie
      set({ token: null, user: null, isAuthenticated: false });
    },
  };
});