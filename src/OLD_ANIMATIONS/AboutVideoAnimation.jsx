import React from 'react';

// This animation was originally on the About page below the photo.
// It relies on CSS classes found in src/index.css (.efecto-wrapper, .efecto-bg, etc.)
// and the video file /animation.webm in the public folder.

const AboutVideoAnimation = () => {
    return (
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
    );
};

export default AboutVideoAnimation;
