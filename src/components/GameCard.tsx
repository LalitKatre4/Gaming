import React from 'react';
import { Heart, Play, Trophy, Sparkles } from 'lucide-react';
import { GameInfo } from '../data/games';
import { isFavorite, toggleFavorite, getBestScore } from '../utils/storage';
import { sounds } from '../utils/audio';

interface GameCardProps {
  game: GameInfo;
  onNavigate: (route: string) => void;
  onFavoriteToggled?: () => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onNavigate, onFavoriteToggled }) => {
  const [favorite, setFavorite] = React.useState<boolean>(false);
  const bestRecord = getBestScore(game.id);

  React.useEffect(() => {
    setFavorite(isFavorite(game.id));
  }, [game.id]);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = toggleFavorite(game.id);
    setFavorite(nextState);
    sounds.playMove();
    if (onFavoriteToggled) onFavoriteToggled();
  };

  const getGameIcon = (id: string) => {
    switch (id) {
      case 'snake':
        return '🐍';
      case '2048':
        return '🔢';
      case 'memory-match':
        return '🃏';
      case 'tic-tac-toe':
        return '⚔️';
      case 'rock-paper-scissors':
        return '✋';
      case 'whack-a-mole':
        return '👾';
      case 'reaction-time':
        return '⚡';
      case 'typing-speed':
        return '⌨️';
      default:
        return '🎮';
    }
  };

  return (
    <div
      onClick={() => onNavigate(game.route)}
      className="group relative rounded-2xl bg-[#171816] border border-white/10 hover:border-[#B7FF35]/40 hover:shadow-[0_4px_24px_rgba(183,255,53,0.12)] transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden p-5"
    >
      {/* Top row: Icon + Favorite button */}
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-[#20221E] border border-white/10 group-hover:border-[#B7FF35]/40 group-hover:bg-[#252822] flex items-center justify-center text-2xl transition-all duration-200">
            {getGameIcon(game.id)}
          </div>

          <div className="flex items-center gap-2">
            {game.badge && (
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#B7FF35] px-2 py-0.5 rounded bg-[#B7FF35]/10 border border-[#B7FF35]/30">
                {game.badge}
              </span>
            )}
            <button
              onClick={handleHeartClick}
              aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 transition-colors bg-[#10110F]/60 border border-white/5"
            >
              <Heart
                className={`w-4 h-4 transition-transform active:scale-125 ${
                  favorite ? 'fill-rose-500 text-rose-500' : 'text-neutral-400'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white group-hover:text-[#B7FF35] transition-colors flex items-center gap-1.5">
          {game.title}
        </h3>

        {/* Unboxed Metadata (Zero-Pill Discipline) */}
        <div className="mt-1 flex items-center gap-2 text-xs text-neutral-400 font-medium">
          <span>{game.categoryLabel}</span>
          <span aria-hidden="true" className="text-neutral-600">·</span>
          <span>{game.estimatedTime}</span>
        </div>

        {/* Tagline */}
        <p className="mt-2.5 text-xs text-neutral-400 line-clamp-2 leading-relaxed">
          {game.tagline}
        </p>
      </div>

      {/* Bottom Area: Controls & Score Preview */}
      <div className="mt-5 pt-3.5 border-t border-white/5 flex items-center justify-between">
        <div className="text-[11px] font-mono text-neutral-400">
          {bestRecord ? (
            <span className="flex items-center gap-1 text-amber-300">
              <Trophy className="w-3 h-3 text-amber-400" />
              <span>Best:</span>
              <strong className="text-white">
                {bestRecord.score}
                {game.id === 'reaction-time' ? 'ms' : ''}
              </strong>
            </span>
          ) : (
            <span className="text-neutral-500 truncate max-w-[150px] inline-block">
              {game.controlsSummary}
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(game.route);
          }}
          className="px-3 py-1.5 bg-[#20221E] group-hover:bg-[#B7FF35] group-hover:text-black text-neutral-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 shrink-0"
        >
          <Play className="w-3 h-3 fill-current" /> Play
        </button>
      </div>
    </div>
  );
};
