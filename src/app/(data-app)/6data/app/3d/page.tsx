'use client';
import { useState, useMemo, useRef } from 'react';
import { useDatasetStore } from '@/contexts/DatasetStoreContext';
import { Box, Download, Settings2, SlidersHorizontal, Maximize2 } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { applyCleaningSteps } from '@/lib/6data/cleaning-engine';

export default function ThreeDScatterPage() {
  const { datasets } = useDatasetStore();
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('');
  const dataset = datasets.find(d => d.id === selectedDatasetId);

  const [xAxis, setXAxis] = useState<string>('');
  const [yAxis, setYAxis] = useState<string>('');
  const [zAxis, setZAxis] = useState<string>('');
  const [colorAxis, setColorAxis] = useState<string>('');

  const { rows, columns } = useMemo(() => {
    if (!dataset) return { rows: [], columns: [] };
    const cleaned = applyCleaningSteps(dataset.rows, dataset.schema, dataset.cleaningSteps);
    return { rows: cleaned.rows, columns: dataset.schema.map(c => c.name) };
  }, [dataset]);

  // Normalise data to a -5 to 5 bounding box
  const normalizedData = useMemo(() => {
    if (!xAxis || !yAxis || !zAxis || rows.length === 0) return [];
    
    const getVal = (row: any, col: string) => {
      const v = Number(row[col]);
      return isNaN(v) ? 0 : v;
    };

    let xMin = Infinity, xMax = -Infinity;
    let yMin = Infinity, yMax = -Infinity;
    let zMin = Infinity, zMax = -Infinity;
    let cMin = Infinity, cMax = -Infinity;

    rows.forEach(r => {
      const x = getVal(r, xAxis);
      const y = getVal(r, yAxis);
      const z = getVal(r, zAxis);
      if (x < xMin) xMin = x; if (x > xMax) xMax = x;
      if (y < yMin) yMin = y; if (y > yMax) yMax = y;
      if (z < zMin) zMin = z; if (z > zMax) zMax = z;
      if (colorAxis) {
        const c = getVal(r, colorAxis);
        if (c < cMin) cMin = c; if (c > cMax) cMax = c;
      }
    });

    // Handle zero ranges
    const xRange = xMax - xMin || 1;
    const yRange = yMax - yMin || 1;
    const zRange = zMax - zMin || 1;
    const cRange = cMax - cMin || 1;

    // We will render max 1000 points to keep performance high for MVP
    return rows.slice(0, 1000).map((r, i) => {
      const x = ((getVal(r, xAxis) - xMin) / xRange) * 10 - 5;
      const y = ((getVal(r, yAxis) - yMin) / yRange) * 10 - 5;
      const z = ((getVal(r, zAxis) - zMin) / zRange) * 10 - 5;
      
      let colorIntensity = 0.5;
      if (colorAxis) {
        colorIntensity = (getVal(r, colorAxis) - cMin) / cRange;
      }
      
      return { id: i, x, y, z, original: r, colorIntensity };
    });
  }, [rows, xAxis, yAxis, zAxis, colorAxis]);

  const handleScreenshot = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `3d-scatter-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="flex h-full bg-[#0a0a12] overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-72 bg-[#0f0f18] border-r border-white/6 flex flex-col shrink-0">
        <div className="p-4 border-b border-white/6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
              <Box className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight leading-none mb-1">3D Scatter Plot</h1>
              <p className="text-[10px] text-white/40 leading-none">Map X, Y, and Z axes</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-white mb-2">Dataset</label>
            <select
              value={selectedDatasetId}
              onChange={(e) => {
                setSelectedDatasetId(e.target.value);
                setXAxis(''); setYAxis(''); setZAxis(''); setColorAxis('');
              }}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 appearance-none"
            >
              <option value="">Select a dataset</option>
              {datasets.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {dataset && (
            <>
              <div className="space-y-4 pt-4 border-t border-white/6">
                <div>
                  <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">X Axis (Numeric)</label>
                  <select value={xAxis} onChange={(e) => setXAxis(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white">
                    <option value="">Select column</option>
                    {columns.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Y Axis (Numeric)</label>
                  <select value={yAxis} onChange={(e) => setYAxis(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white">
                    <option value="">Select column</option>
                    {columns.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Z Axis (Numeric)</label>
                  <select value={zAxis} onChange={(e) => setZAxis(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white">
                    <option value="">Select column</option>
                    {columns.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="pt-2">
                  <label className="block text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2">Color Intensity (Optional)</label>
                  <select value={colorAxis} onChange={(e) => setColorAxis(e.target.value)} className="w-full bg-cyan-500/10 border border-cyan-500/20 rounded-lg px-3 py-2 text-xs text-cyan-300">
                    <option value="">None</option>
                    {columns.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {xAxis && yAxis && zAxis && (
                <div className="pt-4 mt-4 border-t border-white/6">
                  <button onClick={handleScreenshot} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/5 border border-white/10 text-white text-xs font-bold rounded-lg hover:bg-white/10 transition-colors">
                    <Download className="w-4 h-4" />
                    Export High-Res PNG
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* 3D Canvas Area */}
      <div className="flex-1 relative bg-black flex flex-col">
        {!xAxis || !yAxis || !zAxis ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-white/40 pointer-events-none">
            <SlidersHorizontal className="w-12 h-12 mb-4 opacity-30" />
            <p className="text-sm font-medium">Select a dataset and configure X, Y, and Z axes</p>
          </div>
        ) : (
          <div className="absolute top-4 left-4 z-10 text-white/50 text-xs font-mono">
            <div>X: {xAxis}</div>
            <div>Y: {yAxis}</div>
            <div>Z: {zAxis}</div>
            {colorAxis && <div className="text-cyan-400">Color: {colorAxis}</div>}
            <div className="mt-2 text-[10px] opacity-50">Orbit: Left Click · Pan: Right Click · Zoom: Scroll</div>
          </div>
        )}

        <Canvas camera={{ position: [10, 10, 10], fov: 50 }} gl={{ preserveDrawingBuffer: true }}>
          <color attach="background" args={['#0a0a12']} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          
          <OrbitControls makeDefault enableDamping dampingFactor={0.05} />
          
          <gridHelper args={[10, 10, '#333333', '#222222']} position={[0, -5, 0]} />
          <axesHelper args={[6]} />

          {xAxis && yAxis && zAxis && (
            <group>
              {/* Axis Labels */}
              <Text position={[6, -5, 0]} fontSize={0.4} color="white" anchorX="left">X</Text>
              <Text position={[0, 6, 0]} fontSize={0.4} color="white" anchorY="bottom">Y</Text>
              <Text position={[0, -5, 6]} fontSize={0.4} color="white" anchorX="left">Z</Text>

              {normalizedData.map((d) => (
                <DataPoint key={d.id} data={d} />
              ))}
            </group>
          )}
        </Canvas>
      </div>
    </div>
  );
}

function DataPoint({ data }: { data: any }) {
  const [hovered, setHovered] = useState(false);

  // Interpolate color from gray to cyan based on intensity
  const color = new THREE.Color().lerpColors(
    new THREE.Color('#475569'), // Slate 600
    new THREE.Color('#06b6d4'), // Cyan 500
    data.colorIntensity
  );

  return (
    <group position={[data.x, data.y, data.z]}>
      <mesh
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[hovered ? 0.2 : 0.1, 16, 16]} />
        <meshStandardMaterial color={hovered ? '#ffffff' : color} emissive={hovered ? '#ffffff' : '#000000'} emissiveIntensity={0.5} />
      </mesh>
      
      {hovered && (
        <Html distanceFactor={15}>
          <div className="bg-[#0f0f18] border border-white/20 p-2 rounded-lg text-xs text-white shadow-xl whitespace-nowrap pointer-events-none select-none -translate-x-1/2 -translate-y-[120%]">
            {Object.entries(data.original)
              .filter(([k]) => k !== 'id')
              .slice(0, 5) // Show top 5 properties
              .map(([k, v]) => (
                <div key={k} className="flex gap-2 justify-between">
                  <span className="text-white/40">{k}:</span>
                  <span className="font-bold">{String(v)}</span>
                </div>
              ))}
          </div>
        </Html>
      )}
    </group>
  );
}
