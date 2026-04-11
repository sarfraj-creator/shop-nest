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
      <body className={`${inter.variable} font-sans flex flex-col min-h-screen`}>
        <Navbar />
        {/*
          FIX: The original `min-h-[calc(100vh-64px)]` forced <main> to be at
          least viewport-height on every page — including short pages like the
          events list — which pushed the footer far off-screen with empty space.

          Using `flex-1` instead lets <main> grow only as tall as its content
          needs, with the footer sitting naturally right below it.
        */}
        <main className="flex-1">{children}</main>
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