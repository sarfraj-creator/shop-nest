import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";
 
export const metadata: Metadata = {
  title: "Sign In — ShopNest",
  description: "Sign in to access BOB events",
};
 
export default function LoginPage() {
  return <LoginForm />;
}