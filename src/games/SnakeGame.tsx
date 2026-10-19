import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Pause, Trophy, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Zap } from 'lucide-react';
import { sounds } from '../utils/audio';
import { getBestScore, saveBestScore } from '../utils/storage';
import { Confetti } from '../components/Confetti';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 20; // 20x20 grid

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>([
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 },
  ]);
  const [direction, setDirection] = useState<Direction>('UP');
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [bonusFood, setBonusFood] = useState<Point | null>(null);
  const [score, setScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMode, setSpeedMode] = useState<'normal' | 'fast' | 'turbo'>('normal');
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  const directionRef = useRef<Direction>('UP');
  const snakeRef = useRef<Point[]>(snake);
  const foodRef = useRef<Point>(food);
  const bonusFoodRef = useRef<Point | null>(bonusFood);
  const gameLoopRef = useRef<number | null>(null);

  // Sync refs
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    snakeRef.current = snake;
  }, [snake]);

  useEffect(() => {
    foodRef.current = food;
  }, [food]);

  useEffect(() => {
    bonusFoodRef.current = bonusFood;
  }, [bonusFood]);

  // Load best score on mount
  useEffect(() => {
    const saved = getBestScore('snake');
    if (saved) {
      setBestScore(saved.score);
    }
  }, []);

  const getRandomCoord = useCallback((): Point => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  }, []);

  const spawnFood = useCallback((currentSnake: Point[]): Point => {
    let newPos = getRandomCoord();
    while (currentSnake.some((segment) => segment.x === newPos.x && segment.y === newPos.y)) {
      newPos = getRandomCoord();
    }
    return newPos;
  }, [getRandomCoord]);

  const startGame = () => {
    const initialSnake: Point[] = [
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 },
    ];
    setSnake(initialSnake);
    setDirection('UP');
    directionRef.current = 'UP';
    const initialFood = spawnFood(initialSnake);
    setFood(initialFood);
    setBonusFood(null);
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setIsPlaying(true);
    setShowConfetti(false);
    sounds.playMove();
  };

  const changeDirection = useCallback((newDir: Direction) => {
    const current = directionRef.current;
    if (
      (newDir === 'UP' && current === 'DOWN') ||
      (newDir === 'DOWN' && current === 'UP') ||
      (newDir === 'LEFT' && current === 'RIGHT') ||
      (newDir === 'RIGHT' && current === 'LEFT')
    ) {
      return; // prevent reversing into oneself
    }
    setDirection(newDir);
    sounds.playMove();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault(); // prevent window scrolling while playing
      }

      if (!isPlaying) {
        if (e.key === ' ' || e.key === 'Enter') {
          startGame();
        }
        return;
      }

      if (e.key === ' ') {
        setIsPaused((p) => !p);
        return;
      }

      if (e.key === 'r' || e.key === 'R') {
        startGame();
        return;
      }

      if (isPaused || isGameOver) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          changeDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          changeDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          changeDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          changeDirection('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isPaused, isGameOver, changeDirection]);

  // Main game tick
  useEffect(() => {
    if (!isPlaying || isPaused || isGameOver) return;

    const baseSpeed = speedMode === 'turbo' ? 80 : speedMode === 'fast' ? 100 : 130;
    // Speed increases slightly as snake grows
    const speed = Math.max(65, baseSpeed - Math.floor(score / 50) * 4);

    const intervalId = window.setInterval(() => {
      const currentSnake = [...snakeRef.current];
      const head = { ...currentSnake[0] };
      const currentDir = directionRef.current;

      switch (currentDir) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
      }

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setIsGameOver(true);
        sounds.playGameOver();
        return;
      }

      // Check self collision
      if (currentSnake.some((seg) => seg.x === head.x && seg.y === head.y)) {
        setIsGameOver(true);
        sounds.playGameOver();
        return;
      }

      currentSnake.unshift(head);

      // Check food collision
      const currFood = foodRef.current;
      const currBonus = bonusFoodRef.current;

      if (head.x === currFood.x && head.y === currFood.y) {
        sounds.playCollect();
        const nextScore = score + 10;
        setScore(nextScore);
        const nextFood = spawnFood(currentSnake);
        setFood(nextFood);

        // 20% chance to spawn bonus food if none active
        if (!currBonus && Math.random() < 0.25) {
          setBonusFood(spawnFood(currentSnake));
        }

        if (nextScore > bestScore) {
          setBestScore(nextScore);
          saveBestScore('snake', nextScore);
        }
      } else if (currBonus && head.x === currBonus.x && head.y === currBonus.y) {
        sounds.playMatch();
        const nextScore = score + 25;
        setScore(nextScore);
        setBonusFood(null);

        if (nextScore > bestScore) {
          setBestScore(nextScore);
          saveBestScore('snake', nextScore);
          setShowConfetti(true);
        }
      } else {
        currentSnake.pop(); // snake moves forward without growing
      }

      setSnake(currentSnake);
    }, speed);

    gameLoopRef.current = intervalId;

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPlaying, isPaused, isGameOver, score, bestScore, speedMode, spawnFood]);

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto">
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Top HUD */}
      <div className="w-full flex items-center justify-between p-3 mb-4 rounded-xl bg-[#171816] border border-white/10">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">Score</span>
            <span className="text-2xl font-bold font-mono text-[#B7FF35] tabular-nums">{score}</span>
          </div>
          <div className="h-8 w-[1px] bg-white/10" />
          <div>
            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-400" /> Best
            </span>
            <span className="text-xl font-semibold font-mono text-neutral-200 tabular-nums">{bestScore}</span>
          </div>
        </div>

        {/* Speed toggle */}
        <div className="flex items-center gap-1 bg-[#10110F] p-1 rounded-lg border border-white/5">
          {(['normal', 'fast', 'turbo'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setSpeedMode(mode)}
              className={`px-2.5 py-1 text-xs font-mono capitalize rounded transition-colors ${
                speedMode === mode
                  ? 'bg-[#B7FF35] text-black font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Arena Canvas Container */}
      <div className="relative w-full aspect-square max-w-[440px] bg-[#0E0F0D] rounded-2xl border-2 border-white/10 overflow-hidden shadow-2xl flex items-center justify-center">
        {/* Grid cells rendering */}
        <div 
          className="w-full h-full grid"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
            const x = index % GRID_SIZE;
            const y = Math.floor(index / GRID_SIZE);

            const isHead = snake[0] && snake[0].x === x && snake[0].y === y;
            const isBody = snake.slice(1).some((s) => s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;
            const isBonus = bonusFood && bonusFood.x === x && bonusFood.y === y;

            return (
              <div
                key={index}
                className="relative flex items-center justify-center"
              >
                {isHead && (
                  <div className="w-[86%] h-[86%] rounded-sm bg-[#B7FF35] shadow-[0_0_12px_#B7FF35] flex items-center justify-center transition-transform duration-75">
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                  </div>
                )}
                {isBody && (
                  <div className="w-[80%] h-[80%] rounded-xs bg-[#B7FF35]/80 shadow-[0_0_6px_rgba(183,255,53,0.4)]" />
                )}
                {isFood && (
                  <div className="w-[70%] h-[70%] rounded-full bg-[#A855F7] animate-pulse shadow-[0_0_10px_#A855F7]" />
                )}
                {isBonus && (
                  <div className="w-[85%] h-[85%] rounded-full bg-amber-400 animate-bounce shadow-[0_0_14px_#F59E0B]" />
                )}
              </div>
            );
          })}
        </div>

        {/* Start / Paused / Game Over Overlays */}
        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#B7FF35]/10 border border-[#B7FF35]/30 flex items-center justify-center mb-4 text-[#B7FF35]">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Neon Snake</h3>
            <p className="text-neutral-400 text-xs max-w-xs mb-6">
              Use arrow keys or touch D-Pad to steer. Eat green and bonus amber pellets to grow.
            </p>
            <button
              onClick={startGame}
              className="px-6 py-3 bg-[#B7FF35] hover:bg-[#a6ec27] text-black font-semibold text-sm rounded-xl flex items-center gap-2 transition-transform active:scale-95 shadow-[0_0_20px_rgba(183,255,53,0.3)]"
            >
              <Play className="w-4 h-4 fill-black" /> Start Playing
            </button>
          </div>
        )}

        {isPaused && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center p-6">
            <h3 className="text-xl font-bold text-white mb-2">Game Paused</h3>
            <p className="text-xs text-neutral-400 mb-4">Press Space to resume</p>
            <button
              onClick={() => setIsPaused(false)}
              className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-lg border border-white/10"
            >
              Resume
            </button>
          </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
            <div className="text-red-400 font-mono text-xs uppercase tracking-widest mb-1">Collision Detected</div>
            <h3 className="text-2xl font-bold text-white mb-3">Game Over</h3>
            <div className="bg-[#171816] border border-white/10 rounded-xl p-4 w-56 mb-5">
              <div className="text-xs text-neutral-400">Final Score</div>
              <div className="text-3xl font-mono font-bold text-[#B7FF35] tabular-nums mt-1">{score}</div>
              {score >= bestScore && score > 0 && (
                <div className="text-[11px] text-amber-300 font-mono mt-1">★ New Best Score! ★</div>
              )}
            </div>
            <button
              onClick={startGame}
              className="px-6 py-3 bg-[#B7FF35] hover:bg-[#a6ec27] text-black font-semibold text-sm rounded-xl flex items-center gap-2 transition-transform active:scale-95"
            >
              <RotateCcw className="w-4 h-4" /> Play Again
            </button>
          </div>
        )}
      </div>

      {/* Action Controls & Mobile D-Pad */}
      <div className="w-full mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isPlaying && (
            <button
              onClick={() => setIsPaused((p) => !p)}
              className="px-3 py-2 bg-[#171816] hover:bg-[#20221E] text-neutral-300 text-xs font-medium rounded-lg border border-white/10 flex items-center gap-1.5 transition-colors"
            >
              <Pause className="w-3.5 h-3.5" /> {isPaused ? 'Resume' : 'Pause'}
            </button>
          )}
          <button
            onClick={startGame}
            className="px-3 py-2 bg-[#171816] hover:bg-[#20221E] text-neutral-300 text-xs font-medium rounded-lg border border-white/10 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Restart (R)
          </button>
        </div>

        <div className="text-[11px] font-mono text-neutral-500 hidden sm:block">
          Controls: Arrow keys / WASD
        </div>
      </div>

      {/* Responsive On-Screen D-Pad for Mobile Touch */}
      <div className="mt-4 flex flex-col items-center sm:hidden">
        <button
          onClick={() => changeDirection('UP')}
          aria-label="Move Up"
          className="w-12 h-12 rounded-xl bg-[#171816] active:bg-[#B7FF35] active:text-black border border-white/10 flex items-center justify-center text-neutral-300 mb-1"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        <div className="flex gap-4">
          <button
            onClick={() => changeDirection('LEFT')}
            aria-label="Move Left"
            className="w-12 h-12 rounded-xl bg-[#171816] active:bg-[#B7FF35] active:text-black border border-white/10 flex items-center justify-center text-neutral-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => changeDirection('DOWN')}
            aria-label="Move Down"
            className="w-12 h-12 rounded-xl bg-[#171816] active:bg-[#B7FF35] active:text-black border border-white/10 flex items-center justify-center text-neutral-300"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
          <button
            onClick={() => changeDirection('RIGHT')}
            aria-label="Move Right"
            className="w-12 h-12 rounded-xl bg-[#171816] active:bg-[#B7FF35] active:text-black border border-white/10 flex items-center justify-center text-neutral-300"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
