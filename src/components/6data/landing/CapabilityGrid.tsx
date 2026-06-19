"use client";
import { motion } from "framer-motion";
import { capabilities } from "@/data/6data-capabilities";
import { Badge } from "@/components/ui/badge";

const stageColours = {
  mvp: { label: "MVP", className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25" },
  v1: { label: "v1", className: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25" },
  v2: { label: "v2", className: "bg-violet-500/15 text-violet-400 border-violet-500/25" },
};

export default function CapabilityGrid() {
  return (
    <section className="py-20 px-6 sm:px-8 bg-white/[0.02]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <p className="text-xs font-semibold text-cyan-400/60 uppercase tracking-widest mb-3">
            Capabilities
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            One workspace. Everything.
          </h2>
          <p className="text-white/45 max-w-xl mx-auto">
            14 integrated workspace zones covering the full data lifecycle — from first import to published report.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {capabilities.map((cap, i) => {
            const stage = stageColours[cap.stage];
            return (
              <motion.div
                key={cap.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="group relative p-5 rounded-xl border border-white/8 bg-white/[0.025] hover:border-cyan-500/25 hover:bg-cyan-500/5 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-2xl">{cap.icon}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${stage.className}`}
                  >
                    {stage.label}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white/85 mb-2 group-hover:text-cyan-300 transition-colors">
                  {cap.name}
                </h3>
                <p className="text-xs text-white/45 leading-relaxed mb-3">
                  {cap.description}
                </p>

                <div className="flex flex-wrap gap-1">
                  {cap.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-[10px] bg-white/5 text-white/35 border-white/8 px-1.5 py-0"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
