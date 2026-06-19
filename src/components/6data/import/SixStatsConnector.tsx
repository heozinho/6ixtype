'use client';
import { useState } from 'react';
import { Search, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface SixStatsConnectorProps {
  onConnect: () => void;
}

export default function SixStatsConnector({ onConnect }: SixStatsConnectorProps) {
  const [status, setStatus] = useState<'idle' | 'connecting' | 'success'>('idle');

  const handleConnect = async () => {
    setStatus('connecting');
    // Simulate API connection & OAuth handshake
    await new Promise(r => setTimeout(r, 1500));
    setStatus('success');
  };

  return (
    <div className="border border-white/10 rounded-2xl p-8 bg-[#0f0f18] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-pink-500/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="flex items-start gap-5 relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shrink-0">
          <Search className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-black text-white mb-1">6Stats Connector</h3>
          <p className="text-xs text-white/50 leading-relaxed max-w-sm mb-6">
            Securely pull your authenticated Spotify listening history from your 6Stats profile. You'll be asked to authorise 6Data to view your records.
          </p>

          {status === 'idle' && (
            <button
              onClick={handleConnect}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-black font-bold text-sm rounded-xl hover:bg-gray-200 transition-colors"
            >
              Connect to 6Stats
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {status === 'connecting' && (
            <div className="flex items-center gap-3 text-sm font-bold text-pink-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              Establishing secure connection...
            </div>
          )}

          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
                Connected! Found 1 dataset.
              </div>
              <button
                onClick={onConnect}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold text-sm rounded-xl hover:opacity-90 transition-opacity"
              >
                Import "Spotify Listening History"
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
