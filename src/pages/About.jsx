import React from "react";

export default function About() {
  return (
    <main className="min-h-screen px-6 py-16 font-mono">
      <div className="max-w-7xl mx-auto">
        {/* About Me Section */}
        <div className="mb-16">
          <h1 className="text-5xl font-bold mb-12 tracking-wider">
            who is greg?
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Text Content */}
            <div className="space-y-6 text-lg leading-relaxed font-normal">
              <p>
                My name is <strong>Gregory</strong>, a Ghanaian self-taught
                designer with 3 years of hands-on experience in merch design. I
                started designing out of curiosity and built my craft through
                constant experimentation, client and personal projects. Over the
                years, I've learnt how to take an idea from rough sketches and
                turn them into beautiful pieces. Every project I take on is
                built with intention, clarity, and respect for the brand's
                story. My focus is always on creating work that not only looks
                good on screen, but feels authentic when produced and worn.
              </p>

              <p>
                I draw a lot of inspiration from Virgil Abloh, Prince Gyesi, and
                Kwame Adusei. Their work reminds me that design can be more than
                visuals as it can shape culture, tell stories, and redefine how
                people see fashion and identity.
              </p>
            </div>

            {/* Photo */}
            <div className="flex justify-center lg:justify-end">
              <img
                src="/about-photo.jpg"
                alt="Gregory"
                className="w-full max-w-md rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 w-full flex items-center justify-center">
        <div
          className="efecto-wrapper w-full max-w-4xl relative"
          style={{ borderRadius: 8, overflow: "hidden" }}
        >
          <div className="efecto-bg" />
          <video
            src="/animation.webm"
            autoPlay
            loop
            muted
            playsInline
            className="about-efecto-video w-full h-auto block"
          />
          <div className="video-darken-overlay" aria-hidden="true" />
        </div>
      </div>
    </main>
  );
}
