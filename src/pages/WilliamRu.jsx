import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const sections = {
	"kids-next-door-hoodie": {
		title: 'KND "NUMBUH 4" HOODIE',
		images: [
			"/Images/William Ru/png1.png",
		],
	},
	"notting-hill-pinstripe-shirt": {
		title: "NOTTING HILL PINSTRIPE SHIRT",
		images: [
			"/Images/William Ru/png2.png",
			"/Images/William Ru/DSC07061.jpeg",
			"/Images/William Ru/DSC07129.jpeg",
		],
	},
	"stealth-camo-set": {
		title: "STEALTH CAMO SET",
		mobileImages: [
			"/Images/2025/William Ru/camoIMG_6622.jpeg",
		],
		images: [
			"/Images/2025/William Ru/camobg.jpeg",
		],
	},
};

const allImages = [
	"/Images/William Ru/DSC07061.jpeg",
	"/Images/William Ru/DSC07129.jpeg",
	"/Images/William Ru/DSC07261.jpeg",
	"/Images/William Ru/DSC07382.jpg.webp",
	"/Images/William Ru/png1.png",
	"/Images/William Ru/png2.png",
	"/Images/William Ru/png3.png",
	"/Images/William Ru/png4.png",
];

export default function WilliamRu() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const activeItem = searchParams.get("item");
	const section = activeItem && sections[activeItem];

	const [isMobile, setIsMobile] = useState(false);
	const [camoScale, setCamoScale] = useState(100);
	// Track the initial item from URL so we only reorder pills on first load
	const initialItem = useRef(searchParams.get("item"));

	useEffect(() => {
		const check = () => setIsMobile(window.innerWidth < 640);
		check();
		window.addEventListener('resize', check);
		return () => window.removeEventListener('resize', check);
	}, []);

	const images = section
		? (isMobile && section.mobileImages ? section.mobileImages : section.images)
		: allImages;

	// Only reorder pills based on the item the user arrived with, not subsequent clicks
	const sectionEntries = Object.entries(sections);
	const firstItem = initialItem.current;
	const sortedEntries = firstItem
		? [
			...sectionEntries.filter(([slug]) => slug === firstItem),
			...sectionEntries.filter(([slug]) => slug !== firstItem),
		  ]
		: sectionEntries;

	const isCamoMobile = isMobile && activeItem === 'stealth-camo-set';

	return (
		<div className="w-full max-w-4xl mx-auto px-6 pt-4 pb-8 pointer-events-auto">
			{/* Header: back arrow + WILLIAM RU — matching Work page selected item style */}
			<div 
				className="flex items-center cursor-pointer mb-2"
				style={{ 
					transform: 'scale(0.7)', 
					transformOrigin: 'left center',
					marginLeft: '0px',
				}}
				onClick={() => navigate(-1)}
			>
				<div className="w-8 md:w-12 flex-shrink-0 mr-1">
					<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-black dark:text-white">
						<path d="M19 12H5M12 19l-7-7 7-7"/>
					</svg>
				</div>
				<h2
					className="text-4xl sm:text-6xl font-light text-black dark:text-[#e5e5e5] whitespace-nowrap"
					style={{ fontFamily: '"PT Mono", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
				>
					WILLIAM RU
				</h2>
			</div>

			{/* Section nav */}
			<div className="flex gap-3 mb-6 ml-0 overflow-x-auto no-scrollbar">
				{sortedEntries.map(([slug, sec]) => (
					<button
						key={slug}
						onClick={() => navigate(`/williamru?item=${slug}`, { replace: true })}
						className={`text-xs sm:text-sm uppercase tracking-wider px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border transition-colors whitespace-nowrap ${
							slug === activeItem
								? 'bg-black text-white dark:bg-neutral-500 dark:text-black border-transparent'
								: 'border-neutral-300 dark:border-neutral-700 text-neutral-500 hover:text-black dark:hover:text-white'
						}`}
						style={{ fontFamily: "'PT Mono', monospace" }}
					>
						{sec.title}
					</button>
				))}
			</div>


			<div className="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-2 gap-4">
				{images.map((src, i) => (
					<a
						key={src}
						href={src}
						target="_blank"
						rel="noreferrer noopener"
						className="block overflow-hidden"
						aria-label={`Open photo ${i + 1}`}
					>
						<img
							src={src}
							alt={`William Ru photo ${i + 1}`}
							loading="lazy"
							decoding="async"
							className="w-full h-auto sm:h-[500px] sm:object-cover transition-transform duration-300 hover:scale-105"
							style={isCamoMobile ? { width: `${camoScale}%`, maxWidth: 'none' } : undefined}
						/>
					</a>
				))}
			</div>
		</div>
	);
}
