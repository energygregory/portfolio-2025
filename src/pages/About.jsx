import React from "react";

export default function About() {
  return (
    <main className="min-h-screen px-6 py-16">
      <h1 className="text-3xl font-semibold">About page</h1>
      <p className="mt-4 text-neutral-400">Replace this with your real about content.</p>

      <div className="mt-12 w-full flex items-center justify-center">
        <div className="bg-black w-full max-w-4xl" style={{ borderRadius: 8, overflow: 'hidden' }}>
          <video
            src="/animation.webm"
            autoPlay
            loop
            muted
            playsInline
            className="about-efecto-video w-full h-auto block"
          />
        </div>
      </div>
    </main>
  );
}
