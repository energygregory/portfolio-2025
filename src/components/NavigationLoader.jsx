import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function NavigationLoader({ theme = "dark", onVisibleChange }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const targetRef = useRef(null);
  const navigatingRef = useRef(false);
  const videoRef = useRef(null);

  // Sync visible state with parent
  useEffect(() => {
    if (onVisibleChange) {
      onVisibleChange(visible);
    }
  }, [visible, onVisibleChange]);

  // Initial load animation
  useEffect(() => {
    const runInitialLoader = async () => {
      setVisible(true);

      const vid = videoRef.current;
      if (vid) {
        // Ensure video is ready before playing
        if (vid.readyState >= 1) {
          vid.currentTime = 4;
        } else {
          vid.addEventListener(
            "loadedmetadata",
            () => {
              vid.currentTime = 4;
            },
            { once: true }
          );
        }

        try {
          vid.playbackRate = 2.52;
          // Use a small timeout to allow the UI to paint first
          await new Promise((r) => setTimeout(r, 50));
          await vid.play();
        } catch (err) {
          console.error("Auto-play failed:", err);
        }
      }

      // Wait for animation duration
      const NAV_DELAY_MS = 1400;
      await new Promise((resolve) => setTimeout(resolve, NAV_DELAY_MS));

      // Fade out
      const FADE_DURATION_MS = 300;
      const overlayEl = document.getElementById("nav-loader-overlay");
      if (overlayEl) {
        overlayEl.style.transition = `opacity ${FADE_DURATION_MS}ms ease, transform ${FADE_DURATION_MS}ms ease`;
        requestAnimationFrame(() => {
          overlayEl.style.opacity = "0";
          overlayEl.style.transform = "scale(0.98)";
        });
      }

      setTimeout(() => {
        // Only unpause animations AFTER the overlay is fully hidden
        if (onVisibleChange) onVisibleChange(false);

        setVisible(false);
        if (overlayEl) {
          overlayEl.style.transition = "";
          overlayEl.style.opacity = "0";
          overlayEl.style.transform = "";
        }
        // Reset video
        if (vid) {
          vid.pause();
          vid.currentTime = 4;
        }
      }, FADE_DURATION_MS + 50);
    };

    runInitialLoader();
  }, []);

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
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;

      const a = findAnchor(e.target);
      if (!a) return;
      const href = a.getAttribute("href");
      const target = a.getAttribute("target");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        target === "_blank"
      )
        return;

      // allow external links (absolute with different origin)
      try {
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) return;
        // same-path navigation: ignore
        if (url.pathname === window.location.pathname) return;

        e.preventDefault();
        
        // Check if navigating to a brand page from Work page
        const brandPages = ['/williamru', '/legacydrip', '/flyhigh', '/around', '/terzo'];
        const isBrandNavigation = location.pathname === '/work' && brandPages.includes(url.pathname);
        
        if (isBrandNavigation) {
          // Skip loader for brand pages, navigate immediately
          navigate(url.pathname + url.search + url.hash);
          return;
        }
        
        navigatingRef.current = true;
        targetRef.current = url.pathname + url.search + url.hash;
        setVisible(true);

        const vid = videoRef.current;
        if (vid) {
          try {
            // Reset time just in case
            vid.currentTime = 4;
            vid.playbackRate = 2.52;
            await vid.play();
          } catch (err) {
            // ignore play errors
          }
        }

        // navigate after delay - increased to allow video to play more fully
        const NAV_DELAY_MS = 1400;
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
      // Only unpause animations AFTER the overlay is fully hidden
      if (onVisibleChange) onVisibleChange(false);

      setVisible(false);
      navigatingRef.current = false;
      targetRef.current = null;

      if (overlayEl) {
        // reset inline styles so next time we show cleanly
        overlayEl.style.transition = "";
        overlayEl.style.opacity = "0";
        overlayEl.style.transform = "";
      }

      const vid = videoRef.current;
      if (vid) {
        vid.pause();
        // Reset to start frame so it's ready for next time
        vid.currentTime = 4;
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
      <div
        id="nav-loader-video-container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "inline-block",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <video
            ref={videoRef}
            src="/animation.webm"
            muted
            playsInline
            preload="auto"
            className="nav-loader-video-el"
            style={{
              width: "44vmin",
              maxWidth: "420px",
              height: "auto",
              display: "block",
              objectFit: "contain",
              borderRadius: "8px",
              willChange: "transform", // Hint to browser to promote to layer
            }}
          />
        </div>
      </div>
    </div>
  );
}
