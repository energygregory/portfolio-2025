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

	const title = section ? `William Ru — ${section.title}` : "William Ru — All Designs";
	const images = section ? section.images : allImages;

	return (
		<div className="max-w-7xl mx-auto px-4 py-8 pointer-events-auto">
			{/* Back button */}
			<button
				onClick={() => navigate(-1)}
				className="mb-4 text-sm text-neutral-500 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1"
				style={{ fontFamily: "'PT Mono', monospace" }}
			>
				<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
					<path d="M19 12H5M12 19l-7-7 7-7"/>
				</svg>
				Back
			</button>

			<h1
				className="text-2xl sm:text-3xl font-semibold mb-6"
				style={{ fontFamily: "'PT Mono', monospace" }}
			>
				{title}
			</h1>

			{/* Section nav when viewing a specific item */}
			{section && (
				<div className="flex flex-wrap gap-3 mb-6">
					{Object.entries(sections).map(([slug, sec]) => (
						<button
							key={slug}
							onClick={() => navigate(`/williamru?item=${slug}`, { replace: true })}
							className={`text-xs uppercase tracking-wider px-3 py-1.5 rounded-full border transition-colors ${
								slug === activeItem
									? 'bg-black text-white dark:bg-white dark:text-black border-transparent'
									: 'border-neutral-300 dark:border-neutral-700 text-neutral-500 hover:text-black dark:hover:text-white'
							}`}
							style={{ fontFamily: "'PT Mono', monospace" }}
						>
							{sec.title}
						</button>
					))}
				</div>
			)}

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
