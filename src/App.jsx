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
import AnalyticsTracker from "./components/AnalyticsTracker";
import { getDeviceCategory } from "./utils/detectDevice";

// Disable right-click context menu on images (removed for security - ineffective and annoying)
// if (typeof document !== 'undefined') {
//   document.addEventListener('contextmenu', (e) => {
//     if (e.target.tagName === 'IMG') {
//       e.preventDefault();
//     }
//   });
// }
import Home from "./pages/Home.jsx";
import Work from "./pages/Work.jsx";
import WorkGraphic from "./pages/WorkGraphic.jsx";
import WorkMerch from "./pages/WorkMerch.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
const Terzo = lazy(() => import("./pages/Terzo.jsx"));
const WilliamRu = lazy(() => import("./pages/WilliamRu.jsx"));
const Around = lazy(() => import("./pages/Around.jsx"));
const FlyHigh = lazy(() => import("./pages/FlyHigh.jsx"));
const LegacyDrip = lazy(() => import("./pages/LegacyDrip.jsx"));
const PriceList = lazy(() => import("./pages/PriceList.jsx"));
const Admin = lazy(() => import("./pages/Admin.jsx"));

import NavigationLoader from "./components/NavigationLoader";
import Asset1Svg from "./components/Asset1Svg";
const SpotifyNowPlaying = lazy(() => import("./components/SpotifyNowPlaying"));
const Footer = lazy(() => import("./components/Footer"));
const LiquidLogo = lazy(() => import("./components/LiquidLogo"));

// HARDCODED ASSET THICKNESS - DO NOT CHANGE THIS DYNAMICALLY
const HARDCODED_ASSET_THICKNESS = 0.8;

// Device-specific configurations (hardcoded per user's adjustments)
// Key format: "widthxheight" for precise matching
const DEVICE_CONFIGS = {
  // iPhone 14 Pro Mobile (Generic Mobile Fallback updated to these values)
  mobile: {
    heroScale: 0.72,
    heroY: 129,
    animatedOutlineWidth: 4.4,
    assetX: 0,
    assetY: -181,
    assetScale: 1,
    assetH: 1,
    assetV: 0.88,
    navY: 54,
    widgetScale: 0.66,
    widgetY: 90,
    assetOutlineThickness: 0.8,
    assetRotation: 0,
    marqueeY: 11,
    marqueeScale: 0.6,
    marqueeGap: 24, // mobile gap 6 (6 * 4 = 24px)
    marqueeSpeed: 60, // 60s
  },
  // iPhone 12 Pro (390x844) - LOCKED IN
  "390x844": {
    heroScale: 0.69,
    heroY: 79,
    animatedOutlineWidth: 5,
    assetX: 0,
    assetY: -128,
    assetH: 0.93,
    assetV: 1,
    navY: 166,
    widgetScale: 0.5,
    widgetY: 0,
    assetOutlineThickness: 0.8,
    marqueeScale: 1,
    marqueeGap: 24,
    marqueeSpeed: 60,
  },
  // iPhone 14 Pro (393x852) - Explicit match
  "393x852": {
    heroScale: 0.72,
    heroY: 129,
    animatedOutlineWidth: 4.4,
    assetX: 0,
    assetY: -181,
    assetScale: 1,
    assetH: 1,
    assetV: 0.88,
    navY: 54,
    widgetScale: 0.66,
    widgetY: 90,
    assetOutlineThickness: 0.8,
    assetRotation: 0,
    marqueeY: 11,
    marqueeScale: 0.6,
    marqueeGap: 24,
    marqueeSpeed: 60,
  },
  // Specific match for user's screenshot dimensions
  "462x775": {
    heroScale: 0.72,
    heroY: 129,
    animatedOutlineWidth: 4.4,
    assetX: 0,
    assetY: -200,
    assetScale: 1,
    assetH: 1.03,
    assetV: 0.88,
    navY: 54,
    widgetScale: 0.66,
    widgetY: 90,
    assetOutlineThickness: 0.8,
    marqueeY: 57,
  },
  // iPhone 16 Plus (430x932) - LOCKED IN
  "430x932": {
    heroScale: 0.68,
    heroY: 77,
    animatedOutlineWidth: 5,
    assetX: 3,
    assetY: -135,
    assetH: 0.94,
    assetV: 1,
    navY: 209,
    widgetScale: 0.5,
    widgetY: 0,
    assetOutlineThickness: 0.8,
  },
  // iPhone XR (414x896) - LOCKED IN
  "414x896": {
    heroScale: 0.65,
    heroY: 57,
    animatedOutlineWidth: 5,
    assetX: 0,
    assetY: -140,
    assetH: 0.91,
    assetV: 0.98,
    navY: 123,
    widgetScale: 0.5,
    widgetY: 0,
    assetOutlineThickness: 0.8,
  },
  // iPhone 13 Pro Max (428x926) - LOCKED IN
  "428x926": {
    heroScale: 0.66,
    heroY: 84,
    animatedOutlineWidth: 5,
    assetX: -6,
    assetY: -137,
    assetH: 0.93,
    assetV: 0.98,
    navY: 202,
    widgetScale: 0.5,
    widgetY: 0,
    assetOutlineThickness: 0.8,
  },
  // iPad (768x1024)
  "768x1024": {
    heroScale: 1.05,
    heroY: 75,
    animatedOutlineWidth: 3.2,
    assetX: 0,
    assetY: -704,
    assetH: 1.36,
    assetV: 1.17,
    widgetScale: 0.7,
    widgetY: 0,
    assetOutlineThickness: 0.8,
  },
  // iPad Air/Pro 11" Portrait (820x1052)
  "820x1052": {
    heroScale: 1.05,
    heroY: 158,
    animatedOutlineWidth: 2.6,
    assetX: 0,
    assetY: -594,
    assetScale: 0.46,
    assetH: 2.02,
    assetV: 1.25,
    widgetScale: 0.7,
    widgetY: 149,
    navY: 79,
    assetOutlineThickness: 0.5,
    marqueeY: 147,
    marqueeScale: 0.3,
    marqueeSpeed: 60,
  },
  // iPad Pro 11" (834x1194)
  "834x1194": {
    heroScale: 1.05,
    heroY: 75,
    animatedOutlineWidth: 3.2,
    assetX: 0,
    assetY: -594,
    assetScale: 0.46,
    assetH: 2.02,
    assetV: 1.25,
    widgetScale: 0.7,
    widgetY: 149,
    navY: 79,
    assetOutlineThickness: 0.8,
  },
  // iPad Air/Pro 11" Landscape (1180x692)
  "1180x692": {
    heroScale: 0.86,
    heroY: 105,
    animatedOutlineWidth: 1.9,
    assetX: 0,
    assetY: -657,
    assetScale: 0.65,
    assetH: 1.3,
    assetV: 1.05,
    widgetScale: 0.6,
    widgetY: 147,
    navY: 79,
    assetOutlineThickness: 0.3,
    marqueeY: 76,
    marqueeScale: 0.3,
    marqueeSpeed: 60,
  },
  // Tablet Landscape (generic for ~1000px-1366px widths)
  // Adjusted Y to ensure visibility on 10.9-12.9 inch screens in landscape
  "tabletLandscape": {
    heroScale: 1.25,
    heroY: 100,
    animatedOutlineWidth: 2.2,
    assetX: 0,
    assetY: 0, 
    assetH: 1.3,
    assetV: 1.05,
    widgetScale: 0.75,
    widgetY: 80,
    assetOutlineThickness: 0.8,
  },
  // Default fallback for desktop
  desktop: {
    heroScale: 1.44,
    heroY: 147,
    animatedOutlineWidth: 2,
    assetX: 0,
    assetY: -200, // Brought visible
    assetScale: 1,
    assetH: 1.27,
    assetV: 0.96,
    assetOutlineThickness: 0.8,
    assetRotation: 0,
    navY: 79,
    widgetScale: 0.7, // Smaller
    widgetY: 200, // Lower
    marqueeY: 49,
    marqueeScale: 0.4,
    marqueeGap: 64, // desktop md:gap-16
    marqueeSpeed: 60,
  },
  // Default fallback for mobile
  // mobile: { ... } // moved to top for organization
};

// Helper to get config based on screen dimensions and device type
const getDeviceConfig = (dims, deviceMode) => {
  // 1. Exact match override (e.g. for specific iPhone testing)
  if (dims && DEVICE_CONFIGS[dims]) {
    return DEVICE_CONFIGS[dims];
  }

  // 2. Intelligent Device Detection (User Agent + Screen Info)
  
  // If Hardcore Detection says Desktop, force Desktop
  if (deviceMode === 'desktop') {
    return DEVICE_CONFIGS.desktop;
  }
  
  // If Hardcore Detection says Mobile, check if it's a Tablet or Phone
  const category = getDeviceCategory(); 
  
  // Fallback if Hardcore Detection is ambiguous or we need detailed tablet logic
  if (category === 'tablet' || (deviceMode === 'mobile' && typeof window !== 'undefined' && window.innerWidth >= 768)) {
    // Check orientation for tablets
    const width = typeof window !== 'undefined' ? (window.visualViewport?.width || window.innerWidth) : 0;
    
    // iPad 10th Gen Portrait (width 820)
    if (width === 820) return DEVICE_CONFIGS["820x1052"];

    // Tablet Landscape (iPad Pro Landscape, etc)
    if (width > 850) return DEVICE_CONFIGS.tabletLandscape;
    // Tablet Portrait
    return DEVICE_CONFIGS["768x1024"]; 
  }

  // 3. Fallback to mobile if category is 'phone' or unknown
  return DEVICE_CONFIGS.mobile;
};

// Get current viewport dimensions (respects responsive testing tools)
const getViewportDimensions = () => {
  if (typeof window === 'undefined') return { w: 1920, h: 1080 };
  
  // Use visualViewport for more accurate mobile detection
  if (window.visualViewport) {
    return {
      w: Math.round(window.visualViewport.width),
      h: Math.round(window.visualViewport.height)
    };
  }

  // Fallback to inner dimensions
  return {
    w: window.innerWidth,
    h: window.innerHeight
  };
};

// Global background layer to ensure transparency works but we have a base color
// Inserted into the DOM tree
const GlobalBackground = () => (
    <div 
        className="fixed inset-0 -z-[2] w-full h-full pointer-events-none transition-colors duration-500"
        style={{
            backgroundColor: 'var(--bg-base, #000000)'
            // Dark Mode Class handles variable switching normally, 
            // but we hardcode to black for now as per index.css removal? 
            // Actually, let's use the theme classes.
        }} 
    >
        {/* Light mode white background */}
        <div className="absolute inset-0 bg-neutral-100 dark:bg-black transition-colors duration-500" />
    </div>
);

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
  const location = useLocation(); // Hook for conditional footer rendering
  const isLocalhost = typeof window !== 'undefined' && 
    (
      window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname === '' ||
      window.location.hostname.startsWith('192.168.') ||
      window.location.hostname.startsWith('10.')
    );

  console.log('App component is rendering');

  useEffect(() => {
    const hasCounted = sessionStorage.getItem('visit_counted');
    // Only count if not running on localhost to avoid pollution (optional, but good practice)
    const isLocal = window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1');
    
    if (!hasCounted && !isLocal) {
      fetch('https://api.counterapi.dev/v1/energygregory_portfolio/visits/up')
        .then(res => res.json())
        .then(data => {
          console.log('Visitor counted:', data.count);
          sessionStorage.setItem('visit_counted', 'true');
        })
        .catch(err => console.error('Traffic counter error:', err));
    }
  }, []);

  // Hardcore Device Mode Detection (matches index.html script)
  const [viewMode, setViewMode] = useState(() => {
    // Safety check for SSR, defaults to whatever the window has
    if (typeof window !== 'undefined' && window.__DEVICE_MODE__) {
      return window.__DEVICE_MODE__;
    }
    return 'desktop'; // Default fallback
  });

  // Resize listener for view mode
  useEffect(() => {
    const handleResize = () => {
      // Re-run the logic from index.html if needed
      const isMobileHardware = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(navigator.userAgent || '');
      const isSmallScreen = window.matchMedia("only screen and (max-width: 768px)").matches;
      const newMode = (isMobileHardware || isSmallScreen) ? 'mobile' : 'desktop';
      
      if (newMode !== viewMode) {
        setViewMode(newMode);
        
        // Sync the HTML class for consistency
        document.documentElement.classList.remove('device-mobile', 'device-desktop');
        document.documentElement.classList.add(`device-${newMode}`);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);
  
  const navigate = useNavigate();
  // Lock nav on non-localhost when not on desktop view (desktop live sites remain unlocked)
  const isNavLocked = (!isLocalhost && viewMode !== 'desktop');
  // const location = useLocation(); // Already defined above
  
  // Track if navigating from Work page to brand page
  const [slideTransition, setSlideTransition] = useState(false);
  const prevPathRef = useRef(location.pathname);
  
  // Asset1 remains visible on desktop; mobile stays hidden via CSS

  // Theme state with toggle — initialize from localStorage or prefers-color-scheme
  const getInitialTheme = () => {
    // Force dark mode default as requested
    if (typeof window === 'undefined') return 'dark';
    const stored = window.localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;
    return 'dark'; // Default to dark for all devices
  };

  const [theme, setTheme] = useState(getInitialTheme);
  // appliedTheme is what we apply to document classes/background — update it INSTANTLY now
  // const [appliedTheme, setAppliedTheme] = useState(theme);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Persist theme choice so refresh keeps user's preference
  useEffect(() => {
    try {
      window.localStorage.setItem('theme', theme);
    } catch (e) {
      // ignore
    }
  }, [theme]);

  // When `theme` changes -> INSTANT apply
  // Removed the 500ms delay that caused the "white box" desync issue
  /* useEffect(() => {
    const timer = setTimeout(() => setAppliedTheme(theme), 500); // match video transition duration
    return () => clearTimeout(timer);
  }, [theme]); */

  // icon/pill positions — hardcoded per user request
  const iconOffset = 9;
  const pillPadding = 12;

  // Screen dimensions state - updated on resize/viewport change
  const [screenDimensions, setScreenDimensions] = useState(() => {
    if (typeof window === 'undefined') return '?x?';
    const { w, h } = getViewportDimensions();
    return `${w}x${h}`;
  });

  // Get device config based on current screen dimensions AND viewMode
  const [currentConfig, setCurrentConfig] = useState(() => getDeviceConfig(screenDimensions, viewMode));

  // Update the config whenever screen dimensions OR viewMode change
  useEffect(() => {
    setCurrentConfig(getDeviceConfig(screenDimensions, viewMode));
  }, [screenDimensions, viewMode]);

  // Update screen dimensions when viewport changes
  useEffect(() => {
    const updateDimensions = () => {
      const { w, h } = getViewportDimensions();
      const newDims = `${w}x${h}`;
      console.log('Screen dimensions:', newDims, 'UserAgent:', navigator.userAgent);
      setScreenDimensions(newDims);
    };
    
    window.addEventListener('resize', updateDimensions);
    const interval = setInterval(updateDimensions, 500);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
      clearInterval(interval);
    };
  }, []);

  const [liveConfig, setLiveConfig] = useState(currentConfig);

  useEffect(() => {
    setLiveConfig(currentConfig);
  }, [currentConfig]);

  // Apply hardcoded desktop Home settings for specific viewports
  useEffect(() => {
    if (location.pathname === '/' && viewMode === 'desktop') {
      console.log('[Hardcode Check] Current dimensions:', screenDimensions);
      // 2133x1002 viewport hardcodes
      if (screenDimensions === '2133x1002') {
        console.log('[Hardcode Applied] 2133x1002');
        setLiveConfig(prev => ({
          ...prev,
          assetScale: 0.41,
          assetX: -2037,
          assetY: -5387,
          assetOutlineThickness: 0.4,
          assetH: 1.12,
          assetV: 1.07,
          assetRotation: 90
        }));
      }
      // 2083x1002 viewport hardcodes
      else if (screenDimensions === '2083x1002') {
        console.log('[Hardcode Applied] 2083x1002');
        setLiveConfig(prev => ({
          ...prev,
          assetScale: 0.41,
          assetX: -1965,
          assetY: -5311,
          assetOutlineThickness: 0.4,
          assetH: 1.13,
          assetV: 1.11,
          assetRotation: 90,
          heroScale: 1.33,
          heroY: 147,
          widgetY: 200,
          marqueeY: 24,
          marqueeItemScale: 0.4
        }));
      }
      // 1926x1002 viewport hardcodes
      else if (screenDimensions === '1926x1002') {
        console.log('[Hardcode Applied] 1926x1002');
        setLiveConfig(prev => ({
          ...prev,
          assetScale: 0.41,
          assetX: -1859,
          assetY: -4809,
          assetOutlineThickness: 0.4,
          assetH: 1.14,
          assetV: 1.18,
          assetRotation: 90,
          heroScale: 1.44,
          heroY: 147,
          widgetY: 200,
          marqueeY: 49,
          marqueeItemScale: 0.4
        }));
      }
      // 1756x1002 viewport hardcodes
      else if (screenDimensions === '1756x1002') {
        console.log('[Hardcode Applied] 1756x1002');
        setLiveConfig(prev => ({
          ...prev,
          assetScale: 0.41,
          assetX: -1712,
          assetY: -4313,
          assetOutlineThickness: 0.4,
          assetH: 1.12,
          assetV: 1.28,
          assetRotation: 90,
          heroScale: 1.33,
          heroY: 147,
          widgetY: 200,
          marqueeY: 24,
          marqueeItemScale: 0.4
        }));
      }
      // 1661x1002 viewport hardcodes
      else if (screenDimensions === '1661x1002') {
        console.log('[Hardcode Applied] 1661x1002');
        setLiveConfig(prev => ({
          ...prev,
          assetScale: 0.41,
          assetX: -1609,
          assetY: -4013,
          assetOutlineThickness: 0.4,
          assetH: 1.12,
          assetV: 1.4,
          assetRotation: 90,
          heroScale: 1.33,
          heroY: 147,
          widgetY: 200,
          marqueeY: 49,
          marqueeItemScale: 0.4
        }));
      }
      // 1604x1002 viewport hardcodes
      else if (screenDimensions === '1604x1002') {
        console.log('[Hardcode Applied] 1604x1002');
        setLiveConfig(prev => ({
          ...prev,
          assetScale: 0.41,
          assetX: -1540,
          assetY: -3835,
          assetOutlineThickness: 0.4,
          assetH: 1.13,
          assetV: 1.36,
          assetRotation: 90,
          heroScale: 1.33,
          heroY: 147,
          widgetY: 200,
          marqueeY: 24,
          marqueeItemScale: 0.4
        }));
      }
      // 1312x1002 viewport hardcodes
      else if (screenDimensions === '1312x1002') {
        console.log('[Hardcode Applied] 1312x1002');
        setLiveConfig(prev => ({
          ...prev,
          assetScale: 0.41,
          assetX: -1246,
          assetY: -2949,
          assetOutlineThickness: 0.4,
          assetH: 1.12,
          assetV: 1.72,
          assetRotation: 90,
          heroScale: 1.44,
          heroY: 225,
          widgetY: 200,
          marqueeY: 224,
          marqueeItemScale: 0.4
        }));
      }
      // 1263x1002 viewport hardcodes
      else if (screenDimensions === '1263x1002') {
        console.log('[Hardcode Applied] 1263x1002');
        setLiveConfig(prev => ({
          ...prev,
          assetScale: 0.3,
          assetX: -1970,
          assetY: -3837,
          assetOutlineThickness: 0.4,
          assetH: 1.55,
          assetV: 2.47,
          assetRotation: 90,
          heroScale: 1.18,
          heroY: 257,
          widgetY: 200,
          marqueeY: 181,
          marqueeItemScale: 0.35
        }));
      }
    }
  }, [location.pathname, viewMode, screenDimensions]);

  const handleConfigChange = (key, value) => {
    setLiveConfig(prev => ({ ...prev, [key]: value }));
  };

  // Toggle for mobile scrolling PNG marquee
  const [showMarquee, setShowMarquee] = useState(true);

  // Track small-screen state and whether user has scrolled (to hide Asset1)
  // Initialize with actual media query values to avoid stale state
  const [isPhone, setIsPhone] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 640px)').matches;
  });
  const [isTablet, setIsTablet] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(min-width: 641px) and (max-width: 1024px)').matches;
  });
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 1024px)').matches;
  });
  const [assetHidden, setAssetHidden] = useState(false);

  useEffect(() => {
    const phoneMql = window.matchMedia('(max-width: 640px)');
    const tabletMql = window.matchMedia('(min-width: 641px) and (max-width: 1024px)');
    const mobileOrTabletMql = window.matchMedia('(max-width: 1024px)');
    
    const onPhoneChange = (e) => setIsPhone(e.matches);
    const onTabletChange = (e) => setIsTablet(e.matches);
    const onMobileOrTabletChange = (e) => setIsMobileOrTablet(e.matches);
    
    setIsPhone(phoneMql.matches);
    setIsTablet(tabletMql.matches);
    setIsMobileOrTablet(mobileOrTabletMql.matches);
    
    if (phoneMql.addEventListener) {
      phoneMql.addEventListener('change', onPhoneChange);
      tabletMql.addEventListener('change', onTabletChange);
      mobileOrTabletMql.addEventListener('change', onMobileOrTabletChange);
    } else {
      phoneMql.addListener(onPhoneChange);
      tabletMql.addListener(onTabletChange);
      mobileOrTabletMql.addListener(onMobileOrTabletChange);
    }
    return () => {
      if (phoneMql.removeEventListener) {
        phoneMql.removeEventListener('change', onPhoneChange);
        tabletMql.removeEventListener('change', onTabletChange);
        mobileOrTabletMql.removeEventListener('change', onMobileOrTabletChange);
      } else {
        phoneMql.removeListener(onPhoneChange);
        tabletMql.removeListener(onTabletChange);
        mobileOrTabletMql.removeListener(onMobileOrTabletChange);
      }
    };
  }, []);

  // Hide Asset1 when user scrolls on mobile (match Home's threshold)
  useEffect(() => {
    let rafId = null;
    let last = 0;
    const throttleMs = isPhone ? 1000 / 30 : 0;
    const handler = () => {
      const now = Date.now();
      const doUpdate = () => {
        // Hide on scroll for all devices (including desktop)
        setAssetHidden(window.scrollY > 20);
      };
      if (now - last >= throttleMs) {
        last = now;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(doUpdate);
      }
    };
    window.addEventListener('scroll', handler, { passive: true });
    // initialize
    setAssetHidden(window.scrollY > 20);
    
    return () => {
      window.removeEventListener('scroll', handler);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isPhone]);

  // Nav pill hide at page bottom, reveal when user scrolls up
  const [navHidden, setNavHidden] = useState(false);
  const lastScrollY = useRef(typeof window !== 'undefined' ? window.scrollY : 0);
  useEffect(() => {
    let raf = null;
    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const atBottom = window.innerHeight + y >= document.documentElement.scrollHeight - 20;
        if (atBottom) {
          setNavHidden(true);
        } else if (y < lastScrollY.current) {
          // scrolling up -> show
          setNavHidden(false);
        }
        lastScrollY.current = y;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

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
    // Apply visual theme changes based on theme (INSTANT)
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
      <GlobalBackground />
      <AnalyticsTracker />
      <div
        id="app-content"
          className={`min-h-screen relative flex flex-col overflow-x-hidden ${
            theme === "dark"
              ? "text-white theme-dark"
              : "text-black theme-light"
          }`}
          style={{ backgroundColor: 'transparent' }}
      >
      <NavigationLoader theme={theme} onInitialLoad={() => {
        // Remove the initial HTML loader when React's NavigationLoader takes over
        const initialLoader = document.getElementById('initial-loader');
        if (initialLoader) initialLoader.remove();
      }} />

      {/* NAV BAR (CENTERED LINKS) */}
      {/* Desktop: sticky bar at top, full width */}
      <header
        className={`
          hidden sm:flex
          z-50 justify-center items-center app-header
          sticky top-0 p-4 border-b w-full
          ${
            theme === "dark"
              ? "border-neutral-800 bg-black/90 backdrop-blur-sm"
              : "border-neutral-300 bg-white/90 backdrop-blur-sm"
          }
        `}
      >
        {/* Top-left clickable logo */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <Link to="/" aria-label="Home">
            <img
              src="/LOGOS/newlogo.svg"
              alt="Home"
              className="nav-logo h-8"
            />
          </Link>
        </div>
        
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="theme-toggle-btn absolute top-1/2 p-2 rounded-full outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0 active:ring-0"
          style={{ right: `${iconOffset}px`, transform: 'translateY(-50%) scale(1.12)', WebkitTapHighlightColor: 'transparent' }}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        
        {/* Nav links */}
        <nav className="flex items-center gap-6 text-sm px-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
            style={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800, fontFamily: '"PT Mono", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
          >
            Home
          </NavLink>
          <NavLink
            to="/work"
            onClick={(e) => isNavLocked && e.preventDefault()}
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""} ${isNavLocked ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`
            }
            style={{ pointerEvents: isNavLocked ? 'none' : 'auto', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800, fontFamily: '"PT Mono", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
          >
            Work
          </NavLink>
          <NavLink
            to="/about"
            onClick={(e) => isNavLocked && e.preventDefault()}
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""} ${isNavLocked ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`
            }
            style={{ pointerEvents: isNavLocked ? 'none' : 'auto', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800, fontFamily: '"PT Mono", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            onClick={(e) => isNavLocked && e.preventDefault()}
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""} ${isNavLocked ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`
            }
            style={{ pointerEvents: isNavLocked ? 'none' : 'auto', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800, fontFamily: '"PT Mono", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
          >
            Contact
          </NavLink>
        </nav>
      </header>

      {/* Mobile: floating pill at bottom */}
      <header
          style={{ paddingLeft: `${pillPadding}px`, bottom: `${liveConfig.navY ?? 48}px` }}
        className={`
          sm:hidden
          z-50 flex justify-center items-center app-header
          fixed left-1/2 -translate-x-1/2 w-auto py-2 px-8 rounded-full border
          transition-transform transition-opacity duration-300 ease-in-out
          ${navHidden ? 'translate-y-6 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}
          ${
            theme === "dark"
              ? "border-neutral-800 bg-black/80 backdrop-blur-sm"
              : "border-neutral-300 bg-white/80 backdrop-blur-sm"
          }
        `}
      >
        {/* Theme toggle on mobile */}
        <button
          onClick={toggleTheme}
          className="theme-toggle-btn absolute top-1/2 p-1.5 rounded-full outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0 active:ring-0"
          style={{ right: `${iconOffset}px`, transform: 'translateY(-50%) scale(1.12)', WebkitTapHighlightColor: 'transparent' }}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        
        {/* Nav links for mobile */}
        <nav className="flex items-center gap-4 text-xs px-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
            style={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800, fontFamily: '"PT Mono", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
          >
            Home
          </NavLink>
          <NavLink
            to="/work"
            onClick={(e) => isNavLocked && e.preventDefault()}
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""} ${isNavLocked ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`
            }
            style={{ pointerEvents: isNavLocked ? 'none' : 'auto', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800, fontFamily: '"PT Mono", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
          >
            Work
          </NavLink>
          <NavLink
            to="/about"
            onClick={(e) => isNavLocked && e.preventDefault()}
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""} ${isNavLocked ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`
            }
            style={{ pointerEvents: isNavLocked ? 'none' : 'auto', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800, fontFamily: '"PT Mono", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            onClick={(e) => isNavLocked && e.preventDefault()}
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""} ${isNavLocked ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`
            }
            style={{ pointerEvents: isNavLocked ? 'none' : 'auto', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800, fontFamily: '"PT Mono", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
          >
            Contact
          </NavLink>
        </nav>
      </header>

      {/* Now Playing Widget - Inside hero logo area, before Asset1 */}
      {location.pathname === '/' && (
        <div
          style={{
            position: 'absolute',
            top: Math.max(80, liveConfig.widgetY || 80) + 'px',
            left: 0,
            right: 0,
            margin: '0 auto',
            width: '100%',
            opacity: assetHidden ? 0 : 1,
            transition: 'opacity 300ms ease, transform 500ms ease-in-out, top 500ms ease-in-out',
            willChange: 'opacity, transform, top',
            transform: `scale(${liveConfig.widgetScale})`,
            transformOrigin: 'center',
            zIndex: 50,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Suspense fallback={null}>
            <SpotifyNowPlaying theme={theme} />
          </Suspense>
        </div>
      )}

      {/* Asset1.svg decorative element - positioned between navbar and footer */}
      <div className="relative flex-1 overflow-hidden flex flex-col" style={{ minHeight: '100vh' }}>
        {(location.pathname === '/' || location.pathname === '/about' || location.pathname === '/contact' || ((location.pathname === '/work' || location.pathname.startsWith('/work/')) && viewMode === 'mobile')) && (
          <Asset1Svg
            theme={theme}
            outlineThickness={liveConfig.assetOutlineThickness ?? 0.8}
            className={`pointer-events-none absolute ${location.pathname === '/' ? 'z-20' : 'z-0'}`}
            style={{
              left: '50%',
              top: viewMode === 'desktop' ? '50%' : '48px',
              transform: viewMode === 'desktop' 
                ? `translate(-50%, -50%) translate(${liveConfig.assetX ?? 0}px, ${liveConfig.assetY ?? 0}px) scale(${liveConfig.assetScale ?? 1}) scaleX(${liveConfig.assetH ?? 1}) scaleY(${liveConfig.assetV ?? 1}) rotate(${liveConfig.assetRotation ?? 0}deg)`
                : `scale(${liveConfig.assetScale ?? 1}) translateX(calc(-50% + ${liveConfig.assetX ?? 0}px)) translateY(${liveConfig.assetY ?? 0}px) scaleX(${liveConfig.assetH ?? 1}) scaleY(${liveConfig.assetV ?? 1}) rotate(${liveConfig.assetRotation ?? 0}deg)`,
              transformOrigin: viewMode === 'desktop' ? 'center' : 'left top',
              width: '140%',
              maxWidth: 'none',
              height: 'auto',
              opacity: (location.pathname === '/' && assetHidden) ? 0 : 1,
              transition: 'opacity 300ms ease, transform 500ms ease-in-out',
              willChange: 'opacity, transform',
            }}
          />
        )}

        {/* Home-only Asset1 controls (desktop + iPad) - localhost only */}
        {location.pathname === '/' && (viewMode === 'desktop' || isTablet) && (
          <div style={{position: 'fixed', right: 18, bottom: 120, zIndex: 1200, background: theme === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)', color: theme === 'dark' ? 'white' : 'black', padding: '10px', borderRadius: '8px', fontFamily: 'sans-serif', width: '300px', display: isLocalhost ? 'block' : 'none'}}>
            <div style={{fontWeight: '700', marginBottom: 6, fontSize: 12}}>Asset Controls (Home)</div>
            {/* Browser window size detection */}
            <div style={{fontSize:11, marginBottom:8}}>
              <div>Viewport: {screenDimensions}</div>
              <div style={{opacity:0.8, fontSize:10}}> DPR: {liveConfig.forcedDPR ?? (typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1)}</div>
            </div>
            <div className="flex items-center gap-2" style={{marginBottom:6}}>
              <label style={{width:80,fontSize:12}}>Scale</label>
              <input type="range" min="0.1" max="3" step="0.01" value={liveConfig.assetScale ?? 1} onChange={(e) => handleConfigChange('assetScale', parseFloat(e.target.value))} />
              <input type="number" step="0.01" value={liveConfig.assetScale ?? 1} onChange={(e) => handleConfigChange('assetScale', parseFloat(e.target.value))} style={{width:'60px'}} />
            </div>
            <div className="flex items-center gap-2" style={{marginBottom:6}}>
              <label style={{width:80,fontSize:12}}>X pos</label>
              <input type="range" min="-8000" max="8000" step="1" value={liveConfig.assetX ?? 0} onChange={(e) => handleConfigChange('assetX', parseInt(e.target.value))} />
              <input type="number" step="1" value={liveConfig.assetX ?? 0} onChange={(e) => handleConfigChange('assetX', parseInt(e.target.value))} style={{width:'60px'}} />
            </div>
            <div className="flex items-center gap-2" style={{marginBottom:6}}>
              <label style={{width:80,fontSize:12}}>Y pos</label>
              <input type="range" min="-8000" max="8000" step="1" value={liveConfig.assetY ?? 0} onChange={(e) => handleConfigChange('assetY', parseInt(e.target.value))} />
              <input type="number" step="1" value={liveConfig.assetY ?? 0} onChange={(e) => handleConfigChange('assetY', parseInt(e.target.value))} style={{width:'80px'}} />
            </div>
            <div className="flex items-center gap-2" style={{marginBottom:6}}>
              <label style={{width:80,fontSize:12}}>Thickness</label>
              <input type="range" min="0" max="20" step="0.1" value={liveConfig.assetOutlineThickness ?? 0.8} onChange={(e) => handleConfigChange('assetOutlineThickness', parseFloat(e.target.value))} />
              <input type="number" step="0.1" value={liveConfig.assetOutlineThickness ?? 0.8} onChange={(e) => handleConfigChange('assetOutlineThickness', parseFloat(e.target.value))} style={{width:'60px'}} />
            </div>
            <div className="flex items-center gap-2" style={{marginBottom:6}}>
              <label style={{width:80,fontSize:12}}>X stretch</label>
              <input type="range" min="-10" max="30" step="0.01" value={liveConfig.assetH ?? 1} onChange={(e) => handleConfigChange('assetH', parseFloat(e.target.value))} />
              <input type="number" step="0.01" value={liveConfig.assetH ?? 1} onChange={(e) => handleConfigChange('assetH', parseFloat(e.target.value))} style={{width:'60px'}} />
            </div>
            <div className="flex items-center gap-2">
              <label style={{width:80,fontSize:12}}>Y stretch</label>
              <input type="range" min="-10" max="30" step="0.01" value={liveConfig.assetV ?? 1} onChange={(e) => handleConfigChange('assetV', parseFloat(e.target.value))} />
              <input type="number" step="0.01" value={liveConfig.assetV ?? 1} onChange={(e) => handleConfigChange('assetV', parseFloat(e.target.value))} style={{width:'60px'}} />
            </div>
            <div className="flex items-center gap-2" style={{marginTop:6}}>
              <label style={{width:80,fontSize:12}}>Rotation</label>
              <button onClick={() => handleConfigChange('assetRotation', ((liveConfig.assetRotation ?? 0) - 45) % 360)} style={{padding:'4px 8px', fontSize:11, cursor:'pointer'}}>↻ CCW</button>
              <button onClick={() => handleConfigChange('assetRotation', ((liveConfig.assetRotation ?? 0) + 45) % 360)} style={{padding:'4px 8px', fontSize:11, cursor:'pointer'}}>CW ↻</button>
              <span style={{fontSize:11, width:'40px', textAlign:'center'}}>{liveConfig.assetRotation ?? 0}°</span>
            </div>

            {/* Animated logo scale quick control */}
            <div className="flex items-center gap-2" style={{marginTop:8}}>
              <label style={{width:80,fontSize:12}}>Logo Scale</label>
              <input type="range" min="0.2" max="2" step="0.01" value={liveConfig.heroScale ?? 1} onChange={(e) => handleConfigChange('heroScale', parseFloat(e.target.value))} />
              <input type="number" step="0.01" value={liveConfig.heroScale ?? 1} onChange={(e) => handleConfigChange('heroScale', parseFloat(e.target.value))} style={{width:'60px'}} />
            </div>

            {/* Logo Y position control */}
            <div className="flex items-center gap-2" style={{marginTop:6}}>
              <label style={{width:80,fontSize:12}}>Logo Y</label>
              <input type="range" min="-500" max="500" step="1" value={liveConfig.heroY ?? 0} onChange={(e) => handleConfigChange('heroY', parseInt(e.target.value))} />
              <input type="number" step="1" value={liveConfig.heroY ?? 0} onChange={(e) => handleConfigChange('heroY', parseInt(e.target.value))} style={{width:'60px'}} />
            </div>

            {/* Now Playing Y position - quick control in small panel */}
            <div className="flex items-center gap-2" style={{marginTop:8}}>
              <label style={{width:80,fontSize:12}}>Widget Y</label>
              <input type="range" min="-200" max="200" step="1" value={liveConfig.widgetY ?? 0} onChange={(e) => handleConfigChange('widgetY', parseInt(e.target.value))} />
              <input type="number" step="1" value={liveConfig.widgetY ?? 0} onChange={(e) => handleConfigChange('widgetY', parseInt(e.target.value))} style={{width:'60px'}} />
            </div>

            {/* Marquee Y quick control */}
            <div className="flex items-center gap-2" style={{marginTop:6}}>
              <label style={{width:80,fontSize:12}}>Marquee Y</label>
              <input type="range" min="0" max="300" step="1" value={liveConfig.marqueeY ?? 96} onChange={(e) => handleConfigChange('marqueeY', parseInt(e.target.value))} />
              <input type="number" step="1" value={liveConfig.marqueeY ?? 96} onChange={(e) => handleConfigChange('marqueeY', parseInt(e.target.value))} style={{width:'60px'}} />
            </div>

            {/* Marquee Item Size (scales items without changing gap) */}
            <div className="flex items-center gap-2" style={{marginTop:6}}>
              <label style={{width:80,fontSize:12}}>Marquee Item Size</label>
              <input type="range" min="0.1" max="3" step="0.01" value={liveConfig.marqueeItemScale ?? liveConfig.marqueeScale ?? 1} onChange={(e) => handleConfigChange('marqueeItemScale', parseFloat(e.target.value))} />
              <input type="number" step="0.01" value={liveConfig.marqueeItemScale ?? liveConfig.marqueeScale ?? 1} onChange={(e) => handleConfigChange('marqueeItemScale', parseFloat(e.target.value))} style={{width:'60px'}} />
            </div>
          </div>
        )}
      {false && viewMode === 'desktop' && (
      <div 
        className=""
        style={{
          position: 'fixed',
          bottom: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '10px',
          borderRadius: '8px',
          zIndex: 1000,
          fontFamily: 'monospace',
          fontSize: '12px'
        }}>
          <div style={{fontWeight: 'bold'}}>Screen: {screenDimensions}</div>
          <div className="flex items-center gap-2 mb-2">
            <button 
              onClick={() => setShowMarquee(!showMarquee)}
              style={{
                background: showMarquee ? '#4ADE80' : '#F87171',
                color: 'black',
                border: 'none',
                borderRadius: '4px',
                padding: '2px 8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Marquee: {showMarquee ? 'ON' : 'OFF'}
            </button>
          </div>
          <div style={{fontWeight: 'bold'}}>Animated Logo</div>
          <div className="flex items-center gap-2">
            <label>Scale: </label>
            <input type="range" min="0.5" max="2" step="0.01" value={liveConfig.heroScale} onChange={(e) => handleConfigChange('heroScale', parseFloat(e.target.value))} />
            <input type="number" step="0.01" value={liveConfig.heroScale} onChange={(e) => handleConfigChange('heroScale', parseFloat(e.target.value))} style={{width:'60px', color:'black'}} />
          </div>
          <div className="flex items-center gap-2">
            <label>Thickness: </label>
            <input type="range" min="0.5" max="5" step="0.1" value={liveConfig.animatedOutlineWidth} onChange={(e) => handleConfigChange('animatedOutlineWidth', parseFloat(e.target.value))} />
            <input type="number" step="0.1" value={liveConfig.animatedOutlineWidth} onChange={(e) => handleConfigChange('animatedOutlineWidth', parseFloat(e.target.value))} style={{width:'60px', color:'black'}} />
          </div>
          <div className="flex items-center gap-2">
            <label>Y pos: </label>
            <input type="range" min="-200" max="300" step="1" value={liveConfig.heroY} onChange={(e) => handleConfigChange('heroY', parseInt(e.target.value))} />
            <input type="number" step="1" value={liveConfig.heroY} onChange={(e) => handleConfigChange('heroY', parseInt(e.target.value))} style={{width:'60px', color:'black'}} />
          </div>

          <div style={{fontWeight: 'bold', marginTop: '10px'}}>Asset 1</div>
          <div className="flex items-center gap-2">
            <label>X pos: </label>
            <input type="range" min="-5000" max="5000" step="1" value={liveConfig.assetX} onChange={(e) => handleConfigChange('assetX', parseInt(e.target.value))} />
            <input type="number" step="1" value={liveConfig.assetX} onChange={(e) => handleConfigChange('assetX', parseInt(e.target.value))} style={{width:'60px', color:'black'}} />
          </div>
          <div className="flex items-center gap-2">
            <label>Y pos: </label>
            <input type="range" min="-8000" max="8000" step="1" value={liveConfig.assetY} onChange={(e) => handleConfigChange('assetY', parseInt(e.target.value))} />
            <input type="number" step="1" value={liveConfig.assetY} onChange={(e) => handleConfigChange('assetY', parseInt(e.target.value))} style={{width:'60px', color:'black'}} />
          </div>
          <div className="flex items-center gap-2">
            <label>Scale: </label>
            <input type="range" min="0.1" max="2" step="0.01" value={liveConfig.assetScale ?? 1} onChange={(e) => handleConfigChange('assetScale', parseFloat(e.target.value))} />
            <input type="number" step="0.01" value={liveConfig.assetScale ?? 1} onChange={(e) => handleConfigChange('assetScale', parseFloat(e.target.value))} style={{width:'60px', color:'black'}} />
          </div>
          <div className="flex items-center gap-2">
            <label>X stretch: </label>
            <input type="range" min="-5" max="20" step="0.1" value={liveConfig.assetH} onChange={(e) => handleConfigChange('assetH', parseFloat(e.target.value))} />
            <input type="number" step="0.1" value={liveConfig.assetH} onChange={(e) => handleConfigChange('assetH', parseFloat(e.target.value))} style={{width:'60px', color:'black'}} />
          </div>
          <div className="flex items-center gap-2">
            <label>Y stretch: </label>
            <input type="range" min="-5" max="20" step="0.1" value={liveConfig.assetV} onChange={(e) => handleConfigChange('assetV', parseFloat(e.target.value))} />
            <input type="number" step="0.1" value={liveConfig.assetV} onChange={(e) => handleConfigChange('assetV', parseFloat(e.target.value))} style={{width:'60px', color:'black'}} />
          </div>

          <div style={{fontWeight: 'bold', marginTop: '10px'}}>Asset 1</div>
          <div className="flex items-center gap-2">
            <label>Outline thickness: </label>
            <input type="range" min="0" max="20" step="0.1" value={liveConfig.assetOutlineThickness} onChange={(e) => handleConfigChange('assetOutlineThickness', parseFloat(e.target.value))} />
            <input type="number" step="0.1" value={liveConfig.assetOutlineThickness} onChange={(e) => handleConfigChange('assetOutlineThickness', parseFloat(e.target.value))} style={{width:'60px', color:'black'}} />
          </div>
          <div className="flex items-center gap-2">
            <label>Rotation: </label>
            <input type="range" min="-360" max="360" step="1" value={liveConfig.assetRotation ?? 0} onChange={(e) => handleConfigChange('assetRotation', parseInt(e.target.value))} />
            <input type="number" step="1" value={liveConfig.assetRotation ?? 0} onChange={(e) => handleConfigChange('assetRotation', parseInt(e.target.value))} style={{width:'60px', color:'black'}} />
          </div>

          <div style={{fontWeight: 'bold', marginTop: '10px'}}>Nav Bar</div>
           <div className="flex items-center gap-2">
            <label>Y pos: </label>
            <input type="range" min="0" max="300" step="1" value={liveConfig.navY} onChange={(e) => handleConfigChange('navY', parseInt(e.target.value))} />
            <input type="number" step="1" value={liveConfig.navY} onChange={(e) => handleConfigChange('navY', parseInt(e.target.value))} style={{width:'60px', color:'black'}} />
          </div>

          <div style={{fontWeight: 'bold', marginTop: '10px'}}>Now Playing Widget</div>
          <div className="flex items-center gap-2">
            <label>Scale: </label>
            <input type="range" min="0.2" max="2" step="0.01" value={liveConfig.widgetScale} onChange={(e) => handleConfigChange('widgetScale', parseFloat(e.target.value))} />
            <input type="number" step="0.01" value={liveConfig.widgetScale} onChange={(e) => handleConfigChange('widgetScale', parseFloat(e.target.value))} style={{width:'60px', color:'black'}} />
          </div>
          <div className="flex items-center gap-2">
            <label>Y pos: </label>
            <input type="range" min="-200" max="200" step="1" value={liveConfig.widgetY} onChange={(e) => handleConfigChange('widgetY', parseInt(e.target.value))} />
            <input type="number" step="1" value={liveConfig.widgetY} onChange={(e) => handleConfigChange('widgetY', parseInt(e.target.value))} style={{width:'60px', color:'black'}} />
          </div>

          <div style={{fontWeight: 'bold', marginTop: '10px'}}>Marquee (Scrolling PNGs)</div>
          <div className="flex items-center gap-2">
            <label>Y Margin: </label>
            <input type="range" min="0" max="300" step="1" value={liveConfig.marqueeY ?? 96} onChange={(e) => handleConfigChange('marqueeY', parseInt(e.target.value))} />
            <input type="number" step="1" value={liveConfig.marqueeY ?? 96} onChange={(e) => handleConfigChange('marqueeY', parseInt(e.target.value))} style={{width:'60px', color:'black'}} />
          </div>

          <div className="flex items-center gap-2">
            <label>Img Scale: </label>
            <input type="range" min="0.1" max="3" step="0.1" value={liveConfig.marqueeScale ?? 1} onChange={(e) => handleConfigChange('marqueeScale', parseFloat(e.target.value))} />
            <input type="number" step="0.1" value={liveConfig.marqueeScale ?? 1} onChange={(e) => handleConfigChange('marqueeScale', parseFloat(e.target.value))} style={{width:'60px', color:'black'}} />
          </div>

          <div className="flex items-center gap-2">
            <label>Speed (s): </label>
            <input type="range" min="1" max="120" step="1" value={liveConfig.marqueeSpeed ?? 60} onChange={(e) => handleConfigChange('marqueeSpeed', parseInt(e.target.value))} />
            <input type="number" step="1" value={liveConfig.marqueeSpeed ?? 60} onChange={(e) => handleConfigChange('marqueeSpeed', parseInt(e.target.value))} style={{width:'60px', color:'black'}} />
          </div>

          <pre style={{display: 'none'}}>{JSON.stringify(liveConfig, null, 2)}</pre>
        </div>
      )}
        
        {/* Main content - above Asset1 */}
        <main className={`relative z-10 flex-grow p-0 ${slideTransition ? 'page-transition' : ''} ${viewMode === 'mobile' ? 'mobile-view-wrapper' : 'desktop-view-wrapper'} ${location.pathname.startsWith('/work') ? 'pointer-events-none' : ''}`}>
          <Suspense
            fallback={<div className="min-h-screen" />}
          >
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home 
                theme={theme} 
                heroScale={liveConfig.heroScale ?? 1} 
                heroY={liveConfig.heroY ?? 0}  
                animatedOutlineWidth={liveConfig.animatedOutlineWidth ?? 3.8}
                showMarquee={showMarquee}
                marqueeY={liveConfig.marqueeY ?? 96}
                marqueeScale={liveConfig.marqueeScale ?? 1}
                marqueeItemScale={liveConfig.marqueeItemScale ?? liveConfig.marqueeScale ?? 1}
              />} />
              
              {/* PUBLIC ROUTES (Accessible by link) */}
              <Route path="/pricelist" element={<PriceList />} />

              {/* Site routes - make accessible on production too (previously gated to localhost) */}
              <>
                <Route path="/work" element={<Work />} />
                <Route path="/work/:section" element={<Work />} />
                {/* <Route path="/work/graphic" element={<WorkGraphic />} /> */}
                {/* <Route path="/work/merch" element={<WorkMerch />} /> */}
                <Route path="/about" element={<About />} />
                <Route path="/around" element={<Around />} />
                <Route path="/flyhigh" element={<FlyHigh />} />
                <Route path="/legacydrip" element={<LegacyDrip />} />
                <Route path="/terzo" element={<Terzo />} />
                <Route path="/williamru" element={<WilliamRu />} />
                <Route path="/contact" element={<Contact />} />

                {/* Keep Admin restricted to localhost/dev for safety */}
                {isLocalhost && <Route path="/admin" element={<Admin theme={theme} />} />}
              </>
              
              {/* Redirect any other route to Home */}
              <Route path="*" element={<Home 
                marqueeScale={liveConfig.marqueeScale ?? 1}
                marqueeItemScale={liveConfig.marqueeItemScale ?? liveConfig.marqueeScale ?? 1}
                theme={theme} 
                heroScale={liveConfig.heroScale ?? 1} 
                heroY={liveConfig.heroY ?? 0} 
                animatedOutlineWidth={liveConfig.animatedOutlineWidth ?? 3.8}
                showMarquee={showMarquee}
                marqueeY={liveConfig.marqueeY ?? 96}
                marqueeSpeed={liveConfig.marqueeSpeed ?? 60}
              />} />  
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

      {/* Hide global footer on ALL Work pages (managed locally there) */}
      {!location.pathname.startsWith('/work') && (
        <Suspense fallback={<div className="py-8 text-center text-xs tracking-[0.3em] uppercase opacity-40">Loading footer…</div>}>
          <div className="w-full z-50 bg-inherit">
            <Footer />
          </div>
        </Suspense>
      )}
    </div>
    </>
  );
}

export default App;
