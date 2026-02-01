import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BlurCarousel from "../components/BlurCarousel";
import Footer from "../components/Footer";

// Graphic Design Content Components (Placeholders for now)
const LogosContent = () => {
    const logos = [
      "/Images/2025/LOGOS/3.png",
      "/Images/2025/LOGOS/Asset 3.svg",
      "/Images/2025/LOGOS/BRAND-ONE.svg", 
      "/Images/2025/LOGOS/black.png",
      "/Images/2025/LOGOS/flyhigh.svg"
    ];

    // State for mobile long-press preview
    const [pressedImage, setPressedImage] = useState(null);
    const [isMobile, setIsMobile] = useState(false);

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
         {/* Grid with faint inner lines - Reduced opacity (75% of previous) */}
         <div className="w-full grid grid-cols-3 gap-[1px] bg-neutral-900/[0.0375] dark:bg-white/[0.075]">
            {logos.map((src, i) => (
              <div 
                key={i} 
                className="relative aspect-square flex items-center justify-center p-8 bg-white dark:bg-black select-none touch-none"
                onTouchStart={(e) => handleTouchStart(src, e)}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
                onContextMenu={(e) => e.preventDefault()} // Prevent context menu on long press
              >
                   {/* Light Mode: Mask with Black */}
                   <div 
                     className="block dark:hidden w-full h-full bg-black pointer-events-none"
                     style={{
                       maskImage: `url('${src}')`,
                       maskSize: 'contain',
                       maskRepeat: 'no-repeat',
                       maskPosition: 'center',
                       WebkitMaskImage: `url('${src}')`,
                       WebkitMaskSize: 'contain',
                       WebkitMaskRepeat: 'no-repeat',
                       WebkitMaskPosition: 'center'
                     }}
                   />

                   {/* Dark Mode: Mask with #4d4d4d */}
                   <div 
                     className="hidden dark:block w-full h-full bg-[#4d4d4d] pointer-events-none"
                     style={{
                       maskImage: `url('${src}')`,
                       maskSize: 'contain',
                       maskRepeat: 'no-repeat',
                       maskPosition: 'center',
                       WebkitMaskImage: `url('${src}')`,
                       WebkitMaskSize: 'contain',
                       WebkitMaskRepeat: 'no-repeat',
                       WebkitMaskPosition: 'center'
                     }}
                   />
              </div>
            ))}
            {/* Fill empty cells */}
            {[...Array(3 - (logos.length % 3))].map((_, i) => logos.length % 3 !== 0 && (
                <div key={`empty-${i}`} className="bg-white dark:bg-black" />
            ))}
         </div>

         {/* Mobile pressed image popup - fixed overlay */}
         {pressedImage && (
            <div 
              className="fixed inset-0 z-[200] pointer-events-none flex items-center justify-center p-8"
              style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
            >
              <div 
                className="w-full max-w-[80vw] aspect-square flex items-center justify-center bg-white dark:bg-black p-8"
              >
                  {/* Reuse mask logic for consistent color */}
                   <div 
                     className="block dark:hidden w-full h-full bg-black"
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
                     className="hidden dark:block w-full h-full bg-[#4d4d4d]"
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
const PostersContent = () => <div className="p-4 text-center">Posters content gallery will go here</div>;
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
          height: selectedItem ? '100px' : `${(items.length * ITEM_HEIGHT) + 100 - mobileHeightAdjustment}px`,
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
                // UPDATED: Pushed down slightly to -90px per request
                top: selectedItem ? '-90px' : `${idx * ITEM_HEIGHT + TOP_OFFSET}px`,
                left: selectedItem ? '0px' : '50%',
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
    <main className={`transition-colors duration-500 font-['PT_Mono'] selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black flex flex-col items-center pt-24 sm:pt-32 ${activeCategory === 'merch' ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      
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

        {/* Footer should be at the bottom of the flex container */}
        <div className="w-full mt-auto">
          <Footer />
        </div>
      </div>
    </main>
  );
}
