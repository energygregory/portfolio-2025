import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const rateData = {
  "merch-design": [
    { service: "TRUCKER HAT", price: 700, note: "PER DESIGN" },
    { service: "SNAPBACK HAT", price: 750, note: "PER DESIGN" },
    { service: "CROP TOPS", price: 900, note: "PER DESIGN" },
    { service: "T SHIRTS / HOODIES", price: 1200, note: "PER DESIGN" },
    { service: "BUTTONED SHIRTS", price: 1350, note: "PER DESIGN" },
    { service: "JERSEYS / JACKETS", price: 1500, note: "PER DESIGN" },
    { service: "TRACKSUIT SET", price: 2000, note: "PER DESIGN" },
    { service: "TECH PACK DESIGN", price: 700, note: "PER DESIGN" },
  ],
  "graphic-design": [
    { service: "FLYERS / POSTERS", price: 550, note: "PER DESIGN" },
    { service: "LOGO DESIGN", price: 700, note: "PER DESIGN" },
    { service: "BRAND IDENTITY", price: 2000, note: "STARTING PRICE" },
    { service: "PACKAGING / MENU DESIGN", price: 300, note: "STARTING PRICE" },
    { service: "ALBUM COVER ART", price: 600, note: "PER DESIGN" },
    { service: "MOTION GRAPHICS / VIDEO EDITING", price: 800, note: "STARTING PRICE" },
    { service: "INTERACTIVE LENS", price: 700, note: "STARTING PRICE", subtext: "FOR SNAPCHAT, INSTAGRAM ETC" },
  ],
};

const exchangeRates = {
  "GHS": { code: "GHS", rate: 1, symbol: "₵", flag: "🇬🇭" },
  "USD": { code: "USD", rate: 1 / 15.5, symbol: "$", flag: "🇺🇸" },
  "GBP": { code: "GBP", rate: 0.79 / 15.5, symbol: "£", flag: "🇬🇧" },
  "EUR": { code: "EUR", rate: 0.92 / 15.5, symbol: "€", flag: "🇪🇺" },
};

export default function PriceList() {
  const [activeCategory, setActiveCategory] = useState("merch-design");
  const [currencyKey, setCurrencyKey] = useState("GHS");
  const [detectedCurrencyKey, setDetectedCurrencyKey] = useState("GHS");
  const [searchParams] = useSearchParams();
  const [showPolicyModal, setShowPolicyModal] = useState(searchParams.has('policy'));
  const [isDark, setIsDark] = useState(true);

  // Detect theme
  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.classList.contains("theme-light")
        ? "light"
        : "dark";
      setIsDark(theme === "dark");
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Detect visitor's currency on mount
  useEffect(() => {
    const detectCurrency = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        const country = data.country_code || "";
        
        // Map country codes to currency keys
        let detected = "GHS";
        if (country === "GB") detected = "GBP";
        else if (country === "DE" || country === "FR" || country === "IT" || country === "ES") detected = "EUR";
        else if (country === "US" || country === "CA") detected = "USD";
        else if (country === "GH") detected = "GHS";
        
        setDetectedCurrencyKey(detected);
        setCurrencyKey(detected);
      } catch (error) {
        console.log("Currency detection failed, defaulting to GHS");
        setDetectedCurrencyKey("GHS");
        setCurrencyKey("GHS");
      }
    };
    detectCurrency();
  }, []);

  const convertPrice = (priceGHS) => {
    const currencyData = exchangeRates[currencyKey];
    const rate = currencyData ? currencyData.rate : 1;
    return Math.round(priceGHS * rate);
  };

  const getCurrencySymbol = () => {
    const currencyData = exchangeRates[currencyKey];
    return currencyData ? currencyData.symbol : "$";
  };

  const rates = rateData[activeCategory] || [];

  return (
    <main className="min-h-screen px-6 py-16">
      <div className="max-w-4xl">
        <h1 className="text-3xl font-mono mb-12">how much do i charge for my services?</h1>

        {/* Mini nav for service categories */}
        <nav className="flex gap-6 mb-6 border-b border-neutral-700 pb-3">
          <button
            onClick={() => setActiveCategory("merch-design")}
            className={`mini-nav-btn font-mono uppercase text-sm tracking-widest pb-2 transition-colors ${
              activeCategory === "merch-design"
                ? "mini-nav-active"
                : ""
            }`}
          >
            Merch Design
          </button>
          <button
            onClick={() => setActiveCategory("graphic-design")}
            className={`mini-nav-btn font-mono uppercase text-sm tracking-widest pb-2 transition-colors ${
              activeCategory === "graphic-design"
                ? "mini-nav-active"
                : ""
            }`}
          >
            Graphic Design
          </button>
        </nav>

        {/* Currency selector */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-3">
            <label htmlFor="currency-select" className="font-mono text-sm text-neutral-400">
              Currency:
            </label>
            <select
              id="currency-select"
              value={currencyKey}
              onChange={(e) => setCurrencyKey(e.target.value)}
              className="font-mono px-3 py-2 bg-neutral-900 border border-neutral-700 text-white rounded hover:border-neutral-500 focus:outline-none focus:border-neutral-400"
            >
              <option value={detectedCurrencyKey}>
                {detectedCurrencyKey} {exchangeRates[detectedCurrencyKey]?.flag}
              </option>
              <option value="USD">USD 🇺🇸</option>
              <option value="GBP">GBP 🇬🇧</option>
              <option value="EUR">EUR 🇪🇺</option>
            </select>
          </div>
          <p className="font-mono text-sm text-neutral-400">
            Read my <button onClick={() => setShowPolicyModal(true)} className="underline hover:text-white transition-colors">policy</button> here
          </p>
        </div>

        {/* Rate cards in monospace */}
        <div className="space-y-6 font-mono">
          {rates.map((item, idx) => (
            <div key={idx} className="border border-neutral-700 p-6 hover:border-neutral-500 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-bold tracking-wider uppercase">{item.service}</h3>
                <div className="text-right">
                  <div className="text-lg font-bold">
                    {getCurrencySymbol()} {convertPrice(item.price).toLocaleString()}
                  </div>
                  <div className="text-xs text-neutral-400 mt-1">{item.note}</div>
                </div>
              </div>
              {item.subtext && (
                <div className="text-xs text-neutral-500 mt-2">{item.subtext}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Policy Modal */}
      {showPolicyModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setShowPolicyModal(false)}
        >
          <div
            className={`relative max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto rounded-lg p-8 ${
              isDark ? "bg-[#1a1a1a] text-white" : "bg-white text-black"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPolicyModal(false)}
              className="absolute top-4 right-4 text-2xl font-bold hover:opacity-70"
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4 font-mono">POLICY/WORKING TERMS</h2>
            <div className="space-y-4 text-sm leading-relaxed font-mono">
              <p>
                1. PAYMENT TERMS: A 50% deposit is required before work commences.
                This deposit is non-refundable once design work has begun. The
                remaining balance is due upon project completion before final file
                delivery.
              </p>
              <p>
                2. REVISIONS: 4 rounds of revisions are included in the quoted
                price. Additional revisions will incur an extra charge.
              </p>
              <p>
                3. TIMELINE: Project timelines are estimates. Delays in client
                feedback may affect delivery dates.
              </p>
              <p>
                4. OWNERSHIP: Final designs become client property upon full
                payment. I retain the right to display the work in my portfolio.
              </p>
              <p>
                5. All charges quoted "per design" strictly means per 1 single design concept, limited to 5 colourways.
              </p>
              <div className="mt-8 pt-4 border-t border-neutral-700 font-bold uppercase italic">
                PAYING THE INITIAL DEPOSIT MEANS YOU AGREE TO THESE TERMS.
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
