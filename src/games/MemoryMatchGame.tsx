import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, Trophy, Clock, Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';
import { getBestScore, saveBestScore } from '../utils/storage';
import { Confetti } from '../components/Confetti';

interface CardItem {
  id: number;
  symbol: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const SYMBOLS_POOL = [
  { symbol: '⚔️', name: 'Blades' },
  { symbol: '🛡️', name: 'Shield' },
  { symbol: '💎', name: 'Gem' },
  { symbol: '🧪', name: 'Elixir' },
  { symbol: '👑', name: 'Crown' },
  { symbol: '⚡', name: 'Bolt' },
  { symbol: '🔥', name: 'Flame' },
  { symbol: '🐉', name: 'Dragon' },
  { symbol: '🗝️', name: 'Key' },
  { symbol: '🔮', name: 'Orb' },
  { symbol: '🏹', name: 'Bow' },
  { symbol: '🪙', name: 'Rune' },
];

export const MemoryMatchGame: React.FC = () => {
  const [gridMode, setGridMode] = useState<'4x4' | '6x4'>('4x4');
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [bestMoves, setBestMoves] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  const lockRef = useRef<boolean>(false);

  // Load best moves record
  useEffect(() => {
    const saved = getBestScore('memory-match');
    if (saved) {
      setBestMoves(saved.score);
    }
  }, []);

  const setupDeck = useCallback((mode: '4x4' | '6x4') => {
    const pairCount = mode === '4x4' ? 8 : 12;
    const selectedSymbols = SYMBOLS_POOL.slice(0, pairCount);
    const combined = [...selectedSymbols, ...selectedSymbols];

    // Fisher-Yates shuffle
    for (let i = combined.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combined[i], combined[j]] = [combined[j], combined[i]];
    }

    const initialCards: CardItem[] = combined.map((item, idx) => ({
      id: idx,
      symbol: item.symbol,
      name: item.name,
      isFlipped: false,
      isMatched: false,
    }));

    setCards(initialCards);
    setFlippedIndices([]);
    setMoves(0);
    setTimerSeconds(0);
    setIsActive(false);
    setIsCompleted(false);
    setShowConfetti(false);
    lockRef.current = false;
  }, []);

  useEffect(() => {
    setupDeck(gridMode);
  }, [gridMode, setupDeck]);

  // Timer tick
  useEffect(() => {
    let interval: number | null = null;
    if (isActive && !isCompleted) {
      interval = window.setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isCompleted]);

  const handleCardClick = (index: number) => {
    if (lockRef.current) return;
    const card = cards[index];
    if (card.isFlipped || card.isMatched) return;

    if (!isActive) {
      setIsActive(true);
    }

    sounds.playMove();

    const newFlipped = [...flippedIndices, index];
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      lockRef.current = true;
      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = newCards[firstIdx];
      const secondCard = newCards[secondIdx];

      if (firstCard.symbol === secondCard.symbol) {
        // Matched
        setTimeout(() => {
          sounds.playMatch();
          newCards[firstIdx].isMatched = true;
          newCards[secondIdx].isMatched = true;
          setCards([...newCards]);
          setFlippedIndices([]);
          lockRef.current = false;

          // Check all matched
          if (newCards.every((c) => c.isMatched)) {
            setIsCompleted(true);
            sounds.playVictory();
            setShowConfetti(true);

            // Record best score (lowest moves is best)
            const finalMoves = moves + 1;
            saveBestScore('memory-match', finalMoves, `${timerSeconds}s`, true);
            if (!bestMoves || finalMoves < bestMoves) {
              setBestMoves(finalMoves);
            }
          }
        }, 350);
      } else {
        // Not matched, flip back
        setTimeout(() => {
          newCards[firstIdx].isFlipped = false;
          newCards[secondIdx].isFlipped = false;
          setCards([...newCards]);
          setFlippedIndices([]);
          lockRef.current = false;
        }, 850);
      }
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto">
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Top HUD */}
      <div className="w-full flex items-center justify-between p-3 mb-4 rounded-xl bg-[#171816] border border-white/10">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">Moves</span>
            <span className="text-xl font-bold font-mono text-[#B7FF35] tabular-nums">{moves}</span>
          </div>
          <div className="h-6 w-[1px] bg-white/10" />
          <div>
            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block flex items-center gap-1">
              <Clock className="w-3 h-3 text-neutral-400" /> Time
            </span>
            <span className="text-xl font-semibold font-mono text-neutral-200 tabular-nums">
              {formatTime(timerSeconds)}
            </span>
          </div>
          <div className="h-6 w-[1px] bg-white/10" />
          <div>
            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-400" /> Best
            </span>
            <span className="text-xl font-semibold font-mono text-neutral-200 tabular-nums">
              {bestMoves !== null ? `${bestMoves} moves` : '—'}
            </span>
          </div>
        </div>

        {/* Grid size toggle */}
        <div className="flex items-center gap-1 bg-[#10110F] p-1 rounded-lg border border-white/5">
          {(['4x4', '6x4'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setGridMode(mode)}
              className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                gridMode === mode
                  ? 'bg-[#B7FF35] text-black font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div
        className={`w-full grid gap-2.5 p-3.5 bg-[#0E0F0D] rounded-2xl border-2 border-white/10 shadow-2xl ${
          gridMode === '4x4' ? 'grid-cols-4 max-w-[400px]' : 'grid-cols-6 max-w-[500px]'
        }`}
      >
        {cards.map((card, idx) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(idx)}
            disabled={card.isFlipped || card.isMatched || lockRef.current}
            aria-label={card.isFlipped || card.isMatched ? card.name : `Hidden card ${idx + 1}`}
            className={`aspect-square rounded-xl flex items-center justify-center text-3xl font-bold transition-all duration-300 relative select-none transform perspective-500 cursor-pointer ${
              card.isMatched
                ? 'bg-[#1a2e16] border-2 border-[#B7FF35]/70 shadow-[0_0_12px_rgba(183,255,53,0.3)] opacity-90'
                : card.isFlipped
                ? 'bg-[#22251F] border-2 border-white/30 rotate-y-180 shadow-md'
                : 'bg-[#171816] hover:bg-[#20221E] active:scale-95 border border-white/10 hover:border-white/20'
            }`}
          >
            {card.isFlipped || card.isMatched ? (
              <span className="animate-in zoom-in-75 duration-150">{card.symbol}</span>
            ) : (
              <span className="text-neutral-600 text-lg font-mono">✦</span>
            )}
          </button>
        ))}
      </div>

      {/* Victory modal */}
      {isCompleted && (
        <div className="mt-4 p-4 rounded-xl bg-[#171816] border border-[#B7FF35]/40 text-center w-full max-w-sm animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
            <Sparkles className="w-5 h-5 fill-amber-400" />
            <Sparkles className="w-5 h-5 fill-amber-400" />
            <Sparkles className="w-5 h-5 fill-amber-400" />
          </div>
          <h4 className="text-lg font-bold text-white">Relics Synchronized!</h4>
          <p className="text-xs text-neutral-400 mt-1">
            Cleared in <span className="text-[#B7FF35] font-mono font-bold">{moves}</span> moves and{' '}
            <span className="text-white font-mono">{formatTime(timerSeconds)}</span>.
          </p>
        </div>
      )}

      {/* Restart */}
      <div className="mt-4">
        <button
          onClick={() => setupDeck(gridMode)}
          className="px-5 py-2.5 bg-[#171816] hover:bg-[#20221E] active:scale-95 text-neutral-200 text-xs font-semibold rounded-xl border border-white/10 flex items-center gap-2 transition-all shadow-sm"
        >
          <RotateCcw className="w-4 h-4" /> Deal New Cards
        </button>
      </div>
    </div>
  );
};
