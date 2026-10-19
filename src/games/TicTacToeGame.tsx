import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Trophy, Cpu, User } from 'lucide-react';
import { sounds } from '../utils/audio';
import { getBestScore, saveBestScore } from '../utils/storage';
import { Confetti } from '../components/Confetti';

type BoardState = (string | null)[];
type Difficulty = 'casual' | 'tactical' | 'master';

const WINNING_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6]             // diagonals
];

export const TicTacToeGame: React.FC = () => {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('tactical');
  const [stats, setStats] = useState({ wins: 0, losses: 0, ties: 0 });
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  // Load stats from storage
  useEffect(() => {
    const saved = getBestScore('tic-tac-toe');
    if (saved) {
      setStats({
        wins: saved.score,
        losses: parseInt(saved.secondary?.split('/')[0] || '0', 10),
        ties: parseInt(saved.secondary?.split('/')[1] || '0', 10),
      });
    }
  }, []);

  const checkWinner = (currentBoard: BoardState): { winner: string | null; line: number[] | null } => {
    for (const combo of WINNING_COMBOS) {
      const [a, b, c] = combo;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return { winner: currentBoard[a], line: combo };
      }
    }
    if (currentBoard.every((cell) => cell !== null)) {
      return { winner: 'Tie', line: null };
    }
    return { winner: null, line: null };
  };

  // Minimax algorithm for Master AI
  const minimax = (currentBoard: BoardState, depth: number, isMaximizing: boolean): number => {
    const { winner: result } = checkWinner(currentBoard);
    if (result === 'O') return 10 - depth;
    if (result === 'X') return depth - 10;
    if (result === 'Tie') return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (!currentBoard[i]) {
          currentBoard[i] = 'O';
          const score = minimax(currentBoard, depth + 1, false);
          currentBoard[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (!currentBoard[i]) {
          currentBoard[i] = 'X';
          const score = minimax(currentBoard, depth + 1, true);
          currentBoard[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const getBestMove = (currentBoard: BoardState, diff: Difficulty): number => {
    const available = currentBoard
      .map((val, idx) => (val === null ? idx : null))
      .filter((v): v is number => v !== null);

    if (available.length === 0) return -1;

    // 1. Casual: mostly random with 20% smart check
    if (diff === 'casual') {
      if (Math.random() > 0.4) {
        return available[Math.floor(Math.random() * available.length)];
      }
    }

    // 2. Tactical: checks immediate win, then immediate block, otherwise center, corners, or random
    if (diff === 'casual' || diff === 'tactical') {
      // Check can AI win
      for (const idx of available) {
        currentBoard[idx] = 'O';
        if (checkWinner(currentBoard).winner === 'O') {
          currentBoard[idx] = null;
          return idx;
        }
        currentBoard[idx] = null;
      }
      // Check can player win, block them
      for (const idx of available) {
        currentBoard[idx] = 'X';
        if (checkWinner(currentBoard).winner === 'X') {
          currentBoard[idx] = null;
          return idx;
        }
        currentBoard[idx] = null;
      }

      if (diff === 'tactical') {
        // Take center if available
        if (available.includes(4)) return 4;
        // Take corners
        const corners = [0, 2, 6, 8].filter((c) => available.includes(c));
        if (corners.length > 0 && Math.random() < 0.7) {
          return corners[Math.floor(Math.random() * corners.length)];
        }
      }
      return available[Math.floor(Math.random() * available.length)];
    }

    // 3. Master: Minimax
    let bestScore = -Infinity;
    let move = available[0];
    for (const idx of available) {
      currentBoard[idx] = 'O';
      const score = minimax(currentBoard, 0, false);
      currentBoard[idx] = null;
      if (score > bestScore) {
        bestScore = score;
        move = idx;
      }
    }
    return move;
  };

  const executeMove = useCallback((index: number, player: 'X' | 'O') => {
    setBoard((prev) => {
      const next = [...prev];
      next[index] = player;

      const { winner: winResult, line } = checkWinner(next);
      if (winResult) {
        setWinner(winResult);
        setWinningLine(line);

        setStats((prevStats) => {
          const updated = { ...prevStats };
          if (winResult === 'X') {
            updated.wins += 1;
            sounds.playVictory();
            setShowConfetti(true);
          } else if (winResult === 'O') {
            updated.losses += 1;
            sounds.playGameOver();
          } else {
            updated.ties += 1;
            sounds.playCollect();
          }
          saveBestScore('tic-tac-toe', updated.wins, `${updated.losses}/${updated.ties}`);
          return updated;
        });
      } else {
        sounds.playMove();
      }

      return next;
    });
  }, []);

  // Handle player click
  const handleCellClick = (index: number) => {
    if (board[index] || winner || !isPlayerTurn || isAiThinking) return;

    executeMove(index, 'X');
    setIsPlayerTurn(false);
  };

  // Computer's turn
  useEffect(() => {
    if (!isPlayerTurn && !winner) {
      setIsAiThinking(true);
      const timer = setTimeout(() => {
        const aiMove = getBestMove([...board], difficulty);
        if (aiMove !== -1) {
          executeMove(aiMove, 'O');
        }
        setIsAiThinking(false);
        setIsPlayerTurn(true);
      }, 450); // slight delay to feel natural

      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, winner, board, difficulty, executeMove]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setWinningLine(null);
    setIsPlayerTurn(true);
    setIsAiThinking(false);
    setShowConfetti(false);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Top HUD */}
      <div className="w-full flex items-center justify-between p-3 mb-4 rounded-xl bg-[#171816] border border-white/10">
        <div className="flex items-center gap-4 text-center">
          <div>
            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">Wins (X)</span>
            <span className="text-xl font-bold font-mono text-[#B7FF35] tabular-nums">{stats.wins}</span>
          </div>
          <div className="h-6 w-[1px] bg-white/10" />
          <div>
            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">Losses (O)</span>
            <span className="text-xl font-semibold font-mono text-[#A855F7] tabular-nums">{stats.losses}</span>
          </div>
          <div className="h-6 w-[1px] bg-white/10" />
          <div>
            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">Ties</span>
            <span className="text-xl font-semibold font-mono text-neutral-300 tabular-nums">{stats.ties}</span>
          </div>
        </div>

        {/* Difficulty Selector */}
        <div className="flex items-center gap-1 bg-[#10110F] p-1 rounded-lg border border-white/5">
          {(['casual', 'tactical', 'master'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => {
                setDifficulty(diff);
                resetGame();
              }}
              className={`px-2 py-1 text-xs font-mono capitalize rounded transition-colors ${
                difficulty === diff
                  ? 'bg-[#B7FF35] text-black font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Turn indicator */}
      <div className="mb-4 flex items-center gap-2 text-xs font-medium font-mono text-neutral-400">
        {winner ? (
          <span className="text-white font-bold">
            {winner === 'X' ? '🎉 You won!' : winner === 'O' ? '🤖 Computer won!' : '🤝 It is a draw!'}
          </span>
        ) : isAiThinking ? (
          <span className="text-[#A855F7] flex items-center gap-1.5 animate-pulse">
            <Cpu className="w-3.5 h-3.5" /> Computer thinking...
          </span>
        ) : (
          <span className="text-[#B7FF35] flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" /> Your turn (X)
          </span>
        )}
      </div>

      {/* 3x3 Board */}
      <div className="grid grid-cols-3 gap-3 w-full aspect-square max-w-[340px] p-3 bg-[#0E0F0D] rounded-2xl border-2 border-white/10 shadow-2xl">
        {board.map((cell, idx) => {
          const isWinningCell = winningLine?.includes(idx);

          return (
            <button
              key={idx}
              onClick={() => handleCellClick(idx)}
              disabled={!!cell || !!winner || !isPlayerTurn}
              aria-label={`Cell ${idx + 1}, ${cell || 'Empty'}`}
              className={`aspect-square rounded-xl flex items-center justify-center font-bold text-4xl transition-all duration-150 relative ${
                cell === null && !winner && isPlayerTurn
                  ? 'bg-[#171816] hover:bg-[#20221E] active:scale-95 border border-white/5 cursor-pointer'
                  : 'bg-[#141513] border border-white/5 cursor-default'
              } ${
                isWinningCell
                  ? cell === 'X'
                    ? 'bg-[#B7FF35]/20 border-[#B7FF35] shadow-[0_0_15px_rgba(183,255,53,0.3)]'
                    : 'bg-[#A855F7]/20 border-[#A855F7] shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                  : ''
              }`}
            >
              {cell === 'X' && (
                <span className="text-[#B7FF35] drop-shadow-[0_0_8px_rgba(183,255,53,0.6)] animate-in zoom-in-50 duration-150">
                  ✕
                </span>
              )}
              {cell === 'O' && (
                <span className="text-[#A855F7] drop-shadow-[0_0_8px_rgba(168,85,247,0.6)] animate-in zoom-in-50 duration-150">
                  ◯
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Controls */}
      <div className="mt-5 flex items-center gap-3">
        <button
          onClick={resetGame}
          className="px-5 py-2.5 bg-[#171816] hover:bg-[#20221E] active:scale-95 text-neutral-200 text-xs font-semibold rounded-xl border border-white/10 flex items-center gap-2 transition-all shadow-sm"
        >
          <RotateCcw className="w-4 h-4" /> Reset Board
        </button>
      </div>
    </div>
  );
};
