import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, Flame, SearchX, Clock, Heart } from 'lucide-react';
import { GameCategory, GAMES_CATALOG, GameInfo } from '../data/games';
import { HeroSection } from '../components/HeroSection';
import { GameCard } from '../components/GameCard';
import { AdSlot } from '../components/AdSlot';
import { getRecentlyPlayed, getFavorites } from '../utils/storage';

interface HomePageProps {
  onNavigate: (route: string) => void;
  searchQuery: string;
  onClearSearch: () => void;
  filterFavoritesOnly: boolean;
  onToggleFavoritesFilter: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  searchQuery,
  onClearSearch,
  filterFavoritesOnly,
  onToggleFavoritesFilter,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<GameCategory>('all');
  const [recentlyPlayedIds, setRecentlyPlayedIds] = useState<string[]>([]);
  const [favIds, setFavIds] = useState<string[]>([]);

  const loadLocalState = () => {
    const recents = getRecentlyPlayed();
    setRecentlyPlayedIds(recents.map((r) => r.gameId));
    setFavIds(getFavorites());
  };

  useEffect(() => {
    loadLocalState();
    window.addEventListener('gamezone:favorites-changed', loadLocalState);
    window.addEventListener('gamezone:recent-changed', loadLocalState);
    return () => {
      window.removeEventListener('gamezone:favorites-changed', loadLocalState);
      window.removeEventListener('gamezone:recent-changed', loadLocalState);
    };
  }, []);

  // Filter games based on search, category, and favorites
  const filteredGames = GAMES_CATALOG.filter((game) => {
    // 1. Favorites only filter
    if (filterFavoritesOnly && !favIds.includes(game.id)) {
      return false;
    }

    // 2. Category filter
    if (selectedCategory !== 'all' && game.category !== selectedCategory) {
      return false;
    }

    // 3. Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = game.title.toLowerCase().includes(q);
      const matchDesc = game.description.toLowerCase().includes(q);
      const matchCat = game.categoryLabel.toLowerCase().includes(q);
      return matchTitle || matchDesc || matchCat;
    }

    return true;
  });

  // Recently played games list
  const recentGames = GAMES_CATALOG.filter((g) => recentlyPlayedIds.includes(g.id));

  // Featured games (when no search or custom filter is active)
  const featuredGames = GAMES_CATALOG.filter((g) => g.featured);

  const categories: { id: GameCategory; label: string }[] = [
    { id: 'all', label: 'All Games' },
    { id: 'arcade', label: 'Arcade' },
    { id: 'puzzle', label: 'Puzzle' },
    { id: 'reflex', label: 'Reflex & Speed' },
    { id: 'brain', label: 'Brain & Memory' },
    { id: 'strategy', label: 'Strategy' },
  ];

  const handlePlayFeatured = () => {
    onNavigate('/games/snake');
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <HeroSection onPlayFeatured={handlePlayFeatured} totalGames={GAMES_CATALOG.length} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="all-games">
        {/* Recently Played Section (if user has active history) */}
        {!searchQuery && !filterFavoritesOnly && recentGames.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-mono uppercase tracking-wider text-neutral-300 font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#B7FF35]" /> Jump Back In
              </h2>
              <span className="text-xs text-neutral-500 font-mono">Recently played on this device</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentGames.slice(0, 4).map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onNavigate={onNavigate}
                  onFavoriteToggled={loadLocalState}
                />
              ))}
            </div>
          </section>
        )}

        {/* Category Controls & Filters (Functional interactive buttons) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#171816] rounded-xl border border-white/10 overflow-x-auto max-w-full">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#B7FF35] text-black font-semibold shadow-xs'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Active search or favorites indicators */}
          <div className="flex items-center gap-3 text-xs text-neutral-400">
            {filterFavoritesOnly && (
              <button
                onClick={onToggleFavoritesFilter}
                className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300"
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>Favorites view (click to clear)</span>
              </button>
            )}

            {searchQuery && (
              <span className="text-neutral-400 font-mono">
                Matching "{searchQuery}" ({filteredGames.length})
                <button
                  onClick={onClearSearch}
                  className="ml-2 text-[#B7FF35] hover:underline"
                >
                  Clear
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Games Grid */}
        {filteredGames.length > 0 ? (
          <section aria-label="Game Catalog Grid">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onNavigate={onNavigate}
                  onFavoriteToggled={loadLocalState}
                />
              ))}
            </div>
          </section>
        ) : (
          /* Empty State */
          <div className="my-16 py-14 px-6 rounded-2xl bg-[#171816] border border-white/10 text-center max-w-md mx-auto">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3 text-neutral-500">
              <SearchX className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">No Games Found</h3>
            <p className="text-xs text-neutral-400 mb-5">
              {filterFavoritesOnly
                ? "You haven't added any games to your favorites yet. Click the heart icon on any game card!"
                : `No games match the keyword "${searchQuery}".`}
            </p>
            {filterFavoritesOnly ? (
              <button
                onClick={onToggleFavoritesFilter}
                className="px-4 py-2 bg-[#20221E] hover:bg-neutral-800 text-xs font-semibold text-white rounded-xl border border-white/10"
              >
                Show All Games
              </button>
            ) : (
              <button
                onClick={onClearSearch}
                className="px-4 py-2 bg-[#20221E] hover:bg-neutral-800 text-xs font-semibold text-white rounded-xl border border-white/10"
              >
                Reset Search Filters
              </button>
            )}
          </div>
        )}

        {/* Monetization Architecture AdSlot: disabled by default */}
        <div className="mt-14">
          <AdSlot
            placementId="home-mid-banner"
            format="responsive"
            enabled={false}
          />
        </div>

        {/* Featured Spotlight Grid if browsing default */}
        {!searchQuery && !filterFavoritesOnly && selectedCategory === 'all' && (
          <section className="mt-14 pt-10 border-t border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" /> Community Highlights
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Fast reflexes, algorithmic AI opponents, and puzzle masters.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {featuredGames.slice(0, 3).map((game) => (
                <div
                  key={game.id}
                  onClick={() => onNavigate(game.route)}
                  className="p-6 rounded-2xl bg-gradient-to-br from-[#1C1E18] to-[#121310] border border-white/10 hover:border-[#B7FF35]/40 transition-all cursor-pointer group shadow-lg"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#B7FF35]">
                      {game.categoryLabel}
                    </span>
                    <span className="text-xs text-neutral-400 font-mono">{game.estimatedTime}</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-white group-hover:text-[#B7FF35] transition-colors mb-2">
                    {game.title}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2 mb-6">
                    {game.tagline}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-[11px] font-mono text-neutral-500">{game.controlsSummary}</span>
                    <span className="text-xs font-bold text-white group-hover:text-[#B7FF35] transition-colors flex items-center gap-1">
                      Play Now →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
