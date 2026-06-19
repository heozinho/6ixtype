import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import "@/app/fonts.css";
import DataShell from "@/components/6data/layout/DataShell";

export const runtime = 'edge';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "6Data — App",
  description: "6Data workspace — import, profile, clean, query and visualise your data.",
};

// This is a root layout for the (data-app) route group.
// It intentionally does NOT include the portfolio Sidebar or MobileNav.
export default function DataAppRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <DataShell>{children}</DataShell>
      </body>
    </html>
  );
}
