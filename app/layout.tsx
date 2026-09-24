import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SkillSwap: hire young creators",
  description: "A creator gig marketplace",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${font.className} min-h-screen bg-white antialiased`}>
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
        <footer className="border-t border-gray-200 py-8 text-center text-sm text-gray-500">
          SkillSwap · a marketplace for young creators
        </footer>
      </body>
    </html>
  );
}