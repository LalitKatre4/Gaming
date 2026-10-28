import React, { useEffect, useRef } from 'react';

/**
 * Adsterra Native Banner Integration
 * Unit ID / Container: container-72d048b4a022dc8a96cda3e044790928
 * Script URL: https://bauval.org/21/72d048b4a022dc8a96cda3e044790928
 */
export const AdsterraNativeBanner: React.FC<{ className?: string }> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear previous children on re-render to avoid duplicates
    container.innerHTML = '';

    // Create the required Adsterra target container div
    const adTarget = document.createElement('div');
    adTarget.id = 'container-72d048b4a022dc8a96cda3e044790928';
    container.appendChild(adTarget);

    // Create and append the exact Adsterra script
    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = 'https://bauval.org/21/72d048b4a022dc8a96cda3e044790928';
    container.appendChild(script);

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <aside
      aria-label="Sponsored content"
      className={`w-full max-w-4xl mx-auto my-10 ${className}`}
    >
      <div className="flex items-center gap-2 text-[11px] tracking-wider uppercase text-neutral-500 font-mono mb-2">
        <span>Sponsored Recommendations</span>
      </div>
      <div
        ref={containerRef}
        className="w-full min-h-[110px] rounded-xl bg-[#141513]/60 border border-white/10 p-3 overflow-hidden flex flex-col items-center justify-center text-center"
      />
    </aside>
  );
};
