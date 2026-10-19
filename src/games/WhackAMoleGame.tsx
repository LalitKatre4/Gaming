import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Trophy, Clock, Zap } from 'lucide-react';
import { sounds } from '../utils/audio';
import { getBestScore, saveBestScore } from '../utils/storage';
import { Confetti } from '../components/Confetti';

type MoleType = 'normal' | 'golden' | 'bomb';

interface HoleState {
  active: boolean;
  type: MoleType;
  hit: boolean;
  hitText?: string;
}

const TOTAL_HOLES = 9;
const ROUND_DURATION = 30; // seconds

export const WhackAMoleGame: React.FC = () => {
  const [holes, setHoles] = useState<HoleState[]>(() =>
    Array(TOTAL_HOLES).fill({ active: false, type: 'normal', hit: false })
  );
  const [score, setScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(ROUND_DURATION);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  // Authoritative refs to avoid stale React state closures in async loops
  const isPlayingRef = useRef<boolean>(false);
  const timeLeftRef = useRef<number>(ROUND_DURATION);
  const scoreRef = useRef<number>(0);
  const moleTimerRef = useRef<number | null>(null);
  const spawnTimerRef = useRef<number | null>(null);
  const countdownTimerRef = useRef<number | null>(null);
  const activeHoleIndexRef = useRef<number | null>(null);

  // Keep scoreRef synchronized
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  // Load best score on mount
  useEffect(() => {
    const saved = getBestScore('whack-a-mole');
    if (saved) {
      setBestScore(saved.score);
    }
  }, []);

  const clearAllTimers = useCallback(() => {
    if (moleTimerRef.current !== null) {
      clearTimeout(moleTimerRef.current);
      moleTimerRef.current = null;
    }
    if (spawnTimerRef.current !== null) {
      clearTimeout(spawnTimerRef.current);
      spawnTimerRef.current = null;
    }
    if (countdownTimerRef.current !== null) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
  }, []);

  // Clean up all timers on unmount
  useEffect(() => {
    return () => clearAllTimers();
  }, [clearAllTimers]);

  const endGame = useCallback(() => {
    isPlayingRef.current = false;
    clearAllTimers();
    setIsPlaying(false);
    setIsFinished(true);
    activeHoleIndexRef.current = null;

    // Retract all moles
    setHoles(Array(TOTAL_HOLES).fill({ active: false, type: 'normal', hit: false }));

    const finalScore = scoreRef.current;
    const currentBest = getBestScore('whack-a-mole')?.score || 0;

    if (finalScore > currentBest) {
      setBestScore(finalScore);
      saveBestScore('whack-a-mole', finalScore);
      sounds.playVictory();
      setShowConfetti(true);
    } else if (finalScore > 0) {
      sounds.playCollect();
    } else {
      sounds.playGameOver();
    }
  }, [clearAllTimers]);

  const spawnMole = useCallback(() => {
    if (!isPlayingRef.current || timeLeftRef.current <= 0) return;

    // Clear any previous mole/spawn timers
    if (moleTimerRef.current !== null) {
      clearTimeout(moleTimerRef.current);
      moleTimerRef.current = null;
    }
    if (spawnTimerRef.current !== null) {
      clearTimeout(spawnTimerRef.current);
      spawnTimerRef.current = null;
    }

    // Pick a random hole, preferring one different from previous if possible
    let chosenHole = Math.floor(Math.random() * TOTAL_HOLES);
    if (TOTAL_HOLES > 1 && chosenHole === activeHoleIndexRef.current) {
      chosenHole = (chosenHole + 1 + Math.floor(Math.random() * (TOTAL_HOLES - 1))) % TOTAL_HOLES;
    }
    activeHoleIndexRef.current = chosenHole;

    const rand = Math.random();
    const type: MoleType = rand < 0.2 ? 'golden' : rand < 0.4 ? 'bomb' : 'normal';

    setHoles((prev) =>
      prev.map((h, i) =>
        i === chosenHole
          ? { active: true, type, hit: false, hitText: undefined }
          : { active: false, type: 'normal', hit: false, hitText: undefined }
      )
    );

    // Calculate duration based on time remaining (speeds up as round progresses)
    const currentSeconds = timeLeftRef.current;
    const popDuration = Math.max(600, 750 + Math.floor((currentSeconds / ROUND_DURATION) * 450));

    // Schedule automatic retract if player misses
    moleTimerRef.current = window.setTimeout(() => {
      if (!isPlayingRef.current || timeLeftRef.current <= 0) return;

      // Hide target
      setHoles((prev) =>
        prev.map((h, i) =>
          i === chosenHole ? { ...h, active: false, hit: false, hitText: undefined } : h
        )
      );
      activeHoleIndexRef.current = null;

      // Short pause between targets, then spawn the next one
      const delay = Math.floor(Math.random() * 150) + 120;
      spawnTimerRef.current = window.setTimeout(() => {
        spawnMole();
      }, delay);
    }, popDuration);
  }, []);

  const handleWhack = useCallback(
    (index: number, e?: React.SyntheticEvent) => {
      if (e) {
        e.stopPropagation();
      }

      if (!isPlayingRef.current || timeLeftRef.current <= 0) return;

      const currentHole = activeHoleIndexRef.current;
      if (currentHole !== index) return;

      // Clear the timeout that would retract this mole due to expiration
      if (moleTimerRef.current !== null) {
        clearTimeout(moleTimerRef.current);
        moleTimerRef.current = null;
      }
      if (spawnTimerRef.current !== null) {
        clearTimeout(spawnTimerRef.current);
        spawnTimerRef.current = null;
      }

      setHoles((prev) => {
        const target = prev[index];
        if (!target || !target.active || target.hit) return prev;

        let pointsDelta = 10;
        let text = '+10';

        if (target.type === 'golden') {
          pointsDelta = 25;
          text = '+25';
          sounds.playCollect();
        } else if (target.type === 'bomb') {
          pointsDelta = -15;
          text = '-15';
          sounds.playGameOver();
        } else {
          sounds.playHit();
        }

        setScore((prevScore) => {
          const nextScore = Math.max(0, prevScore + pointsDelta);
          scoreRef.current = nextScore;
          return nextScore;
        });

        const next = [...prev];
        next[index] = {
          ...target,
          hit: true,
          hitText: text,
        };
        return next;
      });

      // Show hit reaction briefly, then retract and spawn next target promptly
      spawnTimerRef.current = window.setTimeout(() => {
        if (!isPlayingRef.current || timeLeftRef.current <= 0) return;

        setHoles((prev) =>
          prev.map((h, i) =>
            i === index ? { active: false, type: 'normal', hit: false, hitText: undefined } : h
          )
        );
        activeHoleIndexRef.current = null;

        // Immediately spawn next mole
        spawnMole();
      }, 180);
    },
    [spawnMole]
  );

  const startGame = useCallback(() => {
    clearAllTimers();

    isPlayingRef.current = true;
    timeLeftRef.current = ROUND_DURATION;
    scoreRef.current = 0;
    activeHoleIndexRef.current = null;

    setScore(0);
    setTimeLeft(ROUND_DURATION);
    setIsPlaying(true);
    setIsFinished(false);
    setShowConfetti(false);
    setHoles(Array(TOTAL_HOLES).fill({ active: false, type: 'normal', hit: false }));
    sounds.playMove();

    // Start 1-second countdown loop
    countdownTimerRef.current = window.setInterval(() => {
      timeLeftRef.current -= 1;
      const remaining = timeLeftRef.current;
      setTimeLeft(remaining);

      if (remaining <= 0) {
        endGame();
      }
    }, 1000);

    // Promptly spawn the first mole
    spawnMole();
  }, [clearAllTimers, endGame, spawnMole]);

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
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
              <Clock className="w-3 h-3 text-neutral-400" /> Time Left
            </span>
            <span
              className={`text-xl font-bold font-mono tabular-nums ${
                timeLeft <= 5 && isPlaying ? 'text-red-400 animate-pulse' : 'text-neutral-200'
              }`}
            >
              {timeLeft}s
            </span>
          </div>
          <div className="h-8 w-[1px] bg-white/10" />
          <div>
            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-400" /> Best
            </span>
            <span className="text-xl font-semibold font-mono text-neutral-200 tabular-nums">{bestScore}</span>
          </div>
        </div>
      </div>

      {/* 3x3 Conduit Arena */}
      <div className="relative w-full aspect-square max-w-[380px] p-4 bg-[#0E0F0D] rounded-2xl border-2 border-white/10 shadow-2xl grid grid-cols-3 gap-3.5 select-none touch-manipulation">
        {holes.map((hole, idx) => (
          <button
            type="button"
            key={idx}
            onClick={(e) => handleWhack(idx, e)}
            onTouchStart={(e) => {
              // Direct mobile touch response
              handleWhack(idx, e);
            }}
            aria-label={`Conduit hole ${idx + 1}${
              hole.active ? ` with active ${hole.type} mole` : ''
            }`}
            className="relative aspect-square rounded-2xl bg-[#151614] border-2 border-neutral-800 flex items-center justify-center overflow-hidden shadow-inner cursor-pointer active:scale-95 transition-transform outline-none focus-visible:border-[#B7FF35]"
          >
            {/* Conduit Pipe Rim */}
            <div className="absolute inset-x-2 bottom-1 h-3 rounded-full bg-[#20221E] border-t border-white/10 shadow-md pointer-events-none" />

            {/* Emerging Mole */}
            {hole.active && (
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl pointer-events-none transition-transform duration-100 ${
                  hole.hit ? 'scale-75 opacity-70' : 'scale-100 animate-in slide-in-from-bottom-6'
                } ${
                  hole.type === 'golden'
                    ? 'bg-amber-500/20 border-2 border-amber-400 shadow-[0_0_15px_#F59E0B]'
                    : hole.type === 'bomb'
                    ? 'bg-red-500/20 border-2 border-red-500 shadow-[0_0_15px_#EF4444]'
                    : 'bg-[#B7FF35]/20 border-2 border-[#B7FF35] shadow-[0_0_15px_#B7FF35]'
                }`}
              >
                {hole.type === 'golden' ? '👑' : hole.type === 'bomb' ? '💣' : '👾'}
              </div>
            )}

            {/* Floating Point Delta */}
            {hole.hitText && (
              <div
                className={`absolute top-2 font-mono font-bold text-sm pointer-events-none animate-in fade-in slide-in-from-bottom-2 ${
                  hole.hitText.startsWith('+') ? 'text-[#B7FF35]' : 'text-red-400'
                }`}
              >
                {hole.hitText}
              </div>
            )}
          </button>
        ))}

        {/* Start Overlay */}
        {!isPlaying && !isFinished && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center rounded-2xl z-10">
            <div className="w-14 h-14 rounded-2xl bg-[#B7FF35]/10 border border-[#B7FF35]/30 flex items-center justify-center mb-4 text-[#B7FF35]">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Cyber Whack-a-Mole</h3>
            <p className="text-neutral-400 text-xs max-w-xs mb-6">
              30-second reflex blitz! Whack green moles (+10), golden king moles (+25), and avoid glitch traps (-15).
            </p>
            <button
              type="button"
              onClick={startGame}
              className="px-6 py-3 bg-[#B7FF35] hover:bg-[#a6ec27] text-black font-semibold text-sm rounded-xl flex items-center gap-2 transition-transform active:scale-95 shadow-[0_0_20px_rgba(183,255,53,0.3)] cursor-pointer"
            >
              <Play className="w-4 h-4 fill-black" /> Start Blitz
            </button>
          </div>
        )}

        {/* Finished Overlay with working Try Again */}
        {isFinished && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center rounded-2xl z-10">
            <div className="text-[#B7FF35] font-mono text-xs uppercase tracking-widest mb-1">Time Expired</div>
            <h3 className="text-2xl font-bold text-white mb-3">Round Summary</h3>
            <div className="bg-[#171816] border border-white/10 rounded-xl p-4 w-56 mb-5">
              <div className="text-xs text-neutral-400">Total Points</div>
              <div className="text-3xl font-mono font-bold text-[#B7FF35] tabular-nums mt-1">{score}</div>
              {score >= bestScore && score > 0 && (
                <div className="text-[11px] text-amber-300 font-mono mt-1">★ New High Score! ★</div>
              )}
            </div>
            <button
              type="button"
              onClick={startGame}
              className="px-6 py-3 bg-[#B7FF35] hover:bg-[#a6ec27] text-black font-semibold text-sm rounded-xl flex items-center gap-2 transition-transform active:scale-95 cursor-pointer shadow-[0_0_20px_rgba(183,255,53,0.3)]"
            >
              <RotateCcw className="w-4 h-4" /> Try Again
            </button>
          </div>
        )}
      </div>

      {/* Instructions Key */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs font-mono text-neutral-400">
        <span className="flex items-center gap-1">👾 Normal: +10</span>
        <span className="flex items-center gap-1 text-amber-300">👑 Gold: +25</span>
        <span className="flex items-center gap-1 text-red-400">💣 Trap: -15</span>
      </div>
    </div>
  );
};
