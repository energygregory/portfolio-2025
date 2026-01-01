import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AnimatedLogo from "./AnimatedLogo";

export default function NavigationLoader({ theme = "dark", onVisibleChange, onInitialLoad }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [visible, setVisible] = useState(true); // Start visible to match HTML loader
  const targetRef = useRef(null);
  const navigatingRef = useRef(false);
  const initialLoadDone = useRef(false);

  // Sync visible state with parent
  useEffect(() => {
    if (onVisibleChange) {
      onVisibleChange(visible);
    }
  }, [visible, onVisibleChange]);

  // Initial load animation: show overlay with animated logo, then fade
  useEffect(() => {
    // Remove the HTML initial loader immediately when React takes over
    const initialLoader = document.getElementById('initial-loader');
    if (initialLoader) {
      initialLoader.remove();
    }
    if (onInitialLoad) {
      onInitialLoad();
    }
    
    const runInitialLoader = async () => {
      setVisible(true);

      const isMobile = window.innerWidth < 768;
      const NAV_DELAY_MS = isMobile ? 800 : 1400;
      await new Promise((resolve) => setTimeout(resolve, NAV_DELAY_MS));

      // Fade out
      const FADE_DURATION_MS = isMobile ? 300 : 500;
      const overlayEl = document.getElementById("nav-loader-overlay");
      if (overlayEl) {
        overlayEl.style.transition = `opacity ${FADE_DURATION_MS}ms ease-in-out`;
        overlayEl.style.opacity = "0";
      }

      setTimeout(() => {
        if (onVisibleChange) onVisibleChange(false);
        setVisible(false);
        if (overlayEl) {
          overlayEl.style.display = 'none';
          overlayEl.style.opacity = "";
          overlayEl.style.transition = "";
        }
      }, FADE_DURATION_MS);
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
        navigatingRef.current = true;
        targetRef.current = url.pathname + url.search + url.hash;
        setVisible(true);

        // navigate after delay so the logo animation is visible
        const isMobile = window.innerWidth < 768;
        const NAV_DELAY_MS = isMobile ? 800 : 1400;
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
      requestAnimationFrame(() => {
        overlayEl.style.opacity = "0";
        overlayEl.style.transform = "scale(0.98)";
      });
    }

    const t = setTimeout(() => {
      if (onVisibleChange) onVisibleChange(false);

      setVisible(false);
      navigatingRef.current = false;
      targetRef.current = null;

      if (overlayEl) {
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
        background: theme === "dark" ? "#000000" : "#ffffff",
        color: theme === "dark" ? "#ffffff" : "#000000",
      }}
    >
      <div
        id="nav-loader-logo-container"
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
            width: "44vmin",
            maxWidth: "420px",
          }}
        >
          <AnimatedLogo />
        </div>
      </div>
    </div>
  );
}
