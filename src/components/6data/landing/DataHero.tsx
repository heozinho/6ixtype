"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Database } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DataHero() {
  return (
    <section className="relative min-h-[88vh] flex items-center overflow-hidden">
      {/* Animated dot grid background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(6,182,212,0.4) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background opacity-60" />

      {/* Cyan glow orb */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-cyan-500/8 blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6 sm:px-8 py-20">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 mb-8"
        >
          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <span className="text-xs font-semibold text-cyan-400/70 uppercase tracking-widest">
            6Data — Data Platform
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight mb-6 leading-none"
        >
          <span className="text-white">Your data,</span>
          <br />
          <span className="text-cyan-400">understood.</span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-lg sm:text-xl text-white/55 max-w-2xl leading-relaxed mb-10"
        >
          Import files, databases and app data. Profile, clean, query, visualise, research, learn from and render datasets from one workspace.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-wrap gap-3"
        >
          <Link
            href="/6data/app"
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-base px-6 border-0"
            )}
          >
            Enter 6Data
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
          <Link
            href="#roadmap"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "border-white/15 text-white/70 hover:text-white hover:bg-white/5 font-medium text-base px-6"
            )}
          >
            View Roadmap
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-wrap gap-8 mt-16 pt-8 border-t border-white/8"
        >
          {[
            { value: "14", label: "Lifecycle stages" },
            { value: "5", label: "User types" },
            { value: "13", label: "Workspace zones" },
            { value: "3+", label: "Demo datasets" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl font-black text-cyan-400">{stat.value}</p>
              <p className="text-xs text-white/40 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
