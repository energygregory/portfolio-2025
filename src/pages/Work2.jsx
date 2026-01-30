import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Folder from "../components/Folder";
import logos from "../data/logos";

const CategoryList = ({ items }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  return (
    <div className="flex flex-col items-center gap-16 py-12">
      {/* Inline style for particle animation */}
      <style>{`
        .group:hover .particle {
          opacity: 0.8;
          transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1.2) rotate(45deg) !important;
        }
        /* Override rotation for logo particles so they stay upright */
        .group:hover .particle.logo-particle {
          transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1.2) rotate(0deg) !important;
        }
      `}</style>
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
  // Define logos for the LOGOS category (indices 0, 2, 4, 6 will be logos, others squares)
  const logoImages = [
    '/Images/2025/LOGOS/Asset 3.svg',
    '/Images/2025/LOGOS/BRAND-ONE.svg',
    '/Images/2025/LOGOS/black.png',
    '/Images/2025/LOGOS/flyhigh.svg'
  ];

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
      
      {/* 8 Particles radiating out on hover */}
      {[...Array(8)].map((_, i) => {
        // Calculate angle for even distribution
        const angle = (i * 360) / 8;
        // Convert to radians
        const rad = (angle * Math.PI) / 180;
        // Calculate final X and Y positions
        // Radius increased to 280px to go beyond text length
        const radius = 280;
        const x = Math.cos(rad) * radius;
        const y = Math.sin(rad) * radius;
        
        // Determine if this particle should be a logo
        // Use even indices for logos (0, 2, 4, 6) if the label is 'LOGOS'
        const isLogo = label === 'LOGOS' && i % 2 === 0;
        const logoIndex = i / 2; // 0, 1, 2, 3

        return (
          <div
            key={i}
            className={`particle ${isLogo ? 'logo-particle' : ''} absolute opacity-0 transition-all duration-500 ease-out z-10 flex items-center justify-center ${!isLogo ? 'bg-black dark:bg-white' : ''}`}
            style={{
              width: isLogo ? '60px' : '16px', // Larger size for logos
              height: isLogo ? '60px' : '16px',
              top: '50%',
              left: '50%',
              // Set CSS variables for the target position
              '--tx': `${x}px`,
              '--ty': `${y}px`,
              // Initial transform is centered
              transform: 'translate(-50%, -50%)', 
            }}
          >
             {isLogo ? (
               <img 
                 src={logoImages[logoIndex]} 
                 alt="logo" 
                 className="w-full h-full object-contain dark:invert"
               />
             ) : null}
          </div>
        );
      })}
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
