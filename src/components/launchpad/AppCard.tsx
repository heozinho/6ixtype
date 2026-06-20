"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ExternalLink, ArrowRight, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { EcosystemApp } from "@/data/apps";

const statusConfig = {
  live: { label: "Live", className: "bg-foreground/5 text-foreground border-foreground/20" },
  building: { label: "Building", className: "bg-foreground/5 text-foreground/70 border-foreground/20" },
  prototype: { label: "Prototype", className: "bg-foreground/5 text-foreground/50 border-foreground/20" },
};

interface AppCardProps {
  app: EcosystemApp;
  index: number;
}

export default function AppCard({ app, index }: AppCardProps) {
  const status = statusConfig[app.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
      className="group relative"
    >
      {/* Glow effect */}
      <div
        className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm bg-foreground/5"
      />

      <div className="relative h-full rounded-2xl border border-foreground/8 bg-foreground/3 backdrop-blur-sm p-6 flex flex-col gap-5 hover:border-foreground/15 transition-all duration-300">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl font-black tracking-tight text-foreground">
                {app.name}
              </span>
            </div>
            <p className="text-xs text-foreground/40 font-medium uppercase tracking-wider">
              {app.tagline}
            </p>
          </div>
          <span
            className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${status.className}`}
          >
            {status.label}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {app.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-[11px] bg-foreground/5 text-foreground/50 border-foreground/10 px-2 py-0.5"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Description */}
        <p className="text-sm text-foreground/60 leading-relaxed flex-1">
          {app.description}
        </p>

        {/* Features */}
        <ul className="space-y-1.5">
          {app.features.slice(0, 4).map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-xs text-foreground/50">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-foreground" />
              {feature}
            </li>
          ))}
        </ul>

        {/* Divider */}
        <div className="h-px bg-foreground/8" />

        {/* Actions */}
        <div className="flex items-center gap-2">
          {app.primaryAction.external ? (
            <a
              href={app.primaryAction.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ size: "sm" }),
                "flex-1 text-xs font-semibold justify-center bg-foreground text-background hover:bg-foreground/90 border border-transparent"
              )}
            >
              {app.primaryAction.label}
              <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
            </a>
          ) : (
            <Link
              href={app.primaryAction.href}
              className={cn(
                buttonVariants({ size: "sm" }),
                "flex-1 text-xs font-semibold justify-center bg-foreground text-background hover:bg-foreground/90 border border-transparent"
              )}
            >
              {app.primaryAction.label}
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          )}

          {app.secondaryAction && (
            <Link
              href={app.secondaryAction.href}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "text-xs text-foreground/50 hover:text-foreground/80 hover:bg-foreground/5"
              )}
            >
              {app.secondaryAction.label}
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
