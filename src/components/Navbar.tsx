import React, { useState } from 'react';
import { Search, Heart, Volume2, VolumeX, Menu, X, Gamepad2 } from 'lucide-react';
import { sounds } from '../utils/audio';

interface NavbarProps {
  currentPath: string;
  onNavigate: (route: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  favoritesCount: number;
  filterFavoritesOnly: boolean;
  onToggleFavoritesFilter: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  searchQuery,
  onSearchChange,
  favoritesCount,
  filterFavoritesOnly,
  onToggleFavoritesFilter,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(sounds.isMuted());

  const handleSoundToggle = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  const handleLinkClick = (route: string) => {
    onNavigate(route);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#10110F]/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element in display face) */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('/');
          }}
          className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0 group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#B7FF35] flex items-center justify-center text-black shadow-[0_0_12px_rgba(183,255,53,0.4)] group-hover:scale-105 transition-transform">
            <Gamepad2 className="w-5 h-5 fill-black" />
          </div>
          <span className="font-sans font-black tracking-wider">
            GAME<span className="text-[#B7FF35]">ZONE</span>
          </span>
        </a>

        {/* Zone 2: Navigation Links (Clean single-line text links) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-300">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('/');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#B7FF35] ${
              currentPath === '/' ? 'text-[#B7FF35] font-semibold' : ''
            }`}
          >
            All Games
          </a>
          <a
            href="/about"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('/about');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#B7FF35] ${
              currentPath === '/about' ? 'text-[#B7FF35] font-semibold' : ''
            }`}
          >
            About
          </a>
          <a
            href="/contact"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('/contact');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#B7FF35] ${
              currentPath === '/contact' ? 'text-[#B7FF35] font-semibold' : ''
            }`}
          >
            Contact
          </a>
          <a
            href="/privacy"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('/privacy');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#B7FF35] ${
              currentPath === '/privacy' ? 'text-[#B7FF35] font-semibold' : ''
            }`}
          >
            Privacy
          </a>
        </nav>

        {/* Zone 3: Actions & Search */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Search Input on Desktop */}
          <div className="relative hidden sm:block w-48 lg:w-60">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search 8 games..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-[#171816] text-neutral-200 text-xs rounded-xl pl-9 pr-3 py-2 border border-white/10 focus:border-[#B7FF35]/70 focus:outline-none placeholder:text-neutral-500 transition-colors"
            />
          </div>

          {/* Favorites Filter Button */}
          <button
            onClick={() => {
              onToggleFavoritesFilter();
              if (currentPath !== '/') onNavigate('/');
            }}
            title={filterFavoritesOnly ? 'Show All Games' : 'Show Favorites Only'}
            aria-label="Filter Favorites"
            className={`p-2 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-mono ${
              filterFavoritesOnly
                ? 'bg-rose-500/15 border-rose-500/50 text-rose-400'
                : 'bg-[#171816] border-white/10 text-neutral-300 hover:text-white hover:border-white/20'
            }`}
          >
            <Heart className={`w-4 h-4 ${filterFavoritesOnly ? 'fill-rose-500' : ''}`} />
            {favoritesCount > 0 && <span>{favoritesCount}</span>}
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={handleSoundToggle}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            className="p-2 rounded-xl bg-[#171816] border border-white/10 text-neutral-300 hover:text-[#B7FF35] hover:border-white/20 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-neutral-500" /> : <Volume2 className="w-4 h-4 text-[#B7FF35]" />}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-label="Toggle Navigation Menu"
            className="md:hidden p-2 rounded-xl bg-[#171816] border border-white/10 text-neutral-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#141513] px-4 pt-3 pb-6 animate-in slide-in-from-top-4 duration-150">
          <div className="mb-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-[#1A1C18] text-neutral-200 text-xs rounded-xl pl-9 pr-3 py-2.5 border border-white/10 focus:border-[#B7FF35]/70 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-2 text-sm">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('/');
              }}
              className={`px-3 py-2 rounded-lg font-medium ${
                currentPath === '/' ? 'bg-[#B7FF35]/10 text-[#B7FF35]' : 'text-neutral-300'
              }`}
            >
              All 8 Games
            </a>
            <a
              href="/about"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('/about');
              }}
              className={`px-3 py-2 rounded-lg font-medium ${
                currentPath === '/about' ? 'bg-[#B7FF35]/10 text-[#B7FF35]' : 'text-neutral-300'
              }`}
            >
              About GameZone
            </a>
            <a
              href="/contact"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('/contact');
              }}
              className={`px-3 py-2 rounded-lg font-medium ${
                currentPath === '/contact' ? 'bg-[#B7FF35]/10 text-[#B7FF35]' : 'text-neutral-300'
              }`}
            >
              Contact & Bug Reports
            </a>
            <a
              href="/privacy"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('/privacy');
              }}
              className={`px-3 py-2 rounded-lg font-medium ${
                currentPath === '/privacy' ? 'bg-[#B7FF35]/10 text-[#B7FF35]' : 'text-neutral-300'
              }`}
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('/terms');
              }}
              className={`px-3 py-2 rounded-lg font-medium ${
                currentPath === '/terms' ? 'bg-[#B7FF35]/10 text-[#B7FF35]' : 'text-neutral-300'
              }`}
            >
              Terms of Service
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
