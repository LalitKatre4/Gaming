import React from 'react';
import { Gamepad2, Zap, Shield, Sparkles, Cpu, Layers } from 'lucide-react';

export const AboutPage: React.FC<{ onNavigate: (route: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#B7FF35] mb-2 uppercase tracking-wider">
          <Gamepad2 className="w-4 h-4" /> About GameZone
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Gaming built for the web. <br />
          <span className="text-[#B7FF35]">Instant. Lightweight. Free.</span>
        </h1>
        <p className="mt-4 text-neutral-400 text-sm sm:text-base max-w-xl mx-auto">
          We built GameZone with a simple conviction: you shouldn't need a 50GB installer, a mandatory account login, or invasive launchers just to play a quick game.
        </p>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 rounded-2xl bg-[#171816] border border-white/10">
          <div className="w-10 h-10 rounded-xl bg-[#B7FF35]/10 border border-[#B7FF35]/30 flex items-center justify-center text-[#B7FF35] mb-4">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Zero Install Latency</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Every game is built directly in TypeScript and rendered with hardware-accelerated HTML5 Canvas and CSS compositor pipelines for immediate zero-second startup.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#171816] border border-white/10">
          <div className="w-10 h-10 rounded-xl bg-[#A855F7]/10 border border-[#A855F7]/30 flex items-center justify-center text-[#A855F7] mb-4">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Privacy & Local Storage</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Your best scores, session stats, and favorite games live securely in your browser's local storage. No creepy tracking pixels or sold profile data.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#171816] border border-white/10">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-4">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">100% Mobile Ready</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Whether you are on a high-refresh gaming monitor with mechanical keys or a touch smartphone on a commute, every game features tailored touch and keyboard ergonomics.
          </p>
        </div>
      </div>

      {/* Story section */}
      <div className="p-8 rounded-2xl bg-[#171816] border border-white/10 mb-12">
        <h2 className="text-xl font-bold text-white mb-3">Our Core Philosophy</h2>
        <div className="space-y-4 text-xs sm:text-sm text-neutral-300 leading-relaxed">
          <p>
            The golden age of browser gaming proved that mechanics, responsiveness, and instant gratification trump massive download sizes. GameZone honors that tradition by providing clean, responsive, and thoughtfully designed mini-games.
          </p>
          <p>
            From algorithmic minimax logic in our Tic-Tac-Toe AI to high-frequency reaction timers benchmarked to the exact millisecond, each title has been crafted from scratch with care.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <button
          onClick={() => onNavigate('/')}
          className="px-6 py-3 bg-[#B7FF35] hover:bg-[#a6ec27] text-black font-bold text-sm rounded-xl transition-all shadow-md"
        >
          Explore All Games
        </button>
      </div>
    </div>
  );
};
