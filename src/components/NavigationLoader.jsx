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
        vid.src = "/efecto-recording-2025-12-20T12-26-03.webm";
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
        vid.style.filter = theme === "light" ? "invert(1) brightness(1.02) contrast(1.2)" : "none";
        vid.className = "nav-loader-video-el";
        // speed up playback by 3x; set after metadata to avoid DOMException in some browsers
        vid.addEventListener("loadedmetadata", () => {
          try {
            vid.playbackRate = 3.0;
          } catch (e) {}
        });

        const container = document.getElementById("nav-loader-video-container");
        if (container) {
          // clear previous children
          container.innerHTML = "";
          container.appendChild(vid);
        }

        try {
          await vid.play();
        } catch (err) {
          // ignore play errors
        }

        // start fade-out shortly before navigation so user sees a smooth transition
        const FADE_START_MS = 700; // begin fade after 700ms
        const FADE_DURATION_MS = 300; // fade duration

        const overlayEl = document.getElementById("nav-loader-overlay");
        // ensure overlay is opaque initially
        if (overlayEl) {
          overlayEl.style.transition = `opacity ${FADE_DURATION_MS}ms ease, transform ${FADE_DURATION_MS}ms ease`;
          overlayEl.style.opacity = "1";
          overlayEl.style.transform = "scale(1)";
        }

        setTimeout(() => {
          if (overlayEl) {
            overlayEl.style.opacity = "0";
            overlayEl.style.transform = "scale(0.98)";
          }
        }, FADE_START_MS);

        // navigate after the total (fade start + fade duration) so the fade completes
        setTimeout(() => {
          if (targetRef.current) navigate(targetRef.current);
        }, FADE_START_MS + FADE_DURATION_MS);
      } catch (err) {
        return;
      }
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [navigate, theme]);

  // hide overlay after location changed (navigation finished)
  useEffect(() => {
    if (!navigatingRef.current) return;
    const t = setTimeout(() => {
      setVisible(false);
      navigatingRef.current = false;
      targetRef.current = null;
    }, 1200);
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
        background: theme === "light" ? "#ffffff" : "#000000",
      }}
    >
      <div id="nav-loader-video-container" style={{ display: "flex", alignItems: "center", justifyContent: "center" }} />
    </div>
  );
}
