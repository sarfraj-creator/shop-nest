  
export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id?: number;
  name?: string;
  email?: string;
  /** "Member" | "Public Member" — drives routing after login */
  role?: string;
  company_name?: string;
  position?: string;
  [key: string]: unknown;
}


export type LoginResult =
  | { outcome: "member"; token: string; user: AuthUser }
  | { outcome: "public_member"; user: AuthUser }
  | { outcome: "error"; message: string };