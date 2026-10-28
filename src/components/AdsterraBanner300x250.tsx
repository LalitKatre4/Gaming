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

    // Reset container to avoid duplicate iframes on navigation or re-render
    container.innerHTML = '';

    const iframe = document.createElement('iframe');
    iframe.width = '300';
    iframe.height = '250';
    iframe.title = 'Sponsored Advertisement';
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    iframe.style.width = '300px';
    iframe.style.height = '250px';
    iframe.scrolling = 'no';
    iframe.setAttribute('loading', 'lazy');

    container.appendChild(iframe);

    // Populate the iframe with the exact Adsterra configuration and script
    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (doc) {
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <style>
              body {
                margin: 0;
                padding: 0;
                overflow: hidden;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: transparent;
              }
            </style>
          </head>
          <body>
            <script type="text/javascript">
              atOptions = {
                'key' : '1d37e6f4fcafd623c40c68329065cbd2',
                'format' : 'iframe',
                'height' : 250,
                'width' : 300,
                'params' : {}
              };
            </script>
            <script type="text/javascript" src="https://bauval.org/22/1d37e6f4fcafd623c40c68329065cbd2"></script>
          </body>
        </html>
      `);
      doc.close();
    }

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
