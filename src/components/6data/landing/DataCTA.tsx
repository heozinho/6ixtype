"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DataCTA() {
  return (
    <section className="py-24 px-6 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/8 via-transparent to-transparent overflow-hidden p-10 text-center"
        >
          {/* Background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-cyan-500/15 blur-3xl rounded-full pointer-events-none" />

          <div className="relative space-y-6">
            <div className="flex justify-center">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
                Start with a demo dataset
              </h2>
              <p className="text-white/45 max-w-lg mx-auto text-base leading-relaxed">
                No account needed. Open the 6Data app, load a demo dataset and explore the full workflow — import, profile, clean, query, chart, and research.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/6data/app"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 border-0"
                )}
              >
                Open 6Data App
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link
                href="/launchpad"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "border-white/15 text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                Back to Launchpad
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
