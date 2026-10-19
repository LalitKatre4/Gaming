import React, { useState, useEffect } from 'react';
import { RotateCcw, Flame, Trophy, History } from 'lucide-react';
import { sounds } from '../utils/audio';
import { getBestScore, saveBestScore } from '../utils/storage';
import { Confetti } from '../components/Confetti';

type Choice = 'rock' | 'paper' | 'scissors' | 'lizard' | 'spock';

interface ChoiceData {
  id: Choice;
  name: string;
  icon: string;
  beats: { target: Choice; verb: string }[];
}

const CHOICES_DATA: Record<Choice, ChoiceData> = {
  rock: {
    id: 'rock',
    name: 'Rock',
    icon: '🪨',
    beats: [
      { target: 'scissors', verb: 'crushes' },
      { target: 'lizard', verb: 'crushes' },
    ],
  },
  paper: {
    id: 'paper',
    name: 'Paper',
    icon: '📄',
    beats: [
      { target: 'rock', verb: 'covers' },
      { target: 'spock', verb: 'disproves' },
    ],
  },
  scissors: {
    id: 'scissors',
    name: 'Scissors',
    icon: '✂️',
    beats: [
      { target: 'paper', verb: 'cuts' },
      { target: 'lizard', verb: 'decapitates' },
    ],
  },
  lizard: {
    id: 'lizard',
    name: 'Lizard',
    icon: '🦎',
    beats: [
      { target: 'spock', verb: 'poisons' },
      { target: 'paper', verb: 'eats' },
    ],
  },
  spock: {
    id: 'spock',
    name: 'Spock',
    icon: '🖖',
    beats: [
      { target: 'scissors', verb: 'smashes' },
      { target: 'rock', verb: 'vaporizes' },
    ],
  },
};

interface RoundResult {
  player: Choice;
  computer: Choice;
  outcome: 'win' | 'lose' | 'tie';
  message: string;
}

export const RockPaperScissorsGame: React.FC = () => {
  const [isExtended, setIsExtended] = useState<boolean>(false);
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [isRevealing, setIsRevealing] = useState<boolean>(false);
  const [countdownText, setCountdownText] = useState<string>('');
  const [lastOutcome, setLastOutcome] = useState<RoundResult | null>(null);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [tally, setTally] = useState({ wins: 0, losses: 0, ties: 0 });
  const [history, setHistory] = useState<RoundResult[]>([]);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  // Load best streak
  useEffect(() => {
    const saved = getBestScore('rock-paper-scissors');
    if (saved) {
      setBestStreak(saved.score);
    }
  }, []);

  const availableChoices: Choice[] = isExtended
    ? ['rock', 'paper', 'scissors', 'lizard', 'spock']
    : ['rock', 'paper', 'scissors'];

  const evaluate = (p: Choice, c: Choice): { outcome: 'win' | 'lose' | 'tie'; message: string } => {
    if (p === c) {
      return { outcome: 'tie', message: `Both players threw ${CHOICES_DATA[p].name}. Standoff!` };
    }

    const playerWinsRule = CHOICES_DATA[p].beats.find((b) => b.target === c);
    if (playerWinsRule) {
      return {
        outcome: 'win',
        message: `${CHOICES_DATA[p].name} ${playerWinsRule.verb} ${CHOICES_DATA[c].name}! You win!`,
      };
    }

    const computerWinsRule = CHOICES_DATA[c].beats.find((b) => b.target === p);
    return {
      outcome: 'lose',
      message: `${CHOICES_DATA[c].name} ${computerWinsRule?.verb || 'beats'} ${CHOICES_DATA[p].name}. Computer takes round.`,
    };
  };

  const handleSelectChoice = (choice: Choice) => {
    if (isRevealing) return;

    sounds.playMove();
    setPlayerChoice(choice);
    setComputerChoice(null);
    setIsRevealing(true);
    setCountdownText('Ready...');

    // Quick dramatic countdown: Ready -> Shoot!
    setTimeout(() => setCountdownText('Throw!'), 250);

    setTimeout(() => {
      // Pick computer choice
      const compPick = availableChoices[Math.floor(Math.random() * availableChoices.length)];
      setComputerChoice(compPick);
      setIsRevealing(false);
      setCountdownText('');

      const result = evaluate(choice, compPick);
      const roundData: RoundResult = {
        player: choice,
        computer: compPick,
        outcome: result.outcome,
        message: result.message,
      };

      setLastOutcome(roundData);
      setHistory((prev) => [roundData, ...prev.slice(0, 9)]);

      setTally((t) => {
        const next = { ...t };
        if (result.outcome === 'win') {
          next.wins += 1;
          sounds.playVictory();
          const newStreak = currentStreak + 1;
          setCurrentStreak(newStreak);
          if (newStreak > bestStreak) {
            setBestStreak(newStreak);
            saveBestScore('rock-paper-scissors', newStreak);
            if (newStreak >= 3) {
              setShowConfetti(true);
            }
          }
        } else if (result.outcome === 'lose') {
          next.losses += 1;
          setCurrentStreak(0);
          sounds.playGameOver();
        } else {
          next.ties += 1;
          sounds.playHit();
        }
        return next;
      });
    }, 550);
  };

  const resetAll = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setLastOutcome(null);
    setCurrentStreak(0);
    setTally({ wins: 0, losses: 0, ties: 0 });
    setHistory([]);
    setShowConfetti(false);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto">
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Top HUD */}
      <div className="w-full flex items-center justify-between p-3 mb-4 rounded-xl bg-[#171816] border border-white/10">
        <div className="flex items-center gap-4 text-center">
          <div>
            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-400" /> Streak
            </span>
            <span className="text-xl font-bold font-mono text-[#B7FF35] tabular-nums">{currentStreak}</span>
          </div>
          <div className="h-6 w-[1px] bg-white/10" />
          <div>
            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-400" /> Best
            </span>
            <span className="text-xl font-semibold font-mono text-neutral-200 tabular-nums">{bestStreak}</span>
          </div>
          <div className="h-6 w-[1px] bg-white/10" />
          <div className="text-[11px] font-mono text-neutral-400">
            W: <span className="text-[#B7FF35] font-bold">{tally.wins}</span> · L:{' '}
            <span className="text-[#A855F7] font-bold">{tally.losses}</span> · T: {tally.ties}
          </div>
        </div>

        {/* Mode Toggle */}
        <button
          onClick={() => {
            setIsExtended((e) => !e);
            setPlayerChoice(null);
            setComputerChoice(null);
            setLastOutcome(null);
          }}
          className="px-2.5 py-1 text-xs font-mono rounded-lg border border-white/10 bg-[#10110F] text-neutral-300 hover:text-white transition-colors"
        >
          {isExtended ? '5-Way (Spock)' : 'Classic (3-Way)'}
        </button>
      </div>

      {/* Arena Stage */}
      <div className="w-full bg-[#0E0F0D] rounded-2xl border-2 border-white/10 p-6 flex flex-col items-center justify-center min-h-[260px] shadow-2xl relative overflow-hidden">
        <div className="w-full flex items-center justify-around">
          {/* Player Side */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2">You</span>
            <div className="w-24 h-24 rounded-2xl bg-[#171816] border-2 border-[#B7FF35]/40 flex items-center justify-center text-5xl shadow-lg">
              {playerChoice ? (
                <span className="animate-in zoom-in-75 duration-150">{CHOICES_DATA[playerChoice].icon}</span>
              ) : (
                <span className="text-neutral-600 text-xl font-mono">?</span>
              )}
            </div>
            <span className="text-xs font-medium text-neutral-300 mt-2">
              {playerChoice ? CHOICES_DATA[playerChoice].name : 'Choose below'}
            </span>
          </div>

          {/* VS Standoff */}
          <div className="flex flex-col items-center">
            {isRevealing ? (
              <span className="text-[#B7FF35] font-bold font-mono text-lg animate-pulse">
                {countdownText}
              </span>
            ) : (
              <span className="text-neutral-500 font-bold font-mono text-base">VS</span>
            )}
          </div>

          {/* Computer Side */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2">Computer</span>
            <div className="w-24 h-24 rounded-2xl bg-[#171816] border-2 border-[#A855F7]/40 flex items-center justify-center text-5xl shadow-lg">
              {isRevealing ? (
                <span className="text-neutral-500 animate-spin text-3xl">⏳</span>
              ) : computerChoice ? (
                <span className="animate-in zoom-in-75 duration-150">{CHOICES_DATA[computerChoice].icon}</span>
              ) : (
                <span className="text-neutral-600 text-xl font-mono">?</span>
              )}
            </div>
            <span className="text-xs font-medium text-neutral-300 mt-2">
              {computerChoice ? CHOICES_DATA[computerChoice].name : 'Waiting'}
            </span>
          </div>
        </div>

        {/* Outcome result banner */}
        {lastOutcome && !isRevealing && (
          <div
            className={`mt-6 px-4 py-2 rounded-xl text-center border text-xs font-medium animate-in fade-in duration-200 ${
              lastOutcome.outcome === 'win'
                ? 'bg-[#1a2e16] border-[#B7FF35]/50 text-[#B7FF35]'
                : lastOutcome.outcome === 'lose'
                ? 'bg-[#2a172e] border-[#A855F7]/50 text-[#E9D5FF]'
                : 'bg-neutral-800 border-white/10 text-neutral-300'
            }`}
          >
            {lastOutcome.message}
          </div>
        )}
      </div>

      {/* Choice Buttons */}
      <div className="mt-5 w-full">
        <span className="text-xs font-mono text-neutral-400 block mb-2 text-center">Select your move:</span>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {availableChoices.map((choice) => (
            <button
              key={choice}
              onClick={() => handleSelectChoice(choice)}
              disabled={isRevealing}
              className="px-4 py-3 rounded-xl bg-[#171816] hover:bg-[#20221E] active:scale-95 border border-white/10 hover:border-[#B7FF35]/50 flex items-center gap-2 text-sm font-semibold text-neutral-100 transition-all cursor-pointer disabled:opacity-50"
            >
              <span className="text-2xl">{CHOICES_DATA[choice].icon}</span>
              <span>{CHOICES_DATA[choice].name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* History Log */}
      {history.length > 0 && (
        <div className="w-full mt-6 p-4 rounded-xl bg-[#171816] border border-white/10">
          <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2">
            <History className="w-3.5 h-3.5" /> Recent Rounds
          </div>
          <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
            {history.map((h, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-xs py-1 px-2 rounded bg-[#10110F] border border-white/5"
              >
                <span className="text-neutral-300">
                  {CHOICES_DATA[h.player].icon} vs {CHOICES_DATA[h.computer].icon}
                </span>
                <span
                  className={`font-mono font-bold capitalize ${
                    h.outcome === 'win'
                      ? 'text-[#B7FF35]'
                      : h.outcome === 'lose'
                      ? 'text-[#A855F7]'
                      : 'text-neutral-400'
                  }`}
                >
                  {h.outcome}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reset stats button */}
      <div className="mt-4">
        <button
          onClick={resetAll}
          className="px-4 py-2 bg-[#171816] hover:bg-[#20221E] active:scale-95 text-neutral-400 text-xs rounded-xl border border-white/10 flex items-center gap-2 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Session
        </button>
      </div>
    </div>
  );
};
