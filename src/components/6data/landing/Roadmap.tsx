"use client";
import { motion } from "framer-motion";
import { roadmap } from "@/data/6data-roadmap";
import { CheckCircle2, Circle, Clock } from "lucide-react";

const stageConfig = {
  active: {
    icon: CheckCircle2,
    iconClass: "text-emerald-400",
    borderClass: "border-emerald-500/30",
    bgClass: "bg-emerald-500/5",
    labelClass: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  next: {
    icon: Clock,
    iconClass: "text-cyan-400",
    borderClass: "border-cyan-500/25",
    bgClass: "bg-cyan-500/5",
    labelClass: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  },
  future: {
    icon: Circle,
    iconClass: "text-white/20",
    borderClass: "border-white/8",
    bgClass: "bg-white/[0.02]",
    labelClass: "bg-white/8 text-white/30 border-white/10",
  },
};

export default function Roadmap() {
  return (
    <section id="roadmap" className="py-20 px-6 sm:px-8 bg-white/[0.02]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <p className="text-xs font-semibold text-cyan-400/60 uppercase tracking-widest mb-3">
            Product Roadmap
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Building in stages
          </h2>
          <p className="text-white/45 max-w-xl mx-auto">
            6Data is built stage by stage. No AI before the data basics work. No sharing before the data is right.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roadmap.map((stage, si) => {
            const config = stageConfig[stage.status];
            const Icon = config.icon;
            return (
              <motion.div
                key={stage.stage}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: si * 0.1, duration: 0.5 }}
                className={`rounded-xl border p-5 ${config.borderClass} ${config.bgClass}`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${config.labelClass}`}
                    >
                      {stage.stage}
                    </span>
                    <h3 className="text-base font-black text-white mt-2">{stage.label}</h3>
                  </div>
                  <Icon className={`w-5 h-5 ${config.iconClass}`} />
                </div>

                {/* Items */}
                <ul className="space-y-3">
                  {stage.items.map((item) => (
                    <li key={item.id} className="flex gap-2.5">
                      <div
                        className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                          stage.status === "active"
                            ? "bg-emerald-400"
                            : stage.status === "next"
                            ? "bg-cyan-400"
                            : "bg-white/20"
                        }`}
                      />
                      <div>
                        <p className="text-xs font-semibold text-white/70">{item.title}</p>
                        <p className="text-[11px] text-white/35 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
