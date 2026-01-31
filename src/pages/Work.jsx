import React, { useState, useRef } from "react";
import BlurCarousel from "../components/BlurCarousel";
import Footer from "../components/Footer";

const CategoryList = ({ items }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  return (
    <div className="flex flex-col items-center gap-16 py-12">
      {items.map((item, idx) => (
        <CategoryItem 
          key={idx} 
          label={item} 
          onMouseEnter={() => setHoveredIdx(idx)}
          onMouseLeave={() => setHoveredIdx(null)}
          isDimmed={hoveredIdx !== null && hoveredIdx !== idx}
        />
      ))}
    </div>
  );
};

const CategoryItem = ({ label, onMouseEnter, onMouseLeave, isDimmed }) => {
  return (
    <div 
      className={`relative group cursor-pointer transition-all duration-500 ${isDimmed ? 'opacity-30 blur-[1px] scale-95' : 'opacity-100 scale-100'}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <h2 
        className="text-4xl sm:text-6xl font-light text-[#e5e5e5] dark:text-[#4d4d4d] transition-colors duration-300 group-hover:text-black dark:group-hover:text-white z-20 relative"
        style={{ fontFamily: '"PT Mono", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
      >
        {label}
      </h2>
    </div>
  );
};

export default function Work() {
  const [activeCategory, setActiveCategory] = useState('graphic');

  return (
    // Fixed page size for Merch (h-screen overflow-hidden) to prevent body scroll
    // Graphic Design allows scrolling
    <main className={`transition-colors duration-500 font-['PT_Mono'] selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black flex flex-col items-center pt-24 sm:pt-32 ${activeCategory === 'merch' ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      
      {/* Mini nav - Adjusted z-index to sit on top of carousel */}
      <div className="w-full max-w-xl mb-2 flex flex-col items-center z-[60] fixed top-[20px] left-1/2 -translate-x-1/2 sm:sticky sm:top-32 sm:left-auto sm:translate-x-0">
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
        <section className="w-full max-w-4xl mt-12 mb-20">
          <CategoryList items={['LOGOS', 'POSTERS', 'VISUAL DESIGN', 'PACKAGING DESIGN']} />
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
