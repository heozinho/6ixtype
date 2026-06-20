"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  Upload,
  Archive,
  Table2,
  FlaskConical,
  ChartColumn,
  Box,
  Wand2,
  LayoutGrid,
  BookOpen,
  GraduationCap,
  Zap,
  Plug,
  Share2,
  Settings,
  Database,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navSections = [
  {
    label: null,
    items: [
      { name: "Overview", path: "/6data/app", icon: LayoutDashboard },
      { name: "Workspaces", path: "/6data/app/workspaces", icon: FolderOpen },
    ],
  },
  {
    label: "Data",
    items: [
      { name: "Import Centre", path: "/6data/app/import", icon: Upload },
      { name: "Data Vault", path: "/6data/app/vault", icon: Archive },
      { name: "Datasets", path: "/6data/app/datasets", icon: Table2 },
    ],
  },
  {
    label: "Analysis",
    items: [
      { name: "Query Lab", path: "/6data/app/query", icon: FlaskConical },
      { name: "Visualise", path: "/6data/app/visualise", icon: ChartColumn },
      { name: "3D Lab", path: "/6data/app/3d", icon: Box },
      { name: "Render Studio", path: "/6data/app/render", icon: Wand2 },
      { name: "Dashboards", path: "/6data/app/dashboards", icon: LayoutGrid },
    ],
  },
  {
    label: "Learn",
    items: [
      { name: "Research", path: "/6data/app/research", icon: BookOpen },
      { name: "Learning", path: "/6data/app/learn", icon: GraduationCap },
    ],
  },
  {
    label: "System",
    items: [
      { name: "Automations", path: "/6data/app/automations", icon: Zap },
      { name: "Connectors", path: "/6data/app/connectors", icon: Plug },
      { name: "Publishing", path: "/6data/app/publishing", icon: Share2 },
      { name: "Settings", path: "/6data/app/settings", icon: Settings },
    ],
  },
];

interface DataSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function DataSidebar({ collapsed, onToggle }: DataSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-[#0d0d18] border-r border-white/6 transition-all duration-300 flex-shrink-0",
        collapsed ? "w-16" : "w-56"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-14 border-b border-white/6">
        <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
          <Database className="w-3.5 h-3.5 text-cyan-400" />
        </div>
        {!collapsed && (
          <span className="text-sm font-black text-white tracking-tight">6Data</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {navSections.map((section, si) => (
          <div key={si} className={si > 0 ? "pt-2" : ""}>
            {section.label && !collapsed && (
              <p className="px-2 pb-1.5 text-[9px] font-bold text-white/25 uppercase tracking-widest">
                {section.label}
              </p>
            )}
            {section.label && collapsed && si > 0 && (
              <div className="mx-2 mb-1.5 h-px bg-white/6" />
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === "/6data/app"
                  ? pathname === item.path
                  : pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  title={collapsed ? item.name : undefined}
                  className={cn(
                    "flex items-center gap-2.5 px-2 py-2 rounded-lg text-xs font-medium transition-all duration-150",
                    isActive
                      ? "bg-cyan-500/15 text-cyan-400"
                      : "text-white/40 hover:text-white/70 hover:bg-white/5",
                    collapsed && "justify-center"
                  )}
                >
                  <Icon
                    className={cn(
                      "flex-shrink-0",
                      collapsed ? "w-4.5 h-4.5" : "w-4 h-4",
                      isActive ? "text-cyan-400" : "text-white/35"
                    )}
                  />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="px-2 py-3 border-t border-white/6">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center py-2 rounded-lg text-white/25 hover:text-white/60 hover:bg-white/5 transition-all duration-150"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 mr-1.5" />
              <span className="text-xs">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
