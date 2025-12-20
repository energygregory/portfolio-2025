import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function NavigationLoader({ theme = "dark" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const targetRef = useRef(null);
  const navigatingRef = useRef(false);

  useEffect(() => {
    function findAnchor(el) {
      while (el && el !== document.body) {
        if (el.tagName && el.tagName.toLowerCase() === "a") return el;
        el = el.parentElement;
      }
      return null;
    }

    async function onClick(e) {
      if (navigatingRef.current) return;
      // only left click without modifier keys
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const a = findAnchor(e.target);
      if (!a) return;
      const href = a.getAttribute("href");
      const target = a.getAttribute("target");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || target === "_blank") return;

      // allow external links (absolute with different origin)
      try {
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) return;
        // same-path navigation: ignore
        if (url.pathname === window.location.pathname) return;

        e.preventDefault();
        navigatingRef.current = true;
        targetRef.current = url.pathname + url.search + url.hash;
        setVisible(true);

        // create a larger video element duplicate for the loader
        const vid = document.createElement("video");
        vid.src = "/animation.webm";
        vid.muted = true;
        vid.playsInline = true;
        vid.preload = "auto";
        vid.autoplay = true;
        // make it noticeably bigger
        vid.style.width = "44vmin";
        vid.style.maxWidth = "420px";
        vid.style.height = "auto";
        vid.style.display = "block";
        vid.style.objectFit = "contain";
        vid.style.borderRadius = "8px";
        // apply theme-aware filter: in light mode the video should be inverted and boosted
        if (theme === "light") {
          vid.style.filter = "invert(1) contrast(1.6) brightness(0.6) saturate(0.95)";
        } else {
          vid.style.filter = "none";
        }
        vid.className = "nav-loader-video-el";
        // speed up playback by 3x; set after metadata to avoid DOMException in some browsers
        vid.addEventListener("loadedmetadata", () => {
          try {
            // reduce speed by 30% from previous 3x => 2.1x
            vid.playbackRate = 2.1;
          } catch (e) {}
        });

        const container = document.getElementById("nav-loader-video-container");
        if (container) {
          // clear previous children
          container.innerHTML = "";
          // wrapper to hold video + overlay
          const wrap = document.createElement('div');
          wrap.style.position = 'relative';
          wrap.style.display = 'inline-block';
          wrap.style.borderRadius = '8px';
          wrap.style.overflow = 'hidden';

          // darkening overlay (for light-mode inverted video)
          const odiv = document.createElement('div');
          odiv.className = 'nav-loader-darken-overlay';
          odiv.style.position = 'absolute';
          odiv.style.inset = '0';
          odiv.style.pointerEvents = 'none';
          odiv.style.transition = 'opacity 200ms ease';
          if (theme === 'light') {
            odiv.style.opacity = '1';
            odiv.style.background = 'rgba(0,0,0,0.45)';
            odiv.style.mixBlendMode = 'multiply';
          } else {
            odiv.style.opacity = '0';
          }

          wrap.appendChild(vid);
          wrap.appendChild(odiv);
          container.appendChild(wrap);
        }

        try {
          await vid.play();
        } catch (err) {
          // ignore play errors
        }

        // navigate after a short delay while the overlay remains opaque,
        // then perform the fade-out after the new route mounts.
        const NAV_DELAY_MS = 700;
        setTimeout(() => {
          if (targetRef.current) navigate(targetRef.current);
        }, NAV_DELAY_MS);
      } catch (err) {
        return;
      }
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [navigate, theme]);

  // After location changes, fade the overlay out and then remove it.
  useEffect(() => {
    if (!navigatingRef.current) return;
    const FADE_DURATION_MS = 300;
    const overlayEl = document.getElementById("nav-loader-overlay");
    if (overlayEl) {
      overlayEl.style.transition = `opacity ${FADE_DURATION_MS}ms ease, transform ${FADE_DURATION_MS}ms ease`;
      // start fade-out
      requestAnimationFrame(() => {
        overlayEl.style.opacity = "0";
        overlayEl.style.transform = "scale(0.98)";
      });
    }

    const t = setTimeout(() => {
      setVisible(false);
      navigatingRef.current = false;
      targetRef.current = null;
      // clear any injected video
      const container = document.getElementById("nav-loader-video-container");
      if (container) container.innerHTML = "";
      if (overlayEl) {
        // reset inline styles so next time we show cleanly
        overlayEl.style.transition = "";
        overlayEl.style.opacity = "0";
        overlayEl.style.transform = "";
      }
    }, FADE_DURATION_MS + 50);

    return () => clearTimeout(t);
  }, [location.pathname]);

  return (
    <div
      id="nav-loader-overlay"
      aria-hidden={!visible}
      style={{
        pointerEvents: visible ? "auto" : "none",
        opacity: visible ? 1 : 0,
        transition: "opacity 200ms ease",
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // use theme-aware background so inverted animation looks correct in light mode
        background: theme === "light" ? "#ffffff" : "#000000",
      }}
    >
      <div id="nav-loader-video-container" style={{ display: "flex", alignItems: "center", justifyContent: "center" }} />
    </div>
  );
}
