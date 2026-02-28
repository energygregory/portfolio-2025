import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const sections = {
	"kids-next-door-hoodie": {
		title: 'Kids Next Door "Numbuh 4" Hoodie',
		images: [
			"/Images/William Ru/png1.png",
		],
	},
	"nottingham-pinstripe-shirt": {
		title: "Nottingham Pinstripe Shirt",
		images: [
			"/Images/William Ru/png2.png",
			"/Images/William Ru/DSC07061.jpeg",
			"/Images/William Ru/DSC07129.jpeg",
		],
	},
	"stealth-camo-set": {
		title: "Stealth Camo Set",
		images: [
			"/Images/William Ru/png3.png",
			"/Images/William Ru/png4.png",
			"/Images/William Ru/DSC07261.jpeg",
			"/Images/William Ru/DSC07382.jpg.webp",
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

	const images = section ? section.images : allImages;

	return (
		<div className="max-w-7xl mx-auto px-6 pt-0 pb-8 pointer-events-auto">
			{/* Header: back arrow + WILLIAM RU — matching Work page selected item style */}
			<div className="flex items-center mb-4" style={{ transform: 'scale(0.7)', transformOrigin: 'left center' }}>
				<div
					className="w-8 md:w-12 -ml-8 md:-ml-12 cursor-pointer"
					onClick={() => navigate(-1)}
				>
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
			<div className="flex flex-wrap gap-3 mb-6 ml-0">
				{Object.entries(sections).map(([slug, sec]) => (
					<button
						key={slug}
						onClick={() => navigate(`/williamru?item=${slug}`, { replace: true })}
						className={`text-xs uppercase tracking-wider px-3 py-1.5 rounded-full border transition-colors ${
							slug === activeItem
								? 'bg-neutral-300 text-black border-transparent'
								: 'border-neutral-300 dark:border-neutral-700 text-neutral-500 hover:text-black dark:hover:text-white'
						}`}
						style={{ fontFamily: "'PT Mono', monospace" }}
					>
						{sec.title}
					</button>
				))}
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
				{images.map((src, i) => (
					<a
						key={src}
						href={src}
						target="_blank"
						rel="noreferrer noopener"
						className="block overflow-hidden rounded"
						aria-label={`Open photo ${i + 1}`}
					>
						<img
							src={src}
							alt={`William Ru photo ${i + 1}`}
							loading="lazy"
							decoding="async"
							className="w-full h-56 object-cover transition-transform duration-300 hover:scale-105"
						/>
					</a>
				))}
			</div>
		</div>
	);
}
