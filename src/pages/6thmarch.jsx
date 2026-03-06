import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

const videos = [
  { src: '/RECENTS/Untitledd%20copy.mp4', label: 'FOR TERZO' },
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
  'castro d.png',
  'ebony.png',
  'gyan back.png',
  'gyan front.png',
  'hac.png',
  'kojo.png',
  'last two.png',
  'legend tee.png',
  'rawlings.png',
  'white.png',
];

// Per-image size overrides (as fraction of default clamp)
const outerSizeOverride = {
  'black2.png': 0.72,
  'blue1 copy.png': 0.75,
  'ebony.png': 1.45,
  'rawlings.png': 1.4,
};

export default function SixthMarch() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [fadedOut, setFadedOut] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
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
    const checkTablet = () => setIsTablet(window.innerWidth >= 768);
    checkTablet();
    window.addEventListener('resize', checkTablet);
    const onChange = (e) => { setIsMobileOrTablet(e.matches); };
    mql.addEventListener('change', onChange);
    return () => { mql.removeEventListener('change', onChange); window.removeEventListener('resize', checkTablet); };
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

  // Programmatically start video – required for autoplay on some mobile browsers
  useEffect(() => {
    const vid = videoRef.current;
    if (vid) {
      vid.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setFadedOut(true), 3900);
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
        ref={videoRef}
        src={videos[0].src}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 object-cover transition-opacity duration-1000"
        style={{ opacity: fadedOut ? 0 : 1, width: '100%', height: '100%', minWidth: '100vw', minHeight: '100vh' }}
      />

      {/* Preload all gallery images so they appear immediately when gallery shows */}
      <div style={{ display: 'none' }} aria-hidden="true">
        {[...marchImages, ...outerImages].map(src => (
          <img key={src} src={src} alt="" />
        ))}
      </div>

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
          const anyHovered = !isMobileOrTablet && (hoveredIndex !== null || hoveredOuterIndex !== null);
          const isDimmed = anyHovered && !isHovered;
          const innerLabel = marchImageFiles[idx] === '5.png' || marchImageFiles[idx] === '6.png' ? 'DESIGN FOR SALE' : 'CLIENT WORK';
          return (
            <div
              key={src}
              className="absolute"
              style={{
                left: '50%',
                top: '50%',
                width: 'clamp(44px, 6.5vw, 112px)',
                transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(min(${isMobileOrTablet ? '36vw, 32vh' : '35vw, 31vh'})) rotate(${-angle}deg)`,
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
                {isHovered && (
                  <p style={{ textAlign: 'center', fontSize: '4.5px', letterSpacing: '0.12em', marginTop: '4px', color: isDark ? 'rgba(210,210,210,0.9)' : 'rgba(30,30,30,0.9)', fontFamily: '"PT Mono", monospace', whiteSpace: 'nowrap' }}>
                    {innerLabel}
                  </p>
                )}
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
            animation: 'marchOuterRotate 60s linear infinite',
            transform: undefined,
            pointerEvents: 'none',
            opacity: showGallery ? 1 : 0,
            transition: 'opacity 900ms ease 200ms',
          }}
        >
          {outerImages.map((src, idx) => {
            const angle = (idx / outerImages.length) * 360;
            const isHovered = !isMobileOrTablet && hoveredOuterIndex === idx;
            const anyHovered = !isMobileOrTablet && (hoveredIndex !== null || hoveredOuterIndex !== null);
            const isDimmed = anyHovered && !isHovered;
            const fileName = outerImageFiles[idx];
            const scaleFactor = outerSizeOverride[fileName] ?? 1;
            // desktop: 60% of mobile/tablet size
            const desktopMult = isMobileOrTablet ? 1 : 0.6;
            const ef = scaleFactor * desktopMult;
            return (
              <div
                key={`outer-${src}`}
                className="absolute"
                style={{
                  left: 0,
                  top: 0,
                  width: `clamp(${Math.round(54 * ef)}px, ${(8.5 * ef).toFixed(2)}vw, ${Math.round(140 * ef)}px)`,
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
                <div style={{ animation: 'marchCounterRotate 60s linear infinite' }}>
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
            opacity: showGallery ? ((!isMobileOrTablet && (hoveredIndex !== null || hoveredOuterIndex !== null)) ? 0 : 1) : 0,
            transition: 'opacity 300ms ease',
            textAlign: 'center',
            fontFamily: '"PT Mono", monospace',
          }}
        >
          <p className="tracking-widest uppercase" style={{ fontSize: 'clamp(7px, 1.1vw, 11px)', lineHeight: '1.8', color: isDark ? 'rgba(150,150,150,0.7)' : 'rgba(80,80,80,0.6)' }}>
            {isMobileOrTablet ? 'TAP AND HOLD' : 'HOVER'}
          </p>
          <p className="tracking-widest uppercase" style={{ fontSize: 'clamp(7px, 1.1vw, 11px)', lineHeight: '1.8', color: isDark ? 'rgba(150,150,150,0.7)' : 'rgba(80,80,80,0.6)' }}>
            TO PREVIEW
          </p>
        </div>
      </div>

      {/* Mobile/tablet tap-and-hold preview popup */}
      {pressedImage && (
        <div
          className="fixed inset-0 z-[200] pointer-events-none flex flex-col items-center justify-center gap-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
        >
          <img
            src={pressedImage}
            alt="Preview"
            style={{
              maxWidth: isMobileOrTablet && isTablet ? '44vw' : '82vw',
              maxHeight: isMobileOrTablet && isTablet ? '38vh' : '68vh',
              objectFit: 'contain',
            }}
            draggable={false}
            onContextMenu={preventContextMenu}
          />
          {(() => {
            const pf = decodeURIComponent(pressedImage.split('/').pop());
            const lbl = pf === '5.png' || pf === '6.png' ? 'DESIGN FOR SALE' : marchImageFiles.includes(pf) ? 'CLIENT WORK' : null;
            return lbl ? (
              <p style={{ color: 'rgba(190,190,190,0.9)', fontSize: 'clamp(9px, 1.5vw, 14px)', letterSpacing: '0.15em', fontFamily: '"PT Mono", monospace' }}>
                {lbl}
              </p>
            ) : null;
          })()}
        </div>
      )}

      {/* Top gradient – only after video fades, on top of circles */}
      <div
        style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          height: '130px',
          background: isDark
            ? 'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, transparent 100%)'
            : 'linear-gradient(to bottom, rgba(255,255,255,0.85) 0%, transparent 100%)',
          zIndex: 80,
          pointerEvents: 'none',
          opacity: fadedOut ? 1 : 0,
          transition: 'opacity 800ms ease',
        }}
      />

      {/* Bottom-right legal notice */}
      <div
        style={{
          position: 'fixed', bottom: 10, right: 12, zIndex: 90,
          textAlign: 'right', pointerEvents: 'none',
          fontFamily: '"PT Mono", monospace',
          opacity: fadedOut ? 0.45 : 0,
          transition: 'opacity 800ms ease',
        }}
      >
        <p style={{ fontSize: 'clamp(4px, 0.55vw, 7px)', letterSpacing: '0.07em', color: isDark ? 'rgba(200,200,200,0.8)' : 'rgba(30,30,30,0.8)', lineHeight: 1.6 }}>
          ALL RIGHTS RESERVED.
        </p>
        <p style={{ fontSize: 'clamp(3.5px, 0.5vw, 6.5px)', letterSpacing: '0.05em', color: isDark ? 'rgba(180,180,180,0.6)' : 'rgba(50,50,50,0.6)', lineHeight: 1.7, maxWidth: '32ch' }}>
          ALL ITEMS ARE FOR PORTFOLIO PURPOSES ONLY AND NOT FOR SALE ON THIS WEBSITE. CLIENTS RETAIN FULL OWNERSHIP OF COMMISSIONED DESIGNS. UNAUTHORISED USE OR REPRODUCTION CONSTITUTES INFRINGEMENT.
        </p>
      </div>

      {/* Top bar */}
      <div className="fixed top-8 left-0 right-0 z-[100] flex items-center justify-between px-4 md:px-10 md:top-12">
        {/* Left: Light/Dark mode toggle */}
        <button
          onClick={toggleTheme}
          className={`flex-shrink-0 w-5 h-5 md:w-6 md:h-6 hover:opacity-70 transition-opacity cursor-pointer ${isDark ? 'text-white' : 'text-black'}`}
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
          <img src={isDark ? '/LOGOS/newlogo-white.svg' : '/LOGOS/newlogo.svg'} alt="Logo" className="h-8 md:h-10 w-auto" />
        </button>

        {/* Right: Text — changes after video fades */}
        <div className={`text-right ${isDark ? 'text-white' : 'text-black'}`} style={{ fontFamily: '"PT Mono", monospace' }}>
          {fadedOut ? (
            <>
              <p className="text-[7px] md:text-[11px] tracking-widest leading-tight">DESIGNED BY ME</p>
              <p className="text-[7px] md:text-[11px] tracking-widest leading-tight">GHANA INSPIRED</p>
              <p className="text-[5px] md:text-[8px] tracking-widest leading-tight opacity-50">2022–2026</p>
            </>
          ) : (
            <>
              <p className="text-[7px] md:text-[11px] tracking-widest leading-tight">DESIGNED BY ME</p>
              <p className="text-[7px] md:text-[11px] tracking-widest leading-tight">{videos[0].label}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
