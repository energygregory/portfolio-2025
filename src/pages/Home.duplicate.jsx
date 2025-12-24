import React, { useEffect, useMemo, useRef, useState } from "react";
import LogoLoop from "../components/LogoLoop";
import MultiRowLogoLoop from "../components/MultiRowLogoLoop";
import logos from "../data/logos";

// place your logo at: public/LOGOS/newlogo.svg (or .png/.jpg)
const personallogo = "/LOGOS/newlogo.svg";

// Logos used for the logo-strip — same source as App's list (kept local here for the Home page placement)
const portfolioLogos = [
  { id: "around", label: "Around", src: "/LOGOS/Asset 1.svg", path: "/work", logoHeight: 72 },
  { id: "brand-two", label: "Clapes", src: "/LOGOS/BRAND-TWO.svg", path: "/clapes" },
  { id: "brand-three", label: "Brand Three", src: "/LOGOS/BRAND-THREE.svg", path: "/work" },
  { id: "logo-1-white", label: "Logo 1", src: "/LOGOS/Logo 1 in whitw.svg", path: "/terzo" },
  { id: "william-ru", label: "William Ru", src: "/LOGOS/William Ru.svg", path: "/williamru" },
  { id: "fly-high", label: "Fly High", src: "/LOGOS/flyhigh.svg", path: "/flyhigh" },
  { id: "semanu-studios", label: "Semanu Studios", src: "/LOGOS/semanu studios.svg", path: "/work" },
];

export default function HomeDuplicate() {
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const [rects, setRects] = useState([]);

  // Fixed sizes and labels for the 9 rectangles
  const rectSpecs = useMemo(
    () => [
      { w: 240, h: 240, number: "1" },
      { w: 240, h: 240, number: "2" },
      { w: 240, h: 200, number: "3" },
      { w: 240, h: 200, number: "4" },
      { w: 260, h: 260, number: "5" },
      { w: 300, h: 260, number: "6" },
      { w: 260, h: 260, number: "7" },
      { w: 260, h: 260, number: "8" },
      { w: 300, h: 280, number: "9" },
    ],
    []
  );

  // Place rectangles randomly around, not overlapping logo or each other
  useEffect(() => {
    const el = containerRef.current;
    const logo = logoRef.current;
    if (!el || !logo) return;

    const place = () => {
      const contRect = el.getBoundingClientRect();
      const logoRectAbs = logo.getBoundingClientRect();
      // Convert logo rect to container-relative coords
      const logoRect = {
        x: logoRectAbs.left - contRect.left,
        y: logoRectAbs.top - contRect.top,
        w: logoRectAbs.width,
        h: logoRectAbs.height,
      };

      const marginFromLogo = 32; // keep a gap from the logo
      const gapBetweenRects = 18; // gap between rectangles

      const forbidden = {
        x: Math.max(0, logoRect.x - marginFromLogo),
        y: Math.max(0, logoRect.y - marginFromLogo),
        w: Math.min(contRect.width, logoRect.w + marginFromLogo * 2),
        h: Math.min(contRect.height, logoRect.h + marginFromLogo * 2),
      };

      const within = (r) =>
        r.x >= 0 &&
        r.y >= 0 &&
        r.x + r.w <= contRect.width &&
        r.y + r.h <= contRect.height;

      const overlap = (a, b, pad = 0) =>
        !(a.x + a.w + pad <= b.x ||
          b.x + b.w + pad <= a.x ||
          a.y + a.h + pad <= b.y ||
          b.y + b.h + pad <= a.y);

      const isAroundLogo = (r) => {
        // around == in one of four bands that surround the forbidden area
        const leftBand = r.x + r.w <= forbidden.x;
        const rightBand = r.x >= forbidden.x + forbidden.w;
        const topBand = r.y + r.h <= forbidden.y;
        const bottomBand = r.y >= forbidden.y + forbidden.h;
        return leftBand || rightBand || topBand || bottomBand;
      };

      const results = [];
      const maxAttempts = 4000;
      let attempts = 0;

      while (results.length < rectSpecs.length && attempts < maxAttempts) {
        attempts++;
        const spec = rectSpecs[results.length];

        // Choose a band randomly (top/bottom/left/right) and sample within it
        const bands = ["top", "bottom", "left", "right"];
        const band = bands[Math.floor(Math.random() * bands.length)];

        let x = 0;
        let y = 0;

        const fw = forbidden.w;
        const fh = forbidden.h;

        if (band === "top") {
          const maxY = Math.max(0, forbidden.y - spec.h - gapBetweenRects);
          y = Math.random() * (maxY - 0 + 1);
          const minX = gapBetweenRects;
          const maxX = contRect.width - spec.w - gapBetweenRects;
          x = minX + Math.random() * Math.max(0, maxX - minX);
        } else if (band === "bottom") {
          const minY = Math.min(
            contRect.height - spec.h - gapBetweenRects,
            forbidden.y + fh + gapBetweenRects
          );
          const maxY = contRect.height - spec.h - gapBetweenRects;
          y = Math.max(minY, Math.min(maxY, minY + Math.random() * (maxY - minY)));
          const minX = gapBetweenRects;
          const maxX = contRect.width - spec.w - gapBetweenRects;
          x = minX + Math.random() * Math.max(0, maxX - minX);
        } else if (band === "left") {
          const maxX = Math.max(0, forbidden.x - spec.w - gapBetweenRects);
          x = Math.random() * (maxX - 0 + 1);
          const minY = gapBetweenRects;
          const maxY = contRect.height - spec.h - gapBetweenRects;
          y = minY + Math.random() * Math.max(0, maxY - minY);
        } else if (band === "right") {
          const minX = Math.min(
            contRect.width - spec.w - gapBetweenRects,
            forbidden.x + fw + gapBetweenRects
          );
          const maxX = contRect.width - spec.w - gapBetweenRects;
          x = Math.max(minX, Math.min(maxX, minX + Math.random() * (maxX - minX)));
          const minY = gapBetweenRects;
          const maxY = contRect.height - spec.h - gapBetweenRects;
          y = minY + Math.random() * Math.max(0, maxY - minY);
        }

        const candidate = { x, y, w: spec.w, h: spec.h, number: spec.number };
        if (!within(candidate)) continue;
        if (!isAroundLogo(candidate)) continue;
        if (overlap(candidate, forbidden, 0)) continue;
        if (results.some((r) => overlap(candidate, r, gapBetweenRects))) continue;

        results.push(candidate);
      }

      setRects(results);
    };

    // Initial placement and resize handling
    const ro = new ResizeObserver(() => place());
    ro.observe(el);
    if (logo) ro.observe(logo);
    // In case image loads later
    const onImgLoad = () => place();
    logo.addEventListener("load", onImgLoad);

    // Run once after mount
    requestAnimationFrame(place);

    return () => {
      ro.disconnect();
      logo.removeEventListener("load", onImgLoad);
    };
  }, [rectSpecs]);

  return (
    <main className="min-h-screen px-6 py-16 flex flex-col">
      {/* Top spacer */}
      <div className="w-full h-32"></div>

      <div className="w-full mb-6 relative" ref={containerRef}>
        {/* Random, non-overlapping rectangles placed around the logo */}
        {rects.map((r, idx) => (
          <div
            key={idx}
            className="absolute flex items-center justify-center bg-neutral-600/60 dark:bg-neutral-500/60"
            style={{
              left: `${r.x}px`,
              top: `${r.y}px`,
              width: `${r.w}px`,
              height: `${r.h}px`,
              pointerEvents: "none",
              fontSize: "20px",
              fontWeight: "bold",
              color: "white",
              fontFamily: "monospace",
            }}
          >
            {r.number}
          </div>
        ))}

        {/* Centered logo */}
        <div className="w-full flex justify-center">
          <img
            ref={logoRef}
            src={personallogo}
            alt="Logo"
            className="w-full max-w-[1200px] h-auto dark:invert"
          />
        </div>
      </div>

      {/* Responsive spacing: show 'Trusted By' and part of the first logo row across devices */}
      <div className="w-full h-20 sm:h-28 md:h-40 lg:h-56"></div>

      {/* Trusted By Section + logo strip — extra desktop-only spacer then push down on mobile only */}
      <div className="hidden sm:block" style={{ height: '260px' }} />
      <div className="w-full mt-24 sm:mt-0 pt-96 sm:pt-0">
        <div className="w-full mb-3 text-center">
          <h3
            className="trusted-by text-sm tracking-widest text-neutral-600 dark:text-neutral-400"
            style={{ fontFamily: "'PT Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, monospace" }}
          >
            T R U S T E D &nbsp; B Y
          </h3>
        </div>

        {/* Slow, multi-row logo section (moved from top bar). 4 stacked rows, drastically reduced speed. */}
        {/* Make the logo strip span the full viewport width so it starts at the edges */}
        <section className="w-full mb-12">
          <MultiRowLogoLoop
            logos={logos}
            rows={3}
            /* reduced speed and increased horizontal gap */
            speed={16}
            logoHeight={36}
            gap={140}
            rowGap={80}
          />
        </section>
      </div>

      <div className="flex-1" />

      {/* Contact Section */}
  <section className="w-full max-w-6xl mx-auto mb-16 contact-section mt-12 font-mono">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left: Heading */}
          <div>
            <h2 className="text-5xl md:text-6xl font-bold leading-tight font-mono">
              <span className="text-neutral-700 dark:text-neutral-300">Open for Collabs</span>
              <br />
              <span className="text-neutral-900 dark:text-neutral-50">&amp; Commissions</span>
            </h2>
          </div>

          {/* Right: Contact Info and Form */}
          <div>
            {/* Status Badge */}
            <div className="mb-8 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                Available
              </span>
            </div>

            {/* Contact Links */}
            <div className="space-y-4 mb-8">
              {/* Instagram */}
              <a
                href="https://instagram.com/0021.studio"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 group"
              >
                <svg
                  className="w-6 h-6 text-neutral-600 dark:text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <span className="text-neutral-700 dark:text-neutral-300 group-hover:text-black dark:group-hover:text-white transition-colors">0021.studio</span>
              </a>

              {/* Email */}
              <a
                href="mailto:gregory.gfx1@gmail.com"
                className="flex items-center gap-3 group"
              >
                <svg
                  className="w-6 h-6 text-neutral-600 dark:text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
                <span className="text-neutral-700 dark:text-neutral-300 group-hover:text-black dark:group-hover:text-white transition-colors">
                  gregory.gfx1@gmail.com
                </span>
              </a>
            </div>

            {/* Form Section */}
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Jane Smith"
                  className="w-full px-4 py-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 placeholder-neutral-400 dark:placeholder-neutral-500 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="jane@framer.com"
                  className="w-full px-4 py-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 placeholder-neutral-400 dark:placeholder-neutral-500 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Message
                </label>
                <textarea
                  placeholder="Send a message..."
                  rows="6"
                  className="w-full px-4 py-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 placeholder-neutral-400 dark:placeholder-neutral-500 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 bg-neutral-900 dark:bg-neutral-100 text-neutral-50 dark:text-neutral-900 font-medium rounded-full hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
