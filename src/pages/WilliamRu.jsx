import React from "react";

const images = [
	"/Images/William Ru/DSC07061.jpeg",
	"/Images/William Ru/DSC07129.jpeg",
	"/Images/William Ru/DSC07261.jpeg",
	"/Images/William Ru/DSC07382.jpg.webp",
];

export default function WilliamRu() {
	return (
		<div className="max-w-7xl mx-auto px-4 py-8">
			<h1 className="text-3xl font-semibold mb-6">William Ru — Photos</h1>

			<p className="text-sm text-muted-foreground mb-4">Click any image to open the full-size photo in a new tab.</p>

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
