"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import OverviewCards from "@/components/6data/overview/OverviewCards";
import DemoDatasetGrid from "@/components/6data/overview/DemoDatasetGrid";
import RecentActivity from "@/components/6data/overview/RecentActivity";
import { LayoutDashboard, Sparkles, Loader2 } from "lucide-react";
import { useDatasetStore } from "@/contexts/DatasetStoreContext";
import { getDemoDatasets } from "@/data/demo-datasets";
import { datasetStore, queryStore, chartStore, dashboardStore } from "@/lib/6data/store";
import { useRouter } from "next/navigation";

export default function DataOverviewPage() {
  const { datasets, refresh } = useDatasetStore();
  const [isInjecting, setIsInjecting] = useState(false);
  const router = useRouter();

  const handleInjectDemoWorkspace = async () => {
    setIsInjecting(true);
    // Simulate loading
    await new Promise(r => setTimeout(r, 800));

    const demos = getDemoDatasets();
    const spotifyDs = demos[0];
    const salesDs = demos[1];

    // Add datasets
    datasetStore.add(spotifyDs);
    datasetStore.add(salesDs);

    // Add a sample query
    const sampleQueryId = queryStore.generateId();
    queryStore.add({
      id: sampleQueryId,
      name: 'Top 5 Spotify Tracks',
      sql: `SELECT track, artist, plays FROM ? ORDER BY plays DESC LIMIT 5`,
      datasetId: spotifyDs.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Add a sample chart
    const sampleChartId = chartStore.generateId();
    chartStore.add({
      id: sampleChartId,
      name: 'Revenue Over Time',
      type: 'area',
      xAxis: 'date',
      yAxis: 'revenue',
      datasetId: salesDs.id,
      createdAt: new Date().toISOString()
    });

    // Add a dashboard
    const dashId = dashboardStore.generateId();
    dashboardStore.add({
      id: dashId,
      name: 'Executive Summary',
      widgets: [
        {
          id: 'w-1',
          chartId: sampleChartId,
          x: 0, y: 0, w: 1, h: 1
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    refresh();
    setIsInjecting(false);
  };
  return (
    <div className="p-5 space-y-7 max-w-6xl">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2.5"
        >
          <LayoutDashboard className="w-4 h-4 text-cyan-400" />
          <div>
            <h1 className="text-lg font-black text-white">Overview</h1>
            <p className="text-xs text-white/35">
              Your data workspace at a glance
            </p>
          </div>
        </motion.div>
        
        {datasets.length === 0 && (
          <button
            onClick={handleInjectDemoWorkspace}
            disabled={isInjecting}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-black text-xs font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isInjecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {isInjecting ? 'Loading...' : 'Load Demo Workspace'}
          </button>
        )}
      </div>

      {/* Stat cards */}
      <OverviewCards />

      {/* Recent workspaces + quick actions */}
      <RecentActivity />

      {/* Demo datasets */}
      <DemoDatasetGrid />
    </div>
  );
}
