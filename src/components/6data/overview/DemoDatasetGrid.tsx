"use client";
import { motion } from "framer-motion";
import { demoDatasetsMetadata } from "@/data/6data-demo-datasets";
import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";

const typeColours: Record<string, string> = {
  text: "#94a3b8",
  integer: "#60a5fa",
  decimal: "#34d399",
  date: "#f472b6",
  datetime: "#fb923c",
  category: "#a78bfa",
};

export default function DemoDatasetGrid() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold text-white/80">Demo Datasets</h2>
        </div>
        <span className="text-[10px] text-white/30 font-medium">
          {demoDatasetsMetadata.length} built-in
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {demoDatasetsMetadata.map((ds, i) => (
          <motion.div
            key={ds.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
            className="group relative p-4 rounded-xl border border-white/8 bg-white/[0.025] hover:border-cyan-500/25 hover:bg-cyan-500/5 transition-all duration-200 cursor-pointer"
          >
            {/* Quality score */}
            <div className="absolute top-3 right-3">
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/25 px-1.5 py-0.5 rounded-full">
                {ds.qualityScore}%
              </span>
            </div>

            {/* Header */}
            <div className="flex items-start gap-2.5 mb-3 pr-10">
              <span className="text-2xl flex-shrink-0">{ds.icon}</span>
              <div>
                <h3 className="text-xs font-bold text-white/80 group-hover:text-cyan-300 transition-colors">
                  {ds.name}
                </h3>
                <p className="text-[10px] text-white/35 mt-0.5">
                  {ds.rowCount} rows · {ds.columns.length} columns
                </p>
              </div>
            </div>

            <p className="text-[11px] text-white/45 leading-relaxed mb-3 line-clamp-2">
              {ds.description}
            </p>

            {/* Column type pills */}
            <div className="flex flex-wrap gap-1 mb-3">
              {Array.from(new Set(ds.columns.map((c) => c.type))).map((type) => (
                <span
                  key={type}
                  className="text-[9px] px-1.5 py-0.5 rounded font-medium border"
                  style={{
                    color: typeColours[type] ?? "#94a3b8",
                    borderColor: `${typeColours[type] ?? "#94a3b8"}30`,
                    backgroundColor: `${typeColours[type] ?? "#94a3b8"}10`,
                  }}
                >
                  {type}
                </span>
              ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-4">
              {ds.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 border border-white/8 text-white/35 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Load button */}
            <Link
              href={`/6data/app/import?demo=${ds.slug}`}
              className="flex items-center gap-1 text-[11px] font-semibold text-cyan-400/70 hover:text-cyan-400 transition-colors"
            >
              Load demo
              <ArrowRight className="w-3 h-3" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
