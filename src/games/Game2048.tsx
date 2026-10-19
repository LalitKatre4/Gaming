import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, Undo2, Trophy, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { sounds } from '../utils/audio';
import { getBestScore, saveBestScore } from '../utils/storage';
import { Confetti } from '../components/Confetti';

type Board = number[][];

const BOARD_SIZE = 4;

export const Game2048: React.FC = () => {
  const [board, setBoard] = useState<Board>([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const [score, setScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(0);
  const [previousState, setPreviousState] = useState<{ board: Board; score: number } | null>(null);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [hasWon, setHasWon] = useState<boolean>(false);
  const [keepPlaying, setKeepPlaying] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Load best score on mount
  useEffect(() => {
    const saved = getBestScore('2048');
    if (saved) {
      setBestScore(saved.score);
    }
  }, []);

  const getEmptyCells = (b: Board): { r: number; c: number }[] => {
    const empty: { r: number; c: number }[] = [];
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (b[r][c] === 0) empty.push({ r, c });
      }
    }
    return empty;
  };

  const addRandomTile = useCallback((b: Board): Board => {
    const empty = getEmptyCells(b);
    if (empty.length === 0) return b;
    const { r, c } = empty[Math.floor(Math.random() * empty.length)];
    const val = Math.random() < 0.9 ? 2 : 4;
    const next = b.map((row) => [...row]);
    next[r][c] = val;
    return next;
  }, []);

  const initGame = useCallback(() => {
    let b: Board = Array(BOARD_SIZE).fill(0).map(() => Array(BOARD_SIZE).fill(0));
    b = addRandomTile(b);
    b = addRandomTile(b);
    setBoard(b);
    setScore(0);
    setPreviousState(null);
    setIsGameOver(false);
    setHasWon(false);
    setKeepPlaying(false);
    setShowConfetti(false);
    sounds.playMove();
  }, [addRandomTile]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const canMove = (b: Board): boolean => {
    if (getEmptyCells(b).length > 0) return true;
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        const val = b[r][c];
        if (c + 1 < BOARD_SIZE && b[r][c + 1] === val) return true;
        if (r + 1 < BOARD_SIZE && b[r + 1][c] === val) return true;
      }
    }
    return false;
  };

  const slideRowLeft = (row: number[]): { row: number[]; gained: number } => {
    const filtered = row.filter((n) => n !== 0);
    const newRow: number[] = [];
    let gained = 0;

    for (let i = 0; i < filtered.length; i++) {
      if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
        const mergedVal = filtered[i] * 2;
        newRow.push(mergedVal);
        gained += mergedVal;
        i++; // skip next merged tile
      } else {
        newRow.push(filtered[i]);
      }
    }

    while (newRow.length < BOARD_SIZE) {
      newRow.push(0);
    }

    return { row: newRow, gained };
  };

  const rotateClockwise = (matrix: Board): Board => {
    const res: Board = Array(BOARD_SIZE).fill(0).map(() => Array(BOARD_SIZE).fill(0));
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        res[c][BOARD_SIZE - 1 - r] = matrix[r][c];
      }
    }
    return res;
  };

  const move = useCallback((direction: 'LEFT' | 'RIGHT' | 'UP' | 'DOWN') => {
    if (isGameOver) return;

    let rotCount = 0;
    if (direction === 'UP') rotCount = 3;
    else if (direction === 'RIGHT') rotCount = 2;
    else if (direction === 'DOWN') rotCount = 1;

    let cur = board.map((row) => [...row]);
    for (let i = 0; i < rotCount; i++) {
      cur = rotateClockwise(cur);
    }

    let gainedPoints = 0;
    let changed = false;
    const newGrid: Board = [];

    for (let r = 0; r < BOARD_SIZE; r++) {
      const { row, gained } = slideRowLeft(cur[r]);
      newGrid.push(row);
      gainedPoints += gained;
      if (row.some((val, idx) => val !== cur[r][idx])) {
        changed = true;
      }
    }

    if (!changed) return; // invalid move in this direction

    // Rotate back to original orientation
    let finalGrid = newGrid;
    for (let i = 0; i < (4 - rotCount) % 4; i++) {
      finalGrid = rotateClockwise(finalGrid);
    }

    // Save previous state for undo
    setPreviousState({
      board: board.map((r) => [...r]),
      score,
    });

    // Spawn new tile
    const withNewTile = addRandomTile(finalGrid);
    const nextScore = score + gainedPoints;

    setBoard(withNewTile);
    setScore(nextScore);

    if (gainedPoints > 0) {
      sounds.playCollect();
    } else {
      sounds.playMove();
    }

    if (nextScore > bestScore) {
      setBestScore(nextScore);
      saveBestScore('2048', nextScore);
    }

    // Check for 2048 victory
    if (!hasWon && !keepPlaying) {
      const won = withNewTile.some((row) => row.some((val) => val >= 2048));
      if (won) {
        setHasWon(true);
        sounds.playVictory();
        setShowConfetti(true);
      }
    }

    // Check for game over
    if (!canMove(withNewTile)) {
      setIsGameOver(true);
      sounds.playGameOver();
    }
  }, [board, score, bestScore, hasWon, keepPlaying, isGameOver, addRandomTile]);

  const undoMove = () => {
    if (!previousState) return;
    setBoard(previousState.board);
    setScore(previousState.score);
    setPreviousState(null);
    setIsGameOver(false);
    sounds.playMove();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          move('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          move('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          move('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          move('RIGHT');
          break;
        case 'u':
        case 'U':
          undoMove();
          break;
        case 'r':
        case 'R':
          initGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move, initGame]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) < 25) return; // swipe threshold

    if (absDx > absDy) {
      if (dx > 0) move('RIGHT');
      else move('LEFT');
    } else {
      if (dy > 0) move('DOWN');
      else move('UP');
    }
  };

  // Styling per tile value
  const getTileStyle = (val: number) => {
    if (val === 0) return 'bg-[#151614] border border-white/5';
    if (val === 2) return 'bg-[#22241F] text-neutral-200 border border-white/10';
    if (val === 4) return 'bg-[#2D3128] text-neutral-100 border border-white/15';
    if (val === 8) return 'bg-amber-700/80 text-amber-100 font-bold';
    if (val === 16) return 'bg-orange-700/80 text-orange-100 font-bold';
    if (val === 32) return 'bg-rose-700/80 text-rose-100 font-bold';
    if (val === 64) return 'bg-red-600 text-white font-extrabold shadow-md';
    if (val === 128) return 'bg-[#A855F7] text-white font-extrabold shadow-[0_0_12px_rgba(168,85,247,0.5)]';
    if (val === 256) return 'bg-[#9333EA] text-white font-extrabold shadow-[0_0_15px_rgba(147,51,234,0.6)]';
    if (val === 512) return 'bg-[#7E22CE] text-white font-extrabold shadow-[0_0_18px_rgba(126,34,206,0.7)]';
    if (val === 1024) return 'bg-[#06B6D4] text-black font-black shadow-[0_0_20px_#06B6D4]';
    return 'bg-[#B7FF35] text-black font-black shadow-[0_0_24px_#B7FF35] animate-pulse';
  };

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
              <Trophy className="w-3 h-3 text-amber-400" /> Best
            </span>
            <span className="text-xl font-semibold font-mono text-neutral-200 tabular-nums">{bestScore}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={undoMove}
            disabled={!previousState}
            title="Undo Move (U)"
            aria-label="Undo Move"
            className="p-2 rounded-lg bg-[#10110F] text-neutral-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-800 border border-white/10 transition-colors"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={initGame}
            title="Restart Board (R)"
            aria-label="Restart Board"
            className="p-2 rounded-lg bg-[#10110F] text-neutral-300 hover:bg-neutral-800 border border-white/10 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4x4 Sliding Board */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative w-full aspect-square max-w-[380px] p-3 bg-[#0E0F0D] rounded-2xl border-2 border-white/10 shadow-2xl grid grid-cols-4 gap-2.5 select-none touch-none"
      >
        {board.flat().map((val, idx) => (
          <div
            key={idx}
            className={`aspect-square rounded-xl flex items-center justify-center font-mono font-bold transition-all duration-150 text-xl sm:text-2xl ${getTileStyle(
              val
            )}`}
          >
            {val !== 0 && (
              <span className="animate-in zoom-in-75 duration-100">{val}</span>
            )}
          </div>
        ))}

        {/* Victory Overlay */}
        {hasWon && !keepPlaying && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center rounded-2xl">
            <div className="text-amber-400 font-mono text-xs uppercase tracking-widest mb-1">Milestone Unlocked</div>
            <h3 className="text-3xl font-black text-[#B7FF35] mb-2">2048 Reached!</h3>
            <p className="text-xs text-neutral-300 mb-6">
              Congratulations! You synthesized the legendary 2048 tile.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setKeepPlaying(true)}
                className="px-5 py-2.5 bg-[#B7FF35] text-black font-bold text-xs rounded-xl shadow-md hover:bg-[#a6ec27]"
              >
                Keep Playing
              </button>
              <button
                onClick={initGame}
                className="px-4 py-2.5 bg-neutral-800 text-white text-xs rounded-xl border border-white/10 hover:bg-neutral-700"
              >
                New Game
              </button>
            </div>
          </div>
        )}

        {/* Game Over Overlay */}
        {isGameOver && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center rounded-2xl">
            <div className="text-red-400 font-mono text-xs uppercase tracking-widest mb-1">No Moves Left</div>
            <h3 className="text-2xl font-bold text-white mb-2">Game Over</h3>
            <div className="text-xs text-neutral-400 mb-4">
              Final Score: <span className="text-[#B7FF35] font-mono font-bold text-base">{score}</span>
            </div>
            <button
              onClick={initGame}
              className="px-6 py-2.5 bg-[#B7FF35] text-black font-semibold text-xs rounded-xl flex items-center gap-2 hover:bg-[#a6ec27]"
            >
              <RotateCcw className="w-4 h-4" /> Try Again
            </button>
          </div>
        )}
      </div>

      {/* Accessible Directional Controls (Useful for mobile & touch) */}
      <div className="mt-4 flex flex-col items-center sm:hidden">
        <button
          onClick={() => move('UP')}
          aria-label="Slide Up"
          className="w-12 h-12 rounded-xl bg-[#171816] active:bg-[#B7FF35] active:text-black border border-white/10 flex items-center justify-center text-neutral-300 mb-1"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        <div className="flex gap-4">
          <button
            onClick={() => move('LEFT')}
            aria-label="Slide Left"
            className="w-12 h-12 rounded-xl bg-[#171816] active:bg-[#B7FF35] active:text-black border border-white/10 flex items-center justify-center text-neutral-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => move('DOWN')}
            aria-label="Slide Down"
            className="w-12 h-12 rounded-xl bg-[#171816] active:bg-[#B7FF35] active:text-black border border-white/10 flex items-center justify-center text-neutral-300"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
          <button
            onClick={() => move('RIGHT')}
            aria-label="Slide Right"
            className="w-12 h-12 rounded-xl bg-[#171816] active:bg-[#B7FF35] active:text-black border border-white/10 flex items-center justify-center text-neutral-300"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
