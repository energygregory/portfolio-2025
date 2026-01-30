import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const WorkNavigation = () => {
  const navigate = useNavigate();
  constlocation = useLocation();
  const activeCategory = location.pathname.includes('merch') ? 'merch' : 'graphic';

  return (
    <div className="w-full max-w-xl flex justify-center z-[60] fixed top-24 sm:top-32 left-1/2 -translate-x-1/2">
      <nav className="flex gap-12 mb-6 border-b border-black/50 dark:border-white/50 pb-0 backdrop-blur-sm relative bg-transparent">
        <button
          onClick={() => navigate('/work')}
          className={`font-mono uppercase text-sm tracking-widest pb-3 px-2 transition-colors relative top-[1px] ${
            activeCategory === 'merch' 
              ? 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
              : 'text-black dark:text-white border-b-2 border-black dark:border-white' 
          }`}
        >
          Merch Design
        </button>
        <button
          onClick={() => navigate('/work/graphic')}
          className={`font-mono uppercase text-sm tracking-widest pb-3 px-2 transition-colors relative top-[1px] ${
            activeCategory === 'graphic' 
              ? 'text-black dark:text-white border-b-2 border-black dark:border-white' 
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
          }`}
        >
          Graphic Design
        </button>
      </nav>
    </div>
  );
};
// Correction: The buttons should navigate correctly.
// User wants "Merch" and "Graphic".
// Let's assume paths: /work (default graphic?), /work/merch.
// Wait, user implied he wants "Two different pages".
// Let's redirect /work to /work/graphic or make /work the graphic page?
// I'll make /work/graphic the explicit one.
export default function WorkNav() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Check if we are on the merch page
    const isMerch = location.pathname.endsWith('/merch');
    const isGraphic = location.pathname.endsWith('/graphic') || location.pathname === '/work';

    return (
        <div className="w-full max-w-xl flex justify-center z-[60] fixed top-[110px] sm:top-[140px] left-1/2 -translate-x-1/2 mix-blend-difference">
          <nav className="flex gap-4 sm:gap-12 border-b border-black/50 dark:border-white/50 pb-0 backdrop-blur-sm relative">
            <button
              onClick={() => navigate('/work/merch')}
              className={`font-mono uppercase text-xs sm:text-sm tracking-widest pb-2 px-2 transition-colors relative top-[1px] ${
                isMerch
                  ? 'text-black dark:text-white border-b-2 border-black dark:border-white' 
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
              }`}
            >
              Merch Design
            </button>
            <button
              onClick={() => navigate('/work/graphic')}
              className={`font-mono uppercase text-xs sm:text-sm tracking-widest pb-2 px-2 transition-colors relative top-[1px] ${
                isGraphic
                  ? 'text-black dark:text-white border-b-2 border-black dark:border-white' 
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
              }`}
            >
              Graphic Design
            </button>
          </nav>
        </div>
    );
}
