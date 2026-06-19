'use client';
import { useState, useRef } from 'react';
import { Wand2, Download, Aperture, AudioWaveform } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// ─── Preset Components ─────────────────────────────────────────────────────────

function DataOrb({ active }: { active: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current || !active) return;
    meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
  });

  if (!active) return null;

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[2.5, 64, 64]} />
        <MeshDistortMaterial
          color="#06b6d4"
          emissive="#0891b2"
          emissiveIntensity={0.5}
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

function AudioDNA({ active }: { active: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!groupRef.current || !active) return;
    groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
  });

  if (!active) return null;

  const pairs = 20;
  return (
    <group ref={groupRef}>
      {Array.from({ length: pairs }).map((_, i) => {
        const y = (i - pairs / 2) * 0.4;
        const rot = i * 0.3;
        const x1 = Math.cos(rot) * 2;
        const z1 = Math.sin(rot) * 2;
        const x2 = Math.cos(rot + Math.PI) * 2;
        const z2 = Math.sin(rot + Math.PI) * 2;

        return (
          <group key={i} position={[0, y, 0]}>
            <mesh position={[x1, 0, z1]}>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial color="#3b82f6" emissive="#2563eb" emissiveIntensity={1} />
            </mesh>
            <mesh position={[x2, 0, z2]}>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial color="#f43f5e" emissive="#e11d48" emissiveIntensity={1} />
            </mesh>
            {/* Connecting bar */}
            <mesh position={[0, 0, 0]} rotation={[0, -rot, Math.PI / 2]}>
              <cylinderGeometry args={[0.05, 0.05, 4]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={0.2} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function RenderStudioPage() {
  const [activePreset, setActivePreset] = useState<'orb' | 'dna'>('orb');

  const handleScreenshot = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `render-studio-${activePreset}-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="flex h-full bg-[#0a0a12] overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-72 bg-[#0f0f18] border-r border-white/6 flex flex-col shrink-0">
        <div className="p-4 border-b border-white/6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight leading-none mb-1">Render Studio</h1>
              <p className="text-[10px] text-white/40 leading-none">Abstract data art generator</p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-6">
          <div>
            <h2 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Presets</h2>
            <div className="space-y-2">
              <button
                onClick={() => setActivePreset('orb')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  activePreset === 'orb' 
                    ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400' 
                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                }`}
              >
                <Aperture className="w-5 h-5 shrink-0" />
                <div className="text-left">
                  <div className="text-sm font-bold">Data Orb</div>
                  <div className="text-[10px] opacity-60">Pulsing volumetric sphere</div>
                </div>
              </button>

              <button
                onClick={() => setActivePreset('dna')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  activePreset === 'dna' 
                    ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' 
                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                }`}
              >
                <AudioWaveform className="w-5 h-5 shrink-0" />
                <div className="text-left">
                  <div className="text-sm font-bold">Audio DNA</div>
                  <div className="text-[10px] opacity-60">6Stats inspired helix</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/6">
          <button onClick={handleScreenshot} className="w-full flex items-center justify-center gap-2 px-3 py-3 bg-white text-black text-xs font-bold rounded-xl hover:bg-gray-200 transition-colors">
            <Download className="w-4 h-4" />
            Export High-Res PNG
          </button>
        </div>
      </div>

      {/* 3D Canvas Area */}
      <div className="flex-1 relative bg-black flex flex-col">
        <div className="absolute top-4 left-4 z-10 text-white/50 text-xs font-mono">
          <div>Preset: {activePreset}</div>
          <div className="mt-2 text-[10px] opacity-50">Orbit: Left Click · Pan: Right Click · Zoom: Scroll</div>
        </div>

        <Canvas camera={{ position: [0, 0, 10], fov: 45 }} gl={{ preserveDrawingBuffer: true, antialias: true }}>
          <color attach="background" args={['#050508']} />
          <ambientLight intensity={0.2} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <pointLight position={[-5, -5, -5]} intensity={0.5} color="#06b6d4" />
          
          <OrbitControls makeDefault enableDamping dampingFactor={0.05} autoRotate autoRotateSpeed={0.5} />
          <Environment preset="city" />

          <DataOrb active={activePreset === 'orb'} />
          <AudioDNA active={activePreset === 'dna'} />
          
          <EffectWrapper />
        </Canvas>
      </div>
    </div>
  );
}

function EffectWrapper() {
  // Can add PostProcessing here later, keeping it clean for MVP
  return null;
}
