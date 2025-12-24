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

import { Routes, Route, Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/Home.jsx";
import Work from "./pages/Work.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Terzo from "./pages/Terzo.jsx";
import WilliamRu from "./pages/WilliamRu.jsx";
import Around from "./pages/Around.jsx";
import FlyHigh from "./pages/FlyHigh.jsx";
import LegacyDrip from "./pages/LegacyDrip.jsx";
import PriceList from "./pages/PriceList.jsx";

import LogoLoop from "./components/LogoLoop";
import NavigationLoader from "./components/NavigationLoader";

// Use the actual files in public/LOGOS (filenames used as-is).
const portfolioLogos = [
  { id: "brand-one", label: "Brand One", src: "/LOGOS/BRAND-ONE.svg", path: "/work" },
  { id: "brand-two", label: "Brand Two", src: "/LOGOS/BRAND-TWO.svg", path: "/work" },
  { id: "brand-three", label: "Brand Three", src: "/LOGOS/BRAND-THREE.svg", path: "/work" },
  { id: "logo-1-white", label: "Logo 1", src: "/LOGOS/Logo 1 in whitw.svg", path: "/terzo" },
  { id: "william-ru", label: "William Ru", src: "/LOGOS/William Ru.svg", path: "/williamru" },
];

function App() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Force default to dark mode, ignoring local storage for the initial state if desired,
  // or just ensure the fallback is "dark".
  // The user wants "default mode for the site to be dark mode".
  // If we want to force it every time the app loads (e.g. on refresh), we can just set it to "dark".
  // But usually users expect persistence.
  // However, since the user complained "default mode... wasn't dark mode",
  // I will initialize it to "dark" directly to ensure the first paint is correct.
  // If we want persistence, we can read it in an effect, but that causes a flash.
  // Let's stick to the user's request: "default mode... is dark mode".
  const [theme, setTheme] = useState(() => {
    try {
      // Changed key to 'theme_v2' to reset preferences and ensure default is dark for everyone
      return localStorage.getItem("theme_v2") || "dark";
    } catch (e) {
      return "dark";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("theme_v2", theme);
    } catch (e) {}
  }, [theme]);

  return (
    <div
      className={`min-h-screen relative ${
        theme === "dark"
          ? "bg-black text-white theme-dark"
          : "bg-white text-black theme-light"
      }`}
    >
      <NavigationLoader theme={theme} onVisibleChange={setIsLoading} />
      {/* Logo loop moved to Home page per layout change (was previously at top-level). */}

      {/* NAV BAR (CENTERED LINKS) */}
  <header
    className={`sticky top-0 z-50 p-4 border-b flex justify-center items-center sm:gap-56 gap-3 app-header ${
      theme === "dark" ? "border-neutral-800 bg-black" : "border-neutral-300 bg-white"
    }`}
  >
    {/* Top-left clickable logo that always links to home */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
      <Link to="/" aria-label="Home">
        <img src="/LOGOS/newlogo.svg" alt="Home" className="nav-logo sm:h-8 h-6" />
      </Link>
    </div>
    {/* Show all nav links on all devices with small gaps on mobile */}
    <nav className="flex items-center gap-3 sm:gap-6">
      <NavLink to="/" className={({ isActive }) => `nav-link inline mx-1 ${isActive ? 'active' : ''}`}>
        Home
      </NavLink>
      <NavLink to="/work" className={({ isActive }) => `nav-link inline mx-1 ${isActive ? 'active' : ''}`}>
        Work
      </NavLink>
      <NavLink to="/about" className={({ isActive }) => `nav-link inline mx-1 ${isActive ? 'active' : ''}`}>
        About
      </NavLink>
      <NavLink to="/contact" className={({ isActive }) => `nav-link inline mx-1 ${isActive ? 'active' : ''}`}>
        Contact
      </NavLink>
    </nav>
    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
      <button
        onClick={() => setTheme("light")}
        aria-label="Light mode"
        className="p-1 rounded hover:bg-neutral-200/10"
        title="Light mode"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-current">
          <circle cx="12" cy="12" r="4"></circle>
          <path d="M12 2v2"></path>
          <path d="M12 20v2"></path>
          <path d="M4.93 4.93l1.41 1.41"></path>
          <path d="M17.66 17.66l1.41 1.41"></path>
          <path d="M2 12h2"></path>
          <path d="M20 12h2"></path>
          <path d="M4.93 19.07l1.41-1.41"></path>
          <path d="M17.66 6.34l1.41-1.41"></path>
        </svg>
      </button>
      <button
        onClick={() => setTheme("dark")}
        aria-label="Dark mode"
        className="p-1 rounded hover:bg-neutral-200/10"
        title="Dark mode"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-current">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
        </svg>
      </button>
    </div>
  </header>

      <main className="p-4">
        <Routes>
          <Route path="/" element={<Home isLoading={isLoading} />} />
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
      </main>
    </div>
  );
}

export default App;
