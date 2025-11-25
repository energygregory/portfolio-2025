import React, { useState } from "react";
import LogoLoop from "./LogoLoop";
import { Link } from "react-router-dom";

export default function MultiRowLogoLoop({
  logos,
  rows = 4,
  speed = 120,
  logoHeight = 36,
  gap = 56,
  rowGap = 12,
  fadeOutColor,
  className = "",
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Distribute logos across rows without repeating across rows.
  // Uses round-robin assignment so when you add logos later they will be
  // placed sensibly across rows.
  const distribute = (items, rowsCount) => {
    const buckets = Array.from({ length: rowsCount }, () => []);
    items.forEach((item, idx) => {
      buckets[idx % rowsCount].push(item);
    });
    return buckets;
  };

  // Render each logo as a clickable link
  const renderLogoItem = (item) => (
    <Link to={item.path} className="logoloop__link" aria-label={item.label}>
      <img
        src={item.src}
        alt={item.alt || item.label}
        title={item.title || item.label}
        className={`logo-img ${
          item.id === "asset-4" ? "logo-img--circular" : ""
        } ${
          item.id === "asset-1" || item.id === "asset-3" ? "logo-img--slightly-larger" : ""
        } ${
          item.id === "en-garde" ? "logo-img--large-garde" : ""
        }`}
        draggable={false}
      />
    </Link>
  );

  return (
    <div
      className={`logoloop logoloop--fade multi-logoloop ${className}`}
      role="region"
      aria-label="Client logos multi-row"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="multi-logoloop__inner space-y-0">
        {(() => {
          const buckets = distribute(logos, rows);
          return buckets.map((rowLogos, i) => {
            const direction = i % 2 === 0 ? "left" : "right";
            // reduced hover magnitude so slowdown is subtle but preserves direction
            const hoverMagnitude = 8;
            const signedHover = direction === "left" ? Math.abs(hoverMagnitude) : -Math.abs(hoverMagnitude);

            return (
              <div className="multi-logoloop__row" key={i} style={{ marginBottom: i < rows - 1 ? `${rowGap}px` : 0 }}>
                <LogoLoop
                  logos={rowLogos}
                  speed={speed}
                  direction={direction}
                  logoHeight={logoHeight}
                  gap={gap}
                  externalHover={isHovered}
                  hoverSpeed={signedHover}
                  scaleOnHover
                  fadeOut={false} /* container handles fade */
                  renderItem={renderLogoItem}
                  ariaLabel={`Client logos row ${i + 1}`}
                />
              </div>
            );
          });
        })()}
      </div>
    </div>
  );
}
