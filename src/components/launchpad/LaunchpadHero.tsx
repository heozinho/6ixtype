"use client";
import { motion } from "framer-motion";
import { Layers } from "lucide-react";

export default function LaunchpadHero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-5 mb-12"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
          <Layers className="w-4 h-4 text-violet-400" />
        </div>
        <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">
          Ecosystem
        </span>
      </div>

      <div className="space-y-3">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
          6ixtype{" "}
          <span className="text-white/30">Launchpad</span>
        </h1>
        <p className="text-base sm:text-lg text-white/50 max-w-2xl leading-relaxed">
          The official ecosystem hub. Four products, one direction — music analytics, data platforms, audio software and the portfolio that holds it all together.
        </p>
      </div>

      {/* Accent bar */}
      <div className="flex gap-1.5 pt-1">
        {["#8b5cf6", "#1db954", "#06b6d4", "#f59e0b"].map((color) => (
          <div
            key={color}
            className="h-1 rounded-full flex-1 max-w-16"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </motion.div>
  );
}
