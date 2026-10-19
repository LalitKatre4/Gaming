import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, Trophy, Clock, CheckCircle2 } from 'lucide-react';
import { sounds } from '../utils/audio';
import { getBestScore, saveBestScore } from '../utils/storage';
import { Confetti } from '../components/Confetti';

const PASSAGES = [
  "In the quiet neon corridors of the underground cyberspace, silent runners execute microsecond maneuvers to outpace digital surveillance grids.",
  "Arcade machines lit up the smoke filled rooms of the eighties, teaching players the virtues of precise reflexes, quarter management, and sheer tenacity.",
  "Every millisecond of input latency matters when deflecting incoming projectiles. True champions master muscle memory until the controller becomes an extension of the mind.",
  "Across sprawling open worlds and modular dungeon crawlers, every hero began with an empty inventory, basic tunic, and unyielding curiosity.",
  "Quick keystrokes echo through the mechanical switches as the hacker bypassed the security perimeter with seconds left on the countdown clock."
];

export const TypingSpeedGame: React.FC = () => {
  const [passageIndex, setPassageIndex] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [bestWpm, setBestWpm] = useState<number>(0);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const targetText = PASSAGES[passageIndex];

  // Load best WPM
  useEffect(() => {
    const saved = getBestScore('typing-speed');
    if (saved) {
      setBestWpm(saved.score);
    }
  }, []);

  // Timer loop
  useEffect(() => {
    let interval: number | null = null;
    if (startTime && !isCompleted) {
      interval = window.setInterval(() => {
        setElapsedSeconds((Date.now() - startTime) / 1000);
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [startTime, isCompleted]);

  const resetTest = useCallback((nextIndex?: number) => {
    setUserInput('');
    setStartTime(null);
    setElapsedSeconds(0);
    setIsCompleted(false);
    setShowConfetti(false);
    if (typeof nextIndex === 'number') {
      setPassageIndex(nextIndex % PASSAGES.length);
    }
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }, []);

  // Calculate live stats
  const totalTyped = userInput.length;
  let correctCount = 0;
  for (let i = 0; i < totalTyped; i++) {
    if (userInput[i] === targetText[i]) {
      correctCount++;
    }
  }

  const accuracy = totalTyped > 0 ? Math.round((correctCount / totalTyped) * 100) : 100;
  const minutes = Math.max(elapsedSeconds / 60, 0.016); // avoid zero division
  const wordsTyped = correctCount / 5;
  const currentWpm = Math.max(0, Math.round(wordsTyped / minutes));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isCompleted) return;

    const val = e.target.value;
    if (!startTime && val.length > 0) {
      setStartTime(Date.now());
    }

    if (val.length > userInput.length) {
      const lastChar = val[val.length - 1];
      const targetChar = targetText[val.length - 1];
      if (lastChar === targetChar) {
        sounds.playKeyPress();
      } else {
        sounds.playHit();
      }
    }

    setUserInput(val);

    // Check completion
    if (val.length >= targetText.length) {
      setIsCompleted(true);
      sounds.playVictory();

      // Check best Wpm
      if (currentWpm > bestWpm) {
        setBestWpm(currentWpm);
        saveBestScore('typing-speed', currentWpm, `${accuracy}% Acc`);
        setShowConfetti(true);
      }
    }
  };

  const nextPassage = () => {
    resetTest(passageIndex + 1);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Top HUD */}
      <div className="w-full flex items-center justify-between p-3 mb-4 rounded-xl bg-[#171816] border border-white/10">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">WPM</span>
            <span className="text-2xl font-bold font-mono text-[#B7FF35] tabular-nums">
              {currentWpm}
            </span>
          </div>
          <div className="h-8 w-[1px] bg-white/10" />
          <div>
            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">Accuracy</span>
            <span className="text-xl font-bold font-mono text-neutral-200 tabular-nums">
              {accuracy}%
            </span>
          </div>
          <div className="h-8 w-[1px] bg-white/10" />
          <div>
            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block flex items-center gap-1">
              <Clock className="w-3 h-3 text-neutral-400" /> Time
            </span>
            <span className="text-xl font-semibold font-mono text-neutral-200 tabular-nums">
              {elapsedSeconds.toFixed(1)}s
            </span>
          </div>
          <div className="h-8 w-[1px] bg-white/10" />
          <div>
            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-400" /> Best
            </span>
            <span className="text-xl font-semibold font-mono text-neutral-200 tabular-nums">
              {bestWpm} WPM
            </span>
          </div>
        </div>

        <button
          onClick={() => resetTest(passageIndex)}
          className="p-2 rounded-lg bg-[#10110F] text-neutral-300 hover:text-white border border-white/10 transition-colors"
          title="Restart Test"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Passage Display Arena */}
      <div 
        onClick={() => inputRef.current?.focus()}
        className="w-full bg-[#0E0F0D] rounded-2xl border-2 border-white/10 p-6 min-h-[180px] cursor-text shadow-2xl relative select-none"
      >
        <p className="text-lg leading-relaxed font-mono tracking-wide">
          {targetText.split('').map((char, index) => {
            const isTyped = index < userInput.length;
            const isCorrect = isTyped && userInput[index] === char;
            const isCurrent = index === userInput.length;

            return (
              <span
                key={index}
                className={`relative transition-colors duration-75 ${
                  isCorrect
                    ? 'text-[#B7FF35] font-semibold'
                    : isTyped
                    ? 'text-red-400 bg-red-950/50 underline'
                    : 'text-neutral-500'
                }`}
              >
                {char}
                {isCurrent && (
                  <span className="absolute -left-[1px] top-0 bottom-0 w-[2px] bg-[#B7FF35] animate-pulse" />
                )}
              </span>
            );
          })}
        </p>

        {/* Hidden input catching user keystrokes */}
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInputChange}
          disabled={isCompleted}
          autoFocus
          className="opacity-0 absolute inset-0 cursor-default"
          aria-label="Typing test input"
        />
      </div>

      {/* Completion Summary */}
      {isCompleted && (
        <div className="w-full mt-4 p-5 rounded-2xl bg-[#171816] border border-[#B7FF35]/40 text-center animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-center gap-1.5 text-[#B7FF35] mb-1">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider">Test Completed</span>
          </div>
          <h4 className="text-2xl font-bold text-white mb-2">
            Speed: <span className="text-[#B7FF35] font-mono">{currentWpm} WPM</span>
          </h4>
          <p className="text-xs text-neutral-400 mb-4">
            Accuracy: <strong className="text-white font-mono">{accuracy}%</strong> · Time: <strong className="text-white font-mono">{elapsedSeconds.toFixed(1)}s</strong>
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={nextPassage}
              className="px-5 py-2.5 bg-[#B7FF35] hover:bg-[#a6ec27] text-black font-semibold text-xs rounded-xl shadow-md transition-all"
            >
              Next Passage
            </button>
            <button
              onClick={() => resetTest(passageIndex)}
              className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs rounded-xl border border-white/10 transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Helper text */}
      <div className="mt-4 text-xs font-mono text-neutral-500">
        Click the passage to focus and begin typing. Spacebar and punctuation count.
      </div>
    </div>
  );
};
