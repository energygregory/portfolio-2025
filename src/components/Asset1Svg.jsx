import { useEffect, useState } from "react";
import DOMPurify from 'dompurify';

export default function Asset1Svg({ theme = "dark", style = {}, className = "", outlineThickness = 3 }) {
  const [svgMarkup, setSvgMarkup] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function loadSvg() {
      try {
        const res = await fetch("/LOGOS/Asset 1.svg");
        const text = await res.text();
        if (!cancelled) setSvgMarkup(text);
      } catch (e) {
        console.error("Failed to load Asset 1.svg", e);
      }
    }
    loadSvg();
    return () => { cancelled = true; };
  }, []);

    // Theme styles: dark = fill white, light = stroke black, no fill
  const darkCss = [
    // Desktop: outline only in dark mode
    '.asset1-svg-container svg path, .asset1-svg-container svg rect, .asset1-svg-container svg circle, .asset1-svg-container svg polygon, .asset1-svg-container svg polyline, .asset1-svg-container svg ellipse {',
    '  fill: none !important;',
    '  stroke: #4d4d4d !important;',
    '  stroke-width: var(--outline-width, 3px) !important;',
    '  stroke-linecap: round !important;',
    '  stroke-linejoin: round !important;',
    '  opacity: 1 !important;',
    '}',
  ].join('\n');

  const lightCss = [
    '.asset1-svg-container svg path, .asset1-svg-container svg rect, .asset1-svg-container svg circle, .asset1-svg-container svg polygon, .asset1-svg-container svg polyline, .asset1-svg-container svg ellipse {',
    '  fill: none !important;',
    '  stroke: #000000 !important;',
    '  stroke-width: var(--outline-width, 3px) !important;',
    '  stroke-linecap: round !important;',
    '  stroke-linejoin: round !important;',
    '}',
  ].join('\n');

  // Ensure the SVG scales responsively inside its container
  const responsiveCss = '\n.asset1-svg-container svg { width: 100% !important; height: auto !important; display:block !important;}\n';

  const overrideCss = theme === "dark" ? darkCss + responsiveCss : lightCss + responsiveCss;

  if (!svgMarkup) return null;

  return (
    <div className={`asset1-svg-container ${className}`} style={{ ...style, '--outline-width': `${outlineThickness}px` }}>
      <style>{overrideCss}</style>
      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(svgMarkup, { USE_PROFILES: { svg: true, svgFilters: true } }) }} />
    </div>
  );
}
