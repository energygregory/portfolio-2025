import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Folder from "../components/Folder";
import logos from "../data/logos";

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
  const dropdownRef = useRef(null);

  return (
    <main className="px-6 py-16 flex flex-col items-center min-h-screen">
      
      {/* Mini nav */}
      <div className="w-full max-w-xl mb-12 flex justify-center">
        <nav className="flex gap-12 mb-6 border-b border-neutral-700 pb-3" ref={dropdownRef}>
          <button
            onClick={() => setActiveCategory('merch')}
            className={`mini-nav-btn font-mono uppercase text-sm tracking-widest pb-2 transition-colors ${
              activeCategory === 'merch' ? 'mini-nav-active' : ''
            }`}
          >
            Merch Design
          </button>
          <button
            onClick={() => setActiveCategory('graphic')}
            className={`mini-nav-btn font-mono uppercase text-sm tracking-widest pb-2 transition-colors ${
              activeCategory === 'graphic' ? 'mini-nav-active' : ''
            }`}
          >
            Graphic Design
          </button>
        </nav>
      </div>

      {activeCategory === 'merch' && (
        <section className="max-w-4xl w-full">
           {/* List content removed */}
        </section>
      )}

      {activeCategory === 'graphic' && (
        <section className="w-full max-w-4xl">
          <CategoryList items={['LOGOS', 'POSTERS', 'VISUAL DESIGN']} />
        </section>
      )}
    </main>
  );
}
