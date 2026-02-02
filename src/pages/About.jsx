import React, { useState, useEffect } from "react";
import AnimatedAsset1 from "../components/AnimatedAsset1";

export default function About() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <main className="min-h-screen px-0 py-16 font-mono no-scrollbar flex flex-col items-center pt-20 sm:pt-32">
      {/* Mobile Header: Matches Work Page Mini-Nav style exactly */}
      <div 
        className="w-full max-w-xl mb-2 flex flex-col items-center z-[60] fixed top-[20px] left-1/2 -translate-x-1/2 sm:hidden"
      >
        <nav className="flex gap-12 mb-0 border-b border-black/50 dark:border-white/50 pb-0 backdrop-blur-sm relative">
          <div
            className="font-mono uppercase text-sm tracking-widest pb-3 px-2 relative top-[1px] text-black dark:text-white border-b-2 border-black dark:border-white"
          >
            WHO IS GREG?
          </div>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full">
        {/* About Me Section */}
        <div className="mb-16">
          <h1 className="text-5xl font-bold mb-12 tracking-wider hidden sm:block">
            who is greg?
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mt-4 sm:mt-0">
            {/* Text Content */}
            <div className="space-y-6 text-sm md:text-base leading-relaxed font-normal text-left">
              <p>
                My name is <strong>Gregory</strong>, a Ghanaian self-taught
                designer with 3 years of hands-on experience in merch design. I
                started designing out of curiosity and built my craft through
                constant experimentation, client and personal projects. Over the
                years, I've learnt how to take an idea from rough sketches and
                turn them into beautiful pieces. Every project I take on is
                built with intention, clarity, and respect for the brand's
                story. My focus is always on creating work that not only looks
                good on screen, but feels authentic when produced and worn.
              </p>

              <p>
                I draw a lot of inspiration from Virgil Abloh, Prince Gyesi, and
                Kwame Adusei. Their work reminds me that design can be more than
                visuals as it can shape culture, tell stories, and redefine how
                people see fashion and identity.
              </p>
            </div>

            {/* Photo */}
            <div className="flex justify-center lg:justify-end">
              <img
                src="/Images/2025/IMG_0801%203.heic"
                alt="Gregory"
                className="w-full max-w-[300px] md:max-w-md rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
