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

  // Theme styles: dark = fill #4d4d4d, light = stroke black, no fill
  const darkCss = [
    'svg path, svg rect, svg circle, svg polygon, svg polyline, svg ellipse {',
    '  fill: #4d4d4d !important;',
    '  stroke: none !important;',
    '}',
  ].join('\n');

  const lightCss = [
    'svg path, svg rect, svg circle, svg polygon, svg polyline, svg ellipse {',
    '  fill: none !important;',
    '  stroke: #000000 !important;',
    '  stroke-width: 0.05px !important;',
    '}',
  ].join('\n');

  const overrideCss = theme === "dark" ? darkCss : lightCss;

  if (!svgMarkup) return null;

  return (
    <div className={className} style={style}>
      <style>{overrideCss}</style>
      <div dangerouslySetInnerHTML={{ __html: svgMarkup }} />
    </div>
  );
}
