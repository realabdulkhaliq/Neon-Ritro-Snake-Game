import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Point, Direction } from '../types';
import { GRID_SIZE, INITIAL_SPEED, SPEED_INCREMENT } from '../constants';
import { Target, Zap, RotateCcw, Power } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const gameLoopRef = useRef<number | null>(null);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isColliding = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isColliding) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 5, y: 5 });
    setDirection('RIGHT');
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
    setSpeed(INITIAL_SPEED);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      const isWallCollision = 
        newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE;
      
      const isSelfCollision = prevSnake.some(
        (segment) => segment.x === newHead.x && segment.y === newHead.y
      );

      if (isWallCollision || isSelfCollision) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(generateFood(newSnake));
        setSpeed((prev) => Math.max(prev - SPEED_INCREMENT, 40));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused((p) => !p); break;
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    if (!gameOver && !isPaused) {
      gameLoopRef.current = window.setInterval(moveSnake, speed);
    } else if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
    return () => { if (gameLoopRef.current) clearInterval(gameLoopRef.current); };
  }, [moveSnake, gameOver, isPaused, speed]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  return (
    <div className="flex flex-col items-center space-y-8 w-full crt-flicker">
      
      {/* HUD Details */}
      <div className="w-full flex justify-between items-end border-b border-cyan-500/20 pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-magenta-500" />
            <span className="font-mono text-xs text-cyan-500/60 uppercase tracking-widest">Target_Sync</span>
          </div>
          <p className="font-sans text-4xl font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
            {score.toString().padStart(5, '0')}
          </p>
        </div>
        <div className="text-right">
          <span className="font-mono text-[10px] text-magenta-500/60 uppercase tracking-widest block mb-1">Peak_Throughput</span>
          <p className="font-sans text-2xl font-bold text-magenta-500 text-glitch">
            {highScore.toString().padStart(5, '0')}
          </p>
        </div>
      </div>

      {/* Main Processor Grid */}
      <div 
        className="relative bg-black border-4 border-cyan-900/50 rounded-sm p-1 shadow-[0_0_40px_rgba(34,211,238,0.1)] overflow-hidden"
        style={{ width: 'min(90vw, 480px)', height: 'min(90vw, 480px)' }}
        id="neural-grid"
      >
        {/* Subtle Scanline Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] z-10" />

        <div className="grid grid-cols-20 grid-rows-20 w-full h-full gap-[2px]">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const snakeIndex = snake.findIndex((s) => s.x === x && s.y === y);
            const isSnake = snakeIndex !== -1;
            const isHead = snakeIndex === 0;
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={i}
                className={`w-full h-full transition-all duration-75 ${
                  isSnake 
                    ? isHead 
                      ? 'bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,1)] z-10 scale-105' 
                      : 'bg-cyan-900/80'
                    : isFood
                    ? 'bg-magenta-500 shadow-[0_0_20px_rgba(255,0,255,1)] animate-pulse'
                    : 'bg-white/[0.02]'
                }`}
                style={{ 
                   opacity: isSnake && !isHead ? Math.max(0.3, 1 - (snakeIndex / 15)) : 1,
                   clipPath: isSnake && Math.random() > 0.98 ? 'inset(0 0 50% 0)' : 'none'
                }}
              />
            );
          })}
        </div>

        {/* Overlay Interfaces */}
        <AnimatePresence>
          {(isPaused && !gameOver) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20 backdrop-blur-md border-4 border-dashed border-cyan-500/20 m-2"
            >
              <div className="text-center p-8 border-2 border-cyan-400/50 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black px-2 text-[10px] text-cyan-400 uppercase font-mono tracking-widest">Interrupted</div>
                <h2 className="text-5xl font-bold text-cyan-400 mb-8 font-sans tracking-[0.2em] text-glitch">WAITING_...</h2>
                <button
                  id="link-btn"
                  onClick={() => setIsPaused(false)}
                  className="group relative px-8 py-3 bg-cyan-400 text-black font-bold uppercase tracking-widest hover:bg-magenta-500 hover:text-white transition-all overflow-hidden"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <Power className="w-4 h-4" />
                    <span>Establish Link</span>
                  </span>
                  <motion.div 
                    className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform skew-x-12" 
                  />
                </button>
                <p className="mt-6 text-[10px] font-mono text-cyan-500/40 tracking-[0.4em]">[ SPACE_KEY ]</p>
              </div>
            </motion.div>
          )}

          {gameOver && (
            <motion.div 
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-magenta-900/90 z-30 backdrop-blur-xl m-2 border-4 border-magenta-500"
            >
              <h2 className="text-6xl font-bold text-white mb-2 font-sans tracking-tighter text-glitch italic underline decoration-cyan-400">CRITICAL_FAIL</h2>
              <p className="text-white font-mono text-sm mb-12 tracking-widest bg-black px-4 py-1">ERROR_CODE: 0x882A</p>
              
              <button
                id="reboot-btn"
                onClick={resetGame}
                className="group flex flex-col items-center space-y-4 hover:scale-110 transition-transform"
              >
                <div className="p-6 rounded-full border-4 border-white bg-white/10 group-hover:bg-magenta-400 transition-colors">
                  <RotateCcw className="w-10 h-10 text-white" />
                </div>
                <span className="text-sm font-mono tracking-[0.5em] text-white font-bold">REBOOT SYSTEM</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controller Mapping */}
      <div className="grid grid-cols-2 gap-4 w-full">
        <div className="p-4 bg-cyan-900/5 border border-cyan-500/10 flex flex-col items-center">
            <Zap className="w-4 h-4 mb-2 text-magenta-500" />
            <span className="text-[10px] font-mono text-cyan-500/40 uppercase tracking-[0.2em]">Navigational_Pads</span>
            <span className="text-xs font-bold text-cyan-400 mt-1 uppercase">Direction_X/Y</span>
        </div>
        <div className="p-4 bg-cyan-900/5 border border-cyan-500/10 flex flex-col items-center">
            <Target className="w-4 h-4 mb-2 text-magenta-500" />
            <span className="text-[10px] font-mono text-cyan-500/40 uppercase tracking-[0.2em]">Data_Extraction</span>
            <span className="text-xs font-bold text-cyan-400 mt-1 uppercase">Slither_Protocol</span>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;
