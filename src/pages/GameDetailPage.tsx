import React, { useEffect, useState } from 'react';
import { ChevronLeft, Share2, Heart, Trophy, Keyboard, Info, Check } from 'lucide-react';
import { GameInfo, GAMES_CATALOG } from '../data/games';
import { SnakeGame } from '../games/SnakeGame';
import { TicTacToeGame } from '../games/TicTacToeGame';
import { MemoryMatchGame } from '../games/MemoryMatchGame';
import { Game2048 } from '../games/Game2048';
import { RockPaperScissorsGame } from '../games/RockPaperScissorsGame';
import { WhackAMoleGame } from '../games/WhackAMoleGame';
import { ReactionTimeGame } from '../games/ReactionTimeGame';
import { TypingSpeedGame } from '../games/TypingSpeedGame';
import { AdSlot } from '../components/AdSlot';
import { GameCard } from '../components/GameCard';
import { recordPlayed, isFavorite, toggleFavorite, getBestScore } from '../utils/storage';
import { sounds } from '../utils/audio';

interface GameDetailPageProps {
  game: GameInfo;
  onNavigate: (route: string) => void;
}

export const GameDetailPage: React.FC<GameDetailPageProps> = ({ game, onNavigate }) => {
  const [favorite, setFavorite] = useState<boolean>(false);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);
  const bestRecord = getBestScore(game.id);

  // Record played & set favorite status on mount
  useEffect(() => {
    recordPlayed(game.id);
    setFavorite(isFavorite(game.id));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [game.id]);

  const handleHeartClick = () => {
    const next = toggleFavorite(game.id);
    setFavorite(next);
    sounds.playMove();
  };

  const handleShare = () => {
    sounds.playCollect();
    const shareUrl = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2000);
      });
    }
  };

  // Render game component
  const renderGameComponent = () => {
    switch (game.id) {
      case 'snake':
        return <SnakeGame />;
      case 'tic-tac-toe':
        return <TicTacToeGame />;
      case 'memory-match':
        return <MemoryMatchGame />;
      case '2048':
        return <Game2048 />;
      case 'rock-paper-scissors':
        return <RockPaperScissorsGame />;
      case 'whack-a-mole':
        return <WhackAMoleGame />;
      case 'reaction-time':
        return <ReactionTimeGame />;
      case 'typing-speed':
        return <TypingSpeedGame />;
      default:
        return (
          <div className="p-8 text-center text-neutral-400">
            Game component not found.
          </div>
        );
    }
  };

  // Related games (exclude current)
  const relatedGames = GAMES_CATALOG.filter((g) => g.id !== game.id).slice(0, 3);

  return (
    <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-6">
        <button
          onClick={() => onNavigate('/')}
          className="hover:text-[#B7FF35] transition-colors flex items-center gap-1"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Games
        </button>
        <span aria-hidden="true" className="text-neutral-600">/</span>
        <span className="text-neutral-400">{game.categoryLabel}</span>
        <span aria-hidden="true" className="text-neutral-600">/</span>
        <span className="text-[#B7FF35] font-semibold">{game.title}</span>
      </nav>

      {/* Game Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {game.title}
            </h1>
            {game.badge && (
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#B7FF35] px-2 py-0.5 rounded bg-[#B7FF35]/10 border border-[#B7FF35]/30">
                {game.badge}
              </span>
            )}
          </div>
          {/* Unboxed natural metadata */}
          <div className="mt-2 flex items-center gap-2 text-xs text-neutral-400 font-medium">
            <span>{game.categoryLabel}</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span>{game.estimatedTime} average</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span className="text-neutral-300 font-mono">{game.controlsSummary}</span>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2.5 shrink-0">
          {bestRecord && (
            <div className="px-3 py-2 rounded-xl bg-[#171816] border border-white/10 flex items-center gap-1.5 text-xs font-mono text-amber-300">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Record:</span>
              <strong className="text-white">
                {bestRecord.score}
                {game.id === 'reaction-time' ? 'ms' : ''}
              </strong>
            </div>
          )}

          <button
            onClick={handleHeartClick}
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
            className="p-2.5 rounded-xl bg-[#171816] border border-white/10 text-neutral-300 hover:text-rose-400 transition-colors"
          >
            <Heart className={`w-4 h-4 ${favorite ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          <button
            onClick={handleShare}
            aria-label="Share Game URL"
            className="px-3.5 py-2.5 rounded-xl bg-[#171816] border border-white/10 text-neutral-300 hover:text-[#B7FF35] transition-colors flex items-center gap-1.5 text-xs font-mono"
          >
            {copiedShare ? <Check className="w-4 h-4 text-[#B7FF35]" /> : <Share2 className="w-4 h-4" />}
            <span>{copiedShare ? 'Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Main Playable Game Arena Container */}
      <section 
        aria-label={`${game.title} Game Board`}
        className="w-full bg-[#121311] rounded-3xl border border-white/10 p-4 sm:p-8 shadow-2xl mb-10 flex flex-col items-center justify-center min-h-[480px]"
      >
        {renderGameComponent()}
      </section>

      {/* Instructions & Controls Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Instructions */}
        <section aria-labelledby="rules-heading" className="p-6 rounded-2xl bg-[#171816] border border-white/10">
          <h2 id="rules-heading" className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <Info className="w-4 h-4 text-[#B7FF35]" /> Rules & How to Play
          </h2>
          <ul className="space-y-2 text-xs text-neutral-300 leading-relaxed list-disc pl-4">
            {game.instructions.map((inst, i) => (
              <li key={i}>{inst}</li>
            ))}
          </ul>
        </section>

        {/* Controls */}
        <section aria-labelledby="controls-heading" className="p-6 rounded-2xl bg-[#171816] border border-white/10">
          <h2 id="controls-heading" className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-[#A855F7]" /> Game Controls
          </h2>
          <div className="space-y-2 text-xs">
            {game.controls.map((ctrl, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded-lg bg-[#10110F] border border-white/5"
              >
                <span className="font-mono text-neutral-400">{ctrl.action}</span>
                <kbd className="px-2 py-1 rounded bg-[#20221E] border border-white/15 text-[#B7FF35] font-mono text-[11px]">
                  {ctrl.key}
                </kbd>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Monetization Architecture AdSlot: disabled by default, clean reserved space, zero layout shift */}
      <AdSlot
        placementId="game-bottom-leaderboard"
        format="leaderboard"
        enabled={false}
      />

      {/* Related Games Recommendation */}
      <section className="mt-12 pt-8 border-t border-white/10">
        <h2 className="text-lg font-bold text-white mb-6">More Instant Games</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {relatedGames.map((relGame) => (
            <GameCard
              key={relGame.id}
              game={relGame}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </section>
    </article>
  );
};
