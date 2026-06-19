"use client";
import { motion } from "framer-motion";
import OverviewCards from "@/components/6data/overview/OverviewCards";
import DemoDatasetGrid from "@/components/6data/overview/DemoDatasetGrid";
import RecentActivity from "@/components/6data/overview/RecentActivity";
import { LayoutDashboard } from "lucide-react";

export default function DataOverviewPage() {
  return (
    <div className="p-5 space-y-7 max-w-6xl">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-2.5"
      >
        <LayoutDashboard className="w-4 h-4 text-cyan-400" />
        <div>
          <h1 className="text-lg font-black text-white">Overview</h1>
          <p className="text-xs text-white/35">
            Your data workspace at a glance
          </p>
        </div>
      </motion.div>

      {/* Stat cards */}
      <OverviewCards />

      {/* Recent workspaces + quick actions */}
      <RecentActivity />

      {/* Demo datasets */}
      <DemoDatasetGrid />
    </div>
  );
}
