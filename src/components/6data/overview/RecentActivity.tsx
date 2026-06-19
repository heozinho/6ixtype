"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Upload, FolderOpen, ArrowRight } from "lucide-react";
import { mockWorkspaces } from "@/data/6data-workspaces";

export default function RecentActivity() {
  const recentWorkspaces = mockWorkspaces.slice(0, 3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Recent workspaces */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="rounded-xl border border-white/8 bg-white/[0.025] overflow-hidden"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/6">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-3.5 h-3.5 text-white/35" />
            <h3 className="text-xs font-bold text-white/70">Recent Workspaces</h3>
          </div>
          <Link
            href="/6data/app/workspaces"
            className="text-[10px] text-white/30 hover:text-cyan-400 transition-colors flex items-center gap-1 font-medium"
          >
            View all
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="divide-y divide-white/5">
          {recentWorkspaces.map((ws) => (
            <Link
              key={ws.id}
              href={`/6data/app/workspaces/${ws.id}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-white/4 transition-colors group"
            >
              <span className="text-lg flex-shrink-0">{ws.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white/70 group-hover:text-white/90 truncate">
                  {ws.name}
                </p>
                <p className="text-[10px] text-white/30 mt-0.5 truncate">{ws.description}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[10px] text-white/25">{ws.lastActive}</p>
                <p className="text-[10px] text-white/20">
                  {ws.datasetCount} dataset{ws.datasetCount !== 1 ? "s" : ""}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22, duration: 0.4 }}
        className="rounded-xl border border-white/8 bg-white/[0.025] overflow-hidden"
      >
        <div className="px-4 py-3 border-b border-white/6">
          <h3 className="text-xs font-bold text-white/70">Quick Actions</h3>
        </div>

        <div className="p-4 space-y-3">
          {/* Import CTA */}
          <Link
            href="/6data/app/import"
            className="flex items-center gap-3 p-3 rounded-xl border border-cyan-500/20 bg-cyan-500/5 hover:border-cyan-500/35 hover:bg-cyan-500/10 transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <Upload className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white/75 group-hover:text-white/90">
                Import a dataset
              </p>
              <p className="text-[10px] text-white/35">
                Upload CSV or JSON, detect schema, start profiling
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-cyan-400 ml-auto transition-colors" />
          </Link>

          {/* Empty state message */}
          <div className="py-3 text-center">
            <p className="text-[11px] text-white/25 leading-relaxed">
              Your recent datasets, charts and research projects will appear here.
              <br />
              Start by loading a demo dataset or importing your own.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
