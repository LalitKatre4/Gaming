import React from 'react';
import { Play, Sparkles, ShieldCheck, Zap } from 'lucide-react';

interface HeroSectionProps {
  onPlayFeatured: () => void;
  totalGames: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onPlayFeatured, totalGames }) => {
  return (
    <section className="relative overflow-hidden pt-10 pb-12 sm:pt-14 sm:pb-16 border-b border-white/10 bg-radial from-[#1A1D16] to-[#10110F]">
      {/* Subtle ambient neon glow elements */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-[#B7FF35]/10 blur-[130px] rounded-full" 
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute top-12 right-10 w-[300px] h-[300px] bg-[#A855F7]/10 blur-[110px] rounded-full" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Unboxed natural editorial subtitle (Zero-Pill discipline) */}
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#B7FF35] mb-4">
          <span className="flex items-center gap-1.5 uppercase tracking-wider font-semibold">
            <Zap className="w-3.5 h-3.5 fill-current" /> Instant Arcade Matrix
          </span>
          <span aria-hidden="true" className="text-neutral-600">·</span>
          <span className="text-neutral-400">Version 2.0 Free Edition</span>
        </div>

        {/* Primary Hero Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.08] text-balance">
          Play instantly. <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B7FF35] via-[#d4ff75] to-[#A855F7]">
            No downloads.
          </span>
        </h1>

        {/* Hero description */}
        <p className="mt-5 text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          Zero install times, zero account friction. Eight precision-crafted arcade, reflex,
          puzzle, and brain mini-games engineered for immediate gameplay on desktop and mobile.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onPlayFeatured}
            className="px-7 py-3.5 bg-[#B7FF35] hover:bg-[#a6ec27] text-black font-bold text-sm rounded-xl flex items-center gap-2.5 shadow-[0_0_24px_rgba(183,255,53,0.35)] transition-all transform active:scale-95"
          >
            <Play className="w-4 h-4 fill-black" />
            <span>Play Featured Now</span>
          </button>
          <a
            href="#all-games"
            className="px-6 py-3.5 bg-[#171816] hover:bg-[#20221E] text-neutral-200 font-semibold text-sm rounded-xl border border-white/10 hover:border-white/20 transition-all"
          >
            Browse All {totalGames} Games
          </a>
        </div>

        {/* Feature Highlights Strip (unboxed metrics) */}
        <div className="mt-12 pt-8 border-t border-white/5 grid grid-cols-2 sm:grid-cols-3 max-w-2xl mx-auto gap-4 text-center">
          <div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">0s</div>
            <div className="text-xs text-neutral-400 mt-0.5">Load & Play Latency</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-[#B7FF35] tabular-nums">{totalGames} Games</div>
            <div className="text-xs text-neutral-400 mt-0.5">Original Playable Titles</div>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <div className="text-xl sm:text-2xl font-bold font-mono text-neutral-200">100% Free</div>
            <div className="text-xs text-neutral-400 mt-0.5">No Login Required</div>
          </div>
        </div>
      </div>
    </section>
  );
};
