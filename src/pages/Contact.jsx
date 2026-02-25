import React, { useState } from "react";

export default function Contact() {
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);

  const handleRate = (score) => {
    setRating(score);
    // Simulate submission after a brief delay
    setTimeout(() => {
        setHasRated(true);
        // Reset after showing thank you
        setTimeout(() => {
            setShowRating(false);
            setRating(0);
            setHasRated(false);
        }, 2000);
    }, 500);
  };

  return (
    <main className="min-h-screen px-6 py-16 font-mono no-scrollbar flex flex-col items-center justify-center pt-20 sm:pt-32">
      <div className="w-full max-w-4xl relative h-[60vh] flex flex-col justify-between">
        
        {/* Top Center */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2">
             <a 
                href="mailto:gregory.gfx1@gmail.com"
                className="uppercase tracking-[0] text-[10px] text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
                >
                MAIL
            </a>
        </div>

        {/* Row 2: Instagram (Left) - Pinterest (Right) */}
        <div className="absolute top-[20%] left-[15%]">
            <a 
                href="https://instagram.com/0021.studio"
                target="_blank" 
                rel="noopener noreferrer"
                className="uppercase tracking-[0] text-[10px] text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
            >
                INSTAGRAM
            </a>
        </div>
        <div className="absolute top-[20%] right-[15%]">
            <a 
                href="https://pinterest.com/energygregory"
                target="_blank"
                rel="noopener noreferrer"
                className="uppercase tracking-[0] text-[10px] text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
            >
                PINTEREST
            </a>
        </div>

        {/* Row 3: Twiter (Left) - Behance (Right) */}
        <div className="absolute top-[45%] left-0">
            <a 
                href="https://twitter.com/energygregory"
                target="_blank"
                rel="noopener noreferrer"
                className="uppercase tracking-[0] text-[10px] text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
            >
                TWITTER (X)
            </a>
        </div>
        <div className="absolute top-[45%] right-0">
            <a 
                href="https://behance.net/grega"
                target="_blank"
                rel="noopener noreferrer"
                className="uppercase tracking-[0] text-[10px] text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
            >
                BEHANCE
            </a>
        </div>

        {/* Row 4: Rate Site (Left) - Visitor Book (Right) */}
        <div className="absolute top-[70%] left-[15%]">
            <div className="relative group">
                <button 
                    onClick={() => setShowRating(!showRating)}
                    className="uppercase tracking-[0] text-[10px] text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
                >
                    {hasRated ? "THANKS FOR RATING" : "RATE THE SITE"}
                </button>
                
                {showRating && !hasRated && (
                    <div className="absolute top-full lg:left-0 left-1/2 lg:translate-x-0 -translate-x-1/2 mt-2 flex gap-1 bg-white dark:bg-black p-2 rounded shadow-lg border border-neutral-200 dark:border-neutral-800 z-10 whitespace-nowrap">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => handleRate(star)}
                                onMouseEnter={() => setRating(star)}
                                onMouseLeave={() => setRating(0)}
                                className="text-lg leading-none focus:outline-none transition-transform hover:scale-110"
                            >
                                {star <= rating ? "★" : "☆"}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
        <div className="absolute top-[70%] right-[15%]">
            <a 
                href="#"
                className="uppercase tracking-[0] text-[10px] text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-not-allowed"
                onClick={(e) => e.preventDefault()}
            >
                VISITOR BOOK
            </a>
        </div>

        {/* Bottom Center */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
             <a 
                href="#"
                className="uppercase tracking-[0] text-[10px] text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-not-allowed"
                onClick={(e) => e.preventDefault()}
                >
                SHOP
            </a>
        </div>
      </div>
    </main>
  );
}
