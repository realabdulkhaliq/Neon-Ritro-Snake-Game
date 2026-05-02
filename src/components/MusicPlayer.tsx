import React, { useState, useRef, useEffect } from 'react';
import { TRACKS } from '../constants';
import { Play, Pause, FastForward, Rewind, Activity, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(error => {
        if (error.name !== 'AbortError') {
          console.error("Playback failed:", error);
        }
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  return (
    <div className="w-full space-y-6 crt-flicker">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
      />
      
      <div className="relative group/module">
        {/* Module ID Tag */}
        <div className="absolute -top-3 left-4 bg-[#030303] border-x border-cyan-500/30 px-3 z-20">
          <span className="text-[9px] font-mono text-magenta-500 uppercase tracking-[0.4em] font-bold">MOD_AUD_CORE_V1</span>
        </div>

        <motion.div 
          className="bg-black/80 border-2 border-cyan-500/20 p-6 rounded-sm shadow-[0_0_30px_rgba(34,211,238,0.05)] space-y-6 relative overflow-hidden"
          id="audio-module"
        >
          {/* Deconstructed Cover */}
          <div className="relative w-full aspect-video group/cover overflow-hidden bg-cyan-900/10">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
            <img 
              src={currentTrack.coverUrl} 
              alt={currentTrack.title}
              className="w-full h-full object-cover grayscale opacity-50 contrast-125 saturate-200 group-hover/cover:scale-110 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            
            {/* Visualizer Overlay */}
            <div className="absolute bottom-4 left-4 right-4 z-20 flex items-end space-x-1 h-12">
              {Array.from({ length: 24 }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ height: isPlaying ? [10, Math.random() * 48 + 4, 10] : 4 }}
                  transition={{ repeat: Infinity, duration: 0.3, delay: i * 0.05 }}
                  className="flex-1 bg-cyan-400 opacity-60 rounded-t-[1px]"
                />
              ))}
            </div>
            
            {/* Status Icons */}
            <div className="absolute top-4 right-4 z-20">
               <Activity className={`w-4 h-4 text-magenta-500 ${isPlaying ? 'animate-pulse' : 'opacity-20'}`} />
            </div>
          </div>

          {/* Machine Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-white tracking-widest uppercase mb-1">{currentTrack.title}</h3>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-magenta-500 rounded-full" />
                <p className="text-cyan-500 font-mono text-xs tracking-[0.3em] font-bold uppercase">{currentTrack.artist}</p>
              </div>
            </div>
            
            {/* Crude Progress UI */}
            <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono text-cyan-500/40 uppercase tracking-widest">
                    <span>Inbound_Stream</span>
                    <span>{Math.round(progress)}% Buffer</span>
                </div>
                <div className="relative h-4 w-full bg-cyan-900/10 border border-cyan-500/20 overflow-hidden">
                    <motion.div 
                        className="absolute top-0 left-0 h-full bg-magenta-500"
                        style={{ width: `${progress}%` }}
                    />
                    <div className="absolute inset-0 grid grid-cols-10 h-full border-x border-cyan-500/10 pointer-events-none" />
                </div>
            </div>
          </div>

          {/* Module Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-cyan-500/10">
            <div className="flex items-center space-x-4">
                <button 
                    onClick={prevTrack}
                    className="p-2 text-cyan-500/40 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all cursor-pointer border border-transparent hover:border-cyan-500/20"
                >
                    <Rewind className="w-5 h-5" />
                </button>
                <button 
                    onClick={togglePlay}
                    className="w-14 h-14 bg-cyan-400 text-black flex items-center justify-center hover:bg-magenta-500 hover:text-white transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] active:scale-95"
                >
                    {isPlaying ? <Pause className="fill-current w-6 h-6" /> : <Play className="fill-current w-6 h-6 translate-x-1" />}
                </button>
                <button 
                    onClick={nextTrack}
                    className="p-2 text-cyan-500/40 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all cursor-pointer border border-transparent hover:border-cyan-500/20"
                >
                    <FastForward className="w-5 h-5" />
                </button>
            </div>

            <div className="flex flex-col items-end font-mono text-[9px] text-cyan-500/30 tracking-widest">
                <span>CHANNEL_01</span>
                <span className="text-magenta-500/50">EXT_SIGNAL</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Playlist List (Cryptic Version) */}
      <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2 scrollbar-hide">
        {TRACKS.map((track, idx) => (
            <div 
                key={track.id}
                role="button"
                onClick={() => {
                    setCurrentTrackIndex(idx);
                    setIsPlaying(true);
                }}
                className={`p-3 border flex items-center justify-between group transition-all cursor-pointer ${
                    currentTrackIndex === idx 
                    ? 'border-magenta-500/50 bg-magenta-500/5' 
                    : 'border-cyan-500/5 bg-transparent hover:border-cyan-500/20'
                }`}
            >
                <div className="flex items-center space-x-3">
                    <span className="font-mono text-[10px] text-cyan-500/30">0{idx + 1}</span>
                    <span className={`text-xs uppercase tracking-widest font-bold ${currentTrackIndex === idx ? 'text-magenta-500' : 'text-cyan-500/60'}`}>
                        {track.title}
                    </span>
                </div>
                {currentTrackIndex === idx && isPlaying && <Music className="w-3 h-3 text-magenta-400 animate-bounce" />}
            </div>
        ))}
      </div>
    </div>
  );
};

export default MusicPlayer;
