'use client';
export const runtime = 'edge';
import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDatasetStore } from '@/contexts/DatasetStoreContext';
import { ArrowLeft, Plus, LayoutDashboard, Settings2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { applyCleaningSteps } from '@/lib/6data/cleaning-engine';
import ChartRenderer from '@/components/6data/visualise/ChartRenderer';
import type { DashboardWidget } from '@/lib/6data/types';

export default function DashboardBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const dashboardId = params.id as string;
  
  const { dashboards, charts, datasets, updateDashboard } = useDatasetStore();
  const dashboard = dashboards.find((d) => d.id === dashboardId);

  const [isAddingWidget, setIsAddingWidget] = useState(false);

  if (!dashboard) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white/40">
        Dashboard not found.
      </div>
    );
  }

  const handleAddWidget = (chartId: string) => {
    const newWidget: DashboardWidget = {
      id: `w-${Date.now()}`,
      chartId,
      x: 0, y: 0, w: 1, h: 1 // default sizing for a grid
    };
    updateDashboard(dashboard.id, {
      widgets: [...dashboard.widgets, newWidget]
    });
    setIsAddingWidget(false);
  };

  const handleRemoveWidget = (widgetId: string) => {
    updateDashboard(dashboard.id, {
      widgets: dashboard.widgets.filter(w => w.id !== widgetId)
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a12]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/6 bg-[#0f0f18] shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/6data/app/dashboards" className="p-2 text-white/40 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight leading-none mb-1">{dashboard.name}</h1>
              <p className="text-[10px] text-white/40 leading-none">Dashboard Builder</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsAddingWidget(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500 text-black text-xs font-bold rounded-lg hover:bg-cyan-400"
        >
          <Plus className="w-4 h-4" />
          Add Widget
        </button>
      </div>

      {/* Grid Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        {dashboard.widgets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-white/40">
            <Settings2 className="w-8 h-8 mb-4 opacity-50" />
            <p className="text-sm">This dashboard is empty.</p>
            <button
              onClick={() => setIsAddingWidget(true)}
              className="mt-4 text-cyan-400 text-xs font-bold hover:underline"
            >
              Add your first chart
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {dashboard.widgets.map((widget) => {
              const chart = charts.find(c => c.id === widget.chartId);
              if (!chart) return null;
              
              return (
                <WidgetCard 
                  key={widget.id} 
                  widget={widget} 
                  chart={chart} 
                  datasets={datasets}
                  onRemove={() => handleRemoveWidget(widget.id)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Add Widget Modal */}
      {isAddingWidget && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[80vh] flex flex-col bg-[#0f0f18] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-white/6 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Select a Chart to Add</h3>
              <button onClick={() => setIsAddingWidget(false)} className="text-white/40 hover:text-white text-xs">Close</button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              {charts.length === 0 ? (
                <div className="text-center py-8 text-white/40 text-sm">
                  You haven't saved any charts yet.<br/>
                  <Link href="/6data/app/visualise" className="text-cyan-400 hover:underline mt-2 inline-block">Go to Visualisation Studio</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {charts.map(chart => (
                    <button
                      key={chart.id}
                      onClick={() => handleAddWidget(chart.id)}
                      className="text-left p-4 bg-black/40 border border-white/10 rounded-xl hover:border-cyan-500/50 transition-colors"
                    >
                      <h4 className="font-bold text-white text-sm mb-1">{chart.name}</h4>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">{chart.type} · {chart.yAxis} by {chart.xAxis}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function WidgetCard({ widget, chart, datasets, onRemove }: { widget: DashboardWidget, chart: any, datasets: any[], onRemove: () => void }) {
  const dataset = datasets.find(d => d.id === chart.datasetId);
  
  const { rows } = useMemo(() => {
    if (!dataset) return { rows: [] };
    return applyCleaningSteps(dataset.rows, dataset.schema, dataset.cleaningSteps);
  }, [dataset]);

  return (
    <div className="flex flex-col bg-[#0f0f18] border border-white/10 rounded-2xl p-6 shadow-xl h-[400px]">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white">{chart.name}</h3>
          <p className="text-[10px] text-white/40 uppercase tracking-widest">
            {dataset ? dataset.name : 'Unknown Dataset'}
          </p>
        </div>
        <button 
          onClick={onRemove}
          className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 min-h-0 relative">
        {dataset ? (
          <ChartRenderer
            type={chart.type}
            data={rows.slice(0, 500)} // Cap at 500 for MVP performance
            xAxis={chart.xAxis}
            yAxis={chart.yAxis}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-white/30 text-xs">
            Dataset not found
          </div>
        )}
      </div>
    </div>
  );
}
