import React from 'react';

export type AdPlacement = 
  | 'header-leaderboard'
  | 'game-bottom-leaderboard'
  | 'sidebar-unit'
  | 'home-mid-banner'
  | 'footer-banner';

export interface AdSlotProps {
  placementId: AdPlacement;
  format?: 'leaderboard' | 'rectangle' | 'responsive' | 'banner';
  className?: string;
  enabled?: boolean; // Default false as required by specification
}

/**
 * Reusable, disabled-by-default AdSlot component prepared for future Google AdSense integration.
 * - Reserves exact layout space to prevent Cumulative Layout Shifts (CLS).
 * - Clearly identifies placement slots without misleading content or click targets.
 * - Does not simulate ad clicks or claim AdSense approval.
 */
export const AdSlot: React.FC<AdSlotProps> = ({
  placementId,
  format = 'responsive',
  className = '',
  enabled = false,
}) => {
  // If in future enabled is set to true and an AdSense publisher ID is provided:
  if (enabled) {
    return (
      <div 
        id={`ad-${placementId}`}
        className={`w-full overflow-hidden transition-all duration-200 ${className}`}
        aria-label="Advertisement"
      >
        {/* Placeholder container where window.adsbygoogle would mount */}
        <ins
          className="adsbygoogle"
          style={{ display: 'block', textAlign: 'center' }}
          data-ad-layout="in-article"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Disabled-by-default state with reserved spatial geometry and honest identifier
  const sizeClasses = {
    leaderboard: 'min-h-[90px] max-w-[728px]',
    rectangle: 'min-h-[250px] max-w-[300px]',
    banner: 'min-h-[100px] max-w-4xl',
    responsive: 'min-h-[90px] w-full',
  }[format];

  return (
    <aside
      aria-label={`Reserved sponsor space: ${placementId}`}
      className={`mx-auto w-full ${sizeClasses} my-6 rounded-lg border border-dashed border-white/10 bg-[#141513]/60 p-4 flex flex-col items-center justify-center text-center transition-opacity select-none ${className}`}
    >
      <div className="flex items-center gap-2 text-xs tracking-wider uppercase text-neutral-500 font-mono">
        <span>Sponsor Placement</span>
        <span aria-hidden="true">·</span>
        <span className="text-neutral-400 font-medium">{placementId}</span>
        <span aria-hidden="true">·</span>
        <span>Inactive</span>
      </div>
      <p className="mt-1 text-[11px] text-neutral-600 max-w-sm">
        Reserved layout area for non-intrusive banner ads. Clean zero-shift container.
      </p>
    </aside>
  );
};
