import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Terminal, Activity, ShieldAlert } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#030303] text-cyan-400 font-sans selection:bg-magenta-500/30 overflow-hidden relative selection:text-white">
      {/* Background Noise & Static */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay scale-150 animate-pulse" />
      </div>

      {/* Cryptic Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-4 border-b-2 border-cyan-500/30 bg-black/40 backdrop-blur-sm crt-flicker">
        <div className="flex items-center space-x-4">
          <motion.div 
            animate={{ rotate: [0, 90, 0, -90, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="p-1 border border-cyan-500/50"
          >
            <ShieldAlert className="w-5 h-5 text-magenta-500" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold tracking-[0.2em] uppercase text-glitch">
              STN-09 // <span className="text-magenta-500">SLITHER</span>
            </h1>
            <p className="text-[10px] font-mono text-cyan-500/60 leading-none mt-1">
              SYS_STAT: [EXPERIMENTAL_PROTO_V4]
            </p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-8 font-mono text-xs">
          <div className="flex flex-col items-end">
            <span className="text-magenta-500/50">CPU_LOAD</span>
            <span className="text-cyan-400">88.4%</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-magenta-500/50">NET_PHASE</span>
            <span className="text-cyan-400">ENCRYPTED</span>
          </div>
          <div className="flex items-center space-x-2 text-magenta-500 animate-pulse">
            <Activity className="w-4 h-4" />
            <span className="tracking-widest">LIVE_FEED</span>
          </div>
        </div>
      </header>

      {/* Deconstructed Grid Layout */}
      <main className="relative z-10 p-8 min-h-[calc(100vh-76px)]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-12">
          
          {/* Audio Interface (Left Sidebar) */}
          <aside className="space-y-8">
            <div className="flex items-center space-x-2 mb-4">
              <Terminal className="w-4 h-4 text-magenta-500" />
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-500/40">Audio_Core</span>
            </div>
            <MusicPlayer />
            
            {/* System Logs */}
            <div className="hidden lg:block p-4 border border-cyan-500/10 bg-cyan-900/5 rounded-sm font-mono text-[10px] space-y-1">
              <p className="text-cyan-500/40">{'>'} INJECTING_SYNTH_WAVE...</p>
              <p className="text-cyan-500/60">{'>'} TRACK_VLD: OK</p>
              <p className="text-magenta-500/40">{'>'} BUFFER_OVERFLOW_WNT</p>
              <p className="text-cyan-500/40">{'>'} NEON_SIG_STABLE</p>
            </div>
          </aside>

          {/* Game Core (Center) */}
          <section className="flex items-start justify-center">
            <div className="w-full max-w-[600px]">
               <div className="flex items-center space-x-2 mb-6">
                <div className="w-2 h-2 bg-magenta-500 animate-ping" />
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-500/40">Neural_Link_Active</span>
              </div>
              <SnakeGame />
            </div>
          </section>

        </div>
      </main>

      {/* Decorative Overlays */}
      <div className="fixed top-0 left-0 w-16 h-full border-r border-cyan-500/5 pointer-events-none" />
      <div className="fixed top-0 right-0 w-16 h-full border-l border-cyan-500/5 pointer-events-none" />
    </div>
  );
}
