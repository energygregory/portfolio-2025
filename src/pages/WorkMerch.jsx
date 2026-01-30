import React from "react";
import BlurCarousel from "../components/BlurCarousel";
import WorkNav from "../components/WorkNavigation";
import Footer from "../components/Footer";

export default function WorkMerch() {
  return (
    // iOS fix: use 100dvh (dynamic viewport height) to account for address bars
    <main className="relative w-full h-[100dvh] overflow-hidden bg-transparent font-['PT_Mono']">
      
      <WorkNav />

      {/* Carousel Container - Full Screen, behind navs */}
      {/* z-0 ensures it is behind the fixed Nav and Footer */}
      <section className="absolute inset-0 z-0 flex items-start justify-start">
          <BlurCarousel />
      </section>

      {/* Local Footer - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 w-full z-[60]">
        <Footer />
      </div>
    </main>
  );
}
