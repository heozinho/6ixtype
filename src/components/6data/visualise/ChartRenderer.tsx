'use client';
import {
  BarChart, Bar,
  LineChart, Line,
  AreaChart, Area,
  ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import type { ChartType } from '@/lib/6data/types';

interface ChartRendererProps {
  type: ChartType;
  data: Record<string, string>[];
  xAxis: string;
  yAxis: string;
}

export default function ChartRenderer({ type, data, xAxis, yAxis }: ChartRendererProps) {
  // Convert string values to numbers for the Y axis where possible
  const formattedData = data.map((row) => ({
    ...row,
    [yAxis]: Number(row[yAxis]) || 0,
    [xAxis]: row[xAxis] // Keep X axis as string or number depending on type
  }));

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis dataKey={xAxis} stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0a0a0f', borderColor: '#ffffff20', borderRadius: '8px' }}
              itemStyle={{ color: '#22d3ee' }}
              cursor={{ fill: '#ffffff05' }}
            />
            <Bar dataKey={yAxis} fill="#06b6d4" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis dataKey={xAxis} stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0a0a0f', borderColor: '#ffffff20', borderRadius: '8px' }}
              itemStyle={{ color: '#22d3ee' }}
            />
            <Line type="monotone" dataKey={yAxis} stroke="#06b6d4" strokeWidth={2} dot={{ r: 3, fill: '#0a0a0f', stroke: '#06b6d4', strokeWidth: 2 }} activeDot={{ r: 5 }} />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
            <defs>
              <linearGradient id="colorY" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis dataKey={xAxis} stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0a0a0f', borderColor: '#ffffff20', borderRadius: '8px' }}
              itemStyle={{ color: '#22d3ee' }}
            />
            <Area type="monotone" dataKey={yAxis} stroke="#06b6d4" fillOpacity={1} fill="url(#colorY)" />
          </AreaChart>
        );
      case 'scatter':
        // Scatter chart needs numeric data for both X and Y optimally, but recharts can handle strings on X if defined as category.
        // We will just use the same base for MVP
        return (
          <ScatterChart margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis dataKey={xAxis} name={xAxis} stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis dataKey={yAxis} name={yAxis} stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{ backgroundColor: '#0a0a0f', borderColor: '#ffffff20', borderRadius: '8px' }}
              itemStyle={{ color: '#22d3ee' }}
            />
            <Scatter name="Data" data={formattedData} fill="#06b6d4" />
          </ScatterChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}
