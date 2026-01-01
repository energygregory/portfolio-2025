// // export default function App() {
// //   return (
// //     <div>
// //       <h1>Portfolio is live</h1>
// //     </div>
// //   );
// // }

// function App() {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-black">
//       <h1 className="text-4xl font-bold text-white">Tailwind is working 🎯</h1>
//     </div>
//   );
// }

// export default App;

// import { Routes, Route, Link } from "react-router-dom";
// import Home from "./pages/Home.jsx";
// import Work from "./pages/Work.jsx";
// import About from "./pages/About.jsx";
// import Testimonials from "./pages/Testimonials.jsx";
// import Contact from "./pages/Contact.jsx";

// function App() {
//   return (
//     <div className="min-h-screen text-white relative">
//       <header className="p-4 border-b border-neutral-800 flex justify-center gap-56">
//         <Link to="/">Home</Link>
//         <Link to="/work">Work</Link>
//         <Link to="/about">About</Link>
//         <Link to="/testimonials">Testimonials</Link>
//         <Link to="/contact">Contact</Link>
//       </header>

//       <main className="p-4">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/work" element={<Work />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/testimonials" element={<Testimonials />} />
//           <Route path="/contact" element={<Contact />} />
//         </Routes>
//       </main>
//     </div>
//   );
// }

// export default App;

// import { Routes, Route, Link } from "react-router-dom";
// import Home from "./pages/Home.jsx";
// import Work from "./pages/Work.jsx";
// import About from "./pages/About.jsx";
// import Testimonials from "./pages/Testimonials.jsx";
// import Contact from "./pages/Contact.jsx";

// function App() {
//   return (
//     <div className="min-h-screen text-white relative">
//       {/* NAVBAR — no grid */}
//       <header className="p-4 border-b border-neutral-800 flex justify-center gap-56 bg-black relative z-10">
//         <Link to="/">Home</Link>
//         <Link to="/work">Work</Link>
//         <Link to="/about">About</Link>
//         <Link to="/testimonials">Testimonials</Link>
//         <Link to="/contact">Contact</Link>
//       </header>

//       {/* MAIN CONTENT — grid background */}
//       <main className="p-4 grid-bg relative z-10">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/work" element={<Work />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/testimonials" element={<Testimonials />} />
//           <Route path="/contact" element={<Contact />} />
//         </Routes>
//       </main>
//     </div>
//   );
// }

// export default App;

import {
  Routes,
  Route,
  Link,
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useEffect, useState, useRef, Suspense, lazy } from "react";

// Disable right-click context menu on images
if (typeof document !== 'undefined') {
  document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG') {
      e.preventDefault();
    }
  });
}
import Home from "./pages/Home.jsx";
const Work = lazy(() => import("./pages/Work.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const Terzo = lazy(() => import("./pages/Terzo.jsx"));
const WilliamRu = lazy(() => import("./pages/WilliamRu.jsx"));
const Around = lazy(() => import("./pages/Around.jsx"));
const FlyHigh = lazy(() => import("./pages/FlyHigh.jsx"));
const LegacyDrip = lazy(() => import("./pages/LegacyDrip.jsx"));
const PriceList = lazy(() => import("./pages/PriceList.jsx"));

import NavigationLoader from "./components/NavigationLoader";
const Footer = lazy(() => import("./components/Footer"));
const LiquidLogo = lazy(() => import("./components/LiquidLogo"));

// Use the actual files in public/LOGOS (filenames used as-is).
const portfolioLogos = [
  {
    id: "brand-one",
    label: "Brand One",
    src: "/LOGOS/BRAND-ONE.svg",
    path: "/work",
  },
  {
    id: "brand-two",
    label: "Brand Two",
    src: "/LOGOS/BRAND-TWO.svg",
    path: "/work",
  },
  {
    id: "brand-three",
    label: "Brand Three",
    src: "/LOGOS/BRAND-THREE.svg",
    path: "/work",
  },
  {
    id: "logo-1-white",
    label: "Logo 1",
    src: "/LOGOS/Logo 1 in whitw.svg",
    path: "/terzo",
  },
  {
    id: "william-ru",
    label: "William Ru",
    src: "/LOGOS/William Ru.svg",
    path: "/williamru",
  },
];

function App() {
  console.log('App component is rendering');
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Track if navigating from Work page to brand page
  const [slideTransition, setSlideTransition] = useState(false);
  const prevPathRef = useRef(location.pathname);
  
  // Asset1 remains visible on desktop; mobile stays hidden via CSS

  // Theme state with toggle
  const [theme, setTheme] = useState("dark");
  
  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };

  // Slider state to fine-tune the theme-toggle horizontal position (px)
  const [iconOffset, setIconOffset] = useState(-8); // default matches -right-2 (~-8px)
  // Slider to adjust left padding of the pill (px)
  const [pillPadding, setPillPadding] = useState(32); // corresponds to px-8
  const [showSlider, setShowSlider] = useState(true);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Check if navigating from Work to brand page
    const brandPages = ['/williamru', '/legacydrip', '/flyhigh', '/around', '/terzo'];
    const isFromWorkToBrand = prevPathRef.current === '/work' && brandPages.includes(location.pathname);
    
    setSlideTransition(isFromWorkToBrand);
    prevPathRef.current = location.pathname;
    
    // Reset slide transition after animation completes
    if (isFromWorkToBrand) {
      const timer = setTimeout(() => setSlideTransition(false), 500);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark", "theme-dark");
      root.classList.remove("theme-light");
      root.style.backgroundColor = "#000000";
      root.style.color = "#ffffff";
      document.body.style.backgroundColor = "#000000";
      document.body.style.color = "#ffffff";
    } else {
      root.classList.add("theme-light");
      root.classList.remove("dark", "theme-dark");
      root.style.backgroundColor = "#ffffff";
      root.style.color = "#000000";
      document.body.style.backgroundColor = "#ffffff";
      document.body.style.color = "#000000";
    }

    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute("content", theme === "dark" ? "#000000" : "#ffffff");
    }
  }, [theme]);

  return (
    <>
      <div
        id="app-content"
        className={`min-h-screen relative flex flex-col overflow-x-hidden ${
          theme === "dark"
            ? "bg-black text-white theme-dark"
            : "bg-white text-black theme-light"
        }`}
      >
      <NavigationLoader theme={theme} onInitialLoad={() => {
        // Remove the initial HTML loader when React's NavigationLoader takes over
        const initialLoader = document.getElementById('initial-loader');
        if (initialLoader) initialLoader.remove();
      }} />
      {/* Logo loop moved to Home page per layout change (was previously at top-level). */}

      {/* SLIDER (fixed above the pill) - visible while adjusting */}
      <div className={`fixed bottom-20 left-1/2 -translate-x-1/2 ${showSlider ? "" : "hidden"}`} style={{ zIndex: 9999 }}>
        <div className={`p-3 rounded-md flex flex-col sm:flex-row items-center gap-3 shadow-lg ${theme === 'dark' ? 'bg-black/80 text-white border border-neutral-800' : 'bg-white/90 text-black border border-neutral-300'}`}>
          <div className="flex items-center gap-3">
            <label className="text-xs font-medium">Icon pos</label>
            <input
              type="range"
              min="-40"
              max="40"
              value={iconOffset}
              onChange={(e) => setIconOffset(Number(e.target.value))}
              className="w-48"
            />
            <span className="text-xs w-12 text-center">{iconOffset}px</span>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs font-medium">Pill left</label>
            <input
              type="range"
              min="0"
              max="80"
              value={pillPadding}
              onChange={(e) => setPillPadding(Number(e.target.value))}
              className="w-48"
            />
            <span className="text-xs w-12 text-center">{pillPadding}px</span>
          </div>

          <div className="flex items-center">
            <button
              onClick={() => setShowSlider(false)}
              className="ml-2 px-3 py-1 rounded bg-green-600 text-white text-xs"
            >
              OK
            </button>
          </div>
        </div>
      </div>

      {/* NAV BAR (CENTERED LINKS) */}
      <header
        style={{ paddingLeft: `${pillPadding}px` }}
        className={`
          z-50 flex justify-center items-center app-header
          sm:sticky sm:top-0 sm:p-4 sm:border-b
          fixed bottom-4 left-1/2 -translate-x-1/2 w-auto py-2 px-8 sm:px-6 rounded-full border
          ${
            theme === "dark"
              ? "border-neutral-800 bg-black/80 backdrop-blur-sm"
              : "border-neutral-300 bg-white/80 backdrop-blur-sm"
          }
        `}
      >
        {/* Top-left clickable logo - HIDDEN ON MOBILE FLOATING NAV */}
        <div className="hidden sm:block absolute left-2 sm:left-4 top-1/2 -translate-y-1/2">
          <Link to="/" aria-label="Home">
            <img
              src="/LOGOS/newlogo.svg"
              alt="Home"
              className="nav-logo h-5 sm:h-8"
            />
          </Link>
        </div>
        
        {/* Theme toggle - Now visible on mobile floating nav */}
        <button
          onClick={toggleTheme}
          className="absolute top-1/2 p-1.5 sm:p-2 rounded-full transition-colors hover:bg-gray-200 dark:hover:bg-gray-800"
          style={{ right: `${iconOffset}px`, transform: 'translateY(-50%) scale(1.12)' }}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
              <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        
        {/* Nav links container */}
        <nav className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm px-2">
          {/* Text links for desktop */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-link hidden sm:inline ${isActive ? "active" : ""}`
            }
            style={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800, fontFamily: '"PT Mono", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
          >
            Home
          </NavLink>
          <span className="nav-link opacity-40 cursor-not-allowed" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800, fontFamily: '"PT Mono", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
            Work <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="inline w-1.5 h-1.5 sm:w-1.5 sm:h-1.5 ml-0.5 sm:ml-1 align-middle"><path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" /></svg>
          </span>
          <span className="nav-link opacity-40 cursor-not-allowed" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800, fontFamily: '"PT Mono", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
            About <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="inline w-1.5 h-1.5 sm:w-1.5 sm:h-1.5 ml-0.5 sm:ml-1 align-middle"><path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" /></svg>
          </span>
          <span className="nav-link opacity-40 cursor-not-allowed" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800, fontFamily: '"PT Mono", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
            Contact <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="inline w-1.5 h-1.5 sm:w-1.5 sm:h-1.5 ml-0.5 sm:ml-1 align-middle"><path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" /></svg>
          </span>
        </nav>
      </header>

      {/* Asset1.svg decorative element - positioned between navbar and footer */}
      <div className="relative flex-1 overflow-hidden" style={{ minHeight: '100vh' }}>
        {/* The decorative SVG - BEHIND main content */}
        {/* Mobile: hidden */}
        {/* Desktop: fills entire viewport height as background decoration, masked at center */}
        {/* Asset1 overlay hidden */}
        
        {/* Main content - above Asset1 */}
        <main className={`relative z-10 p-4 ${slideTransition ? 'page-transition' : ''}`}>
          <Suspense
            fallback={<div className="min-h-screen" />}
          >
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home theme={theme} />} />
              <Route path="/work" element={<Work />} />
              <Route path="/about" element={<About />} />
              <Route path="/around" element={<Around />} />
              <Route path="/flyhigh" element={<FlyHigh />} />
              <Route path="/legacydrip" element={<LegacyDrip />} />
              <Route path="/terzo" element={<Terzo />} />
              <Route path="/williamru" element={<WilliamRu />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/pricelist" element={<PriceList />} />
            </Routes>
          </Suspense>
        </main>
      </div>
      
      {/* Metallic Chain Border with Liquid Metal Effect - HIDDEN */}
      {/* <div className={`w-full overflow-hidden py-4 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
        <div 
          className="w-full flex"
          style={{
            height: '60px',
          }}
        >
          <div className="hidden md:block flex-1 h-full">
            <LiquidLogo logoUrl="/LOGOS/half.svg" logoScale={0.9} effectScale={0.5} />
          </div>
          <div className="flex-1 h-full">
            <LiquidLogo logoUrl="/LOGOS/half.svg" logoScale={0.9} effectScale={0.5} />
          </div>
          <div className="flex-1 h-full">
            <LiquidLogo logoUrl="/LOGOS/half.svg" logoScale={0.9} effectScale={0.5} />
          </div>
        </div>
      </div> */}

      <Suspense fallback={<div className="py-8 text-center text-xs tracking-[0.3em] uppercase opacity-40">Loading footer…</div>}>
        <Footer />
      </Suspense>
    </div>
    </>
  );
}

export default App;
