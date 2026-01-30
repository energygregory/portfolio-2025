import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Folder from "../components/Folder";
import logos from "../data/logos";

const CategoryList = ({ items }) => {
  return (
    <div className="flex flex-col items-center gap-16 py-12">
      {/* Inline style for particle animation */}
      <style>{`
        .group:hover .particle {
          opacity: 0.6;
          transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1.5) !important;
        }
      `}</style>
      {items.map((item, idx) => (
        <CategoryItem key={idx} label={item} />
      ))}
    </div>
  );
};

const CategoryItem = ({ label }) => {
  return (
    <div className="relative group cursor-pointer">
      <h2 
        className="text-4xl sm:text-6xl font-light text-[#4d4d4d] transition-colors duration-300 group-hover:text-white z-20 relative"
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
        // Radius can be adjusted. e.g. 100px
        const radius = 100;
        const x = Math.cos(rad) * radius;
        const y = Math.sin(rad) * radius;
        
        return (
          <div
            key={i}
            className="particle absolute rounded-full bg-white opacity-0 transition-all duration-500 ease-out z-10"
            style={{
              width: '12px',
              height: '12px',
              top: '50%',
              left: '50%',
              // Set CSS variables for the target position
              '--tx': `${x}px`,
              '--ty': `${y}px`,
              // Initial transform is centered
              transform: 'translate(-50%, -50%)', 
            }}
          />
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
