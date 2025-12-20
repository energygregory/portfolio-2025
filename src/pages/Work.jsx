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

  // use a mini-nav like PriceList: 'Brands' | 'Type of Work'
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
            Type of Work
          </button>
        </nav>
      </div>
      {activeCategory === 'brands' && (
        <section className="max-w-4xl">
          <ul className="space-y-3">
            {(() => {
              // ensure William Ru appears first
              const first = logos.filter(l => l.id === 'william-ru');
              const rest = logos.filter(l => l.id !== 'william-ru');
              const ordered = [...first, ...rest];
              return ordered.map((l) => (
                <li key={l.id}>
                  <Link
                    to={l.path || '/work'}
                    className="brand-list-item block text-2xl sm:text-3xl tracking-wide px-3 py-2 transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ));
            })()}
          </ul>
        </section>
      )}

      {activeCategory === 'type' && (
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {['Merch Design', 'Graphic Design', 'Branding', 'Packaging'].slice(0,4).map((label, idx) => {
            const id = `type-${idx}`;
            const color = folders[idx]?.color || '#9CA3AF';
            return (
              <div key={id} className="flex flex-col items-center">
                <div className="w-[140px] h-[140px] flex items-center justify-center">
                  <Folder
                    color={color}
                    size={1}
                    open={openFolder === id}
                    onToggle={() => handleToggle(id)}
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
