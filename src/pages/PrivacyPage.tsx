import React from 'react';
import { ShieldCheck, HardDrive, Cookie, ExternalLink, Mail, MessageSquare, Info, CheckCircle2 } from 'lucide-react';

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
          Last updated: October 2026 · Compliant with Google AdSense Publisher Requirements
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
          <p className="mb-2">
            GameZone does not deploy third-party analytics platforms (such as Google Analytics) or covert tracking pixels to monitor individual browsing behavior.
          </p>
          <p>
            When you voluntarily submit a message through our Contact page, we collect only the information you enter (your name, email address, inquiry topic, and message text) solely to process and respond to your communication.
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

        {/* Section 3: Google AdSense, Cookies & Third-Party Advertising */}
        <div className="p-6 rounded-2xl bg-[#171816] border border-white/10">
          <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <Cookie className="w-4 h-4 text-[#B7FF35]" /> 3. Google AdSense & Third-Party Advertising Cookies
          </h2>
          <p className="mb-3">
            GameZone integrates with Google AdSense for website monetization. To comply with Google’s official publisher policies, we provide the following required disclosures regarding advertising technologies and cookies:
          </p>
          <ul className="space-y-2 text-neutral-300 mb-4">
            <li className="flex items-start gap-2">
              <span className="text-[#B7FF35] font-mono">▸</span>
              <span>
                <strong>Third-Party Vendor Cookies:</strong> Third-party vendors, including Google, use cookies to serve ads based on a user’s prior visits to this website or other websites on the Internet.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#B7FF35] font-mono">▸</span>
              <span>
                <strong>Advertising Cookies:</strong> Google’s use of advertising cookies enables it and its partners to serve ads to our users based on their visit to GameZone and/or other sites across the Internet.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#B7FF35] font-mono">▸</span>
              <span>
                <strong>Ad Serving & Measurement:</strong> Advertising technologies (including cookies and web beacons) may be used to serve, personalize, and measure the effectiveness of advertisements.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#B7FF35] font-mono">▸</span>
              <span>
                <strong>Current Verification State:</strong> The Google AdSense site verification script is placed in our site header for publisher review. Ad units remain inactive placeholders until formal verification and approval is granted.
              </span>
            </li>
          </ul>
        </div>

        {/* Section 4: Advertising Controls & User Opt-Out Choices */}
        <div className="p-6 rounded-2xl bg-[#171816] border border-white/10">
          <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-[#B7FF35]" /> 4. Managing Ad Personalization & Opt-Out Options
          </h2>
          <p className="mb-3">
            Users have full control over how their data is used for personalized advertising across the web:
          </p>
          <ul className="space-y-2.5 text-neutral-300">
            <li className="flex items-start gap-2">
              <span className="text-[#B7FF35] font-mono">▸</span>
              <span>
                <strong>Google Ads Settings:</strong> Users may opt out of personalized advertising by visiting{' '}
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
                <strong>How Google Uses Data:</strong> To learn how Google uses information from sites or apps that use its services, please review{' '}
                <a
                  href="https://policies.google.com/technologies/partner-sites"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B7FF35] hover:underline inline-flex items-center gap-1 font-mono"
                >
                  policies.google.com/technologies/partner-sites <ExternalLink className="w-3 h-3 inline" />
                </a>{' '}
                and Google’s advertising technologies guide at{' '}
                <a
                  href="https://policies.google.com/technologies/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B7FF35] hover:underline inline-flex items-center gap-1 font-mono"
                >
                  policies.google.com/technologies/ads <ExternalLink className="w-3 h-3 inline" />
                </a>.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#B7FF35] font-mono">▸</span>
              <span>
                <strong>Third-Party Vendor Opt-Out:</strong> Alternatively, users can opt out of a third-party vendor's use of cookies for personalized advertising by visiting{' '}
                <a
                  href="https://www.aboutads.info/choices/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-300 hover:text-white underline inline-flex items-center gap-1 font-mono"
                >
                  www.aboutads.info <ExternalLink className="w-3 h-3 inline" />
                </a>{' '}
                or the Network Advertising Initiative (NAI) opt-out tool at{' '}
                <a
                  href="https://optout.networkadvertising.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-300 hover:text-white underline inline-flex items-center gap-1 font-mono"
                >
                  optout.networkadvertising.org <ExternalLink className="w-3 h-3 inline" />
                </a>.
              </span>
            </li>
          </ul>
        </div>

        {/* Section 5: Consent Requirements & Browser Controls */}
        <div className="p-6 rounded-2xl bg-[#171816] border border-white/10">
          <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#B7FF35]" /> 5. Consent Information & Browser Cookie Controls
          </h2>
          <p className="mb-2">
            In compliance with applicable legal frameworks (such as the GDPR and ePrivacy Directive in the European Economic Area, UK data privacy laws, and applicable US state privacy statutes), advertising cookies and personalized ad serving will be governed by user consent where required by law upon full activation of live advertising.
          </p>
          <p className="mb-2">
            Please note: GameZone is currently in the verification stage with ad units disabled. Once live advertising is deployed, consent mechanisms will be implemented in accordance with Google’s EU User Consent Policy and applicable partner requirements.
          </p>
          <p className="text-neutral-400">
            You can also configure your web browser to block, alert, or delete cookies at any time via your browser settings (e.g. Chrome, Firefox, Safari, Edge). Disabling browser cookies does not prevent you from enjoying any of GameZone’s games.
          </p>
        </div>

        {/* Section 6: Third-Party Processors & External Services */}
        <div className="p-6 rounded-2xl bg-[#171816] border border-white/10">
          <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#B7FF35]" /> 6. External Services & Communications
          </h2>
          <p className="mb-2">
            To deliver website functions efficiently without a custom server backend, GameZone relies on specific third-party utilities:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-neutral-400">
            <li>
              <strong>Contact Delivery (FormSubmit):</strong> Enquiries submitted through the Contact page are dispatched securely via FormSubmit (formsubmit.co) directly to our administrative email inbox.
            </li>
            <li>
              <strong>Web Fonts (Google Fonts):</strong> Modern typography assets are served via Google’s CDN without collecting personal user profiles.
            </li>
            <li>
              <strong>Web Audio:</strong> Sound effects are synthesized client-side via the browser’s Web Audio API and do not require external audio downloads or network tracking.
            </li>
          </ul>
        </div>

        {/* Section 7: Policy Changes & Contact Details */}
        <div className="p-6 rounded-2xl bg-[#171816] border border-white/10">
          <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#B7FF35]" /> 7. Policy Changes & Contact Details
          </h2>
          <p className="mb-2">
            We review and update this Privacy Policy periodically to maintain compliance with Google AdSense guidelines, technological changes, and legal requirements. When updates occur, the revision date at the top of this page will be updated accordingly.
          </p>
          <p>
            For questions or requests concerning this Privacy Policy, please reach out using the inquiry form on our Contact page.
          </p>
        </div>
      </div>
    </div>
  );
};
