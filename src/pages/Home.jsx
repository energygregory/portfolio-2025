import React from "react";
import LogoLoop from "../components/LogoLoop";
import MultiRowLogoLoop from "../components/MultiRowLogoLoop";
import logos from "../data/logos";

// place your logo at: public/LOGOS/finalbiglogo.svg (or .png/.jpg)
import personallogo from "../../public/LOGOS/finalbiglogo.svg";

// Logos used for the logo-strip — same source as App's list (kept local here for the Home page placement)
const portfolioLogos = [
  { id: "around", label: "Around", src: "/LOGOS/Asset 1.svg", path: "/work", logoHeight: 72 },
  { id: "brand-two", label: "Clapes", src: "/LOGOS/BRAND-TWO.svg", path: "/clapes" },
  { id: "brand-three", label: "Brand Three", src: "/LOGOS/BRAND-THREE.svg", path: "/work" },
  { id: "logo-1-white", label: "Logo 1", src: "/LOGOS/Logo 1 in whitw.svg", path: "/terzo" },
  { id: "william-ru", label: "William Ru", src: "/LOGOS/William Ru.svg", path: "/williamru" },
  { id: "fly-high", label: "Fly High", src: "/LOGOS/flyhigh.svg", path: "/flyhigh" },
  { id: "semanu-studios", label: "Semanu Studios", src: "/LOGOS/semanu studios.svg", path: "/work" },
];

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-16 flex flex-col">
      {/* Top spacer */}
      <div className="w-full h-32"></div>

      <div className="w-full mb-6 flex justify-center">
        <img 
          src={personallogo} 
          alt="Logo" 
          className="w-full max-w-[1200px] h-auto dark:invert"
        />
      </div>

      {/* Responsive spacing: show 'Trusted By' and part of the first logo row across devices */}
      <div className="w-full h-20 sm:h-28 md:h-40 lg:h-56"></div>

      {/* Trusted By Section + logo strip — push down on mobile only */}
      <div className="w-full mt-24 sm:mt-0">
        <div className="w-full mb-3 text-center">
          <h3
            className="trusted-by text-sm tracking-widest text-neutral-600 dark:text-neutral-400"
            style={{ fontFamily: "'PT Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, monospace" }}
          >
            T R U S T E D &nbsp; B Y
          </h3>
        </div>

        {/* Slow, multi-row logo section (moved from top bar). 4 stacked rows, drastically reduced speed. */}
        {/* Make the logo strip span the full viewport width so it starts at the edges */}
        <section className="w-full mb-12">
          <MultiRowLogoLoop
            logos={logos}
            rows={3}
            /* reduced speed and increased horizontal gap */
            speed={16}
            logoHeight={36}
            gap={140}
            rowGap={80}
          />
        </section>
      </div>

      <div className="flex-1" />

      {/* Contact Section */}
  <section className="w-full max-w-6xl mx-auto mb-16 contact-section mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left: Heading */}
          <div>
            <h2 className="text-5xl md:text-6xl font-bold leading-tight">
              <span className="text-neutral-700 dark:text-neutral-300">Open for Collabs</span>
              <br />
              <span className="text-neutral-900 dark:text-neutral-50">&amp; Commissions</span>
            </h2>
          </div>

          {/* Right: Contact Info and Form */}
          <div>
            {/* Status Badge */}
            <div className="mb-8 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                Available
              </span>
            </div>

            {/* Contact Links */}
            <div className="space-y-4 mb-8">
              {/* Instagram */}
              <a
                href="https://instagram.com/0021.studio"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 group"
              >
                <svg
                  className="w-5 h-5 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
                </svg>
                <span className="text-blue-500 group-hover:underline">0021.studio</span>
              </a>

              {/* Email */}
              <a
                href="mailto:gregory.gfx1@gmail.com"
                className="flex items-center gap-3 group"
              >
                <svg
                  className="w-5 h-5 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                <span className="text-blue-500 group-hover:underline">gregory.gfx1@gmail.com</span>
              </a>
            </div>

            {/* Form Section */}
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Jane Smith"
                  className="w-full px-4 py-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 placeholder-neutral-400 dark:placeholder-neutral-500 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="jane@framer.com"
                  className="w-full px-4 py-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 placeholder-neutral-400 dark:placeholder-neutral-500 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Message
                </label>
                <textarea
                  placeholder="Send a message..."
                  rows="6"
                  className="w-full px-4 py-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 placeholder-neutral-400 dark:placeholder-neutral-500 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 bg-neutral-900 dark:bg-neutral-100 text-neutral-50 dark:text-neutral-900 font-medium rounded-full hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
