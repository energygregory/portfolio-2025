import React, { useState, useEffect } from "react";

const rateData = {
  "merch-design": [],
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
  const [activeCategory, setActiveCategory] = useState("graphic-design");
  const [currencyKey, setCurrencyKey] = useState("GHS");
  const [detectedCurrencyKey, setDetectedCurrencyKey] = useState("GHS");

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
        <h1 className="text-3xl font-semibold mb-4">0021.STUDIO</h1>
        <p className="text-lg italic text-neutral-400 mb-12">Rate Card</p>

        {/* Mini nav for service categories */}
        <nav className="flex gap-4 mb-10 border-b border-neutral-700 pb-4">
          <button
            onClick={() => setActiveCategory("merch-design")}
            className={`font-mono uppercase text-sm tracking-widest pb-2 transition-colors ${
              activeCategory === "merch-design"
                ? "text-white border-b-2 border-white"
                : "text-neutral-400 hover:text-neutral-300"
            }`}
          >
            Merch Design
          </button>
          <button
            onClick={() => setActiveCategory("graphic-design")}
            className={`font-mono uppercase text-sm tracking-widest pb-2 transition-colors ${
              activeCategory === "graphic-design"
                ? "text-white border-b-2 border-white"
                : "text-neutral-400 hover:text-neutral-300"
            }`}
          >
            Graphic Design
          </button>
        </nav>

        {/* Currency selector */}
        <div className="mb-10 flex items-center gap-4">
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

        {/* Social links footer (optional) */}
        <div className="mt-16 pt-8 border-t border-neutral-800 flex gap-6 text-xs text-neutral-500">
          <a href="https://instagram.com/0021.studio" target="_blank" rel="noopener noreferrer" className="hover:text-white">
            © 0021.STUDIO
          </a>
        </div>
      </div>
    </main>
  );
}
