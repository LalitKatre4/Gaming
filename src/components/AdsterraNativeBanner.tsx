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

    const scriptSrc = 'https://bauval.org/21/72d048b4a022dc8a96cda3e044790928';

    // Prevent duplicate script injection during React re-renders
    if (container.querySelector(`script[src="${scriptSrc}"]`)) {
      return;
    }

    // Verify container exists in DOM before appending the script
    const target = document.getElementById('container-72d048b4a022dc8a96cda3e044790928');
    if (target) {
      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = scriptSrc;
      container.appendChild(script);
    }

    return () => {
      const script = container.querySelector(`script[src="${scriptSrc}"]`);
      if (script) {
        script.remove();
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
      >
        {/* Container rendered directly in React JSX */}
        <div id="container-72d048b4a022dc8a96cda3e044790928" />
      </div>
    </aside>
  );
};
