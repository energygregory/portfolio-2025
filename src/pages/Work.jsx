import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Folder from "../components/Folder";
import logos from "../data/logos";

export default function Work() {
  // create 12 folder placeholders
  // all folders grey
  const folders = Array.from({ length: 12 }).map((_, i) => ({
    id: `folder-${i + 1}`,
    color: '#9CA3AF'
  }));

  const [openFolder, setOpenFolder] = useState(null);
  const [hoveredBrand, setHoveredBrand] = useState(null);

  // use a mini-nav like PriceList: 'Brands' | 'Skill Set'
  const [activeCategory, setActiveCategory] = useState('brands');
  const dropdownRef = useRef(null);

  // Caption pop state: track which caption is currently 'popped'
  const [poppedCaption, setPoppedCaption] = useState(null);

  // click outside helper kept for possible future use (noop now)
  useEffect(() => {
    const onDocClick = (e) => {
      if (!dropdownRef.current) return;
      // no-op: we no longer use a dropdown here
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const handleToggle = (id) => {
    setOpenFolder(prev => (prev === id ? null : id));
  };

  return (
    <main className="min-h-screen px-6 py-16">
      <h1 className="text-3xl font-semibold mb-6">Work</h1>

      {/* Mini nav (same visual style as PriceList) */}
      <div className="w-full mb-6">
        <nav className="flex gap-6 mb-6 border-b border-neutral-700 pb-3" ref={dropdownRef}>
          <button
            onClick={() => setActiveCategory('brands')}
            className={`mini-nav-btn font-mono uppercase text-sm tracking-widest pb-2 transition-colors ${
              activeCategory === 'brands' ? 'mini-nav-active' : ''
            }`}
          >
            Brands
          </button>
          <button
            onClick={() => setActiveCategory('type')}
            className={`mini-nav-btn font-mono uppercase text-sm tracking-widest pb-2 transition-colors ${
              activeCategory === 'type' ? 'mini-nav-active' : ''
            }`}
          >
            Skill Set
          </button>
        </nav>
      </div>
      {activeCategory === 'brands' && (
        <section className="flex gap-8 items-start">
          <ul className="space-y-4 flex-1">
            {[
              { label: 'William Ru', path: '/williamru', image: '/Images/William Ru/png2.png' },
              { label: 'Legacy Drip', path: '/legacydrip', image: '/realistic/mockup.png' },
              { label: 'Fly High', path: '/flyhigh', image: '/realistic/grey beanie.png' },
              { label: 'Around', path: '/around', image: '/realistic/t shirt 1.png' },
              { label: 'Zaama disco', path: '/work', image: '/box.png' },
              { label: 'Semanu Studios', path: '/work', image: '/box2.png' },
            ].map((item, idx) => (
              <li 
                key={idx}
                onMouseEnter={() => setHoveredBrand(item)}
                onMouseLeave={() => setHoveredBrand(null)}
              >
                <Link
                  to={item.path}
                  className="brand-list-item block text-4xl sm:text-5xl tracking-wide px-3 py-3 transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          
          {/* Preview Panel */}
          <div className="hidden lg:block w-96 sticky top-24" style={{ height: 'calc(100vh - 6rem - 100px)' }}>
            <div className={`w-full h-full transition-all duration-500 ease-out flex items-center justify-center ${
              hoveredBrand ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
            }`}>
              {hoveredBrand && (
                <img 
                  src={hoveredBrand.image} 
                  alt={hoveredBrand.label}
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          </div>
        </section>
      )}

      {activeCategory === 'type' && (
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {['Tech Pack Design', 'Logo Design', 'Realistic Mockup', 'Packaging'].slice(0,4).map((label, idx) => {
            const id = `type-${idx}`;
            const color = folders[idx]?.color || '#9CA3AF';
            
            // Define items for each folder
            let folderItems = [];
            if (idx === 0) {
              folderItems = [
                <img key="img1" src="/Screenshot 2025-06-27 at 18.35.48.png" alt="Tech Pack 1" className="w-full h-full object-cover" />,
                <img key="img2" src="/Screenshot 2025-10-09 at 21.16.48.png" alt="Tech Pack 2" className="w-full h-full object-cover" />
              ];
            } else if (idx === 2) {
              folderItems = [
                <img key="real1" src="/realistic/mockup.png" alt="Realistic Mockup 1" className="w-full h-full object-cover" />,
                <img key="real2" src="/realistic/grey beanie.png" alt="Realistic Mockup 2" className="w-full h-full object-cover" />,
                <img key="real3" src="/realistic/t shirt 1.png" alt="Realistic Mockup 3" className="w-full h-full object-cover" />
              ];
            } else if (idx === 3) {
              folderItems = [
                <img key="box1" src="/box.png" alt="Box 1" className="w-full h-full object-cover" />,
                <img key="box2" src="/box2.png" alt="Box 2" className="w-full h-full object-cover" />
              ];
            }
            
            return (
              <div key={id} className="flex flex-col items-center">
                <div className="w-[140px] h-[140px] flex items-center justify-center">
                  <Folder
                    color={color}
                    size={1}
                    open={openFolder === id}
                    onToggle={() => handleToggle(id)}
                    items={folderItems}
                  />
                </div>
                <div className="mt-3 text-sm font-mono text-center">{label}</div>
              </div>
            );
          })}
        </section>
      )}
    </main>
  );
}
