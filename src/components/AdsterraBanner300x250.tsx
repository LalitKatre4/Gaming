import React, { useEffect, useRef } from 'react';

/**
 * Adsterra 300x250 Iframe Banner Integration
 * Key: 1d37e6f4fcafd623c40c68329065cbd2
 * Script URL: https://bauval.org/22/1d37e6f4fcafd623c40c68329065cbd2
 */
export const AdsterraBanner300x250: React.FC<{ className?: string }> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scriptSrc = 'https://bauval.org/22/1d37e6f4fcafd623c40c68329065cbd2';

    // Prevent duplicate script injection during React re-renders or game navigation
    if (container.querySelector(`script[src="${scriptSrc}"]`)) {
      return;
    }

    // Set atOptions on window object following exact Adsterra specifications
    (window as unknown as { atOptions: Record<string, unknown> }).atOptions = {
      key: '1d37e6f4fcafd623c40c68329065cbd2',
      format: 'iframe',
      height: 250,
      width: 300,
      params: {},
    };

    // Load the exact Adsterra script directly without custom nested iframes
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = scriptSrc;
    container.appendChild(script);

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <aside
      aria-label="Sponsored advertisement"
      className={`mx-auto flex flex-col items-center justify-center my-8 ${className}`}
    >
      <div className="flex items-center gap-2 text-[11px] tracking-wider uppercase text-neutral-500 font-mono mb-2">
        <span>Sponsored</span>
      </div>
      <div
        ref={containerRef}
        className="w-[300px] h-[250px] min-w-[300px] min-h-[250px] max-w-full rounded-xl overflow-hidden bg-[#141513]/60 border border-white/10 flex items-center justify-center shadow-sm"
      />
    </aside>
  );
};
