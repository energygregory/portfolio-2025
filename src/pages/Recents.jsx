import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const recentsVideos = [
  { src: '/RECENTS/Untitledd.mp4', label: 'FOR TERZO' },
  { src: '/RECENTS/william ru.mov', label: 'FOR WILLIAM RU' },
];

const Recents = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const goTo = (idx) => {
    const next = Math.max(0, Math.min(recentsVideos.length - 1, idx));
    setCurrentIndex(next);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx < 0) goTo(currentIndex + 1);
      else goTo(currentIndex - 1);
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <div 
      className="fixed inset-0 z-[1] pointer-events-auto"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Full-screen video background */}
      {recentsVideos.map((vid, i) => (
        <video
          key={vid.src}
          src={vid.src}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          style={{ opacity: i === currentIndex ? 1 : 0 }}
        />
      ))}

      {/* Top bar: back arrow + logo center + right text */}
      <div className="fixed top-12 left-0 right-0 z-[100] flex items-center justify-between px-6">
        {/* Left: Back arrow */}
        <button 
          onClick={() => navigate(-1)}
          className="flex-shrink-0 w-6 h-6 text-white hover:opacity-70 transition-opacity cursor-pointer"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>

        {/* Center: Logo clickable to home */}
        <button 
          onClick={() => navigate('/')}
          className="absolute left-1/2 -translate-x-1/2 cursor-pointer hover:opacity-70 transition-opacity"
        >
          <img src="/LOGOS/newlogo-white.svg" alt="Logo" className="h-8 w-auto" />
        </button>

        {/* Right: Text */}
        <div className="text-right text-white" style={{ fontFamily: '"PT Mono", monospace' }}>
          <p className="text-[7px] tracking-widest leading-tight">DESIGNED BY ME</p>
          <p className="text-[7px] tracking-widest leading-tight">{recentsVideos[currentIndex]?.label}</p>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-[3]">
        {recentsVideos.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === currentIndex ? 'bg-white scale-110' : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Recents;
