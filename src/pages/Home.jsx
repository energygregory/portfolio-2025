import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
import LogoLoop from "../components/LogoLoop";
import MultiRowLogoLoop from "../components/MultiRowLogoLoop";
import LiquidLogo from "../components/LiquidLogo";
import AnimatedLogo from "../components/AnimatedLogo";
// import SpotifyNowPlaying from "../components/SpotifyNowPlaying";
import logos from "../data/logos";

// Logo for chrome effect (PNG)
const logoPath = "/LOGOS/newlogo.svg";

// 2025 Images from public/Images/2025 folder - organized in rows of 6
const images2025 = [
  // Row 1 - black1, black2, white1, white2 together
  "/Images/2025/black1.png",
  "/Images/2025/black2.png",
  "/Images/2025/white1.png",
  "/Images/2025/white2.png",
  "/Images/2025/black.png",
  "/Images/2025/white.png",
  // Row 2
  "/Images/2025/1.png",
  "/Images/2025/2.png",
  "/Images/2025/3.png",
  "/Images/2025/4b.png",
  "/Images/2025/4.png",
  "/Images/2025/5.png",
  // Row 3 - hoodie blue 1, hoodie blue 2, final pants 2, hoodie black 1, hoodie black 2, final pants
  "/Images/2025/hoodie blue 1.png",
  "/Images/2025/hoodie blue 2.png",
  "/Images/2025/final pants 2.png",
  "/Images/2025/hoodie black 1.png",
  "/Images/2025/hoodie black 2.png",
  "/Images/2025/final pants.png",
  // Row 4
  "/Images/2025/BEANIE 1.png",
  "/Images/2025/grey beanie.png",
  "/Images/2025/RED.png",
  "/Images/2025/RED2b.png",
  "/Images/2025/front.png",
  "/Images/2025/coloured puffer.png",
  // Row 5
  "/Images/2025/bandana3.png",
  "/Images/2025/bandana4.png",
  "/Images/2025/bandana5.png",
  "/Images/2025/bandana8.png",
  "/Images/2025/t shirt 1.png",
  "/Images/2025/sweapants 1.png",
  // Row 6 - boxes (using box2a and box3a)
  "/Images/2025/box2a.png",
  "/Images/2025/box3a.png",
  "/Images/2025/gyan front.png",
  "/Images/2025/gyan back.png",
  "/Images/2025/hofa.png",
  "/Images/2025/hofb.png",
  // Row 7
  "/Images/2025/mockup.png",
  "/Images/2025/zm.png",
  "/Images/2025/zm2.png",
  "/Images/2025/s1.png",
  "/Images/2025/s2.png",
  // Row 8 - hats and headwear
  "/Images/2025/HAT1.png",
  "/Images/2025/HAT5.png",
  "/Images/2025/HAT6.png",
  "/Images/2025/wrhat1.png",
  "/Images/2025/wrhat2.png",
  "/Images/2025/wrhat3.png",
  "/Images/2025/wrhat4.png",
  // Row 9 - Around + caps + first WR set
  "/Images/2025/around1.png",
  "/Images/2025/around2.png",
  "/Images/2025/mcap1.png",
  "/Images/2025/mcap2.png",
  "/Images/2025/wr1.png",
  "/Images/2025/wr2.png",
  // Row 10 - remaining WR looks
  "/Images/2025/wr3.png",
  "/Images/2025/wr4.png",
  "/Images/2025/wr5.png",
  "/Images/2025/wr6.png",
  "/Images/2025/wr7.png",
  "/Images/2025/wr8.png",
  // Row 11 - cream & brown line
  "/Images/2025/cream front.png",
  "/Images/2025/cream back.png",
  "/Images/2025/cream pants back.png",
  "/Images/2025/brown front.png",
  "/Images/2025/brown back.png",
  "/Images/2025/brown pants back.png",
  // Row 12 - new color drops
  "/Images/2025/blue1.png",
  "/Images/2025/blue2.png",
  "/Images/2025/green1.png",
  "/Images/2025/green2.png",
  "/Images/2025/red1.png",
  "/Images/2025/red2.png",
];

const reducedSizeImages2025 = new Set([
  "/Images/2025/HAT1.png",
  "/Images/2025/HAT5.png",
  "/Images/2025/HAT6.png",
  "/Images/2025/wrhat1.png",
  "/Images/2025/wrhat2.png",
  "/Images/2025/wrhat3.png",
  "/Images/2025/wrhat4.png",
]);

const expandedSizeImages2025 = new Set([
  "/Images/2025/wr1.png",
  "/Images/2025/wr2.png",
  "/Images/2025/wr3.png",
  "/Images/2025/wr4.png",
]);

const slightlyExpandedImages2025 = new Set([
  "/Images/2025/mcap1.png",
  "/Images/2025/mcap2.png",
  "/Images/2025/RED.png",
  "/Images/2025/RED2b.png",
  "/Images/2025/around1.png",
  "/Images/2025/around2.png",
]);

// Logos used for the logo-strip — same source as App's list (kept local here for the Home page placement)
const portfolioLogos = [
  {
    id: "around",
    label: "Around",
    src: "/LOGOS/Asset 1.svg",
    path: "/work",
    logoHeight: 72,
  },
  {
    id: "brand-two",
    label: "Clapes",
    src: "/LOGOS/BRAND-TWO.svg",
    path: "/clapes",
  },
  {
    id: "brand-three",
    label: "Brand Three",
    src: "/LOGOS/BRAND-THREE.svg",
    path: "/work",
  },
  {
    id: "logo-1-white",
    label: "Logo 1",
    src: "/LOGOS/Logo 1 in whitw.svg",
    path: "/terzo",
  },
  {
    id: "william-ru",
    label: "William Ru",
    src: "/LOGOS/William Ru.svg",
    path: "/williamru",
  },
  {
    id: "fly-high",
    label: "Fly High",
    src: "/LOGOS/flyhigh.svg",
    path: "/flyhigh",
  },
  {
    id: "semanu-studios",
    label: "Semanu Studios",
    src: "/LOGOS/semanu studios.svg",
    path: "/work",
  },
];

export default function Home({ theme = "dark" }) {
  console.log('Home component is rendering');
  
  const [isPhone, setIsPhone] = useState(false);
  const [isTabletOrLarger, setIsTabletOrLarger] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const logoContainerRef = useRef(null);
  const clRef = useRef(null);
  const crRef = useRef(null);
  const logoWrapperRef = useRef(null);
  const imagesRef = useRef(null);
  const scrollYRef = useRef(0);

  useEffect(() => {
    const phoneMql = window.matchMedia("(max-width: 640px)");
    const tabletMql = window.matchMedia("(min-width: 641px)");
    
    const onPhoneChange = (e) => setIsPhone(e.matches);
    const onTabletChange = (e) => setIsTabletOrLarger(e.matches);
    
    setIsPhone(phoneMql.matches);
    setIsTabletOrLarger(tabletMql.matches);
    
    if (phoneMql.addEventListener) {
      phoneMql.addEventListener("change", onPhoneChange);
      tabletMql.addEventListener("change", onTabletChange);
    } else {
      phoneMql.addListener(onPhoneChange);
      tabletMql.addListener(onTabletChange);
    }
    return () => {
      if (phoneMql.removeEventListener) {
        phoneMql.removeEventListener("change", onPhoneChange);
        tabletMql.removeEventListener("change", onTabletChange);
      } else {
        phoneMql.removeListener(onPhoneChange);
        tabletMql.removeListener(onTabletChange);
      }
    };
  }, []);

  // State for pressed image (mobile hold feature) - stores image src and touch position
  const [pressedImage, setPressedImage] = useState(null);

  // Touch handlers for press-and-hold - capture touch position for centered popup
  const handleTouchStart = useCallback((idx, src, e) => {
    if (isPhone) {
      const touch = e.touches[0];
      setPressedImage({
        src,
        x: touch.clientX,
        y: touch.clientY,
      });
    }
  }, [isPhone]);

  const handleTouchEnd = useCallback(() => {
    setPressedImage(null);
  }, []);

  // MOBILE & DESKTOP: Scroll-based animations
  const updateScrollAnimations = useCallback(() => {
    const scrollY = scrollYRef.current;
    const maxScroll = isPhone ? 400 : 600;
    const progress = Math.min(scrollY / maxScroll, 1);
    
    // Track if user has scrolled (for mobile marquee)
    if (isPhone) {
      setHasScrolled(scrollY > 20);
    }
    
    // Ease the progress for much smoother motion (easeOutCubic)
    const eased = 1 - Math.pow(1 - progress, 3);

    // Animations for both mobile and desktop (use eased values)
    const logoTranslateY = eased * (isPhone ? -100 : -150);
    const logoScale = 1 - eased * (isPhone ? 0.1 : 0.15);
    const logoOpacity = 1 - eased; // Fully fade out the logo
    const shoulderOpacity = Math.max(0, 1 - eased);
    const shoulderRotation = eased * 360;
    
    if (logoWrapperRef.current) {
      logoWrapperRef.current.style.transform = `translate3d(0, ${logoTranslateY}px, 0) scale(${logoScale})`;
      logoWrapperRef.current.style.opacity = logoOpacity;
    }
    
    if (clRef.current) {
      clRef.current.style.transform = `scaleX(-1) rotate3d(0, 0, 1, ${shoulderRotation}deg)`;
      clRef.current.style.opacity = shoulderOpacity;
    }
    
    if (crRef.current) {
      crRef.current.style.transform = `rotate3d(0, 0, 1, ${shoulderRotation}deg)`;
      crRef.current.style.opacity = shoulderOpacity;
    }
    
    if (imagesRef.current) {
      // On mobile, fade in the grid smoothly as you scroll
      const gridOpacity = progress;
      imagesRef.current.style.opacity = gridOpacity;
      imagesRef.current.style.transform = `translate3d(0, ${isPhone ? 0 : (1 - progress) * 100}px, 0)`;
    }
  }, [isPhone, hasScrolled]);

  // Scroll handler - BOTH MOBILE AND DESKTOP
  useEffect(() => {
    let lastUpdateTime = 0;
    const throttleMs = isPhone ? 1000 / 30 : 0; // 30fps on mobile, 60fps on desktop
    
    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
      const now = Date.now();
      if (now - lastUpdateTime >= throttleMs) {
        lastUpdateTime = now;
        requestAnimationFrame(updateScrollAnimations);
      }
    };
    
    scrollYRef.current = window.scrollY;
    updateScrollAnimations();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [updateScrollAnimations, isPhone]);

  const logoSpeed = useMemo(() => (isPhone ? 22 : 40), [isPhone]);
  const logoRowGap = useMemo(() => (isPhone ? 14 : 4), [isPhone]);
  const logoGap = useMemo(() => (isPhone ? 40 : 80), [isPhone]);
  const logoHeight = useMemo(() => (isPhone ? 22 : 28), [isPhone]);

  return (
    <main className={`min-h-screen flex flex-col overflow-x-hidden relative ${theme === 'light' ? 'bg-white' : 'bg-black'}`}>
      {/* Light mode video background removed */}
      
      {/* cl: Left shoulder symbol with liquid chrome metallic effect - HIDDEN */}
      {/* <div 
        ref={clRef}
        className="fixed z-[100] pointer-events-none"
        style={{
          top: isPhone ? '5vh' : '-10vh',
          left: isPhone ? '-15vw' : '0',
          width: isPhone ? '50vw' : '35vw',
          height: isPhone ? '50vw' : '35vw',
          transform: 'scaleX(-1) rotate3d(0, 0, 1, 0deg)',
          transformOrigin: '50% 50%',
          willChange: 'transform, opacity',
        }}
      >
        <LiquidLogo logoUrl="/LOGOS/shoulder symbol.png" />
      </div> */}
      {/* cr: Right shoulder symbol with liquid chrome metallic effect - HIDDEN */}
      {/* <div 
        ref={crRef}
        className="fixed z-[100] pointer-events-none"
        style={{
          top: isPhone ? '5vh' : '-10vh',
          right: isPhone ? '-15vw' : '0',
          width: isPhone ? '50vw' : '35vw',
          height: isPhone ? '50vw' : '35vw',
          transform: 'rotate3d(0, 0, 1, 0deg)',
          transformOrigin: '50% 50%',
          willChange: 'transform, opacity',
        }}
      >
        <LiquidLogo logoUrl="/LOGOS/shoulder symbol.png" />
      </div> */}

      {/* Hero section with sticky logo */}
      <section className={`relative z-10 ${isPhone ? '' : 'min-h-[150vh]'}`}>
        {/* Sticky logo container */}
        <div 
          ref={logoContainerRef}
          className={`${isPhone ? '' : 'sticky top-0'} ${isPhone ? '' : 'h-screen'} flex items-center justify-center px-6`}
          style={isPhone ? { paddingTop: '1vh', minHeight: '45vh' } : {}}
        >
          <div 
            ref={logoWrapperRef}
            className="w-full relative flex flex-col items-center gap-2"
            style={{ 
              maxWidth: isPhone ? '90vw' : '800px', 
              maxHeight: isPhone ? '80vw' : '800px',
              height: isPhone ? 'auto' : '70vh',
              willChange: 'transform',
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)',
            }}
          >
            <div className="w-full flex justify-center px-2">
              {/* <SpotifyNowPlaying theme={theme} /> */}
            </div>
            {/* Render both videos stacked and crossfade by opacity so switching
                themes doesn't remount/restart playback. Both videos play in
                parallel; we simply fade between them. This assumes the two
                assets are identical content in different colours (as noted). */}
            <div className="relative w-full h-auto select-none flex items-center justify-center" style={{ transform: 'scale(1.5)' }}>
              {/* Replace hero videos with loading animation placeholder + outlined logo sequence */}
              <HeroLogoSequence theme={theme} />
            </div>
          </div>
        </div>

        {/* Hero logo sequence component (inline below) */}

        {/* Mobile: Scrolling marquee of 2025 images - fades out as you scroll */}
        {isPhone && !hasScrolled && (
          <div 
            className="w-full overflow-hidden py-4 mt-24 transition-opacity duration-300"
          >
            <div 
              className="flex gap-6 animate-marquee"
              style={{
                animation: 'marquee 60s linear infinite',
                width: 'max-content',
              }}
            >
              {[...images2025, ...images2025].map((src, idx) => (
                <img 
                  key={idx}
                  src={src} 
                  alt="" 
                  className="w-12 h-12 object-contain flex-shrink-0"
                  draggable={false}
                  decoding="async"
                  fetchpriority="low"
                />
              ))}
            </div>
            <style>{`
              @keyframes marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
            `}</style>
          </div>
        )}

        {/* 2025 Content - images grid */}
        <div 
          ref={imagesRef}
          className={`relative z-10 px-6 pb-24 ${isPhone ? 'mt-4' : '-mt-[50vh]'}`}
          style={{ 
            opacity: isPhone && !hasScrolled ? 0 : undefined, 
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden',
            transform: 'translateZ(0)',
          }}
        >
          <div className="max-w-7xl mx-auto">
            {/* 6 Column Image Grid - Small with lots of space */}
            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 gap-12 sm:gap-16 md:gap-20">
              {images2025.map((src, idx) => {
                const isReduced = reducedSizeImages2025.has(src);
                const isExpanded = expandedSizeImages2025.has(src);
                const isSlightlyExpanded = slightlyExpandedImages2025.has(src);
                const sizeClasses = isExpanded
                  ? 'w-[60px] h-[60px] sm:w-[110px] sm:h-[110px] md:w-[140px] md:h-[140px]'
                  : isSlightlyExpanded
                    ? 'w-[55px] h-[55px] sm:w-[105px] sm:h-[105px] md:w-[130px] md:h-[130px]'
                    : isReduced
                      ? 'w-[35px] h-[35px] sm:w-[70px] sm:h-[70px] md:w-[80px] md:h-[80px]'
                      : 'w-[50px] h-[50px] sm:w-[100px] sm:h-[100px] md:w-[120px] md:h-[120px]';

                return (
                  <div 
                    key={idx}
                    className={`${sizeClasses} mx-auto flex items-center justify-center relative`}
                    onTouchStart={(e) => handleTouchStart(idx, src, e)}
                    onTouchEnd={handleTouchEnd}
                    onTouchCancel={handleTouchEnd}
                    onContextMenu={(e) => e.preventDefault()}
                  >
                    <img 
                      src={src} 
                      alt=""
                      className={`max-w-full max-h-full object-contain select-none transition-transform duration-500 ${
                        !isPhone ? 'hover:scale-110' : ''
                      }`}
                      loading="lazy"
                      decoding="async"
                      fetchpriority="low"
                      draggable={false}
                      onContextMenu={(e) => e.preventDefault()}
                      onDragStart={(e) => e.preventDefault()}
                    />
                    {/* Transparent overlay to block direct image interaction */}
                    <div className="absolute inset-0" onContextMenu={(e) => e.preventDefault()} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      
      {/* Mobile pressed image popup - fixed overlay outside all containers */}
      {pressedImage && (
        <div 
          className="fixed inset-0 z-[200] pointer-events-none flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
        >
          <img 
            src={pressedImage.src}
            alt="Preview"
            className="max-w-[80vw] max-h-[80vh] object-contain"
            decoding="async"
          />
        </div>
      )}

      {/* Spacer */}
      <div className="w-full h-20 sm:h-28 md:h-40"></div>

      {/* Clientele Section - Properly centered grid layout */}
      <section className="w-full mt-24 sm:mt-0 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <h3
            className="text-center text-sm tracking-[0.3em] text-neutral-600 dark:text-neutral-400 mb-12"
            style={{
              fontFamily:
                "'PT Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
            }}
          >
            C L I E N T E L E
          </h3>

          {/* Logo Grid - 2 rows, first row longer, all centered */}
          <div className="flex flex-col items-center gap-6 sm:gap-12 mb-16 sm:mb-32">
            {/* Row 1: Around, Tribe of God, Terzo, Sleekster, Legacy Drip, Asset 3 */}
            <div className="flex items-center justify-center gap-4 sm:gap-12 md:gap-16">
              <div className="opacity-80">
                <img src="/LOGOS/around.svg" alt="Around" className="h-5 sm:h-10 w-auto dark:invert" draggable={false} />
              </div>
              <div className="opacity-80">
                <img src="/LOGOS/tribeofGod.svg" alt="Tribe of God" className="h-4 sm:h-8 w-auto dark:invert" draggable={false} />
              </div>
              <div className="opacity-80">
                <img src="/LOGOS/Logo 1 in whitw.svg" alt="Terzo" className="h-4 sm:h-8 w-auto invert dark:invert-0" draggable={false} />
              </div>
              <div className="opacity-80">
                <img src="/LOGOS/sleekster.svg" alt="Sleekster" className="h-3 sm:h-6 w-auto dark:invert" draggable={false} />
              </div>
              <div className="opacity-80">
                <img src="/LOGOS/legacydrip.svg" alt="Legacy Drip" className="h-5 sm:h-10 w-auto dark:invert" draggable={false} />
              </div>
              <div className="opacity-80">
                <img src="/LOGOS/Asset 3.svg" alt="Asset 3" className="h-5 sm:h-10 w-auto dark:invert" draggable={false} />
              </div>
            </div>

            {/* Row 2: William Ru, En Garde, Brand Two, Fly High, Semanu Studios */}
            <div className="flex items-center justify-center gap-4 sm:gap-12 md:gap-16">
              <div className="opacity-80">
                <img src="/LOGOS/William Ru.svg" alt="William Ru" className="h-4 sm:h-8 w-auto invert dark:invert-0" draggable={false} />
              </div>
              <div className="opacity-80">
                <img src="/LOGOS/en garde.svg" alt="En Garde" className="h-6 sm:h-12 w-auto dark:invert" draggable={false} />
              </div>
              <div className="opacity-80">
                <img src="/LOGOS/BRAND-TWO.svg" alt="Brand Two" className="h-6 sm:h-12 w-auto dark:invert" draggable={false} />
              </div>
              <div className="opacity-80">
                <img src="/LOGOS/flyhigh.svg" alt="Fly High" className="h-3 sm:h-6 w-auto dark:invert" draggable={false} />
              </div>
              <div className="opacity-80">
                <img src="/LOGOS/semanu studios.svg" alt="Semanu Studios" className="h-3 sm:h-6 w-auto dark:invert" draggable={false} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="flex-1" />

      {/* Contact Section - HIDDEN */}
      <section className="hidden w-full max-w-6xl mx-auto mb-16 contact-section mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left: Heading */}
          <div>
            <h2 className="text-5xl md:text-6xl font-bold leading-tight font-mono">
              <span className="text-neutral-700 dark:text-neutral-300">
                Open for Collabs
              </span>
              <br />
              <span className="text-neutral-900 dark:text-neutral-50">
                &amp; Commissions
              </span>
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
                  className="w-5 h-5 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
                </svg>
                <span className="text-blue-500 group-hover:underline">
                  0021.studio
                </span>
              </a>

              {/* Email */}
              <a
                href="mailto:gregory.gfx1@gmail.com"
                className="flex items-center gap-3 group"
              >
                <svg
                  className="w-5 h-5 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                <span className="text-blue-500 group-hover:underline">
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
                  className="w-full px-4 py-3 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 placeholder-neutral-400 dark:placeholder-neutral-500 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="jane@framer.com"
                  className="w-full px-4 py-3 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 placeholder-neutral-400 dark:placeholder-neutral-500 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Message
                </label>
                <textarea
                  placeholder="Send a message..."
                  rows="6"
                  className="w-full px-4 py-3 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 placeholder-neutral-400 dark:placeholder-neutral-500 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 resize-none"
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

// Inline hero sequence: show static outlined logo for 1s, then start the AnimatedLogo
function HeroLogoSequence({ theme = 'dark' }) {
  const [start, setStart] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStart(true), 1000); // show outline for 1s
    return () => clearTimeout(t);
  }, []);

  // Outline color: grey for dark mode on home page only
  const outlineColor = theme === 'dark' ? '#9CA3AF' : undefined; // tailwind gray-400

  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      {/* Render AnimatedLogo with `start` controlled; style color sets stroke via currentColor */}
      <AnimatedLogo start={start} className="w-full h-auto" style={{ color: outlineColor }} />
    </div>
  );
}
