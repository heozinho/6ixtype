"use client";
import { useState } from "react";
import { ChevronDown, Check, FolderOpen } from "lucide-react";
import { useDatasetStore } from "@/contexts/DatasetStoreContext";
import CreateWorkspaceModal from "../workspace/CreateWorkspaceModal";

export default function WorkspaceSwitcher() {
  const { workspaces } = useDatasetStore();
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeId, setActiveId] = useState(workspaces[0]?.id || 'ws-demo-lab');

  const active = workspaces.find((w) => w.id === activeId) ?? workspaces[0];

  if (!active) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-white/8 bg-white/4 hover:bg-white/8 transition-all group"
      >
        <span className="text-base leading-none">{active.icon}</span>
        <span className="text-xs font-semibold text-white/70 group-hover:text-white/90 transition-colors max-w-[120px] truncate">
          {active.name}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-white/30 transition-transform duration-150 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[90]"
            onClick={() => setOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-1.5 z-[100] w-64 rounded-xl border border-white/10 bg-[#0a0a12]/95 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden">
            <div className="px-3 pt-3 pb-2">
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                Workspaces
              </p>
            </div>
            <div className="pb-2">
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => {
                    setActiveId(ws.id);
                    setOpen(false);
                  }}
                  className="w-full flex items-start gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors text-left"
                >
                  <span className="text-lg leading-none mt-0.5 flex-shrink-0">{ws.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-white/75 truncate">{ws.name}</p>
                      {ws.id === activeId && (
                        <Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-[10px] text-white/30 truncate mt-0.5">{ws.description}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] text-white/25">
                        {ws.datasetCount} dataset{ws.datasetCount !== 1 ? "s" : ""}
                      </span>
                      <span className="text-[10px] text-white/20">·</span>
                      <span className="text-[10px] text-white/25">{ws.lastActive}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="px-3 pt-2 pb-3 border-t border-white/6">
              <button
                onClick={() => {
                  setOpen(false);
                  setModalOpen(true);
                }}
                className="flex items-center gap-2 text-xs text-white/35 hover:text-white/60 transition-colors font-medium w-full text-left"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                New workspace
              </button>
            </div>
          </div>
        </>
      )}

      <CreateWorkspaceModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
