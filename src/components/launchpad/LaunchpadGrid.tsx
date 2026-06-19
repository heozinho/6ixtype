"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppCard from "./AppCard";
import { ecosystemApps } from "@/data/apps";
import type { AppStatus, AppType } from "@/data/apps";

type FilterId = "all" | AppStatus | AppType;

const filters: { id: FilterId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "live", label: "Live" },
  { id: "building", label: "Building" },
  { id: "prototype", label: "Prototype" },
  { id: "analytics", label: "Analytics" },
  { id: "platform", label: "Platform" },
  { id: "music", label: "Music" },
];

export default function LaunchpadGrid() {
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");

  const filtered = ecosystemApps.filter((app) => {
    if (activeFilter === "all") return true;
    return app.status === activeFilter || app.type === activeFilter;
  });

  return (
    <div className="space-y-8">
      {/* Filter pills */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="flex flex-wrap gap-2"
      >
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
              activeFilter === filter.id
                ? "bg-white text-black border-white"
                : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white/80"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </motion.div>

      {/* Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <AnimatePresence mode="popLayout">
          {filtered.map((app, i) => (
            <AppCard key={app.id} app={app} index={i} />
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-white/30 text-sm">
          No products match this filter.
        </div>
      )}
    </div>
  );
}
