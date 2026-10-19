import React from 'react';
import { ShieldCheck, HardDrive, Cookie, ExternalLink, Mail, MessageSquare, Info } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#B7FF35] mb-2 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" /> Privacy & Data Transparency
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-2 text-xs font-mono text-neutral-400">
          Last revised: October 2026 · Plain language commitment
        </p>
      </div>

      <div className="space-y-6 text-neutral-300 text-xs sm:text-sm leading-relaxed">
        {/* Section 1: Data Collection & Gameplay */}
        <div className="p-6 rounded-2xl bg-[#171816] border border-white/10">
          <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <Info className="w-4 h-4 text-[#B7FF35]" /> 1. Information Collection & How You Play
          </h2>
          <p className="mb-2">
            Playing games on GameZone requires no user registration, account sign-in, subscription, or payment details. You can play any of our eight mini-games immediately without creating a profile.
          </p>
          <p>
            When you voluntarily submit a message through our Contact page, we collect the details you provide (your name, email address, inquiry topic, and message text) solely to process and respond to your communication.
          </p>
        </div>

        {/* Section 2: LocalStorage Disclosures */}
        <div className="p-6 rounded-2xl bg-[#171816] border border-white/10">
          <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-[#B7FF35]" /> 2. Browser LocalStorage Disclosures
          </h2>
          <p className="mb-2">
            GameZone uses standard HTML5 LocalStorage on your local device to deliver persistent game features without requiring a backend database account:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-neutral-400 mb-3">
            <li><strong>Best Scores:</strong> Highest scores, streaks, and completion times recorded in each mini-game.</li>
            <li><strong>Favorites:</strong> An array of game identifiers you have favorited with the heart icon.</li>
            <li><strong>Recently Played:</strong> Recent games played on this specific browser session.</li>
            <li><strong>Sound Preferences:</strong> Audio mute or unmuted state preference.</li>
          </ul>
          <p className="text-neutral-400">
            This data is stored strictly on your device and is never uploaded to an analytics database or central user profile server. You can clear or reset this data at any time via your browser’s cache and site data settings.
          </p>
        </div>

        {/* Section 3: Current vs. Future Advertising (AdSense Preparation) */}
        <div className="p-6 rounded-2xl bg-[#171816] border border-white/10">
          <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <Cookie className="w-4 h-4 text-[#B7FF35]" /> 3. Current & Future Advertising (Google AdSense Preparation)
          </h2>
          <div className="p-3 rounded-xl bg-[#121311] border border-white/5 mb-3 text-xs text-neutral-400">
            <strong className="text-neutral-200">Current Status:</strong> Advertising slots on GameZone are currently disabled architectural placeholders (<code className="text-[#B7FF35] font-mono text-[11px]">enabled=false</code>). We do not claim active Google AdSense certification, and no third-party ad network scripts or tracking cookies are currently executed.
          </div>
          <p className="mb-2">
            GameZone is designed for future monetization through third-party advertising partners, including Google AdSense. When advertising integration is activated:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-neutral-400">
            <li>
              Third-party vendors, including Google, may use cookies, web beacons, or similar technologies to serve ads based on a user’s prior visits to this website or other websites across the Internet.
            </li>
            <li>
              Google’s use of advertising cookies enables it and its partners to serve ads to users based on their visit to GameZone and/or other sites on the Internet.
            </li>
            <li>
              All advertising implementation will adhere to applicable Google publisher policies, industry standards, and relevant regional privacy and consent requirements.
            </li>
          </ul>
        </div>

        {/* Section 4: Advertising Controls & User Choices */}
        <div className="p-6 rounded-2xl bg-[#171816] border border-white/10">
          <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-[#B7FF35]" /> 4. Managing Ad Preferences & Opt-Out Resources
          </h2>
          <p className="mb-3">
            Users have direct control over how their data is used for personalized advertising across the web:
          </p>
          <ul className="space-y-2 text-neutral-300">
            <li className="flex items-start gap-2">
              <span className="text-[#B7FF35] font-mono">▸</span>
              <span>
                <strong>Google Ads Settings:</strong> You can customize your ad preferences or opt out of personalized advertising by visiting{' '}
                <a
                  href="https://adssettings.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B7FF35] hover:underline inline-flex items-center gap-1 font-mono"
                >
                  adssettings.google.com <ExternalLink className="w-3 h-3 inline" />
                </a>{' '}
                or Google My Ad Center at{' '}
                <a
                  href="https://myadcenter.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B7FF35] hover:underline inline-flex items-center gap-1 font-mono"
                >
                  myadcenter.google.com <ExternalLink className="w-3 h-3 inline" />
                </a>.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#B7FF35] font-mono">▸</span>
              <span>
                <strong>How Google Uses Information:</strong> To understand how Google uses data when you use partner sites, visit{' '}
                <a
                  href="https://policies.google.com/technologies/partner-sites"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B7FF35] hover:underline inline-flex items-center gap-1 font-mono"
                >
                  policies.google.com/technologies/partner-sites <ExternalLink className="w-3 h-3 inline" />
                </a>.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#B7FF35] font-mono">▸</span>
              <span>
                <strong>Industry Opt-Out Tools:</strong> You can also opt out of interest-based advertising from participating networks via the Network Advertising Initiative at{' '}
                <a
                  href="https://optout.networkadvertising.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-white underline inline-flex items-center gap-1 font-mono"
                >
                  optout.networkadvertising.org <ExternalLink className="w-3 h-3 inline" />
                </a>{' '}
                and the Digital Advertising Alliance at{' '}
                <a
                  href="https://optout.aboutads.info/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-white underline inline-flex items-center gap-1 font-mono"
                >
                  optout.aboutads.info <ExternalLink className="w-3 h-3 inline" />
                </a>.
              </span>
            </li>
          </ul>
        </div>

        {/* Section 5: Third-Party Processors & External Services */}
        <div className="p-6 rounded-2xl bg-[#171816] border border-white/10">
          <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#B7FF35]" /> 5. External Services & Communications
          </h2>
          <p className="mb-2">
            To deliver website functions efficiently without a custom server backend, GameZone relies on specific third-party utilities:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-neutral-400">
            <li>
              <strong>Contact Delivery (FormSubmit):</strong> Enquiries submitted through the Contact page are dispatched via FormSubmit (formsubmit.co) directly to our administrative email inbox.
            </li>
            <li>
              <strong>Web Fonts (Google Fonts):</strong> Modern typography assets are served via Google’s CDN without collecting personal user profiles.
            </li>
            <li>
              <strong>Web Audio:</strong> Sound effects are synthesized client-side via the browser’s Web Audio API and do not require external audio downloads or network tracking.
            </li>
          </ul>
        </div>

        {/* Section 6: Policy Changes & Contact Details */}
        <div className="p-6 rounded-2xl bg-[#171816] border border-white/10">
          <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#B7FF35]" /> 6. Changes to this Policy & Contact
          </h2>
          <p className="mb-2">
            We review and update this Privacy Policy periodically to reflect technological changes, future monetization implementations, or legal requirements. When updates occur, the revision date at the top of this page will be updated accordingly.
          </p>
          <p>
            For questions or requests concerning this Privacy Policy, please reach out using the inquiry form on our Contact page.
          </p>
        </div>
      </div>
    </div>
  );
};
