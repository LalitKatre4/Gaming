import React from 'react';
import { Gamepad2, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="mt-20 border-t border-white/10 bg-[#0C0D0B] text-neutral-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 text-lg font-bold text-white mb-3">
              <div className="w-7 h-7 rounded-lg bg-[#B7FF35] flex items-center justify-center text-black">
                <Gamepad2 className="w-4 h-4 fill-black" />
              </div>
              <span className="tracking-wider">
                GAME<span className="text-[#B7FF35]">ZONE</span>
              </span>
            </div>
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed mb-4">
              Play instantly. No downloads. GameZone is a dedicated browser gaming destination
              providing high-performance, original arcade and puzzle mini-games with zero account friction.
            </p>
            <div className="text-[11px] font-mono text-neutral-500">
              Free web application · No login needed · Built with React & TypeScript
            </div>
          </div>

          {/* Quick Games Col */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-semibold mb-3">
              Popular Games
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('/games/snake')}
                  className="hover:text-[#B7FF35] transition-colors"
                >
                  Neon Snake
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/games/2048')}
                  className="hover:text-[#B7FF35] transition-colors"
                >
                  2048 Cyber
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/games/reaction-time')}
                  className="hover:text-[#B7FF35] transition-colors"
                >
                  Reaction Benchmark
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/games/whack-a-mole')}
                  className="hover:text-[#B7FF35] transition-colors"
                >
                  Cyber Whack-a-Mole
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/games/typing-speed')}
                  className="hover:text-[#B7FF35] transition-colors"
                >
                  Typing Speed Test
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Company Col */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-semibold mb-3">
              Platform & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('/about')}
                  className="hover:text-[#B7FF35] transition-colors"
                >
                  About GameZone
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-[#B7FF35] transition-colors"
                >
                  Contact & Support
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/privacy')}
                  className="hover:text-[#B7FF35] transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/terms')}
                  className="hover:text-[#B7FF35] transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <span className="text-neutral-500 hover:text-neutral-300 cursor-default">
                  Responsible Gaming
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <div>
            © {new Date().getFullYear()} GameZone. All rights reserved. Play instantly. No downloads.
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono">
            <span>Crafted for browser gaming lovers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
