import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Zap, Trophy, Activity, AlertCircle } from 'lucide-react';
import { sounds } from '../utils/audio';
import { getBestScore, saveBestScore } from '../utils/storage';
import { Confetti } from '../components/Confetti';

type GameState = 'IDLE' | 'WAITING' | 'READY' | 'EARLY' | 'RESULT' | 'SUMMARY';

export const ReactionTimeGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('IDLE');
  const [currentMs, setCurrentMs] = useState<number | null>(null);
  const [trials, setTrials] = useState<number[]>([]);
  const [bestMs, setBestMs] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<number | null>(null);

  // Load best ms (lowest is better)
  useEffect(() => {
    const saved = getBestScore('reaction-time');
    if (saved) {
      setBestMs(saved.score);
    }
  }, []);

  const clearTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearTimer();
  }, []);

  const startTrial = () => {
    clearTimer();
    setCurrentMs(null);
    setGameState('WAITING');
    sounds.playMove();

    // Random delay between 1.5s and 4.0s
    const delay = Math.floor(Math.random() * 2500) + 1500;
    timeoutRef.current = window.setTimeout(() => {
      startTimeRef.current = performance.now();
      setGameState('READY');
      sounds.playCollect();
    }, delay);
  };

  const handleInteraction = () => {
    if (gameState === 'IDLE' || gameState === 'RESULT') {
      startTrial();
    } else if (gameState === 'WAITING') {
      // False start! Clicked too early
      clearTimer();
      setGameState('EARLY');
      sounds.playGameOver();
    } else if (gameState === 'READY') {
      const elapsed = Math.round(performance.now() - startTimeRef.current);
      setCurrentMs(elapsed);
      const updatedTrials = [...trials, elapsed];
      setTrials(updatedTrials);

      // Check if new all-time best
      if (!bestMs || elapsed < bestMs) {
        setBestMs(elapsed);
        saveBestScore('reaction-time', elapsed, undefined, true);
        if (elapsed < 240) {
          setShowConfetti(true);
        }
      }

      if (updatedTrials.length >= 5) {
        setGameState('SUMMARY');
        sounds.playVictory();
      } else {
        setGameState('RESULT');
        sounds.playMove();
      }
    } else if (gameState === 'EARLY') {
      startTrial();
    } else if (gameState === 'SUMMARY') {
      resetSession();
    }
  };

  const resetSession = () => {
    clearTimer();
    setTrials([]);
    setCurrentMs(null);
    setGameState('IDLE');
    setShowConfetti(false);
  };

  // Keyboard spacebar listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleInteraction();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const averageMs =
    trials.length > 0 ? Math.round(trials.reduce((a, b) => a + b, 0) / trials.length) : null;

  const getTier = (ms: number) => {
    if (ms < 190) return { label: 'Esports Godlike', color: 'text-[#B7FF35]' };
    if (ms < 230) return { label: 'Top 5% Lightning', color: 'text-emerald-400' };
    if (ms < 280) return { label: 'Above Average', color: 'text-amber-300' };
    if (ms < 350) return { label: 'Standard Human Reflex', color: 'text-neutral-300' };
    return { label: 'Sluggish / Fatigued', color: 'text-rose-400' };
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto">
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Top HUD */}
      <div className="w-full flex items-center justify-between p-3 mb-4 rounded-xl bg-[#171816] border border-white/10">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">Trial Progress</span>
            <span className="text-xl font-bold font-mono text-white tabular-nums">
              {Math.min(trials.length + (gameState === 'WAITING' || gameState === 'READY' ? 1 : 0), 5)} / 5
            </span>
          </div>
          <div className="h-6 w-[1px] bg-white/10" />
          <div>
            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-400" /> Best Time
            </span>
            <span className="text-xl font-semibold font-mono text-[#B7FF35] tabular-nums">
              {bestMs !== null ? `${bestMs} ms` : '—'}
            </span>
          </div>
          {averageMs !== null && (
            <>
              <div className="h-6 w-[1px] bg-white/10" />
              <div>
                <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">Avg (5)</span>
                <span className="text-xl font-semibold font-mono text-neutral-200 tabular-nums">
                  {averageMs} ms
                </span>
              </div>
            </>
          )}
        </div>

        <button
          onClick={resetSession}
          className="p-2 rounded-lg bg-[#10110F] text-neutral-300 hover:text-white border border-white/10 transition-colors"
          title="Reset Test"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Reflex Arena */}
      <div
        onClick={handleInteraction}
        className={`w-full aspect-[4/3] max-w-[480px] rounded-2xl border-2 flex flex-col items-center justify-center p-6 text-center select-none cursor-pointer transition-colors duration-100 shadow-2xl relative overflow-hidden ${
          gameState === 'IDLE'
            ? 'bg-[#141513] border-white/10 hover:border-white/20'
            : gameState === 'WAITING'
            ? 'bg-[#450a0a] border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.25)]'
            : gameState === 'READY'
            ? 'bg-[#B7FF35] border-[#B7FF35] text-black shadow-[0_0_40px_rgba(183,255,53,0.5)]'
            : gameState === 'EARLY'
            ? 'bg-[#260e0e] border-red-800'
            : gameState === 'RESULT'
            ? 'bg-[#171816] border-[#B7FF35]/40'
            : 'bg-[#171816] border-amber-400/50'
        }`}
      >
        {gameState === 'IDLE' && (
          <>
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-300 mb-4">
              <Zap className="w-8 h-8 text-[#B7FF35]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Reaction Benchmark</h3>
            <p className="text-neutral-400 text-xs max-w-xs mb-4">
              When the screen turns <strong className="text-[#B7FF35]">NEON LIME</strong>, click or press Spacebar as quickly as possible.
            </p>
            <span className="text-xs font-mono font-semibold text-[#B7FF35] uppercase tracking-wider">
              Click anywhere to start
            </span>
          </>
        )}

        {gameState === 'WAITING' && (
          <>
            <div className="w-14 h-14 rounded-full border-4 border-red-400 border-t-transparent animate-spin mb-4" />
            <h3 className="text-2xl font-bold text-red-100 mb-1">Wait for Green...</h3>
            <p className="text-xs text-red-300 font-mono">Do not click yet</p>
          </>
        )}

        {gameState === 'READY' && (
          <div className="animate-in zoom-in-75 duration-75">
            <h2 className="text-4xl sm:text-5xl font-black text-black tracking-tight uppercase">
              CLICK NOW!
            </h2>
          </div>
        )}

        {gameState === 'EARLY' && (
          <>
            <AlertCircle className="w-12 h-12 text-red-400 mb-3" />
            <h3 className="text-2xl font-bold text-white mb-1">Too Fast!</h3>
            <p className="text-xs text-neutral-300 mb-4">
              You clicked before the screen turned green.
            </p>
            <span className="text-xs font-mono text-[#B7FF35]">Click anywhere to try again</span>
          </>
        )}

        {gameState === 'RESULT' && (
          <>
            <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider mb-1">
              Trial {trials.length} of 5
            </div>
            <div className="text-5xl sm:text-6xl font-black font-mono text-[#B7FF35] tabular-nums mb-2">
              {currentMs} <span className="text-2xl font-normal text-white">ms</span>
            </div>
            {currentMs && (
              <span className={`text-xs font-semibold ${getTier(currentMs).color} mb-4`}>
                {getTier(currentMs).label}
              </span>
            )}
            <span className="text-xs font-mono text-neutral-400">Click to proceed to next trial</span>
          </>
        )}

        {gameState === 'SUMMARY' && averageMs && (
          <>
            <Activity className="w-12 h-12 text-amber-400 mb-2" />
            <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider mb-1">
              5-Trial Aggregate Benchmark
            </div>
            <div className="text-5xl sm:text-6xl font-black font-mono text-[#B7FF35] tabular-nums mb-2">
              {averageMs} <span className="text-2xl font-normal text-white">ms</span>
            </div>
            <div className="text-sm font-bold text-white mb-4">
              Rank: <span className={getTier(averageMs).color}>{getTier(averageMs).label}</span>
            </div>
            <span className="text-xs font-mono text-neutral-400">Click to start a new 5-trial benchmark</span>
          </>
        )}
      </div>

      {/* Trial breakdown badges */}
      {trials.length > 0 && (
        <div className="w-full mt-4 flex items-center justify-center gap-2">
          {trials.map((ms, idx) => (
            <div
              key={idx}
              className="px-2.5 py-1 rounded bg-[#171816] border border-white/10 text-xs font-mono tabular-nums text-neutral-300"
            >
              #{idx + 1}: <span className="text-[#B7FF35] font-semibold">{ms}ms</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
