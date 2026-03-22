import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "ShopNest — Modern E-Commerce",
  description: "Find the best products at unbeatable prices",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>
        <Navbar />
        <main className="min-h-[calc(100vh-64px)]">{children}</main>
        <Footer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 2500,
            style: {
              background: "#1e293b",
              color: "#f8fafc",
              borderRadius: "10px",
              fontSize: "14px",
            },
          }}
        />
      </body>
    </html>
  );
}
