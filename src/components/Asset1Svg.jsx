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
  const overrideCss = theme === "dark"
    ? `svg path { fill: #4d4d4d !important; stroke: #4d4d4d !important; }`
    : `svg path { fill: none !important; stroke: #000000 !important; }`;

  if (!svgMarkup) return null;

  return (
    <div className={className} style={style}>
      <style>{overrideCss}</style>
      <div dangerouslySetInnerHTML={{ __html: svgMarkup }} />
    </div>
  );
}
