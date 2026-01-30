import React, { useState } from "react";
import WorkNav from "../components/WorkNavigation";

// Inline CategoryList/Item if not separate file yet. 
// I'll extract it below to be safe, or just copy it here.
const CategoryListInternal = ({ items }) => {
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

export default function WorkGraphic() {
  return (
    <main className="min-h-screen transition-colors duration-500 font-['PT_Mono'] selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black flex flex-col items-center pt-48">
      <WorkNav />
      {/* Spacer for fixed nav handled by pt-48 (12rem approx ~192px) */}
      
      <section className="w-full max-w-4xl mt-0 mb-20 animate-in fade-in duration-500">
        <CategoryListInternal items={['LOGOS', 'POSTERS', 'VISUAL DESIGN']} />
      </section>

      {/* Global Footer will be rendered by App.jsx, which is perfect for this page */}
    </main>
  );
}
