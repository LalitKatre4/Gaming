import React from 'react';
import { FileText, CheckCircle } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#B7FF35] mb-2 uppercase tracking-wider">
          <FileText className="w-4 h-4" /> Legal Terms
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Terms of Service
        </h1>
        <p className="mt-2 text-xs font-mono text-neutral-400">
          Last revised: October 2026 · Standard terms for web entertainment
        </p>
      </div>

      <div className="space-y-6 text-neutral-300 text-xs sm:text-sm leading-relaxed">
        <div className="p-6 rounded-2xl bg-[#171816] border border-white/10">
          <h2 className="text-base font-bold text-white mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or playing games on GameZone, you agree to comply with and be bound by these Terms of Service. If you do not agree with any part of these terms, please discontinue using the website.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#171816] border border-white/10">
          <h2 className="text-base font-bold text-white mb-2">2. Permitted Use & Entertainment Purpose</h2>
          <p>
            All games and interactive features on GameZone are provided strictly for personal, non-commercial entertainment and cognitive recreation. You agree not to reverse engineer, disrupt, overload, or launch automated denial-of-service or scraping tools against the service.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#171816] border border-white/10">
          <h2 className="text-base font-bold text-white mb-2">3. Intellectual Property</h2>
          <p>
            The GameZone brand, styling, code architecture, and mini-game implementations are the intellectual property of the GameZone project authors. Classic game rules (such as Tic-Tac-Toe, Rock Paper Scissors, and Snake mechanics) are in the public domain; their respective implementations on GameZone are original works.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#171816] border border-white/10">
          <h2 className="text-base font-bold text-white mb-2">4. Disclaimers & Limitation of Liability</h2>
          <p>
            GameZone is provided on an "as is" and "as available" basis without warranties of any kind. We make no guarantee that the service will remain uninterrupted, bug-free, or compatible with obsolete browsers. High scores stored in browser LocalStorage may be cleared if the browser cache is flushed.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#171816] border border-white/10">
          <h2 className="text-base font-bold text-white mb-2">5. Responsible Gaming</h2>
          <p>
            While our mini-games are casual, lighthearted, and do not involve real-money gambling, we encourage taking regular screen breaks, practicing good ergonomic posture, and maintaining balanced digital screen time habits.
          </p>
        </div>
      </div>
    </div>
  );
};
