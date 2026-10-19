import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { GameDetailPage } from './pages/GameDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { GAMES_CATALOG } from './data/games';
import { getFavorites } from './utils/storage';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterFavoritesOnly, setFilterFavoritesOnly] = useState<boolean>(false);
  const [favoritesCount, setFavoritesCount] = useState<number>(0);

  // Sync favorites count
  const refreshFavorites = () => {
    setFavoritesCount(getFavorites().length);
  };

  useEffect(() => {
    refreshFavorites();
    window.addEventListener('gamezone:favorites-changed', refreshFavorites);
    return () => {
      window.removeEventListener('gamezone:favorites-changed', refreshFavorites);
    };
  }, []);

  // Browser navigation popstate listener (back/forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update dynamic SEO titles & meta descriptions on route change
  useEffect(() => {
    let pageTitle = 'GameZone – Play Instantly. No Downloads.';
    let pageDesc = 'Play instant free browser games online. No downloads, zero installs. Featuring Snake, 2048, Memory Match, Tic-Tac-Toe, Typing Speed, and more.';

    if (currentPath.startsWith('/games/')) {
      const gameId = currentPath.replace('/games/', '').split('/')[0];
      const game = GAMES_CATALOG.find((g) => g.id === gameId);
      if (game) {
        pageTitle = `${game.title} – Free Instant Game | GameZone`;
        pageDesc = `${game.tagline} Play ${game.title} immediately in your browser with zero installs and high score tracking.`;
      }
    } else if (currentPath === '/about') {
      pageTitle = 'About GameZone – Instant Browser Games Architecture';
      pageDesc = 'Learn about GameZone: lightweight, privacy-friendly browser games engineered in TypeScript for instant play with no downloads.';
    } else if (currentPath === '/contact') {
      pageTitle = 'Contact & Support – GameZone';
      pageDesc = 'Send feedback, report glitches, or suggest new mini-games for the GameZone instant arcade.';
    } else if (currentPath === '/privacy') {
      pageTitle = 'Privacy Policy – GameZone';
      pageDesc = 'GameZone privacy policy: transparent local storage disclosures, communications handling, and future advertising readiness.';
    } else if (currentPath === '/terms') {
      pageTitle = 'Terms of Service – GameZone';
      pageDesc = 'Terms of service and fair play guidelines for GameZone web entertainment.';
    }

    document.title = pageTitle;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', pageDesc);
    }
  }, [currentPath]);

  // Client-side router navigation helper
  const navigate = (newPath: string) => {
    if (newPath !== currentPath) {
      window.history.pushState({}, '', newPath);
      setCurrentPath(newPath);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Render view by route
  const renderRouteView = () => {
    // 1. Game Detail Route (/games/:id)
    if (currentPath.startsWith('/games/')) {
      const gameId = currentPath.replace('/games/', '').split('/')[0];
      const game = GAMES_CATALOG.find((g) => g.id === gameId);

      if (game) {
        return <GameDetailPage game={game} onNavigate={navigate} />;
      }

      // Game Not Found Fallback
      return (
        <div className="max-w-md mx-auto my-20 p-8 rounded-2xl bg-[#171816] border border-white/10 text-center">
          <h2 className="text-xl font-bold text-white mb-2">Game Not Found</h2>
          <p className="text-xs text-neutral-400 mb-6">
            The requested game does not exist or has been relocated.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-5 py-2.5 bg-[#B7FF35] text-black font-semibold text-xs rounded-xl"
          >
            Return to All Games
          </button>
        </div>
      );
    }

    // 2. Informational Pages
    if (currentPath === '/about') {
      return <AboutPage onNavigate={navigate} />;
    }
    if (currentPath === '/contact') {
      return <ContactPage />;
    }
    if (currentPath === '/privacy') {
      return <PrivacyPage />;
    }
    if (currentPath === '/terms') {
      return <TermsPage />;
    }

    // 3. Default Home Page
    return (
      <HomePage
        onNavigate={navigate}
        searchQuery={searchQuery}
        onClearSearch={() => setSearchQuery('')}
        filterFavoritesOnly={filterFavoritesOnly}
        onToggleFavoritesFilter={() => setFilterFavoritesOnly((prev) => !prev)}
      />
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#10110F] text-slate-100 selection:bg-[#B7FF35] selection:text-black">
      {/* Sticky Navigation */}
      <Navbar
        currentPath={currentPath}
        onNavigate={navigate}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        favoritesCount={favoritesCount}
        filterFavoritesOnly={filterFavoritesOnly}
        onToggleFavoritesFilter={() => setFilterFavoritesOnly((prev) => !prev)}
      />

      {/* Main Content Area */}
      <div className="flex-1">
        {renderRouteView()}
      </div>

      {/* Footer */}
      <Footer onNavigate={navigate} />
    </div>
  );
}
