import React, { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useParams, useNavigate } from "react-router-dom";
import BlurCarousel from "../components/BlurCarousel";
import Footer from "../components/Footer";
import ResponsiveImage from "../components/ResponsiveImage.jsx";

// Graphic Design Content Components (Placeholders for now)
const LogosContent = () => {
    const logos = [
      "/Images/2025/LOGOS/3.png",
      "/Images/2025/LOGOS/TERZO.png",
      "/Images/2025/LOGOS/BRAND-ONE.svg", 
      "/Images/2025/LOGOS/black.png",
      "/Images/2025/LOGOS/flyhigh.svg",
      "/Images/2025/LOGOS/GRUB2.png",
      "/Images/2025/LOGOS/en garde.svg",
      "/Images/2025/LOGOS/bubble logo 3.png",
      "/Images/2025/LOGOS/del marque.png",
      "/Images/2025/LOGOS/red logo full png without text.png"
    ];

    // State for mobile long-press preview and desktop scaling
    const [pressedImage, setPressedImage] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    // Hardcoded scales per user request (Initial State)
    const [logoScales, setLogoScales] = useState([
        0.90, 1.00, 0.65, // Row 1
        1.25, 1.20, 0.90, // Row 2
        0.90, 1.65, 0.80, // Row 3
        1.05              // Row 4
    ]);
    const [globalScale, setGlobalScale] = useState(0.95);
    // Spacing control (Padding)
    const [paddingX, setPaddingX] = useState(9); 
    const [paddingY, setPaddingY] = useState(0);
    // Grid Y Position
    const [gridY, setGridY] = useState(-30);
    // Mobile Controls Position (Hidden now)
    const [controlsY, setControlsY] = useState(-160);

    const handleScaleChange = (index, value) => {
      const newScales = [...logoScales];
      newScales[index] = parseFloat(value);
      setLogoScales(newScales);
    };

    useEffect(() => {
       const checkMobile = () => setIsMobile(window.innerWidth < 640);
       checkMobile();
       window.addEventListener('resize', checkMobile);
       return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleTouchStart = (src, e) => {
        if (!isMobile) return;
        setPressedImage({ src });
    };

    const handleTouchEnd = () => {
        setPressedImage(null);
    };
  
    return (
      <div className="w-full flex flex-col items-center">

         {/* Mobile Controls - Fixed Overlay (Hidden) */}
         <div 
            className="hidden fixed left-4 right-4 z-[100] flex-col items-center p-4 space-y-2 bg-neutral-100/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-xl border border-black/10 dark:border-white/10 shadow-2xl"
            style={{ bottom: `${controlsY}px` }}
         >
            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-0 opacity-80">Mobile Controls</h3>
            
            {/* Global Scale */}
            <div className="w-full flex flex-col items-center space-y-1">
                <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Global Scale: {globalScale.toFixed(2)}x</span>
                <input 
                type="range" 
                min="0.5" 
                max="2" 
                step="0.05" 
                value={globalScale}
                onChange={(e) => setGlobalScale(parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-400/50 dark:bg-gray-600/50 rounded-lg appearance-none cursor-pointer accent-black dark:accent-white"
                />
            </div>

            {/* Grid Y Position */}
            <div className="w-full flex flex-col items-center space-y-1">
                <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Grid Y: {gridY}px</span>
                <input 
                type="range" 
                min="-200" 
                max="200" 
                step="10" 
                value={gridY}
                onChange={(e) => setGridY(parseInt(e.target.value))}
                className="w-full h-1 bg-gray-400/50 dark:bg-gray-600/50 rounded-lg appearance-none cursor-pointer accent-black dark:accent-white"
                />
            </div>

            {/* Spacing Controls */}
            <div className="w-full grid grid-cols-2 gap-2">
                <div className="flex flex-col items-center space-y-1">
                    <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">H-Space: {paddingX}px</span>
                    <input 
                    type="range" 
                    min="0" 
                    max="60" 
                    step="1" 
                    value={paddingX}
                    onChange={(e) => setPaddingX(parseInt(e.target.value))}
                    className="w-full h-1 bg-gray-400/50 dark:bg-gray-600/50 rounded-lg appearance-none cursor-pointer accent-black dark:accent-white"
                    />
                </div>
                <div className="flex flex-col items-center space-y-1">
                    <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">V-Space: {paddingY}px</span>
                    <input 
                    type="range" 
                    min="0" 
                    max="60" 
                    step="1" 
                    value={paddingY}
                    onChange={(e) => setPaddingY(parseInt(e.target.value))}
                    className="w-full h-1 bg-gray-400/50 dark:bg-gray-600/50 rounded-lg appearance-none cursor-pointer accent-black dark:accent-white"
                    />
                </div>
            </div>

            {/* Controls Position Slider */}
            <div className="w-full flex flex-col items-center space-y-1 pt-2 border-t border-black/5 dark:border-white/5 mt-1">
                <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Controls Y: {controlsY}px</span>
                <input 
                type="range" 
                min="-200" 
                max="400" 
                step="5" 
                value={controlsY}
                onChange={(e) => setControlsY(parseInt(e.target.value))}
                className="w-full h-1 bg-gray-400/50 dark:bg-gray-600/50 rounded-lg appearance-none cursor-pointer accent-black dark:accent-white"
                />
            </div>
         </div>
         
         {/* Desktop Spacing Control Sliders (REMOVED per user request) */}
         {/* 
         <div className="hidden md:flex flex-row items-center justify-end w-full max-w-[1800px] px-8 py-4 gap-8">
            <div className="flex flex-col items-end space-y-2">
                <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Horizontal Spacing: {paddingX}px</span>
                <input 
                type="range" 
                min="0" 
                max="60" 
                step="1" 
                value={paddingX}
                onChange={(e) => setPaddingX(parseInt(e.target.value))}
                className="w-32 h-1 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-black dark:accent-white"
                />
            </div>
            <div className="flex flex-col items-end space-y-2">
                <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Vertical Spacing: {paddingY}px</span>
                <input 
                type="range" 
                min="0" 
                max="60" 
                step="1" 
                value={paddingY}
                onChange={(e) => setPaddingY(parseInt(e.target.value))}
                className="w-32 h-1 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-black dark:accent-white"
                />
            </div>
         </div>
         */}


         {/* Grid with faint inner lines - Fixed gap for constant line thickness */}
         <div 
             className="w-full grid grid-cols-3 md:grid-cols-5 gap-[1px] md:gap-[2px] bg-neutral-900/[0.0375] dark:bg-white/[0.075]"
             style={{ 
                 transform: `scale(${globalScale}) translateY(${gridY}px)`, 
                 transformOrigin: 'top center'
             }}
         >
            {logos.map((src, i) => (
              <div 
                key={i} 
                className="relative group aspect-square md:aspect-[4/3] flex items-center justify-center bg-white dark:bg-black select-none touch-none"
                onContextMenu={(e) => e.preventDefault()}
              >
                  {/* Individual Scale Slider - Desktop (Hover) */}
                   <div 
                        className={`
                            absolute bottom-1 left-0 right-0 z-20 flex flex-col items-center justify-center
                            md:opacity-0 md:group-hover:opacity-100 transition-opacity pointer-events-none space-y-1
                            hidden md:flex mb-1 md:mb-2 
                        `}
                   >
                        <span className="text-[8px] md:text-[10px] font-mono bg-black/50 text-white px-1 rounded backdrop-blur-sm">
                            {(logoScales[i] || 1).toFixed(2)}x
                        </span>
                        <input 
                            type="range" 
                            min="0.5" 
                            max="3" 
                            step="0.05" 
                            value={logoScales[i] || 1}
                            onChange={(e) => handleScaleChange(i, e.target.value)}
                            className="w-16 md:w-24 h-1 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-black dark:accent-white shadow-sm pointer-events-auto opacity-70 hover:opacity-100"
                            onClick={(e) => e.stopPropagation()}
                            onTouchStart={(e) => e.stopPropagation()} 
                        />
                   </div>

                   {/* Tap target wrapper - Padding applied here for spacing without affecting grid lines */}
                   <div 
                      className="w-full h-full p-8 md:p-8 flex items-center justify-center"
                      style={
                         isMobile 
                         ? { padding: `${Math.max(4, 32 + paddingY)}px ${Math.max(4, 32 + paddingX)}px` } // Mobile: apply dynamic padding
                         : { padding: `${32 + paddingY}px ${32 + paddingX}px` } // Desktop: apply dynamic padding (previously hardcoded, aligned with mobile logic now)
                      }
                      onTouchStart={(e) => {
                         // Stop propagation to prevent grid scrolling issues? 
                         // No, we want to allow scrolling if not pressed.
                         handleTouchStart(src, e);
                      }}
                      onTouchEnd={handleTouchEnd}
                      onTouchCancel={handleTouchEnd}
                   >
                        {/* Light Mode: Mask with Black */}
                        <div 
                            className="block dark:hidden w-full h-full bg-black pointer-events-none transition-transform duration-200"
                            style={{
                            maskImage: `url('${src}')`,
                            maskSize: 'contain',
                            maskRepeat: 'no-repeat',
                            maskPosition: 'center',
                            WebkitMaskImage: `url('${src}')`,
                            WebkitMaskSize: 'contain',
                            WebkitMaskRepeat: 'no-repeat',
                            WebkitMaskPosition: 'center',
                            // Apply individual scale only
                            transform: `scale(${logoScales[i] || 1})`
                            }}
                        />

                        {/* Dark Mode: Mask with #4d4d4d */}
                        <div 
                            className="hidden dark:block w-full h-full bg-[#4d4d4d] pointer-events-none transition-transform duration-200"
                            style={{
                            maskImage: `url('${src}')`,
                            maskSize: 'contain',
                            maskRepeat: 'no-repeat',
                            maskPosition: 'center',
                            WebkitMaskImage: `url('${src}')`,
                            WebkitMaskSize: 'contain',
                            WebkitMaskRepeat: 'no-repeat',
                            WebkitMaskPosition: 'center',
                            // Apply individual scale only
                            transform: `scale(${logoScales[i] || 1})`
                            }}
                        />
                   </div>
              </div>
            ))}
            {/* Fill empty cells */}
            {(() => {
                const cols = isMobile ? 3 : 5;
                const remainder = logos.length % cols;
                const emptyCells = remainder === 0 ? 0 : cols - remainder;
                return [...Array(emptyCells)].map((_, i) => (
                    <div key={`empty-${i}`} className="bg-white dark:bg-black" />
                ));
            })()}
         </div>

         {/* Mobile pressed image popup - fixed overlay */}
         {pressedImage && (
            <div 
              className="fixed inset-0 z-[200] pointer-events-none flex items-center justify-center p-8 bg-white/90 dark:bg-black/90 transition-colors duration-200"
            >
              <div 
                className="w-full max-w-[80vw] aspect-square flex items-center justify-center bg-transparent p-4 transition-transform duration-300 scale-110"
              >
                  {/* Dynamic color for preview: Black in Light Mode, White in Dark Mode */}
                   <div 
                     className="block dark:hidden w-full h-full bg-black shadow-2xl"
                     style={{
                       maskImage: `url('${pressedImage.src}')`,
                       maskSize: 'contain',
                       maskRepeat: 'no-repeat',
                       maskPosition: 'center',
                       WebkitMaskImage: `url('${pressedImage.src}')`,
                       WebkitMaskSize: 'contain',
                       WebkitMaskRepeat: 'no-repeat',
                       WebkitMaskPosition: 'center'
                     }}
                   />
                   <div 
                     className="hidden dark:block w-full h-full bg-[#4d4d4d] shadow-2xl"
                     style={{
                       maskImage: `url('${pressedImage.src}')`,
                       maskSize: 'contain',
                       maskRepeat: 'no-repeat',
                       maskPosition: 'center',
                       WebkitMaskImage: `url('${pressedImage.src}')`,
                       WebkitMaskSize: 'contain',
                       WebkitMaskRepeat: 'no-repeat',
                       WebkitMaskPosition: 'center'
                     }}
                   />
              </div>
            </div>
         )}
      </div>
    );
};
const PostersContent = () => {
    // Localhost detection (extended to include local network IPs for mobile testing)
    const isLocalhost = typeof window !== 'undefined' && 
        (window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1' || 
         window.location.hostname === '' ||
         window.location.hostname.startsWith('192.168.') ||
         window.location.hostname.startsWith('10.'));
    
    // State for the strict poster stack interaction
    const [currentIndex, setCurrentIndex] = useState(0);
    // Poster position/scale sliders (mobile only)
    const [posterY, setPosterY] = useState(0);
    const [posterScale, setPosterScale] = useState(1);

    // Poster images with Dimensions for Masonry Layout
    // Width is fixed by column width (TILE_W), Height is calculated by aspect ratio (H/W)
    const posterData = [
      { src: "/Images/2025/POSTERS/post00.jpg", aspectRatio: 0.707 },   // 2480/3508
      { src: "/Images/2025/POSTERS/full.png", aspectRatio: 1.0 },      // full.png (square)
      { src: "/Images/2025/POSTERS/post.jpg", aspectRatio: 0.707 },     // 2480/3508
      { src: "/Images/2025/POSTERS/post0.jpg", aspectRatio: 0.707 },    // 2480/3508
      { src: "/Images/2025/POSTERS/snap1.jpg", aspectRatio: 1.25 },     // 1349/1080
      { src: "/Images/2025/POSTERS/snap2.jpg", aspectRatio: 1.25 },     // 1347/1080
      { src: "/Images/2025/POSTERS/final.png", aspectRatio: 1.778 },// 1920/1080
      { src: "/Images/2025/POSTERS/thank_you.png", aspectRatio: 1.778 },// 1920/1080
      { src: "/Images/2025/POSTERS/50f5a5175916607.64bbce5a0894e.jpg", aspectRatio: 1.25 }, // 1350/1080
      { src: "/Images/2025/POSTERS/FzT_IJUWwAEHrOK.jpeg", aspectRatio: 1.25 }, // 1350/1080
      { src: "/Images/2025/POSTERS/afterparty.png", aspectRatio: 1.778 }, // 1920/1080
      { src: "/Images/2025/POSTERS/ypee.jpg", aspectRatio: 1.0 },      // 3000/3000
      { src: "/Images/2025/POSTERS/JINJA main.png", aspectRatio: 1.778 }, // 1920/1080
      { src: "/Images/2025/POSTERS/gb & gr.png", aspectRatio: 1.0 },   // gb & gr.png (square)
      { src: "/Images/2025/POSTERS/anticipate.png", aspectRatio: 1.25 }, // 2700/2160 = 1.25
      { src: "/Images/2025/POSTERS/final final.png", aspectRatio: 1.778 }, // 1920/1080
      { src: "/Images/2025/POSTERS/main flyer cod.png", aspectRatio: 1.778 }, // 1920/1080
      { src: "/Images/2025/POSTERS/tyc1.png", aspectRatio: 1.25 },
    ];

    const posterCount = posterData.length;
    const PRIORITY_COUNT = 10;
    const CONCURRENCY = 12;

    // Preload strategy: preload AVIF variants (the format browsers actually use)
    // to avoid wasted bandwidth on original files the <picture> element won't select.
    useEffect(() => {
      let cancelled = false;
      const head = typeof document !== 'undefined' ? document.head : null;
      const addedLinks = [];

      // Helper to get AVIF URL for a given source
      const toAvif = (src, width) => {
        const base = src.replace(/\.[^.]+$/, '');
        return width ? `${base}@${width}.avif` : `${base}.avif`;
      };

      // Preload first batch as AVIF at the size the browser will actually use
      // Desktop tiles are 300px → 400w is perfect (or 800w for retina)
      const preloadWidth = window.devicePixelRatio > 1 ? 800 : 400;
      for (let i = 0; i < Math.min(PRIORITY_COUNT, posterData.length); i++) {
        try {
          const url = toAvif(posterData[i].src, preloadWidth);
          if (head) {
            const l = document.createElement('link');
            l.rel = 'preload';
            l.as = 'image';
            l.type = 'image/avif';
            l.href = url;
            head.appendChild(l);
            addedLinks.push(l);
          }
        } catch (e) {
          // ignore
        }
      }

      // Helper to load a single image as AVIF and decode it
      const loadImage = (src) => new Promise((resolve) => {
        try {
          const img = new Image();
          img.onload = () => {
            if (img.decode) {
              img.decode().then(() => resolve()).catch(() => resolve());
            } else {
              resolve();
            }
          };
          img.onerror = () => resolve();
          img.src = toAvif(src, preloadWidth);
        } catch (err) {
          resolve();
        }
      });

      // Background preload remaining images with high concurrency
      const backgroundPreload = async () => {
        const remaining = posterData.slice(PRIORITY_COUNT);
        let idx = 0;
        const workers = new Array(CONCURRENCY).fill(null).map(async () => {
          while (!cancelled && idx < remaining.length) {
            const i = idx++;
            await loadImage(remaining[i].src);
          }
        });
        await Promise.all(workers);
      };

      if (typeof window !== 'undefined') {
        const id = window.requestAnimationFrame(() => {
          backgroundPreload().catch(() => {});
        });
        return () => {
          cancelled = true;
          window.cancelAnimationFrame(id);
          if (head) addedLinks.forEach(l => l.remove());
        };
      }
      return () => {
        cancelled = true;
        if (head) addedLinks.forEach(l => l.remove());
      };
    }, [posterData]);
    
    // Indices for special rules (update these based on new array order if needed)
    // ooo_final is index 7
    // thank_you is index 8
    const oooIndex = 7;
    const thankYouIndex = 8;

    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // --- DESKTOP INFINITE GRID STATE ---
    // Start offset at (0,0) or centered? (0,0) works for infinite.
    // Use Ref for animation values to prevent React render stutter
    const stateRef = useRef({
        offset: { x: 0, y: 0 },
        animTime: 0,
        lastPos: { x: 0, y: 0 },
        isDragging: false
    });

    // Force render state for the animation loop
    const [tick, setTick] = useState(0);
    // expandedSrc removed — we use hover-to-colour instead of click-to-expand
    const [hoveredPosterIndex, setHoveredPosterIndex] = useState(null);
    const containerRef = useRef(null);

    // Grid Params
    const TILE_W = 300;
    // TILE_H is now variable per item (H/W * TILE_W)
    const GAP_X = 7; // Reduced spacing to 7px (Fixed)
    const GAP_Y = 7; // Reduced spacing to 7px (Fixed)
    const ANIM_SPEED = 0.05; // Even smoother slow drift
    
    // Helper to check critical conflicts
    const isConflict = (id1, id2) => {
        if (id1 === id2) return true; // Direct duplicate
        // No adjacent ooo_final and thank_you
        if ((id1 === oooIndex && id2 === thankYouIndex) || (id1 === thankYouIndex && id2 === oooIndex)) return true;
        return false;
    };

    // Generate MULTIPLE distinct layouts to prevent horizontal alignment
    // STRATEGY: PARITY-BASED POOLS
    // We split the 20 posters into two disjoint sets: Pool A (Evens) and Pool B (Odds).
    // Even columns (0, 2, 4...) ONLY sample from Pool A.
    // Odd columns (1, 3, 5...) ONLY sample from Pool B.
    // This mathematically guarantees that no poster in Col N can ever appear in Col N-1 or Col N+1.
    const columnLayouts = useMemo(() => {
        const NUM_COLS_TO_GEN = 15; // Sufficient variants
        const SEQ_LENGTH = 100;     // Length of sequence
        
        // Define Pools
        // We have 20 items. 
        // Pool A: indices 0-9
        // Pool B: indices 10-19
        // Special check: oooIndex (7) and thankYouIndex (8) are both in Pool A.
        // We must handle their adjacency rule specifically within Pool A generation.
        
        const poolA = Array.from({ length: 9 }, (_, k) => k);      // 0..8
        const poolB = Array.from({ length: 9 }, (_, k) => k + 9); // 9..17
        
        // Helper to generate a random sequence from a pool with constraints
        const generateSequence = (pool) => {
             const seq = [];
             let last = -1;
             for (let i = 0; i < SEQ_LENGTH; i++) {
                 const candidates = pool.filter(idx => {
                     // Rule 1: No vertical duplicate
                     if (idx === last) return false;
                     // Rule 2: Special rule (only matters if both are in this pool)
                     if (isConflict(idx, last)) return false;
                     return true;
                 });
                 
                 // Shuffle candidates to ensure randomness each time (not just first valid)
                 if (candidates.length > 0) {
                     const pick = candidates[Math.floor(Math.random() * candidates.length)];
                     seq.push(pick);
                     last = pick;
                 } else {
                     // Fallback (should be impossible with 10 items)
                     seq.push(pool[0]);
                     last = pool[0];
                 }
             }
             return seq;
        };
        
        const layouts = [];
        for (let c = 0; c < NUM_COLS_TO_GEN; c++) {
            // Even columns -> Pool A, Odd columns -> Pool B
            const isEven = c % 2 === 0;
            const sourcePool = isEven ? poolA : poolB;
            
            // Generate sequence
            // Note: Since each column is independently random within its pool, 
            // and pools are disjoint, we don't need to check neighbors.
            const indices = generateSequence(sourcePool);
            
            // Build layout object
             const items = [];
             let currentY = 0;
             indices.forEach(idx => {
               let itemR = Number(posterData[idx].aspectRatio) || 1;
               if (!isFinite(itemR) || itemR <= 0) itemR = 1;
               // Clamp computed height to avoid extreme tall/short tiles (prevents layout breakage)
               const rawH = TILE_W * itemR;
               const minH = Math.max(80, TILE_W * 0.4);
               const maxH = Math.max(200, TILE_W * 2);
               const itemH = Math.min(Math.max(rawH, minH), maxH);
                items.push({
                   y: currentY,
                   height: itemH,
                   index: idx
                });
                currentY += itemH + GAP_Y;
             });
             layouts.push({ items, totalHeight: currentY });
        }

        return layouts;
    }, [posterCount, TILE_W, GAP_Y]);

    /* REMOVE OLD single randomizedSequence and sequenceLayout */

    // Gradient (hardcoded for desktop + iPad per request)
    const GRADIENT_START = 10; // Percentage (hardcoded)
    const GRADIENT_END = 42; // Percentage (hardcoded)

    // Tablet detection: treat iPad widths as tablet (no hover-to-colour)
    const [isTablet, setIsTablet] = useState(false);
    useEffect(() => {
      const m = window.matchMedia('(min-width: 641px) and (max-width: 1024px)');
      const handler = (e) => setIsTablet(e.matches);
      setIsTablet(m.matches);
      if (m.addEventListener) m.addEventListener('change', handler); else m.addListener(handler);
      return () => { if (m.removeEventListener) m.removeEventListener('change', handler); else m.removeListener(handler); };
    }, []);
    
    // Single Loop for Animation + Render
    useEffect(() => {
        if (isMobile) return;
        
        let frameId;
        const loop = () => {
            stateRef.current.animTime += ANIM_SPEED;
            setTick(t => t + 1); // Trigger render at 60fps
            frameId = requestAnimationFrame(loop);
        };
        
        frameId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(frameId);
    }, [isMobile]);

    // Mouse/Touch Handlers for Desktop Pan
    // These update refs directly to avoid fighting the render loop
    const handleMouseDown = (e) => {
        if(isMobile) return;
        stateRef.current.isDragging = true;
        stateRef.current.lastPos = { x: e.clientX, y: e.clientY };
        e.preventDefault(); // Prevent text selection
    };

    const handleMouseMove = (e) => {
        if (!stateRef.current.isDragging) return;
        const dx = e.clientX - stateRef.current.lastPos.x;
        const dy = e.clientY - stateRef.current.lastPos.y;
        
        stateRef.current.offset.x += dx;
        stateRef.current.offset.y += dy;
        stateRef.current.lastPos = { x: e.clientX, y: e.clientY };
        // No setState here! The loop picks it up.
    };

    const handleMouseUp = () => {
        stateRef.current.isDragging = false;
    };

    const handleWheel = (e) => {
        // Optional: Map scroll wheel to pan
        const dx = -e.deltaX;
        const dy = -e.deltaY;
        stateRef.current.offset.x += dx;
        stateRef.current.offset.y += dy;
    };


    /* 
     * STRICT POSTER-ONLY ARRANGEMENT (React Implementation)
     * No containers/boxes. Styles applied directly to poster elements.
     * Central poster centered at 100% opacity.
     * Side posters fanning out, reduced opacity, scaled down, sitting underneath.
     */
    if (isMobile) {
      if (isLocalhost) {
        const handlePosterClick = (index) => {
          setCurrentIndex(index);
        };

        const handleTouchStart = (e) => {
          stateRef.current.startX = e.touches[0].clientX;
        };

        const handleTouchEnd = (e) => {
          const deltaX = stateRef.current.startX - e.changedTouches[0].clientX;
          if (deltaX > 50 && currentIndex < posterData.length - 1) {
            setCurrentIndex(prev => prev + 1);
          } else if (deltaX < -50 && currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
          }
        };

        return (
          <>
          {/* Poster Controls - fixed at bottom, separate from poster container */}
          <div className="fixed bottom-24 left-4 right-4 z-[201] flex flex-col gap-2 p-3 bg-black/10 backdrop-blur-sm rounded-xl border border-white/10 pointer-events-auto">
            <div className="text-[10px] font-bold text-center uppercase tracking-widest">Poster Controls</div>
            <div className="flex justify-between text-[10px] items-center">
              <span>Y: {posterY}</span>
              <input type="range" min="-300" max="300" step="1" value={posterY} onChange={(e) => setPosterY(parseInt(e.target.value))} className="w-32 accent-blue-500"/>
            </div>
            <div className="flex justify-between text-[10px] items-center">
              <span>Scale: {posterScale.toFixed(2)}</span>
              <input type="range" min="0.3" max="2" step="0.05" value={posterScale} onChange={(e) => setPosterScale(parseFloat(e.target.value))} className="w-32 accent-blue-500"/>
            </div>
          </div>
          <div 
            className="fixed inset-0 top-0 z-[50] w-full h-full flex items-center justify-center bg-transparent pointer-events-auto overflow-hidden"
            style={{ 
              perspective: '1200px',
              touchAction: 'none',
              transform: `translateY(${posterY}px) scale(${posterScale})`
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {posterData.map((poster, index) => {
              const offset = index - currentIndex;
              const absOffset = Math.abs(offset);
              
              // Only render posters within a visible range to save resources/DOM clutter
              if (absOffset > 5) return null;

              const isActive = offset === 0;
              // z-index: Main is on top (100). Further away = lower z-index.
              const zIndex = 100 - absOffset;
              // Opacity: Main 100%, near 70%, far 40% (approx by formula)
              const opacity = isActive ? 1 : Math.max(0.2, 0.8 - (absOffset * 0.2));
              // Scale: Main 1.1 (or 1), others 0.8
              const scale = isActive ? 1.1 : 0.8;
              
              // TranslateX: Fan out. 
              // The user script used: offset * 45 (percent?)
              // Let's use percentage relative to viewport width or just px.
              // Logic: offset * 45% of translation.
              // Since they are absolute centered, translateX moves them left/right.
              const translateX = offset * 45; // %
              
              // TranslateZ: Push back side posters
              const translateZ = absOffset * -150; // px
              
              const rotateY = 0; // The prompt didn't strictly specify rotation, typically strictly vertical meant flat? 
              // User script snippet: transform: `translateX(${translateX}%) translateZ(${translateZ}px) scale(${scale})` 
              // It does NOT have rotateY.

              return (
                <ResponsiveImage
                  key={index}
                  src={poster.src}
                  alt={`Poster ${index}`}
                  className="absolute object-contain transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
                  style={{
                    width: '75vw',
                    height: 'auto',
                    maxHeight: '80vh',
                    zIndex: zIndex,
                    opacity: opacity,
                    transform: `translateX(${translateX}%) translateZ(${translateZ}px) scale(${scale})`,
                    // Box shadow only on active, no borders/boxes
                    boxShadow: isActive ? '0 20px 50px rgba(0,0,0,0.5)' : 'none',
                    pointerEvents: 'auto',
                    left: '12.5%', // (100 - 75) / 2 = 12.5% to center horizontally with w=75vw
                    right: '12.5%',
                    filter: isActive ? 'none' : 'grayscale(100%)',
                    transition: 'filter 0.5s ease, transform 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.5s cubic-bezier(0.4,0,0.2,1)',
                  }}
                  onClick={() => handlePosterClick(index)}
                  loading={Math.abs(index - currentIndex) < 2 ? "eager" : "lazy"}
                />
              );
            })}
          </div>
          </>
        );
      }
      
      // OLD Mobile: Duplicate the poster row (fallback for non-localhost/prod for now as requested?)
      // User said: "On mobile only, implement this for the posters page... using only the posters allowed..."
      // AND "bring back the sliders for localhost... on mobile localhost, implement this"
      // So I will keep the existing prod implementation below for now, as requested.
      return (
        <div className="fixed inset-0 top-[100px] z-[50] w-full flex flex-col items-center bg-transparent pointer-events-auto"> 
          <div className="w-full h-full flex items-center overflow-x-auto no-scrollbar pb-12 pt-12 pl-[15vw] pr-[50vw]">
            <div className="flex flex-col items-center" style={{ height: '80vh' }}>
                        {/* Split posters: portraits on top, landscapes on bottom */}
                        {(() => {
                          const portraits = posterData.filter(p => (Number(p.aspectRatio) || 1) < 1);
                          const landscapes = posterData.filter(p => (Number(p.aspectRatio) || 1) >= 1);
                          return (
                            <>
                            <div className="flex items-center mb-12 z-40" style={{ height: '60vh' }}>
                              {portraits.map((item, i) => {
                                const rotate = (i % 5 - 2) * 3;
                                const origIndex = posterData.findIndex(p => p.src === item.src);
                                return (
                                  <ResponsiveImage
                                    key={`dup-${i}`}
                                    src={item.src}
                                    alt={`Poster duplicate ${i + 1}`}
                                    className="flex-shrink-0 w-[50vw] max-w-[260px] object-contain pointer-events-none transition-transform duration-300"
                                    loading={origIndex >= 0 && origIndex < PRIORITY_COUNT ? 'eager' : 'lazy'}
                                    style={{
                                      marginLeft: i === 0 ? 0 : '-45vw',
                                      transform: `rotate(${rotate}deg)`,
                                      zIndex: 1000 - i,
                                      display: 'block'
                                    }}
                                  />
                                );
                              })}
                            </div>

                            <div className="flex items-center z-30 mt-6" style={{ height: '60vh' }}>
                              {landscapes.map((item, i) => {
                                const rotate = (i % 5 - 2) * 3;
                                const origIndex = posterData.findIndex(p => p.src === item.src);
                                return (
                                  <ResponsiveImage
                                    key={`main-${i}`}
                                    src={item.src}
                                    alt={`Poster ${i + 1}`}
                                    className="flex-shrink-0 w-[60vw] max-w-[300px] object-contain pointer-events-none transition-transform duration-300"
                                    loading={origIndex >= 0 && origIndex < PRIORITY_COUNT ? 'eager' : 'lazy'}
                                    style={{
                                      marginLeft: i === 0 ? 0 : '-45vw',
                                      transform: `rotate(${rotate}deg)`,
                                      zIndex: i,
                                      display: 'block'
                                    }}
                                  />
                                );
                              })}
                            </div>
                            </>
                          );
                        })()}
            </div>
          </div>
        </div>
      );
    }

    // Expanded modal removed — hover-to-colour replaces click expansion

    // Infinite Grid Render via Portal to escape parent transforms/clipping
    if (typeof document === 'undefined') return null;

    return createPortal(
      <>
      {/* Gradient Controls (Dev Tool) */}
        {/* Gradient controls removed — values hardcoded to GRADIENT_START / GRADIENT_END */}

      <div 
        ref={containerRef}
        className="fixed inset-0 w-full h-full overflow-hidden cursor-grab active:cursor-grabbing select-none bg-transparent pointer-events-auto"
        style={{ 
            zIndex: 0, // 0 to sit behind z-10 content but above -z global background
             // Dynamic Mask Image based on controls
               maskImage: `linear-gradient(to bottom, transparent 0%, transparent ${GRADIENT_START}%, black ${GRADIENT_END}%, black 100%)`,
               WebkitMaskImage: `linear-gradient(to bottom, transparent 0%, transparent ${GRADIENT_START}%, black ${GRADIENT_END}%, black 100%)`
        }} 
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <div className="w-full h-full">
        {/* Render visible tiles */}
        {(() => {
             // Read current values from Ref
             const currentOffset = stateRef.current.offset;
             const currentAnimTime = stateRef.current.animTime;
             const isDragging = stateRef.current.isDragging;

             // We render a grid relative to the offset.
             // Tile (c, r) pos = (c * itemW + offset.x, masonry_y + offset.y)
             // We want to find min/max C and R such that tiles are visible.
             // Viewport W/H:
             // Since it's fixed w-screen h-screen, use window dimensions or ref
             const vpW = typeof window !== 'undefined' ? window.innerWidth : 1500;
             const vpH = typeof window !== 'undefined' ? window.innerHeight : 1000;
             
             const itemW = TILE_W + GAP_X;
             
             // Visible range in columns
             // left_edge_x = c * itemW + offset.x > -TILE_W
             const minCol = Math.floor((-currentOffset.x - TILE_W) / itemW);
             const maxCol = Math.ceil((-currentOffset.x + vpW) / itemW);
             
             const tiles = [];
             for (let c = minCol; c <= maxCol; c++) {
                 // Ambient Drift: Even columns move down, Odd columns move up
                 // This happens constantly regardless of user interaction
                 const colDrift = (c % 2 === 0 ? 1 : -1) * currentAnimTime;
                 
                 // Effective Vertical Offset for this column combines user drag (offset.y) plus ambient drift
                 const effectiveOffsetY = currentOffset.y + colDrift;
                 
                 // Select different layout variant for this column to prevent horizontal alignment
                 // Use Positive Modulo to ensure negative indices map correctly
                 // We have generated 15 distinct column layouts that loosely coordinate with neighbors
                 const variantIdx = ((c % 15) + 15) % 15;
                 const { items, totalHeight } = columnLayouts[variantIdx];

                 // Visible Range:
                 const visibleMinY = -effectiveOffsetY - 400;
                 const visibleMaxY = -effectiveOffsetY + vpH + 400;
                 
                 const minBlock = Math.floor(visibleMinY / totalHeight);
                 const maxBlock = Math.floor(visibleMaxY / totalHeight);
                 
                 for (let b = minBlock; b <= maxBlock; b++) {
                     const blockY = b * totalHeight; 
                     
                     for (let i = 0; i < items.length; i++) {
                        const item = items[i];
                        const absoluteY = blockY + item.y;
                        
                        if (absoluteY + item.height > visibleMinY && absoluteY < visibleMaxY) {
                             tiles.push(
                                 <div
                                    key={`c${c}-b${b}-i${i}`} // Unique key
                             
                                    onMouseEnter={() => setHoveredPosterIndex(item.index)}
                                    onMouseLeave={() => setHoveredPosterIndex(null)}
                                    className="absolute will-change-transform" 
                                    style={{
                                        // Use translate3d for hardware accel
                                        transform: `translate3d(${c * itemW + currentOffset.x}px, ${absoluteY + effectiveOffsetY}px, 0)`,
                                        top: 0,
                                        left: 0,
                                        width: TILE_W,
                                        height: item.height, // Variable Height!
                                    }}
                                 >
                                    <div className="w-full h-full flex items-center justify-center bg-black">
                                        {/* Use object-contain to ensure NO cutting, with black background filling gaps if any (though tiles fit generally) */}
                                        <ResponsiveImage
                                          src={posterData[item.index].src}
                                          className="w-full h-full block pointer-events-none select-none object-contain transition-all duration-200"
                                          sizes="300px"
                                          style={{
                                            filter: isTablet ? 'none' : (hoveredPosterIndex === item.index ? 'grayscale(0%)' : 'grayscale(100%)')
                                          }}
                                          fetchPriority={item.index < PRIORITY_COUNT ? 'high' : undefined}
                                          loading="eager"
                                        />
                                    </div>
                                 </div>
                             );
                        }
                     }
                 }
             }
             return tiles;
        })()}
        </div>
      </div>
      </>,
      document.body
    );
};
const VisualDesignContent = () => <div className="p-4 text-center">Visual Design content gallery will go here</div>;
const PackagingContent = () => {
    const images = [
        "/Images/2025/PACKAGING/Free 2 Plastic Pouch PSD Mockup.png",
        "/Images/2025/PACKAGING/Group 3.png"
    ];

    return (
        <div className="w-full flex flex-col items-center gap-12 px-4 pb-32 pt-12">
            {images.map((src, i) => (
                <div key={i} className="flex justify-center w-full">
                    <img 
                        src={src} 
                        className="max-w-full md:max-w-4xl max-h-[85vh] w-auto h-auto object-contain shadow-2xl" 
                        loading="lazy"
                    />
                </div>
            ))}
        </div>
    );
};
const TechpackContent = () => <div className="p-4 text-center w-full flex-grow flex items-center justify-center">Techpack Design content gallery will go here</div>;
const RecentsContent = () => {
  return (
    <div 
      className="fixed inset-x-0 top-0 overflow-hidden z-[1]" 
      style={{ 
        height: '100vh',
        transform: 'translateY(-236px) scale(1.15)',
        transformOrigin: 'top center',
      }}
    >
      <video
        src="/RECENTS/Untitledd.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      />
    </div>
  );
};

// RECENTS CONTAINER — Reserved for future use.
// Same size and position as the RecentsContent video.
// To activate: replace RecentsContent usage in getContentForItem with RecentsContainer,
// or render RecentsContainer alongside/instead of the video.
const RecentsContainer = () => {
  return (
    <div 
      className="fixed inset-x-0 top-0 overflow-hidden z-[2]" 
      style={{ 
        height: '100vh',
        transform: 'translateY(-236px) scale(1.15)',
        transformOrigin: 'top center',
      }}
    >
      {/* Future content goes here */}
    </div>
  );
};
const BrandContent = () => {
  const brandItems = [
    {
      thumb: '/Images/2025/Brand design/brand guidelines-2_thumb.jpg',
      pdf: '/Images/2025/Brand design/brand guidelines-2.pdf',
      title: 'BRAND GUIDELINES',
    },
    {
      thumb: '/Images/2025/Brand design/Educ8Africa New Proposed Identity_thumb.jpg',
      pdf: '/Images/2025/Brand design/Educ8Africa New Proposed Identity.pdf',
      title: 'EDUC8AFRICA IDENTITY',
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-start justify-items-center">
      {brandItems.map((item, i) => (
        <a
          key={i}
          href={item.pdf}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-4 group cursor-pointer"
        >
          <div className="relative transition-transform duration-500 hover:scale-[1.02] hover:shadow-2xl rounded-lg overflow-hidden">
            <img
              src={item.thumb}
              alt={item.title}
              className="w-full max-w-[90vw] md:max-w-full h-auto"
              loading="lazy"
            />
          </div>
        </a>
      ))}
    </div>
  );
};

const getContentForItem = (item) => {
  switch(item) {
    case 'LOGOS': return <LogosContent />;
    case 'POSTERS': return <PostersContent />;
    case 'VISUAL DESIGN': return <VisualDesignContent />;
    case 'PACKAGING DESIGN': return <PackagingContent />;
    case 'TECHPACK DESIGN': return <TechpackContent />;
    case 'BRAND DESIGN': return <BrandContent />;
    case 'RECENTS': return <RecentsContent />;
    default: return null;
  }
};

const GraphicDesignSection = ({ items, onDetailViewChange, selectedItem, setSelectedItem }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const navigate = useNavigate();

  // Responsive values
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Lock Body Scroll when POSTERS or RECENTS is selected (Fixed Page View)
  useEffect(() => {
    if ((selectedItem === 'POSTERS' || selectedItem === 'RECENTS') && !isMobile) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh'; 
      document.documentElement.style.overflow = 'hidden';
    } else if (selectedItem === 'RECENTS' && isMobile) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh'; 
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.documentElement.style.overflow = '';
    };
  }, [selectedItem, isMobile]);

  // Notify parent when state changes (legacy support or side effects)
  useEffect(() => {
    onDetailViewChange(!!selectedItem);
  }, [selectedItem, onDetailViewChange]);

  // Height for the list view to maintain spacing
  // Desktop: 120px gap
  // Mobile: 105px gap
  const ITEM_HEIGHT = isMobile ? 90 : 120; 
  const TOP_OFFSET = isMobile ? -20 : 40;   

  const mobileHeightAdjustment = 0;

  return (
    <div className="relative w-full flex-grow flex flex-col transition-all duration-700 ease-in-out">
      {/* List Items / Header Title */}
      <div 
        className="relative w-full flex-shrink-0"
        style={{ 
          height: selectedItem ? '0px' : `${(items.length * ITEM_HEIGHT) - mobileHeightAdjustment}px`,
          transition: 'height 500ms ease-in-out'
        }}
      >
        {items.map((item, idx) => {
          const isSelected = selectedItem === item;
          const isOther = selectedItem && !isSelected;
          
          return (
            <div 
              key={idx}
              className={`absolute transition-all duration-700 ease-[0.165,0.84,0.44,1] group cursor-pointer flex items-center hover:z-50 pointer-events-auto ${
                isOther ? 'opacity-0 pointer-events-none ease-in duration-300' : 'opacity-100'
              } ${
                (item === 'RECENTS' && isSelected) ? 'opacity-0 pointer-events-none' : ''
              }`}
              style={{
                top: selectedItem 
                  ? (item === 'RECENTS' ? '-9999px' : (isMobile ? '-75px' : '-160px'))
                  : `${idx * ITEM_HEIGHT + TOP_OFFSET}px`,
                
                left: selectedItem ? '24px' : '50%',
                transform: selectedItem 
                  ? (isMobile ? 'translate(0, 0) scale(0.7)' : 'translate(0, 0) scale(0.85)') // scaled down on mobile
                  : 'translate(-50%, 0) scale(1)',
                
                transformOrigin: 'left center',
                zIndex: isSelected ? 50 : 10
              }}
              onMouseEnter={() => !selectedItem && setHoveredIdx(idx)}
              onMouseLeave={() => !selectedItem && setHoveredIdx(null)}
              onClick={() => setSelectedItem(selectedItem ? null : item)}
            >
              {/* Back Arrow - Only visible when selected */}
              {isSelected && <div 
                className="transition-all duration-500 delay-300 opacity-100 w-8 md:w-12 -ml-8 md:-ml-12"
              >
                 <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-black dark:text-white">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                 </svg>
              </div>}

              <h2 
                className={`${item === 'RECENTS' ? 'text-sm sm:text-2xl' : 'text-4xl sm:text-6xl'} font-light text-[#e5e5e5] dark:text-[#4d4d4d] transition-colors duration-300 z-20 whitespace-nowrap ${
                  (hoveredIdx === idx || isSelected) ? 'text-black dark:text-[#e5e5e5]' : ''
                } ${
                  (!selectedItem && hoveredIdx !== null && hoveredIdx !== idx) ? 'blur-[1px] opacity-30 text-[#e5e5e5] dark:text-[#4d4d4d]' : ''
                }`}
                style={{ 
                 fontFamily: '"PT Mono", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
                }}
              >
                {item}
              </h2>

              {/* TAP AND HOLD TEXT (Mobile only - visible when LOGOS is selected) */}
              {isMobile && isSelected && item === 'LOGOS' && (
                <div 
                  className="absolute left-0 top-full mt-2 opacity-100 transition-opacity duration-500 delay-300"
                  style={{ width: 'max-content' }}
                >
                    <h3
                      className="text-[10px] tracking-[0.15em] text-neutral-600 dark:text-neutral-400 whitespace-nowrap"
                      style={{
                        fontFamily: "'PT Mono', monospace",
                        fontWeight: 400,
                      }}
                    >
                      TAP AND HOLD TO PREVIEW
                    </h3>
                </div>
              )}

              {/* DESKTOP POSTERS INSTRUCTION */}
              {!isMobile && isSelected && item === 'POSTERS' && (
                <div 
                  className="absolute left-0 top-full mt-2 opacity-100 transition-opacity duration-500 delay-300"
                  style={{ width: 'max-content' }}
                >
                    <h3
                          className="text-xs md:text-sm tracking-[0.15em] text-neutral-600 dark:text-neutral-400 whitespace-nowrap font-bold"
                          style={{
                            fontFamily: "'PT Mono', monospace",
                          }}
                        >
                          SCROLL ANY DIRECTION TO EXPLORE, HOVER TO COLOUR
                        </h3>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Custom RECENTS overlay header */}
      {selectedItem === 'RECENTS' && (
        <>
          {/* Top bar: back arrow + logo center + right text */}
          <div className="fixed top-12 left-0 right-0 z-[100] flex items-center justify-between px-6 pointer-events-auto">
            {/* Left: Back arrow */}
            <button 
              onClick={() => setSelectedItem(null)}
              className="flex-shrink-0 w-6 h-6 text-white hover:opacity-70 transition-opacity cursor-pointer"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>

            {/* Center: Logo clickable to home */}
            <button 
              onClick={() => navigate('/')}
              className="absolute left-1/2 -translate-x-1/2 cursor-pointer hover:opacity-70 transition-opacity"
            >
              <img src="/LOGOS/newlogo-white.svg" alt="Logo" className="h-8 w-auto" />
            </button>

            {/* Right: Text */}
            <div className="text-right text-white" style={{ fontFamily: '"PT Mono", monospace' }}>
              <p className="text-[7px] tracking-widest leading-tight">DESIGNED BY ME</p>
              <p className="text-[7px] tracking-widest leading-tight">FOR TERZO</p>
            </div>
          </div>
        </>
      )}

      {/* Content Area - Fades in below the header - Full width & Flexible height */}
      <div 
        className={`relative w-full flex-grow flex flex-col mt-4 sm:mt-12 transition-all duration-700 ease-out delay-200 ${
          selectedItem ? 'opacity-100 translate-y-0 relative' : 'opacity-0 translate-y-20 pointer-events-none absolute'
        }`}
        style={{
             minHeight: selectedItem ? '50vh' : '0'
        }}
      >
        {selectedItem && getContentForItem(selectedItem)}
      </div>
    </div>
  );
};

export default function Work() {
  const { section } = useParams();
  const navigate = useNavigate();
  
  const [activeCategory, setActiveCategory] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('work_active_category') || 'graphic';
    }
    return 'graphic';
  });

  // State for graphic design items, lifted from GraphicDesignSection
  const [selectedGraphicItem, setSelectedGraphicItem] = useState(null);

  // Track if we are in a detail view (Graphic Design) to hide the mini-nav
  const [isGraphicDetailView, setIsGraphicDetailView] = useState(false);

  // Sync state with URL params on mount/update
  useEffect(() => {
    if (section) {
       const sectionUpper = section.toUpperCase();
       // Check if section matches any graphic items. If so, select it.
       const validItems = ['LOGOS', 'POSTERS', 'VISUAL DESIGN', 'PACKAGING DESIGN', 'TECHPACK DESIGN', 'BRAND DESIGN', 'RECENTS'];
       // We might need to handle spaces in URL: visual-design -> VISUAL DESIGN
       const cleanSection = sectionUpper.replace(/-/g, ' ');
       
       if (validItems.includes(cleanSection)) {
          setSelectedGraphicItem(cleanSection);
          setActiveCategory('graphic');
       } else if (section === 'merch') {
          setActiveCategory('merch');
       } else if (section === 'graphic') {
          setActiveCategory('graphic');
          setSelectedGraphicItem(null);
       }
    } else {
       // If no section, verify state matches? Or just leave it.
       // Probably leave it, unless user navigated back to /work specifically.
       // Actually, if user hits back button to /work, we should clear selected item.
       // But checking "if no section" might clear purely internal state changes if we aren't careful.
       // Let's rely on handleSelection to push URL.
       if (selectedGraphicItem !== null) {
          // If we have an item selected but URL is empty, we should clear it?
          // No, this hook runs when `section` changes. If `section` becomes undefined, we clear.
          setSelectedGraphicItem(null);
       }
    }
  }, [section]);

  useEffect(() => {
    sessionStorage.setItem('work_active_category', activeCategory);
  }, [activeCategory]);

  const handleGraphicSelection = (item) => {
    if (item) {
      // Navigate to /work/item-name
      navigate(`/work/${item.toLowerCase().replace(/ /g, '-')}`);
    } else {
      // Navigate back to /work/graphic or just /work? 
      // If we go to /work/graphic, it keeps 'graphic' tab active.
      navigate('/work/graphic');
    }
    // Local state updates via useEffect above mostly, but for immediate feedback:
    setSelectedGraphicItem(item);
  };

  const handleCategoryChange = (cat) => {
     setActiveCategory(cat);
     navigate(`/work/${cat}`);
  };

  return (
    // Fixed page size for Merch (h-screen overflow-hidden) to prevent body scroll
    // Graphic Design allows scrolling
    <main className={`transition-colors duration-500 min-h-screen font-['PT_Mono'] selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black flex flex-col items-center pt-24 sm:pt-32 ${activeCategory === 'merch' ? 'h-screen overflow-hidden' : 'w-full'}`}>
      
      {/* Mini nav - Adjusted z-index to sit on top of carousel */}
      <div 
        className={`w-full max-w-xl mb-2 flex flex-col items-center z-[60] fixed top-[20px] left-1/2 -translate-x-1/2 sm:sticky sm:top-32 sm:left-auto sm:translate-x-0 transition-opacity duration-500 ease-in-out ${isGraphicDetailView ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}
      >
        <nav className="flex gap-12 mb-0 border-b border-black/50 dark:border-white/50 pb-0 backdrop-blur-sm relative">
          <button
            onClick={() => handleCategoryChange('merch')}
            className={`font-mono uppercase text-sm tracking-widest pb-3 px-2 transition-colors relative top-[1px] ${
              activeCategory === 'merch' 
                ? 'text-black dark:text-white border-b-2 border-black dark:border-white' 
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
            }`}
          >
            Merch Design
          </button>
          <button
            onClick={() => handleCategoryChange('graphic')}
            className={`font-mono uppercase text-sm tracking-widest pb-3 px-2 transition-colors relative top-[1px] ${
              activeCategory === 'graphic' 
                ? 'text-black dark:text-white border-b-2 border-black dark:border-white' 
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
            }`}
          >
            Graphic Design
          </button>
        </nav>
        <span className="uppercase tracking-[0] text-[10px] text-neutral-500 mt-1">Selected Works</span>
      </div>

      {activeCategory === 'merch' && (
        // Full screen fixed background for the carousel
        // z-0 puts it behind the mini nav (z-[60])
        <section className="fixed inset-0 w-full h-full z-0 flex items-start justify-start pointer-events-auto">
            <BlurCarousel />
        </section>
      )}

      {/* Main Content Area with Flex Grow to push footer down */}
      <div className={`w-full flex-grow flex flex-col items-center ${activeCategory === 'merch' ? 'hidden' : ''}`}>
        {activeCategory === 'graphic' && (
          <section className="w-full max-w-4xl mt-4 mb-0 px-6 flex-grow flex flex-col">
            <GraphicDesignSection 
              items={['LOGOS', 'POSTERS', 'VISUAL DESIGN', 'PACKAGING DESIGN', 'TECHPACK DESIGN', 'BRAND DESIGN', 'RECENTS']} 
              onDetailViewChange={setIsGraphicDetailView}
              selectedItem={selectedGraphicItem}
              setSelectedItem={handleGraphicSelection}
            />
          </section>
        )}

        {/* Footer for Graphic Design Section (Not Fixed) */}
        {!isGraphicDetailView && (
           <div className="w-full mt-auto mb-0 bg-transparent z-10 pointer-events-auto">
             <Footer />
           </div>
        )}
        {/* If detail view is active, show footer unless it's POSTERS or RECENTS */}
        {isGraphicDetailView && selectedGraphicItem !== 'POSTERS' && selectedGraphicItem !== 'RECENTS' && (
             <div className="w-full mt-auto mb-0 bg-transparent z-10 pointer-events-auto">
                <Footer />
             </div>
        )}
      </div>
    </main>
  );
}
