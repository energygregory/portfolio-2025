import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BlurCarousel from "../components/BlurCarousel";
import Footer from "../components/Footer";

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
         
         {/* Desktop Spacing Control Sliders */}
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
    // Poster images from /Images/2025/POSTERS
    // Order based on visual fan arrangement (Left to Right)
    const posters = [
      "/Images/2025/POSTERS/po$t00.jpg",
      "/Images/2025/POSTERS/food0.jpg",
      "/Images/2025/POSTERS/po$t.jpg",
      "/Images/2025/POSTERS/filter announcer.jpg",
      "/Images/2025/POSTERS/po$t0.jpg",
    ];

    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Desktop: Fan Layout with Interaction
    // We maintain the fan look but allow clicking to cycle through items
    const [activeIndex, setActiveIndex] = useState(2); // Start with center item (index 2)

    if (isMobile) {
        // Mobile: Horizontal Scroll Snap
        return (
            <div className="w-full flex items-center py-12 px-0 overflow-x-auto snap-x snap-mandatory no-scrollbar" style={{ scrollPaddingLeft: '50%', scrollPaddingRight: '50%' }}>
                <div className="flex gap-4 px-[50vw]"> 
                 {/* px-[50vw] centers the first item initially if using center alignment logic, 
                     but simpler approach is just padding. 
                     Let's use a simple gap container with centering snap.
                  */}
                  {posters.map((src, i) => (
                      <div 
                        key={i} 
                        className="relative flex-shrink-0 w-[70vw] aspect-[2/3] snap-center shadow-lg rounded-sm overflow-hidden"
                      >
                           <img 
                              src={src} 
                              alt={`Poster ${i + 1}`}
                              className="w-full h-full object-cover"
                              loading="lazy"
                           />
                      </div>
                  ))}
                </div>
            </div>
        );
    }

    return (
      <div className="w-full flex items-center justify-center py-4 overflow-visible min-h-[500px]">
        <div className="relative w-full max-w-[1400px] h-[500px] flex items-center justify-center">
            {posters.map((src, i) => {
                // Calculate position relative to active index
                // We want the fan to stay centered, but the CONTENT rotates
                // So if activeIndex changes, the card at that index must become the "center" card (0 deg)
                
                // Adjust index so it wraps around? Or hard limit?
                // User said "SWIPEABLE". A nice way is to just let them cycle.
                // But preserving the fan look "5 items fanned out" means we need slot positions.
                
                // Slots: -2, -1, 0, 1, 2
                // We calculate the visual position based on the difference from activeIndex
                let offset = i - activeIndex;
                
                // Optional: Wrapping behavior (infinite carousel) if desired, 
                // but let's stick to simple "shift" first or just clamp?
                // The user says "MAKE THEM SWIPEABLE". Cycling is best.
                // Ensure offset is within reasonable bounds visually?
                // If we have 5 items, and active is 0. offset is 0, 1, 2, 3, 4.
                // We want to center the active one.
                
                // Fan calculations
                const rotate = offset * 12; 
                // Z-index: Active is highest. Further away = lower.
                const zIndex = 100 - Math.abs(offset);
                
                // Opacity/Visibility: Hide items that go too far off?
                // Or just let them fan out further.

                return (
                    <div 
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className="absolute w-[300px] aspect-[0.7] cursor-pointer shadow-2xl transition-all duration-500 ease-out hover:scale-105 origin-center"
                        style={{
                            left: '50%',
                            top: '50%',
                            // Stack cards based on offset
                            transform: `translate(-50%, -50%) translateX(${offset * 120}%) translateY(${Math.abs(offset) * 30}px) rotate(${rotate}deg)`,
                            zIndex: zIndex,
                            opacity: Math.abs(offset) > 3 ? 0 : 1, // Hide if too far
                            pointerEvents: Math.abs(offset) > 3 ? 'none' : 'auto'
                        }}
                    >
                         <img 
                            src={src} 
                            alt={`Poster ${i + 1}`}
                            className="w-full h-full object-cover brightness-90 hover:brightness-100 transition-all duration-300 rounded-[2px]"
                            loading="eager"
                         />
                    </div>
                )
            })}
        </div>
      </div>
    );
};
const VisualDesignContent = () => <div className="p-4 text-center">Visual Design content gallery will go here</div>;
const PackagingContent = () => <div className="p-4 text-center">Packaging Design content gallery will go here</div>;
const TechpackContent = () => <div className="p-4 text-center">Techpack Design content gallery will go here</div>;
const BrandContent = () => <div className="p-4 text-center">Brand Design content gallery will go here</div>;

const getContentForItem = (item) => {
  switch(item) {
    case 'LOGOS': return <LogosContent />;
    case 'POSTERS': return <PostersContent />;
    case 'VISUAL DESIGN': return <VisualDesignContent />;
    case 'PACKAGING DESIGN': return <PackagingContent />;
    case 'TECHPACK DESIGN': return <TechpackContent />;
    case 'BRAND DESIGN': return <BrandContent />;
    default: return null;
  }
};

const GraphicDesignSection = ({ items, onDetailViewChange, selectedItem, setSelectedItem }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // Responsive values
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Notify parent when state changes (legacy support or side effects)
  useEffect(() => {
    onDetailViewChange(!!selectedItem);
  }, [selectedItem, onDetailViewChange]);

  // Height for the list view to maintain spacing
  // Desktop: 120px gap
  // Mobile: 105px gap
  const ITEM_HEIGHT = isMobile ? 105 : 120; 
  const TOP_OFFSET = isMobile ? -20 : 40;   

  // On mobile, we subtract one ITEM_HEIGHT from calculation effectively "hiding" the added height of the last item
  // This keeps the footer where it was relative to the second-to-last item (Techpack)
  const mobileHeightAdjustment = isMobile ? ITEM_HEIGHT : 0;

  return (
    <div className="relative w-full min-h-[50vh] transition-all duration-700 ease-in-out">
      {/* List Items / Header Title */}
      <div 
        className="relative w-full"
        style={{ 
          height: selectedItem ? '0px' : `${(items.length * ITEM_HEIGHT) + 100 - mobileHeightAdjustment}px`,
          transition: 'height 500ms ease-in-out'
        }}
      >
        {items.map((item, idx) => {
          const isSelected = selectedItem === item;
          const isOther = selectedItem && !isSelected;
          
          return (
            <div 
              key={idx}
              className={`absolute transition-all duration-700 ease-[0.23, 1, 0.32, 1] group cursor-pointer flex items-center gap-4 ${
                isOther ? 'opacity-0 pointer-events-none ease-in duration-300' : 'opacity-100'
              }`}
              style={{
                // Move up higher when selected to replace the mini-nav area
                // UPDATED: Adjusted to -110px to move it further up (was -120px, moving down slightly means less negative)
                // Actually user said "BRING DOWN THE TEXT ... SLIGHTLY". So -120px -> -110px works.
                // And "MOVE IT SLIGHTLY TO THE RIGHT". 0px -> 24px.
                top: selectedItem ? '-106px' : `${idx * ITEM_HEIGHT + TOP_OFFSET}px`,
                left: selectedItem ? '24px' : '50%',
                transform: selectedItem 
                  ? 'translate(0, 0) scale(0.85)' 
                  : 'translate(-50%, 0) scale(1)',
                transformOrigin: 'left center',
                zIndex: isSelected ? 50 : 10
              }}
              onMouseEnter={() => !selectedItem && setHoveredIdx(idx)}
              onMouseLeave={() => !selectedItem && setHoveredIdx(null)}
              onClick={() => setSelectedItem(selectedItem ? null : item)}
            >
              {/* Back Arrow - Only visible when selected */}
              <div 
                className={`transition-all duration-500 delay-300 ${isSelected ? 'opacity-100 w-8 md:w-12 -ml-8 md:-ml-12' : 'opacity-0 w-0 -ml-0 overflow-hidden'}`}
              >
                 <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-black dark:text-white">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                 </svg>
              </div>

              <h2 
                className={`text-4xl sm:text-6xl font-light text-[#e5e5e5] dark:text-[#4d4d4d] transition-colors duration-300 z-20 whitespace-nowrap ${
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
            </div>
          );
        })}
      </div>

      {/* Content Area - Fades in below the header - Full width & Flexible height */}
      <div 
        className={`relative w-full flex-grow flex flex-col mt-4 sm:mt-12 transition-all duration-700 ease-out delay-200 ${
          selectedItem ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none absolute'
        }`}
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
       const validItems = ['LOGOS', 'POSTERS', 'VISUAL DESIGN', 'PACKAGING DESIGN', 'TECHPACK DESIGN', 'BRAND DESIGN'];
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
    <main className={`transition-colors duration-500 font-['PT_Mono'] selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black flex flex-col items-center pt-24 sm:pt-32 ${activeCategory === 'merch' ? 'h-screen overflow-hidden' : 'w-full flex-grow'}`}>
      
      {/* Mini nav - Adjusted z-index to sit on top of carousel */}
      <div 
        className={`w-full max-w-xl mb-2 flex flex-col items-center z-[60] fixed top-[20px] left-1/2 -translate-x-1/2 sm:sticky sm:top-32 sm:left-auto sm:translate-x-0 transition-opacity duration-500 ease-in-out ${isGraphicDetailView ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
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
        <section className="fixed inset-0 w-full h-full z-0 flex items-start justify-start">
            <BlurCarousel />
        </section>
      )}

      {/* Main Content Area with Flex Grow to push footer down */}
      <div className={`w-full flex-grow flex flex-col items-center ${activeCategory === 'merch' ? 'hidden' : ''}`}>
        {activeCategory === 'graphic' && (
          <section className="w-full max-w-4xl mt-4 mb-20 px-6 flex-grow">
            <GraphicDesignSection 
              items={['LOGOS', 'POSTERS', 'VISUAL DESIGN', 'PACKAGING DESIGN', 'TECHPACK DESIGN', 'BRAND DESIGN']} 
              onDetailViewChange={setIsGraphicDetailView}
              selectedItem={selectedGraphicItem}
              setSelectedItem={handleGraphicSelection}
            />
          </section>
        )}

        {/* Footer should be at the bottom of the flex container - Zero margins */}
        <div className="w-full mt-auto mb-0 bg-transparent h-0 overflow-visible">
          {/* Footer removed here, relying on App.jsx global footer */}
        </div>
      </div>
    </main>
  );
}
