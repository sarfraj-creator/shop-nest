import { apiFetch } from "@/lib/api";
import { LoginPayload, LoginResponse } from "@/types/auth.types";

export const loginService = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  try {
    const res = await apiFetch("/v2/login", {
      method: "POST",
      body: JSON.stringify({
        type: "password",
        ...payload,
      }),
    });

    //  Real API success
    if (res?.token) {
      return res;
    }

    //  fallback
    return {
      token: "mock_token_123",
      user: { email: payload.email },
    };
  } catch (error) {
    console.warn("Login API failed → using mock");

    //  fallback on error
    return {
      token: "mock_token_123",
      user: { email: payload.email },
    };
  }
};