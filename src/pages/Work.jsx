import React, { useState, useRef, useEffect } from "react";
import BlurCarousel from "../components/BlurCarousel";
import Footer from "../components/Footer";

// Graphic Design Content Components (Placeholders for now)
const LogosContent = () => <div className="p-4 text-center">Logos content gallery will go here</div>;
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

const GraphicDesignSection = ({ items, onDetailViewChange }) => {
  const [selectedItem, setSelectedItem] = useState(null);
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

  // Notify parent when state changes
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
                // Move up higher (-120px) when selected to replace the mini-nav area
                top: selectedItem ? '-120px' : `${idx * ITEM_HEIGHT + TOP_OFFSET}px`,
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
            </div>
          );
        })}
      </div>

      {/* Content Area - Fades in below the header */}
      <div 
        className={`w-full mt-12 transition-all duration-700 ease-out delay-200 ${
          selectedItem ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none absolute'
        }`}
      >
        {selectedItem && getContentForItem(selectedItem)}
      </div>
    </div>
  );
};

export default function Work() {
  const [activeCategory, setActiveCategory] = useState(() => {
    // Persist active tab on refresh using sessionStorage
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('work_active_category') || 'graphic';
    }
    return 'graphic';
  });

  // Track if we are in a detail view (Graphic Design) to hide the mini-nav
  const [isGraphicDetailView, setIsGraphicDetailView] = useState(false);

  useEffect(() => {
    sessionStorage.setItem('work_active_category', activeCategory);
  }, [activeCategory]);

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
            onClick={() => setActiveCategory('merch')}
            className={`font-mono uppercase text-sm tracking-widest pb-3 px-2 transition-colors relative top-[1px] ${
              activeCategory === 'merch' 
                ? 'text-black dark:text-white border-b-2 border-black dark:border-white' 
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
            }`}
          >
            Merch Design
          </button>
          <button
            onClick={() => setActiveCategory('graphic')}
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

      {activeCategory === 'graphic' && (
        <section className="w-full max-w-4xl mt-4 mb-20 px-6">
          <GraphicDesignSection 
            items={['LOGOS', 'POSTERS', 'VISUAL DESIGN', 'PACKAGING DESIGN', 'TECHPACK DESIGN', 'BRAND DESIGN']} 
            onDetailViewChange={setIsGraphicDetailView}
          />
        </section>
      )}

      {/* Fixed Footer for Merch, Normal for Graphic? 
          User said "TAKE AWAY THE FOOTER IN THE MERCH DESIGN SECTION"
      */}
      {activeCategory !== 'merch' && (
        <div className="w-full">
          <Footer />
        </div>
      )}
    </main>
  );
}
