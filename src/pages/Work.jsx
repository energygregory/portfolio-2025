import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Folder from "../components/Folder";

export default function Work() {
  // create 12 folder placeholders
  // all folders grey
  const folders = Array.from({ length: 12 }).map((_, i) => ({
    id: `folder-${i + 1}`,
    color: '#9CA3AF'
  }));

  const [openFolder, setOpenFolder] = useState(null);

  // Sort dropdown state
  const [showDropdown, setShowDropdown] = useState(false);
  // start with 'by brands'
  const [selectedFilter, setSelectedFilter] = useState('brands');
  const dropdownRef = useRef(null);

  const selectedFilterLabel = selectedFilter === 'brands' ? 'brands' : 'type of work';

  // Caption pop state: track which caption is currently 'popped'
  const [poppedCaption, setPoppedCaption] = useState(null);

  // close dropdown when clicking outside
  useEffect(() => {
    const onDocClick = (e) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target)) setShowDropdown(false);
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

      {/* Sort bar (BDM) - moved under the heading */}
      <div className="w-full mb-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-neutral-400">Sort by:</span>
          <div className="relative inline-block" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(s => !s)}
              className="sort-button inline-flex items-center gap-2 px-3 py-2 bg-neutral-900/60 dark:bg-neutral-200/10 rounded-md text-sm"
              aria-expanded={showDropdown}
              aria-haspopup="menu"
            >
              <span className="capitalize">{selectedFilterLabel}</span>
              <svg className="w-3 h-3 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </button>

            {showDropdown && (
              <ul role="menu" className="absolute left-0 mt-2 w-48 bg-white dark:bg-neutral-900 rounded-md shadow-lg z-50 sort-dropdown">
                <li role="menuitem">
                  <button className="w-full text-left px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800" onClick={() => { setSelectedFilter('brands'); setShowDropdown(false); }}>
                    brands
                  </button>
                </li>
                <li role="menuitem">
                  <button className="w-full text-left px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800" onClick={() => { setSelectedFilter('type'); setShowDropdown(false); }}>
                    type of work
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>

      {selectedFilter === 'brands' && (
        <section className="grid grid-cols-3 sm:grid-cols-4 gap-x-3 gap-y-10 place-items-center">
          {folders.map((f, idx) => {
            const isFirst = idx === 0;
            const caption = isFirst ? 'William Ru' : `Project ${idx + 1}`;
            const to = isFirst ? '/williamru' : '/work';

            return (
              <div key={f.id} className="flex flex-col items-center" aria-hidden={false}>
                <div className="flex justify-center items-center w-[120px] h-[120px]">
                  <Folder
                    color={f.color}
                    size={1}
                    className=""
                    open={openFolder === f.id}
                    onToggle={() => handleToggle(f.id)}
                  />
                </div>

                {/* Clickable caption under each folder - navigates to the same page as folder content would */}
                <Link
                  to={to}
                  className={`mt-2 text-sm text-center folder-caption ${poppedCaption === f.id ? 'pop' : ''}`}
                  onMouseEnter={() => setPoppedCaption(f.id)}
                  onMouseLeave={() => setPoppedCaption(null)}
                >
                  {caption}
                </Link>
              </div>
            );
          })}
        </section>
      )}
    </main>
  );
}
