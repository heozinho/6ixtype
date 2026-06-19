"use client";
import { motion } from "framer-motion";
import { Table2, FlaskConical, LayoutGrid, Upload } from "lucide-react";

const cards = [
  {
    label: "Total Datasets",
    value: "6",
    icon: Table2,
    colour: "#06b6d4",
    subtitle: "Across 4 workspaces",
  },
  {
    label: "Recent Imports",
    value: "3",
    icon: Upload,
    colour: "#8b5cf6",
    subtitle: "Last 7 days",
  },
  {
    label: "Saved Queries",
    value: "2",
    icon: FlaskConical,
    colour: "#10b981",
    subtitle: "Across workspaces",
  },
  {
    label: "Active Dashboards",
    value: "1",
    icon: LayoutGrid,
    colour: "#f59e0b",
    subtitle: "Music analytics",
  },
];

export default function OverviewCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.4 }}
            className="relative p-4 rounded-xl border border-white/8 bg-white/[0.025] hover:border-white/15 transition-all duration-200"
          >
            {/* Icon */}
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
              style={{ backgroundColor: `${card.colour}18`, border: `1px solid ${card.colour}30` }}
            >
              <Icon className="w-4 h-4" style={{ color: card.colour }} />
            </div>

            <p className="text-2xl font-black text-white mb-0.5">{card.value}</p>
            <p className="text-xs font-semibold text-white/60">{card.label}</p>
            <p className="text-[10px] text-white/30 mt-0.5">{card.subtitle}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
