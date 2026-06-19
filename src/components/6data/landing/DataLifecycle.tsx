"use client";
import { motion } from "framer-motion";
import { lifecycleSteps } from "@/data/6data-capabilities";
import { ArrowRight } from "lucide-react";

export default function DataLifecycle() {
  return (
    <section className="py-20 px-6 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <p className="text-xs font-semibold text-cyan-400/60 uppercase tracking-widest mb-3">
            Data Lifecycle
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Every stage of your data journey
          </h2>
          <p className="text-white/45 max-w-xl mx-auto">
            6Data is built around a complete data lifecycle. Every step is traceable, reversible, and linked to what came before.
          </p>
        </motion.div>

        {/* Lifecycle pipeline */}
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 hidden md:block">
            <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
          </div>

          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {lifecycleSteps.map((step, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
                className="flex items-center gap-2"
              >
                <div className="relative group">
                  <div className="absolute inset-0 rounded-xl bg-cyan-500/0 group-hover:bg-cyan-500/10 transition-colors duration-300 rounded-lg" />
                  <div className="relative flex items-center gap-2 px-3.5 py-2 rounded-lg border border-white/8 bg-white/3 hover:border-cyan-500/30 transition-all duration-200">
                    <span className="text-xs font-bold text-white/30 tabular-nums w-4">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm font-semibold text-white/70 group-hover:text-cyan-300 transition-colors">
                      {step}
                    </span>
                  </div>
                </div>
                {i < lifecycleSteps.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-white/20 hidden md:block flex-shrink-0" />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Traceability note */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-12 p-5 rounded-xl border border-cyan-500/20 bg-cyan-500/5 text-center"
        >
          <p className="text-sm text-white/50 leading-relaxed">
            At any point you can answer:{" "}
            <span className="text-cyan-400 font-medium">Where did this data come from?</span>{" "}
            <span className="text-white/30">·</span>{" "}
            <span className="text-cyan-400 font-medium">What cleaning steps were applied?</span>{" "}
            <span className="text-white/30">·</span>{" "}
            <span className="text-cyan-400 font-medium">Which query produced this chart?</span>{" "}
            <span className="text-white/30">·</span>{" "}
            <span className="text-cyan-400 font-medium">Can I reproduce this result?</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
