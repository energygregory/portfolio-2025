import { useEffect, useRef, useState } from "react";
import { animate, svg, stagger } from "animejs";

export default function AnimatedAsset1({ className = "", style = {} }) {
  const containerRef = useRef(null);
  const [svgContent, setSvgContent] = useState(null);

  // Fetch the SVG content
  useEffect(() => {
    fetch("/LOGOS/Asset 1.svg")
      .then((res) => res.text())
      .then((text) => {
        // Parse the SVG and modify paths for stroke animation
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "image/svg+xml");
        const svgEl = doc.querySelector("svg");
        
        if (svgEl) {
          // Set viewBox and class
          svgEl.setAttribute("class", "w-full h-full");
          svgEl.setAttribute("preserveAspectRatio", "xMidYMid slice");
          
          // Modify all paths for stroke animation
          const paths = svgEl.querySelectorAll("path");
          paths.forEach((path) => {
            // Get original fill color or use white
            const originalFill = path.getAttribute("fill") || "#fff";
            // Remove fill, add stroke
            path.setAttribute("fill", "none");
            path.setAttribute("stroke", originalFill === "none" ? "#fff" : originalFill);
            path.setAttribute("stroke-width", "1");
            path.setAttribute("stroke-linecap", "round");
            path.setAttribute("stroke-linejoin", "round");
          });
          
          setSvgContent(svgEl.outerHTML);
        }
      })
      .catch((err) => console.error("Failed to load Asset 1.svg:", err));
  }, []);

  // Animate after SVG is loaded
  useEffect(() => {
    if (!containerRef.current || !svgContent) return;

    // Get all path elements in the SVG
    const paths = containerRef.current.querySelectorAll("path");

    // Create drawable proxies for each path
    const drawables = Array.from(paths).map(
      (path) => svg.createDrawable(path)[0]
    );

    // Animate the draw property - VERY FAST version
    animate(drawables, {
      draw: ["0 0", "0 1", "1 1"],
      ease: "inOutQuad",
      duration: 300,
      delay: stagger(5),
      loop: true,
      loopDelay: 200,
    });
  }, [svgContent]);

  return (
    <div 
      ref={containerRef} 
      className={className} 
      style={style}
      dangerouslySetInnerHTML={svgContent ? { __html: svgContent } : undefined}
    />
  );
}
