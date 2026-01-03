import { useEffect, useState } from "react";

export default function Asset1Svg({ theme = "dark", style = {}, className = "" }) {
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
    '.asset1-svg-container svg path, .asset1-svg-container svg rect, .asset1-svg-container svg circle, .asset1-svg-container svg polygon, .asset1-svg-container svg polyline, .asset1-svg-container svg ellipse {',
    '  fill: #4d4d4d !important;',
    '  stroke: none !important;',
    '  opacity: 1 !important;',
    '}',
    '@media (max-width: 640px) {',
    '  .asset1-svg-container svg path, .asset1-svg-container svg rect, .asset1-svg-container svg circle, .asset1-svg-container svg polygon, .asset1-svg-container svg polyline, .asset1-svg-container svg ellipse {',
    '    fill: #4d4d4d !important;',
    '  }',
    '}',
  ].join('\n');

  const lightCss = [
    '.asset1-svg-container svg path, .asset1-svg-container svg rect, .asset1-svg-container svg circle, .asset1-svg-container svg polygon, .asset1-svg-container svg polyline, .asset1-svg-container svg ellipse {',
    '  fill: none !important;',
    '  stroke: #000000 !important;',
    '  stroke-width: 0.25px !important;',
    '}',
  ].join('\n');

  const overrideCss = theme === "dark" ? darkCss : lightCss;

  if (!svgMarkup) return null;

  return (
    <div className={`asset1-svg-container ${className}`} style={style}>
      <style>{overrideCss}</style>
      <div dangerouslySetInnerHTML={{ __html: svgMarkup }} />
    </div>
  );
}
