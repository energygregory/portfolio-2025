import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const videos = [
  { src: '/RECENTS/Untitledd copy.mp4', label: 'FOR TERZO' },
];

export default function SixthMarch() {
  const navigate = useNavigate();
  const [fadedOut, setFadedOut] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setFadedOut(true), 6000);
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      window.localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      window.localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <div className="pointer-events-auto" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh', zIndex: 50 }}>
      {/* Blank bg behind video for fade target */}
      <div className="absolute inset-0 bg-white dark:bg-black" />

      {/* Video */}
      <video
        src={videos[0].src}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 object-cover transition-opacity duration-1000"
        style={{ opacity: fadedOut ? 0 : 1, width: '100vw', height: '100vh' }}
      />

      {/* Top bar */}
      <div className="fixed top-8 left-0 right-0 z-[100] flex items-center justify-between px-4 md:px-10 md:top-12">
        {/* Left: Light/Dark mode toggle */}
        <button
          onClick={toggleTheme}
          className="flex-shrink-0 w-4 h-4 md:w-6 md:h-6 text-white hover:opacity-70 transition-opacity cursor-pointer"
        >
          {isDark ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* Center: Logo clickable to home */}
        <button
          onClick={() => navigate('/')}
          className="absolute left-1/2 -translate-x-1/2 cursor-pointer hover:opacity-70 transition-opacity"
        >
          <img src="/LOGOS/newlogo-white.svg" alt="Logo" className="h-5 md:h-8 w-auto" />
        </button>

        {/* Right: Text */}
        <div className="text-right text-white" style={{ fontFamily: '"PT Mono", monospace' }}>
          <p className="text-[5px] md:text-[8px] tracking-widest leading-tight">DESIGNED BY ME</p>
          <p className="text-[5px] md:text-[8px] tracking-widest leading-tight">{videos[0].label}</p>
        </div>
      </div>
    </div>
  );
}
