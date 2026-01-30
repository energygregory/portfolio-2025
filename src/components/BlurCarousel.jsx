import React, { useRef, useEffect, useState } from 'react';

// Original set
const baseImages = [
    '/Images/2025/PNGS/png1.png',
    '/Images/2025/PNGS/png2.png',
    '/Images/2025/PNGS/png5.png',
    '/Images/2025/PNGS/png1.png',
    '/Images/2025/PNGS/png2.png',
    '/Images/2025/PNGS/png5.png',
    '/Images/2025/PNGS/png1.png',
    '/Images/2025/PNGS/png2.png',
    '/Images/2025/PNGS/png5.png',
];

// Create a large repeated array to simulate infinite scroll
// Repeating 20 times gives 180 items.
const images = Array(20).fill(baseImages).flat();

const BlurCarousel = () => {
    const containerRef = useRef(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    const handleScroll = () => {
        if (containerRef.current) {
            setScrollProgress(containerRef.current.scrollTop);
        }
    };

    useEffect(() => {
        const el = containerRef.current;
        if (el) {
            el.addEventListener('scroll', handleScroll, { passive: true });
            handleScroll();
            
            // Start in the middle to allow scrolling both ways "infinitely"
            // Wait for render
            setTimeout(() => {
                const scrollHeight = el.scrollHeight;
                el.scrollTop = scrollHeight / 2;
            }, 100);
        }
        return () => el && el.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        // Full width/height container
        <div className="relative w-full h-full mx-auto flex justify-start pl-0 overflow-hidden">
            <div 
                ref={containerRef}
                className="flex flex-col items-start overflow-y-auto overflow-x-hidden h-full w-full no-scrollbar snap-y snap-mandatory py-[30vh]"
            >
                {images.map((img, idx) => (
                    <CarouselItem 
                        key={idx} 
                        src={img} 
                        containerRef={containerRef} 
                        scrollTop={scrollProgress}
                    />
                ))}
            </div>
        </div>
    );
};

const CarouselItem = ({ src, containerRef, scrollTop }) => {
    const itemRef = useRef(null);
    const [style, setStyle] = useState({ opacity: 0.2, filter: 'blur(8px)', transform: 'translateX(0) scale(0.8)' });

    useEffect(() => {
        if (!itemRef.current || !containerRef.current) return;
        
        const container = containerRef.current;
        const item = itemRef.current;
        
        const containerRect = container.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        
        // Focal Point: Center of the visible container
        const focalPoint = containerRect.top + (containerRect.height / 2);
        const itemCenter = itemRect.top + (itemRect.height / 2);
        const dist = Math.abs(focalPoint - itemCenter);
        
        // Visual constants
        const maxDist = 500; // Range of effect
        let norm = Math.min(dist / maxDist, 1);
        
        // Easing: Linear for gradual blur from center
        const easedNorm = norm; 

        // Calculate Blur
        const maxBlur = 6;
        const blur = easedNorm * maxBlur; 
        
        // Calculate Opacity
        const opacity = 1 - (easedNorm * 0.7);
        
        // Calculate Scale
        const scale = 1.0 - (easedNorm * 0.2); 

        // Calculate Circular Horizontal Offset (The curve)
        // DYNAMIC RESPONSIVE SHIFT
        // On Desktop: we want a larger shift to make use of space.
        // On Mobile: smaller shift.
        const isMobile = window.innerWidth < 640;
        const maxShift = isMobile ? 60 : 200; 
        
        // "Edge" logic: The resting position (dist=max) is 0 (or slight negative).
        // Center position (dist=0) is maxShift (pushed right).
        // The container already hugs the left edge (pl-0).
        const xShift = (1 - easedNorm) * maxShift; 
        
        setStyle({
            filter: `blur(${blur}px)`,
            opacity: opacity,
            transform: `translateX(${xShift}px) scale(${scale})`,
        });

    }, [scrollTop]);

    return (
        <div 
            ref={itemRef}
            className="snap-center shrink-0 w-full flex items-center justify-start transition-all duration-100 ease-out will-change-transform my-2 sm:my-0 pl-0"
            style={{...style, height: window.innerWidth < 640 ? '150px' : '450px'}}
        >
             {/* Image container */}
            <div className="w-[120px] h-[120px] sm:w-[450px] sm:h-[450px] relative">
                <img 
                    src={src} 
                    alt="" 
                    className="w-full h-full object-contain" 
                />
            </div>
        </div>
    );
};

export default BlurCarousel;
