import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const videos = [
  { src: '/RECENTS/Untitledd copy.mp4', label: 'FOR TERZO' },
];

// Inner circle (original – do not change order or contents)
const marchImageFiles = [
  '1.png',
  '2.png',
  '4 prez 1.png',
  '4 prez 2.png',
  '5.png',
  '6.png',
  'a gyan.png',
  'black front.png',
  'nkrumah solo.png',
  'white front.png',
  'yellow front.png',
];

// Outer circle – all non-inner-circle images
const outerImageFiles = [
  '5 cedi.png',
  'black.png',
  'black2.png',
  'blue1 copy.png',
  'ebony.png',
  'gyan back.png',
  'gyan front.png',
  'hac.png',
  'legend tee.png',
  'rawlings.png',
  'white.png',
];

// Per-image size overrides (as fraction of default clamp)
const outerSizeOverride = {
  'black2.png': 0.72,
  'blue1 copy.png': 0.75,
};

export default function SixthMarch() {
  const navigate = useNavigate();
  const [fadedOut, setFadedOut] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hoveredOuterIndex, setHoveredOuterIndex] = useState(null);
  const [pressedImage, setPressedImage] = useState(null);
  const [contentBlurred, setContentBlurred] = useState(false);

  const marchImages = marchImageFiles.map((file) => encodeURI(`/Images/6thMarch/${file}`));
  const outerImages = outerImageFiles.map((file) => encodeURI(`/Images/6thMarch/${file}`));

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  // Detect touch/mobile devices (coarse pointer = touch screen)
  useEffect(() => {
    const mql = window.matchMedia('(pointer: coarse)');
    setIsMobileOrTablet(mql.matches);
    const onChange = (e) => setIsMobileOrTablet(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  // Screenshot blocking: blur content when page is hidden
  // (iOS screenshot UI briefly hides the page, screen recorders trigger visibility change)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setContentBlurred(true);
      } else {
        setTimeout(() => setContentBlurred(false), 400);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setFadedOut(true), 6000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!fadedOut) return;
    const timer = setTimeout(() => setShowGallery(true), 300);
    return () => clearTimeout(timer);
  }, [fadedOut]);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      window.localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      window.localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  // Tap-and-hold: show image popup immediately on touch, dismiss on release
  const handleTouchStart = useCallback((src, e) => {
    e.preventDefault(); // block iOS long-press save menu
    setPressedImage(src);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setPressedImage(null);
  }, []);

  const preventContextMenu = useCallback((e) => {
    e.preventDefault();
  }, []);

  return (
    <div
      className="pointer-events-auto select-none"
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        width: '100vw', height: '100vh', zIndex: 50,
        WebkitUserSelect: 'none', userSelect: 'none',
        WebkitTouchCallout: 'none',
        overflowY: 'hidden',
        touchAction: 'none',
      }}
      onContextMenu={preventContextMenu}
    >
      {/* Blank bg */}
      <div className="absolute inset-0 bg-white dark:bg-black" />

      {/* Video */}
      <video
        src={videos[0].src}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 object-cover transition-opacity duration-1000"
        style={{ opacity: fadedOut ? 0 : 1, width: '100vw', height: '100vh' }}
      />

      {/* Gallery wrapper – both circles + hint */}
      <div
        className="absolute inset-0"
        style={{
          opacity: showGallery ? 1 : 0,
          transition: 'opacity 900ms ease',
          zIndex: 20,
          filter: contentBlurred ? 'blur(40px)' : 'none',
        }}
      >
        {/* ── INNER CIRCLE (unchanged) ── */}
        {marchImages.map((src, idx) => {
          const angle = (idx / marchImages.length) * 360;
          const isHovered = !isMobileOrTablet && hoveredIndex === idx;
          const isDimmed = !isMobileOrTablet && hoveredIndex !== null && hoveredIndex !== idx;
          return (
            <div
              key={src}
              className="absolute"
              style={{
                left: '50%',
                top: '50%',
                width: 'clamp(58px, 9vw, 150px)',
                transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(min(38vw, 34vh)) rotate(${-angle}deg)`,
                transformOrigin: 'center center',
                opacity: showGallery ? 1 : 0,
                transition: `opacity 700ms ease ${idx * 80}ms`,
                zIndex: isHovered ? 50 : 1,
                cursor: isMobileOrTablet ? 'default' : 'pointer',
              }}
              onMouseEnter={() => !isMobileOrTablet && setHoveredIndex(idx)}
              onMouseLeave={() => !isMobileOrTablet && setHoveredIndex(null)}
              onTouchStart={(e) => handleTouchStart(src, e)}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchEnd}
              onContextMenu={preventContextMenu}
            >
              <div
                style={{
                  transform: isHovered ? 'scale(2.5)' : 'scale(1)',
                  transition: 'transform 300ms ease, opacity 300ms ease, filter 300ms ease',
                  opacity: isDimmed ? 0.08 : 1,
                  filter: isDimmed
                    ? 'blur(3px) grayscale(100%)'
                    : (isDark ? 'brightness(0.95)' : 'brightness(0.88)'),
                }}
              >
                <img
                  src={src}
                  alt={`6th March ${idx + 1}`}
                  className="w-full h-auto object-contain"
                  draggable={false}
                  onContextMenu={preventContextMenu}
                  onDragStart={preventContextMenu}
                />
                <div className="absolute inset-0" onContextMenu={preventContextMenu} />
              </div>
            </div>
          );
        })}

        {/* ── OUTER CIRCLE (clockwise rotation on mobile/tablet) ── */}
        <style>{`
          @keyframes marchOuterRotate {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to   { transform: translate(-50%, -50%) rotate(360deg); }
          }
          @keyframes marchCounterRotate {
            from { transform: rotate(0deg); }
            to   { transform: rotate(-360deg); }
          }
        `}</style>
        {/* Rotating orbit wrapper – 0×0 div anchored at viewport center */}
        <div
          className="absolute"
          style={{
            left: '50%',
            top: '50%',
            width: 0,
            height: 0,
            animation: isMobileOrTablet ? 'marchOuterRotate 60s linear infinite' : undefined,
            transform: isMobileOrTablet ? undefined : 'translate(-50%, -50%)',
            pointerEvents: 'none',
            opacity: showGallery ? 1 : 0,
            transition: 'opacity 900ms ease 200ms',
          }}
        >
          {outerImages.map((src, idx) => {
            const angle = (idx / outerImages.length) * 360;
            const isHovered = !isMobileOrTablet && hoveredOuterIndex === idx;
            const isDimmed = !isMobileOrTablet && hoveredOuterIndex !== null && hoveredOuterIndex !== idx;
            const fileName = outerImageFiles[idx];
            const scaleFactor = outerSizeOverride[fileName] ?? 1;
            return (
              <div
                key={`outer-${src}`}
                className="absolute"
                style={{
                  left: 0,
                  top: 0,
                  width: `clamp(${Math.round(54 * scaleFactor)}px, ${(8.5 * scaleFactor).toFixed(2)}vw, ${Math.round(140 * scaleFactor)}px)`,
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(min(60vw, 54vh)) rotate(${-angle}deg)`,
                  transformOrigin: 'center center',
                  zIndex: isHovered ? 50 : 1,
                  cursor: isMobileOrTablet ? 'default' : 'pointer',
                  pointerEvents: 'auto',
                }}
                onMouseEnter={() => !isMobileOrTablet && setHoveredOuterIndex(idx)}
                onMouseLeave={() => !isMobileOrTablet && setHoveredOuterIndex(null)}
                onTouchStart={(e) => handleTouchStart(src, e)}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
                onContextMenu={preventContextMenu}
              >
                {/* Counter-rotate so images stay upright as the orbit spins */}
                <div style={{ animation: isMobileOrTablet ? 'marchCounterRotate 60s linear infinite' : undefined }}>
                  <div
                    style={{
                      transform: isHovered ? 'scale(2.5)' : 'scale(1)',
                      transition: 'transform 300ms ease, opacity 300ms ease, filter 300ms ease',
                      opacity: isDimmed ? 0.08 : 1,
                      filter: isDimmed
                        ? 'blur(3px) grayscale(100%)'
                        : (isDark ? 'brightness(0.95)' : 'brightness(0.88)'),
                    }}
                  >
                    <img
                      src={src}
                      alt={`6th March outer ${idx + 1}`}
                      className="w-full h-auto object-contain"
                      draggable={false}
                      onContextMenu={preventContextMenu}
                      onDragStart={preventContextMenu}
                    />
                    <div className="absolute inset-0" onContextMenu={preventContextMenu} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── CENTER HINT TEXT ── */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 30,
            opacity: showGallery ? 1 : 0,
            transition: 'opacity 1200ms ease 800ms',
            textAlign: 'center',
            fontFamily: '"PT Mono", monospace',
          }}
        >
          <p className="text-white/50 tracking-widest uppercase" style={{ fontSize: 'clamp(7px, 1.1vw, 11px)', lineHeight: '1.8' }}>
            {isMobileOrTablet ? 'TAP AND HOLD' : 'HOVER'}
          </p>
          <p className="text-white/50 tracking-widest uppercase" style={{ fontSize: 'clamp(7px, 1.1vw, 11px)', lineHeight: '1.8' }}>
            TO PREVIEW
          </p>
        </div>
      </div>

      {/* Mobile/tablet tap-and-hold preview popup */}
      {pressedImage && (
        <div
          className="fixed inset-0 z-[200] pointer-events-none flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
        >
          <img
            src={pressedImage}
            alt="Preview"
            className="max-w-[82vw] max-h-[82vh] object-contain"
            draggable={false}
            onContextMenu={preventContextMenu}
          />
        </div>
      )}

      {/* Top gradient – ensures top-bar UI is readable over the circles */}
      <div
        style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          height: '130px',
          background: isDark
            ? 'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, transparent 100%)'
            : 'linear-gradient(to bottom, rgba(255,255,255,0.85) 0%, transparent 100%)',
          zIndex: 80,
          pointerEvents: 'none',
        }}
      />

      {/* Top bar */}
      <div className="fixed top-8 left-0 right-0 z-[100] flex items-center justify-between px-4 md:px-10 md:top-12">
        {/* Left: Light/Dark mode toggle */}
        <button
          onClick={toggleTheme}
          className={`flex-shrink-0 w-4 h-4 md:w-6 md:h-6 hover:opacity-70 transition-opacity cursor-pointer ${isDark ? 'text-white' : 'text-black'}`}
        >
          {isDark ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* Center: Logo */}
        <button
          onClick={() => navigate('/')}
          className="absolute left-1/2 -translate-x-1/2 cursor-pointer hover:opacity-70 transition-opacity"
        >
          <img src={isDark ? '/LOGOS/newlogo-white.svg' : '/LOGOS/newlogo.svg'} alt="Logo" className="h-5 md:h-8 w-auto" />
        </button>

        {/* Right: Text — changes after video fades */}
        <div className={`text-right ${isDark ? 'text-white' : 'text-black'}`} style={{ fontFamily: '"PT Mono", monospace' }}>
          {fadedOut ? (
            <>
              <p className="text-[5px] md:text-[8px] tracking-widest leading-tight">DESIGNED BY ME</p>
              <p className="text-[5px] md:text-[8px] tracking-widest leading-tight">GHANA INSPIRED</p>
            </>
          ) : (
            <>
              <p className="text-[5px] md:text-[8px] tracking-widest leading-tight">DESIGNED BY ME</p>
              <p className="text-[5px] md:text-[8px] tracking-widest leading-tight">{videos[0].label}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
