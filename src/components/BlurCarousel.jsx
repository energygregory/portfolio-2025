import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Original set with labels
const baseItems = [
    { src: '/Images/2025/PNGS/png1.webp', label: 'William Ru — Kids Next Door "Numbuh 4" Hoodie', mobileLines: ['William Ru', 'Kids Next Door', '"Numbuh 4"', 'Hoodie'], slug: 'kids-next-door-hoodie' },
    { src: '/Images/2025/PNGS/png2.webp', label: 'William Ru — Notting Hill Pinstripe Shirt', mobileLines: ['William Ru', 'Notting Hill', 'Pinstripe Shirt'], slug: 'notting-hill-pinstripe-shirt' },
    { src: '/Images/2025/PNGS/png5.webp', label: 'William Ru — Stealth Camo Set', mobileLines: ['William Ru', 'Stealth Camo', 'Set'], slug: 'stealth-camo-set' },
];

// Create a repeated array to simulate infinite scroll
// 12 sets is usually enough buffer for 'infinite' feel if we reset scroll
const items = Array(12).fill(baseItems).flat();

const BlurCarousel = ({ textXOffset = -778, textYOffset = 0, textScale = 1, isIpad = false }) => {
    const containerRef = useRef(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    // Hardcoded ITEM SIZE (Mobile: 139px)
    // NOTE: Desktop uses hardcoded 500px in CSS below.
    const MOBILE_SIZE = 139;

    // Hardcoded MOBILE CONFIGURATION from user session
    const MOBILE_VERTICAL_GAP = 0;
    const MOBILE_X_POINTS = [90, 19, -65, -34]; // [Center, Next, Far, Edge]

    // DEBUG: Global Controls
    const [globalScale, setGlobalScale] = useState(1);
    const [globalX, setGlobalX] = useState(0);

    const handleScroll = () => {
        if (containerRef.current) {
            const el = containerRef.current;
            setScrollProgress(el.scrollTop);

            // Infinite Scroll "Teleport" Logic
            // If we get too close to the top or bottom, jump back to the middle
            // This prevents hitting the "end" and feeling stuck
            const threshold = el.scrollHeight / 4;
            
            if (el.scrollTop < threshold) {
                // Jump forward by half the total height
                el.scrollTop += el.scrollHeight / 2;
            } else if (el.scrollTop > el.scrollHeight - threshold) {
                // Jump backward by half
                el.scrollTop -= el.scrollHeight / 2;
            }
        }
    };

    useEffect(() => {
        const el = containerRef.current;
        if (el) {
            el.addEventListener('scroll', handleScroll, { passive: true });
            handleScroll();
            
            // Start in the middle to allow scrolling both ways "infinitely"
            // Wait for render
            setTimeout(() => {
                const scrollHeight = el.scrollHeight;
                el.scrollTop = scrollHeight / 2;
            }, 100);
        }
        return () => el && el.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        // Full width/height container
        <div className="relative w-full h-full mx-auto flex justify-start pl-0 overflow-hidden">
            
            {/* GLOBAL CONTROLS - HIDDEN */}
             {false && <div className="fixed top-28 right-4 z-[9999] bg-white/90 text-black p-2 rounded shadow flex flex-col gap-2 scale-90 origin-top-right">
                <div>
                     <div className="text-[10px] uppercase font-bold">Global Scale</div>
                    <input type="range" min="0.5" max="1.5" step="0.05" value={globalScale} onChange={(e) => setGlobalScale(parseFloat(e.target.value))} />
                     <div className="text-xs text-center">{globalScale}x</div>
                </div>
                 <div>
                    <div className="text-[10px] uppercase font-bold">Global X Pos</div>
                    <input type="range" min="-200" max="200" value={globalX} onChange={(e) => setGlobalX(parseInt(e.target.value))} />
                     <div className="text-xs text-center">{globalX}px</div>
                </div>
            </div>}




            <div 
                ref={containerRef}
                className="flex flex-col items-start overflow-y-auto overflow-x-hidden h-full w-full no-scrollbar snap-y snap-mandatory py-[30vh]"
                style={{
                    transform: `translateX(${globalX}px) scale(${globalScale})`,
                    transformOrigin: 'left center' 
                }}
            >
                {items.map((item, idx) => (
                    <CarouselItem 
                        key={idx} 
                        src={item.src}
                        label={item.label}
                        mobileLines={item.mobileLines}
                        slug={item.slug}
                        containerRef={containerRef} 
                        scrollTop={scrollProgress}
                        manualSize={MOBILE_SIZE}
                        verticalGap={MOBILE_VERTICAL_GAP}
                        xControlPoints={MOBILE_X_POINTS}
                        textXOffset={textXOffset}
                        textYOffset={textYOffset}
                        textScale={textScale}
                        isIpad={isIpad}
                    />
                ))}
            </div>
        </div>
    );
};

            const CarouselItem = ({ src, label, mobileLines, slug, containerRef, scrollTop, manualSize, verticalGap, xControlPoints, textXOffset, textYOffset, textScale, isIpad }) => {
    const itemRef = useRef(null);
    const navigate = useNavigate();
    const [style, setStyle] = useState({ opacity: 0.2, filter: 'blur(8px)', transform: 'translateX(0) scale(0.8)' });
    const [isCentered, setIsCentered] = useState(false);

    const handleClick = () => {
        if (!itemRef.current || !containerRef.current) return;
        
        const container = containerRef.current;
        const item = itemRef.current;
        
        // Calculate target to center this item
        // targetScrollTop = itemTop - (containerH / 2) + (itemH / 2)
        const containerH = container.clientHeight;
        const itemH = item.offsetHeight;
        const itemTop = item.offsetTop;
        
        const targetTop = itemTop - (containerH / 2) + (itemH / 2);
        
        container.scrollTo({
            top: targetTop,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        if (!itemRef.current || !containerRef.current) return;
        
        const container = containerRef.current;
        const item = itemRef.current;
        
        const containerRect = container.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        
        // Focal Point: Center of the visible container
        const focalPoint = containerRect.top + (containerRect.height / 2);
        const itemCenter = itemRect.top + (itemRect.height / 2);
        const dist = Math.abs(focalPoint - itemCenter);
        
        // Visual constants
        const maxDist = 500; // Range of effect
        let norm = Math.min(dist / maxDist, 1);
        
        // Easing: Linear for gradual blur from center
        const easedNorm = norm; 

        // Calculate Blur
        const maxBlur = 6;
        const blur = easedNorm * maxBlur; 
        
        // Calculate Opacity
        const opacity = 1 - (easedNorm * 0.7);
        
        // Calculate Scale
        const scale = 1.0 - (easedNorm * 0.2); 

        // CUSTOM CURVE INTERPOLATION
        // Calculate "index distance" (0, 1, 2, 3...)
        // Height of one item slot = Height + Gap
        // Note: For desktop fallback, height is 550px.
        // We need to use the actual visual height logic used in render style
        const isMobile = window.innerWidth < 640;
        const currentSize = isMobile ? manualSize : 500;
        const currentHeight = isMobile ? (manualSize + verticalGap) : 550;
        
        const indexDist = dist / currentHeight; 

        // Interpolate X based on control points
        const [p0, p1, p2, p3] = xControlPoints || [60, 40, 20, 0];
        
        let xShift = 0;
        
        if (indexDist < 1) {
            // Lerp between 0 and 1
            xShift = p0 + (p1 - p0) * indexDist;
        } else if (indexDist < 2) {
             // Lerp between 1 and 2
            xShift = p1 + (p2 - p1) * (indexDist - 1);
        } else {
             // Lerp between 2 and 3 (clamped)
             const d = Math.min(indexDist - 2, 1);
             xShift = p2 + (p3 - p2) * d;
        }

        // If not mobile, use old logic or ignore? 
        // User asked "for each item" presumably for the mobile view which has the issue.
        // Let's protect desktop from weird jumps if needed.
        if (!isMobile) {
            // Keep desktop logic simple for now or use the same curve but scaled?
            // Reverting to smooth linear for desktop to avoid regression unless requested
             const maxShift = 200;
             xShift = (1 - easedNorm) * maxShift; 
        }
        
        // Track if this item is the centered one (within half an item slot)
        setIsCentered(indexDist < 0.5);

        // Apply calculated styles
        setStyle({
            filter: `blur(${blur}px)`,
            opacity: opacity,
            transform: `translateX(${xShift}px) scale(${scale})`,
        });

    }, [scrollTop, verticalGap, xControlPoints]);

    return (
        <div 
            ref={itemRef}
            onClick={handleClick}
            className="snap-center shrink-0 w-full flex items-center justify-start transition-all duration-100 ease-out will-change-transform my-0 pl-0 cursor-pointer"
            // Adjust container height to be tighter
            style={{...style, height: window.innerWidth < 640 ? (manualSize + verticalGap) + 'px' : '550px'}}
        >
             {/* Image — no container, free sizing */}
            <img 
                src={src} 
                alt="" 
                className="object-contain"
                style={{
                    height: window.innerWidth < 640 ? manualSize + 'px' : '500px',
                    width: 'auto',
                    cursor: isCentered ? 'pointer' : 'default',
                }}
                onClick={(e) => {
                    if (isCentered && slug) {
                        e.stopPropagation();
                        navigate(`/williamru?item=${slug}`);
                    }
                }}
            />

            {/* Item label — visible only when centered */}
            {label && (() => {
              return (
                <div
                  className="absolute bottom-0 left-0 right-0 transition-opacity duration-300 sm:text-center"
                  style={{
                    opacity: isCentered ? 1 : 0,
                    pointerEvents: isCentered ? 'auto' : 'none',
                    cursor: isCentered ? 'pointer' : 'default',
                  }}
                  onClick={(e) => {
                    if (isCentered && slug) {
                      e.stopPropagation();
                      navigate(`/williamru?item=${slug}`);
                    }
                  }}
                >
                  {/* Mobile: multi-line right-aligned, pushed left */}
                  <div className="flex flex-col items-end text-right sm:hidden"
                    style={{ fontFamily: "'PT Mono', monospace", transform: 'translateX(-120px)', paddingRight: '16px' }}
                  >
                    {(mobileLines || []).map((line, i) => (
                      <span
                        key={i}
                        className={`uppercase ${
                          i === 0
                            ? 'text-[11px] tracking-[0.15em] text-neutral-500 dark:text-neutral-400'
                            : 'text-[9px] tracking-[0.12em] text-neutral-600 dark:text-neutral-500'
                        }`}
                        style={{ lineHeight: '1.4' }}
                      >
                        {line}
                      </span>
                    ))}
                  </div>
                  {/* Desktop: multi-line right-aligned, near image */}
                  <div className="hidden sm:flex flex-col items-end text-right"
                    style={{
                      fontFamily: "'PT Mono', monospace",
                      transform: `translateX(${textXOffset}px) translateY(${isIpad ? textYOffset : 0}px) scale(${isIpad ? textScale : 1})`,
                      transformOrigin: 'right center',
                      paddingRight: '16px'
                    }}
                  >
                    {(mobileLines || []).map((line, i) => (
                      <span
                        key={i}
                        className={`uppercase ${
                          i === 0
                            ? (isIpad
                                ? 'text-[19px] tracking-[0.24em] font-bold text-neutral-500 dark:text-neutral-300'
                                : 'text-base tracking-[0.15em] text-neutral-500 dark:text-neutral-400')
                            : (isIpad
                                ? 'text-[12px] tracking-[0.15em] font-medium text-neutral-600 dark:text-neutral-500'
                                : 'text-sm tracking-[0.12em] text-neutral-600 dark:text-neutral-500')
                        }`}
                        style={{ lineHeight: isIpad ? (i === 0 ? '1.2' : '1.35') : '1.5', opacity: i === 0 ? 1 : (isIpad ? 0.82 : 1) }}
                      >
                        {line}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })()}
        </div>
    );
};

export default BlurCarousel;
