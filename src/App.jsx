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
import { useEffect, useState, useRef } from "react";
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
import Footer from "./components/Footer";

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
  const navigate = useNavigate();
  const location = useLocation();
  
  // Track if navigating from Work page to brand page
  const [slideTransition, setSlideTransition] = useState(false);
  const prevPathRef = useRef(location.pathname);

  // Dark mode only
  const theme = "dark";

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
    // Dark mode only
    root.classList.add("dark", "theme-dark");
    root.classList.remove("theme-light");

    root.style.backgroundColor = "#000000";
    root.style.color = "#ffffff";
    document.body.style.backgroundColor = "#000000";
    document.body.style.color = "#ffffff";

    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute("content", "#000000");
    }
  }, []);

  return (
    <div
      className={`min-h-screen relative flex flex-col ${
        theme === "dark"
          ? "bg-black text-white theme-dark"
          : "bg-white text-black theme-light"
      }`}
    >
      <NavigationLoader theme={theme} />
      {/* Logo loop moved to Home page per layout change (was previously at top-level). */}

      {/* NAV BAR (CENTERED LINKS) */}
      <header
        className={`sticky top-0 z-50 p-4 border-b flex justify-center items-center sm:gap-56 gap-3 app-header ${
          theme === "dark"
            ? "border-neutral-800 bg-black"
            : "border-neutral-300 bg-white"
        }`}
      >
        {/* Top-left clickable logo that always links to home */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <Link to="/" aria-label="Home">
            <img
              src="/LOGOS/newlogo.svg"
              alt="Home"
              className="nav-logo sm:h-8 h-6"
            />
          </Link>
        </div>
        {/* Show all nav links on all devices with small gaps on mobile */}
        <nav className="flex items-center gap-3 sm:gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-link inline mx-1 ${isActive ? "active" : ""}`
            }
          >
            Home
          </NavLink>
          <span className="nav-link mx-1 opacity-40 cursor-not-allowed" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800, fontFamily: '"PT Mono", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
            Work <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '12px', height: '12px', display: 'inline', verticalAlign: 'middle', marginLeft: '4px' }}><path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" /></svg>
          </span>
          <span className="nav-link mx-1 opacity-40 cursor-not-allowed" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800, fontFamily: '"PT Mono", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
            About <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '12px', height: '12px', display: 'inline', verticalAlign: 'middle', marginLeft: '4px' }}><path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" /></svg>
          </span>
          <span className="nav-link mx-1 opacity-40 cursor-not-allowed" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800, fontFamily: '"PT Mono", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
            Contact <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '12px', height: '12px', display: 'inline', verticalAlign: 'middle', marginLeft: '4px' }}><path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" /></svg>
          </span>
        </nav>
      </header>

      <main className={`flex-1 p-4 ${slideTransition ? 'page-transition' : ''}`}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
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
      <Footer />
    </div>
  );
}

export default App;
