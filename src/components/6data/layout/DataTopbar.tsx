"use client";
import { Search, Upload, Bell, ExternalLink } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import WorkspaceSwitcher from "./WorkspaceSwitcher";

export default function DataTopbar() {
  return (
    <header className="h-14 border-b border-white/6 bg-[#0d0d18]/80 backdrop-blur-sm flex items-center px-4 gap-3 flex-shrink-0">
      {/* Workspace switcher */}
      <WorkspaceSwitcher />

      {/* Divider */}
      <div className="h-5 w-px bg-white/10 flex-shrink-0" />

      {/* Search */}
      <div className="flex-1 max-w-sm">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" />
          <input
            type="text"
            placeholder="Search datasets, queries, dashboards…"
            className="w-full bg-white/4 border border-white/8 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white/60 placeholder:text-white/25 focus:outline-none focus:border-cyan-500/40 focus:bg-white/6 transition-all"
          />
        </div>
      </div>

      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Import button */}
        <Link
          href="/6data/app/import"
          className={cn(
            buttonVariants({ size: "sm" }),
            "bg-cyan-500/15 text-cyan-400 border border-cyan-500/25 hover:bg-cyan-500/25 font-semibold text-xs h-8 px-3"
          )}
        >
          <Upload className="w-3.5 h-3.5 mr-1.5" />
          Import
        </Link>

        {/* Notifications placeholder */}
        <button className="w-8 h-8 rounded-lg border border-white/8 bg-white/4 flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/8 transition-all">
          <Bell className="w-3.5 h-3.5" />
        </button>

        {/* Back to portfolio */}
        <Link
          href="/"
          className="hidden sm:flex items-center gap-1 text-[10px] text-white/25 hover:text-white/50 transition-colors font-medium"
        >
          <ExternalLink className="w-3 h-3" />
          6ixtype
        </Link>
      </div>
    </header>
  );
}
